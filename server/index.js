const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });

app.use(cors({ origin: '*' }));
app.use(express.json());

// ---- Import DB first so tables are created ----
const { getAsync, runAsync, allAsync } = require('./database');
const { authenticate } = require('./middleware');

// ---- Auth Routes ----
const authRouter = require('./auth');
app.use('/api/auth', authRouter);

// ---- Daily Cases + Streak ----
const { router: dailyRouter } = require('./daily');
app.use('/api', dailyRouter);

// ---- Social (Profile, Friends, Ranking, Notifications) ----
const socialRouter = require('./social');
app.use('/api', socialRouter);

// ---- Battles ----
const battleRouter = require('./battle');
app.use('/api', battleRouter);

// ---- Referrals ----
const referralRouter = require('./referral');
app.use('/api', referralRouter);

// ---- Legacy: User Coins ----
app.get('/api/user/:id', async (req, res) => {
    try {
        const user = await getAsync('SELECT id, coins, username, display_name, avatar_url, xp, level, rank FROM users WHERE id = ?', [req.params.id]);
        res.json(user || { coins: 0 });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ---- Legacy: Inventory ----
app.get('/api/inventory/:userId', async (req, res) => {
    try {
        const rows = await allAsync('SELECT * FROM inventory WHERE user_id = ? ORDER BY acquired_at DESC', [req.params.userId]);
        const inventory = rows.map(r => {
            try { return { ...r, ...JSON.parse(r.item_data) }; } catch { return r; }
        });
        res.json({ inventory });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ---- Legacy: Roulette Open (saves item to inventory & charges coins) ----
app.post('/api/roulette/open', async (req, res) => {
    try {
        const { userId = 1, casePrice, wonItem } = req.body;
        const user = await getAsync('SELECT coins FROM users WHERE id = ?', [userId]);
        if (!user || user.coins < casePrice) return res.status(400).json({ error: 'Saldo insuficiente' });
        await runAsync('UPDATE users SET coins = coins - ? WHERE id = ?', [casePrice, userId]);
        await runAsync(
            'INSERT INTO inventory (user_id, item_id, item_data, source) VALUES (?, ?, ?, "case")',
            [userId, wonItem.id || wonItem.name, JSON.stringify(wonItem)]
        );
        const updated = await getAsync('SELECT coins FROM users WHERE id = ?', [userId]);
        res.json({ success: true, coins: updated.coins });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ---- Legacy: Sell Item ----
app.post('/api/inventory/sell', async (req, res) => {
    try {
        const { userId = 1, itemId, price } = req.body;
        const item = await getAsync('SELECT id FROM inventory WHERE user_id = ? AND item_id = ? LIMIT 1', [userId, itemId]);
        if (!item) return res.status(404).json({ error: 'Item não encontrado' });
        await runAsync('DELETE FROM inventory WHERE id = ?', [item.id]);
        await runAsync('UPDATE users SET coins = coins + ? WHERE id = ?', [price, userId]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ---- Legacy: Sell All ----
app.post('/api/inventory/sellAll', async (req, res) => {
    try {
        const { userId = 1 } = req.body;
        const items = await allAsync('SELECT id, item_data FROM inventory WHERE user_id = ? AND locked = 0', [userId]);
        let total = 0;
        for (const item of items) {
            try { const d = JSON.parse(item.item_data); if (d.price) total += d.price; } catch {}
            await runAsync('DELETE FROM inventory WHERE id = ?', [item.id]);
        }
        if (total > 0) await runAsync('UPDATE users SET coins = coins + ? WHERE id = ?', [total, userId]);
        res.json({ success: true, totalValueSold: total });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ---- Legacy: Toggle Lock ----
app.post('/api/inventory/toggleLock', async (req, res) => {
    try {
        const { userId = 1, itemId } = req.body;
        const item = await getAsync('SELECT id, locked FROM inventory WHERE user_id = ? AND item_id = ? LIMIT 1', [userId, itemId]);
        if (!item) return res.status(404).json({ error: 'Item não encontrado' });
        await runAsync('UPDATE inventory SET locked = ? WHERE id = ?', [item.locked ? 0 : 1, item.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ---- Legacy: Upgrade ----
app.post('/api/upgrade', async (req, res) => {
    try {
        const { userId = 1, sourceItems, targetItems, chance, win } = req.body;
        for (const si of sourceItems || []) {
            const item = await getAsync('SELECT id FROM inventory WHERE user_id = ? AND item_id = ? AND locked = 0 LIMIT 1', [userId, si.id || si.item_id]);
            if (item) await runAsync('DELETE FROM inventory WHERE id = ?', [item.id]);
        }
        if (win) {
            for (const ti of targetItems || []) {
                await runAsync('INSERT INTO inventory (user_id, item_id, item_data, source) VALUES (?, ?, ?, "upgrade")', [userId, ti.id, JSON.stringify(ti)]);
            }
        }
        res.json({ success: true, win });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ---- Crash Game (Socket.io) ----
const { initCrashGame } = require('./crash');
initCrashGame(io);

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`🚀 DopaShop 2.0 Server running on http://localhost:${PORT}`);
});
