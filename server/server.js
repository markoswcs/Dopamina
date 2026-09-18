require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Payment } = require('mercadopago');
const { v4: uuidv4 } = require('uuid');
const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('@supabase/supabase-js');
const { getDB } = require('./db');

const supabaseUrl = process.env.SUPABASE_URL || 'https://kdsqmjalvnmxgkhyngzc.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function creditSupabaseUserBalance(userId, coinsCredited) {
  if (!userId || userId === 'anon') return;
  try {
    const { data } = await supabase.from('user_balance').select('coins').eq('user_id', userId).single();
    const currentCoins = data ? Number(data.coins) || 0 : 0;
    const newCoins = currentCoins + Number(coinsCredited);

    if (data) {
      await supabase.from('user_balance').update({ coins: newCoins, updated_at: new Date().toISOString() }).eq('user_id', userId);
    } else {
      await supabase.from('user_balance').insert({ user_id: userId, coins: newCoins });
    }
    console.log(`[Supabase] Credito de ${coinsCredited} moedas aplicado com sucesso ao usuario ${userId}`);
  } catch (err) {
    console.error('[Supabase Error] Erro ao creditar moedas:', err);
  }
}

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-0000000000000000-000000-00000000000000000000000000000000-000000000', 
  options: { timeout: 5000 } 
});

/* ========================================================
   1. REAL-TIME CRASH GAME (WEBSOCKETS)
======================================================== */
let gameState = 'idle'; // idle, playing, crashed
let currentMultiplier = 1.0;
let crashPoint = 0;
let activePlayers = new Map(); // socketId => { bet, autoCashout, cashedOut, userId }
let gameTimer = null;

function calculateCrashPoint() {
  const e = 2 ** 32;
  const h = crypto.getRandomValues(new Uint32Array(1))[0];
  if (h % 33 === 0) return 1.0;
  return Math.max(1.0, Math.floor((100 * e - h) / (e - h)) / 100);
}

function startGame() {
  gameState = 'playing';
  currentMultiplier = 1.0;
  crashPoint = calculateCrashPoint();
  io.emit('game_start', { multiplier: currentMultiplier });

  let ticks = 0;
  gameTimer = setInterval(() => {
    ticks++;
    // Exponential growth matching standard crash speed
    currentMultiplier = Math.pow(1.015, ticks);
    
    // Auto-cashout logic for active players
    for (let [socketId, player] of activePlayers.entries()) {
      if (!player.cashedOut && player.autoCashout > 0 && currentMultiplier >= player.autoCashout) {
        player.cashedOut = true;
        const winAmount = player.bet * player.autoCashout;
        io.to(socketId).emit('auto_cashout', { multiplier: player.autoCashout, winAmount });
        // Database is handled on the frontend now via Supabase
      }
    }

    if (currentMultiplier >= crashPoint) {
      clearInterval(gameTimer);
      gameState = 'crashed';
      currentMultiplier = crashPoint;
      
      // Log losses is skipped as Supabase handles balances directly
      io.emit('game_crashed', { multiplier: currentMultiplier });
      activePlayers.clear();

      setTimeout(() => {
        gameState = 'idle';
        io.emit('game_reset');
      }, 5000);
    } else {
      io.emit('multiplier_update', { multiplier: currentMultiplier });
    }
  }, 100);
}

io.on('connection', (socket) => {
  socket.emit('game_state', { state: gameState, multiplier: currentMultiplier });

  socket.on('place_bet', async ({ bet, autoCashout, userId }) => {
    if (gameState !== 'idle') {
      return socket.emit('bet_error', 'O jogo já começou');
    }
    
    // Balance check and deduction is handled on the frontend React App with Supabase
    
    activePlayers.set(socket.id, { bet, autoCashout, cashedOut: false, userId });
    socket.emit('bet_accepted');

    // Auto-start if it's the first player and idle
    if (gameState === 'idle' && activePlayers.size === 1) {
      setTimeout(startGame, 200);
    }
  });

  socket.on('manual_cashout', async () => {
    const player = activePlayers.get(socket.id);
    if (gameState === 'playing' && player && !player.cashedOut) {
      player.cashedOut = true;
      const winAmount = player.bet * currentMultiplier;
      socket.emit('cashout_success', { multiplier: currentMultiplier, winAmount });
      
      // The frontend will update Supabase.
    }
  });

  socket.on('disconnect', () => {
    // If they disconnect mid-game without cashing out, they lose (handled in crash logic)
  });
});


