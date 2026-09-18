const express = require('express');
const crypto = require('crypto');
const { getAsync, runAsync, allAsync } = require('./database');
const { authenticate } = require('./middleware');
const { rollItem } = require('./daily');

const router = express.Router();

// POST /api/battle/create
router.post('/battle/create', authenticate, async (req, res) => {
    try {
        const { case_name = 'dopamina', entry_fee = 0 } = req.body;
        const challengerId = req.userId;

        const user = await getAsync('SELECT coins FROM users WHERE id = ?', [challengerId]);
        if (entry_fee > 0 && user.coins < entry_fee) {
            return res.status(400).json({ error: 'Saldo insuficiente' });
        }

        if (entry_fee > 0) {
            await runAsync('UPDATE users SET coins = coins - ? WHERE id = ?', [entry_fee, challengerId]);
        }

        const invite_code = crypto.randomBytes(4).toString('hex').toUpperCase();
        const result = await runAsync(
            'INSERT INTO battles (challenger_id, case_name, entry_fee, status, invite_code) VALUES (?, ?, ?, "pending", ?)',
            [challengerId, case_name, entry_fee, invite_code]
        );

        res.json({ success: true, battle_id: result.lastID, invite_code });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno' });
    }
});

// POST /api/battle/join
router.post('/battle/join', authenticate, async (req, res) => {
    try {
        const { battle_id } = req.body;
        const opponentId = req.userId;

        const battle = await getAsync('SELECT * FROM battles WHERE id = ?', [battle_id]);
        if (!battle) return res.status(404).json({ error: 'Batalha não encontrada' });
        if (battle.status !== 'pending') return res.status(400).json({ error: 'Batalha não está disponível' });
        if (battle.challenger_id === opponentId) return res.status(400).json({ error: 'Você não pode entrar na sua própria batalha' });

        const opponent = await getAsync('SELECT coins FROM users WHERE id = ?', [opponentId]);
        if (battle.entry_fee > 0 && opponent.coins < battle.entry_fee) {
            return res.status(400).json({ error: 'Saldo insuficiente' });
        }

        if (battle.entry_fee > 0) {
            await runAsync('UPDATE users SET coins = coins - ? WHERE id = ?', [battle.entry_fee, opponentId]);
        }

        // Roll items for both players (no streak restriction in battles)
        const challengerItem = rollItem(10); // max streak for battles
        const opponentItem = rollItem(10);

        // Determine winner (higher price wins)
        const winnerId = challengerItem.price >= opponentItem.price ? battle.challenger_id : opponentId;
        const loserId = winnerId === battle.challenger_id ? opponentId : battle.challenger_id;

        // Give both items to winner
        await runAsync(
            'INSERT INTO inventory (user_id, item_id, item_data, source) VALUES (?, ?, ?, "battle")',
            [winnerId, challengerItem.id, JSON.stringify(challengerItem)]
        );
        await runAsync(
            'INSERT INTO inventory (user_id, item_id, item_data, source) VALUES (?, ?, ?, "battle")',
            [winnerId, opponentItem.id, JSON.stringify(opponentItem)]
        );

        // XP: winner +50, loser +10
        await runAsync('UPDATE users SET xp = xp + 50 WHERE id = ?', [winnerId]);
        await runAsync('UPDATE users SET xp = xp + 10 WHERE id = ?', [loserId]);

        // Update battle record
        await runAsync(
            'UPDATE battles SET opponent_id = ?, status = "finished", winner_id = ?, challenger_item = ?, opponent_item = ?, finished_at = datetime("now") WHERE id = ?',
            [opponentId, winnerId, JSON.stringify(challengerItem), JSON.stringify(opponentItem), battle_id]
        );

        // Notifications
        const winnerUser = await getAsync('SELECT username FROM users WHERE id = ?', [winnerId]);
        const totalValue = challengerItem.price + opponentItem.price;
        await runAsync(
            'INSERT INTO notifications (user_id, type, payload) VALUES (?, "battle_result", ?)',
            [winnerId, JSON.stringify({ message: `Você ganhou a batalha! +${totalValue} Dopas em itens! ⚔️`, icon: '⚔️' })]
        );
        await runAsync(
            'INSERT INTO notifications (user_id, type, payload) VALUES (?, "battle_result", ?)',
            [loserId, JSON.stringify({ message: `@${winnerUser.username} venceu a batalha. Mais sorte na próxima! 💪`, icon: '⚔️' })]
        );

        res.json({
            success: true,
            winner_id: winnerId,
            challenger_item: challengerItem,
            opponent_item: opponentItem,
            total_value: totalValue,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno' });
    }
});

// GET /api/battle/:id
router.get('/battle/:id', async (req, res) => {
    try {
        const battle = await getAsync('SELECT * FROM battles WHERE id = ?', [req.params.id]);
        if (!battle) return res.status(404).json({ error: 'Batalha não encontrada' });

        const parsed = {
            ...battle,
            challenger_item: battle.challenger_item ? JSON.parse(battle.challenger_item) : null,
            opponent_item: battle.opponent_item ? JSON.parse(battle.opponent_item) : null,
        };
        res.json({ battle: parsed });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

// GET /api/battle/history/:userId
router.get('/battle/history/:userId', async (req, res) => {
    try {
        const battles = await allAsync(
            'SELECT * FROM battles WHERE (challenger_id = ? OR opponent_id = ?) AND status = "finished" ORDER BY finished_at DESC LIMIT 20',
            [req.params.userId, req.params.userId]
        );
        const parsed = battles.map(b => ({
            ...b,
            challenger_item: b.challenger_item ? JSON.parse(b.challenger_item) : null,
            opponent_item: b.opponent_item ? JSON.parse(b.opponent_item) : null,
        }));
        res.json({ battles: parsed });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

module.exports = router;
