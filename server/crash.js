const { getAsync, runAsync } = require('./database');

// Crash Game Constants
const STATE_IDLE = 'idle';
const STATE_PLAYING = 'playing';
const STATE_CRASHED = 'crashed';

let gameState = STATE_IDLE;
let multiplier = 1.0;
let crashPoint = 1.0;
let activeBets = new Map(); // socketId -> { userId, betAmount, autoCashout }

function generateCrashPoint() {
    const e = 2 ** 32;
    const h = Math.floor(Math.random() * e);
    
    // 5% instant crash chance
    if (h % 20 === 0) return 1.0;
    
    const crash = Math.max(1.0, (e / (e - h)) * 0.99); // 1% house edge
    // Cap at 1000x for safety
    return Math.min(1000.0, crash);
}

function initCrashGame(io) {
    console.log("Crash Game Server Initialized");

    io.on('connection', (socket) => {
        // Send current state to newly connected client
        socket.emit('game_state', { state: gameState, multiplier });

        socket.on('place_bet', async (data) => {
            if (gameState !== STATE_IDLE) {
                return socket.emit('bet_error', "Game already started");
            }
            if (activeBets.has(socket.id)) {
                return socket.emit('bet_error', "Bet already placed");
            }

            const userId = data.userId || socket.id;
            const betAmount = Number(data.amount || data.bet);
            const autoCashout = data.autoCashout ? Number(data.autoCashout) : null;

            if (isNaN(betAmount) || betAmount <= 0) {
                return socket.emit('bet_error', "Invalid bet amount");
            }

            // O frontend (React) já deduziu o saldo usando Supabase
            activeBets.set(socket.id, { userId, betAmount, autoCashout });
            socket.emit('bet_accepted');
        });

        socket.on('cashout', async (data) => {
            if (gameState !== STATE_PLAYING) return;
            const betData = activeBets.get(socket.id);
            if (!betData) return;

            const winAmount = betData.betAmount * multiplier;
            activeBets.delete(socket.id); // Remove bet to prevent double cashout

            // O frontend adicionará o saldo via Supabase
            socket.emit('cashout_success', { winAmount });
        });

        socket.on('disconnect', () => {
            if (gameState === STATE_IDLE && activeBets.has(socket.id)) {
                activeBets.delete(socket.id);
            }
        });
    });

    // Game Loop
    async function startGameLoop() {
        while (true) {
            // Idle phase
            gameState = STATE_IDLE;
            multiplier = 1.0;
            io.emit('game_reset');
            
            // Wait 5 seconds for bets
            await new Promise(r => setTimeout(r, 5000));
            
            // Start game
            gameState = STATE_PLAYING;
            crashPoint = generateCrashPoint();
            io.emit('game_start');

            let timeElapsed = 0;
            const tickRate = 50; // ms
            
            while (gameState === STATE_PLAYING) {
                await new Promise(r => setTimeout(r, tickRate));
                timeElapsed += tickRate;
                
                // Calculate multiplier based on time (exponential curve)
                // Curve: multiplier = Math.pow(Math.E, 0.00006 * timeMs)
                multiplier = Math.pow(Math.E, 0.00006 * timeElapsed);

                if (multiplier >= crashPoint) {
                    multiplier = crashPoint;
                    gameState = STATE_CRASHED;
                    io.emit('game_crashed', { multiplier });
                    break;
                }

                // Check auto-cashouts
                for (const [socketId, b] of activeBets.entries()) {
                    if (b.autoCashout && multiplier >= b.autoCashout) {
                        const winAmount = b.betAmount * b.autoCashout;
                        io.to(socketId).emit('auto_cashout', { winAmount, at: b.autoCashout });
                        activeBets.delete(socketId);
                    }
                }

                io.emit('multiplier_update', { multiplier });
            }

            // End game - all remaining active bets are lost
            activeBets.clear();

            // Wait 4 seconds before next round
            await new Promise(r => setTimeout(r, 4000));
        }
    }

    // Start the loop
    startGameLoop();
}

module.exports = { initCrashGame };