/* ========================================================
   2. USERS & REFERRALS API
======================================================== */
app.post('/api/users/register', async (req, res) => {
  const { userId, username, referredBy } = req.body;
  try {
    const db = await getDB();
    // In a real app, userId comes from auth. Here we trust the client for demo.
    await db.run('INSERT OR IGNORE INTO users (id, username, referred_by) VALUES (?, ?, ?)', [userId, username || 'Player', referredBy || null]);
    
    // Process referral bonus if new user
    if (referredBy) {
      const existingRef = await db.get('SELECT * FROM referral_rewards WHERE referred_id = ?', [userId]);
      if (!existingRef) {
        const bonus = 500;
        await db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [bonus, referredBy]); // Referrer gets 500
        await db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [bonus, userId]); // New user gets 500
        await db.run('INSERT INTO referral_rewards (referrer_id, referred_id, reward_amount) VALUES (?, ?, ?)', [referredBy, userId, bonus]);
      }
    }

    const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const db = await getDB();
    const user = await db.get('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const referrals = await db.all('SELECT * FROM referral_rewards WHERE referrer_id = ?', [req.params.id]);
    res.json({ ...user, referrals_count: referrals.length, referrals_earned: referrals.length * 500 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ========================================================
   3. MERCADO PAGO PIX API
======================================================== */
app.post('/api/pix', async (req, res) => {
  try {
    const { amount, description, email, userId } = req.body;
    if (!amount) return res.status(400).json({ error: 'Valor é obrigatório' });

    const payment = new Payment(client);
    const body = {
      transaction_amount: Number(amount),
      description: description || 'Pacote de DopaCoins',
      payment_method_id: 'pix',
      payer: { email: email || 'pagamento@dopashop.com.br' },
    };

    const response = await payment.create({ body, requestOptions: { idempotencyKey: uuidv4() } });
    
    const db = await getDB();
    const coins = (amount / 5) * 500; // Simplified conversion for demo
    await db.run(`INSERT INTO transactions (id, user_id, payment_id, amount, coins_credited) VALUES (?, ?, ?, ?, ?)`, 
      [uuidv4(), userId || 'anon', response.id.toString(), amount, coins]
    );

    res.json({
      payment_id: response.id,
      qr_code: response.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: response.point_of_interaction.transaction_data.qr_code_base64,
      status: response.status
    });
  } catch (error) {
    console.error('Erro PIX:', error);
    res.status(500).json({ error: 'Falha ao gerar o PIX.', details: error.message });
  }
});

app.get('/api/pix/status/:id', async (req, res) => {
  try {
    const paymentId = req.params.id;
    const db = await getDB();
    
    // Check local status first
    const tx = await db.get('SELECT status, coins_credited, user_id FROM transactions WHERE payment_id = ?', [paymentId]);
    if (tx && tx.status === 'approved') {
      return res.json({ id: paymentId, status: 'approved' });
    }

    // Consult MP
    const payment = new Payment(client);
    const response = await payment.get({ id: paymentId });

    if (response.status === 'approved' && tx) {
      // Fulfill order
      await db.run("UPDATE transactions SET status = 'approved' WHERE payment_id = ?", [paymentId]);
      if (tx.user_id !== 'anon') {
        await db.run("UPDATE users SET balance = balance + ?, total_spent = total_spent + (SELECT amount FROM transactions WHERE payment_id = ?) WHERE id = ?", [tx.coins_credited, paymentId, tx.user_id]);
        await creditSupabaseUserBalance(tx.user_id, tx.coins_credited);
      }
    }

    res.json({ id: response.id, status: response.status });
  } catch (error) {
    console.error('Erro status PIX:', error);
    res.status(500).json({ error: 'Falha ao consultar status' });
  }
});

// Webhook
app.post('/api/webhooks/pix', async (req, res) => {
  try {
    const paymentId = req.query.id || req.body.data?.id;
    const action = req.body.action;

    if (paymentId && action === 'payment.updated') {
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: paymentId });

      if (paymentInfo.status === 'approved') {
         const db = await getDB();
         const tx = await db.get("SELECT * FROM transactions WHERE payment_id = ? AND status != 'approved'", [paymentId]);
         if (tx) {
           await db.run("UPDATE transactions SET status = 'approved' WHERE payment_id = ?", [paymentId]);
           if (tx.user_id !== 'anon') {
             await db.run("UPDATE users SET balance = balance + ?, total_spent = total_spent + ? WHERE id = ?", [tx.coins_credited, tx.amount, tx.user_id]);
             await creditSupabaseUserBalance(tx.user_id, tx.coins_credited);
           }
         }
      }
    }
    res.status(200).send('OK');
  } catch (error) {
    console.error('Erro Webhook:', error);
    res.status(500).send('Erro no Webhook');
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, async () => {
  await getDB();
  console.log(`🚀 Servidor Dopamina (WebSockets + DB) rodando na porta ${PORT}`);
});
