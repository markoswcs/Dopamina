const express = require('express');
const { getAsync, runAsync, allAsync } = require('./database');
const { authenticate } = require('./middleware');

const router = express.Router();

// GET /api/user/:id/profile (public)
router.get('/user/:id/profile', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await getAsync(
            `SELECT id, username, display_name, avatar_url, bio, xp, level, rank, referral_code, created_at FROM users WHERE id = ?`,
            [userId]
        );
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

        const streak = await getAsync('SELECT current_streak, longest_streak FROM daily_streak WHERE user_id = ?', [userId]);
        const battlesWon = await getAsync('SELECT COUNT(*) as count FROM battles WHERE winner_id = ? AND status = "finished"', [userId]);
        const battlesLost = await getAsync('SELECT COUNT(*) as count FROM battles WHERE (challenger_id = ? OR opponent_id = ?) AND winner_id != ? AND status = "finished"', [userId, userId, userId]);
        const totalItems = await getAsync('SELECT COUNT(*) as count FROM inventory WHERE user_id = ?', [userId]);

        res.json({
            ...user,
            stats: {
                battles_won: battlesWon?.count || 0,
                battles_lost: battlesLost?.count || 0,
                total_items: totalItems?.count || 0,
                current_streak: streak?.current_streak || 0,
                longest_streak: streak?.longest_streak || 0,
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno' });
    }
});

// GET /api/user/:id/inventory
router.get('/user/:id/inventory', async (req, res) => {
    try {
        const userId = req.params.id;
        const items = await allAsync('SELECT * FROM inventory WHERE user_id = ? ORDER BY acquired_at DESC', [userId]);
        const parsed = items.map(i => {
            try { return { ...i, item_data: JSON.parse(i.item_data) }; }
            catch { return i; }
        });
        res.json({ inventory: parsed });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

// POST /api/friends/request
router.post('/friends/request', authenticate, async (req, res) => {
    try {
        const { target_username } = req.body;
        const requesterId = req.userId;
        const target = await getAsync('SELECT id, username FROM users WHERE username = ?', [target_username]);
        if (!target) return res.status(404).json({ error: 'Usuário não encontrado' });
        if (target.id === requesterId) return res.status(400).json({ error: 'Você não pode adicionar a si mesmo' });

        const existing = await getAsync(
            'SELECT id FROM friendships WHERE (requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?)',
            [requesterId, target.id, target.id, requesterId]
        );
        if (existing) return res.status(400).json({ error: 'Pedido de amizade já existe' });

        await runAsync('INSERT INTO friendships (requester_id, addressee_id) VALUES (?, ?)', [requesterId, target.id]);

        const requester = await getAsync('SELECT username FROM users WHERE id = ?', [requesterId]);
        await runAsync(
            'INSERT INTO notifications (user_id, type, payload) VALUES (?, "friend_request", ?)',
            [target.id, JSON.stringify({ message: `@${requester.username} quer ser seu amigo!`, icon: '👥', from_id: requesterId })]
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno' });
    }
});

// POST /api/friends/respond
router.post('/friends/respond', authenticate, async (req, res) => {
    try {
        const { friendship_id, action } = req.body;
        const userId = req.userId;
        const friendship = await getAsync('SELECT * FROM friendships WHERE id = ? AND addressee_id = ?', [friendship_id, userId]);
        if (!friendship) return res.status(404).json({ error: 'Pedido não encontrado' });

        if (action === 'accept') {
            await runAsync('UPDATE friendships SET status = "accepted" WHERE id = ?', [friendship_id]);
        } else {
            await runAsync('DELETE FROM friendships WHERE id = ?', [friendship_id]);
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

// GET /api/friends/list
router.get('/friends/list', authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        const friends = await allAsync(`
            SELECT u.id, u.username, u.display_name, u.avatar_url, u.rank, u.level, u.xp,
                   ds.current_streak, f.id as friendship_id
            FROM friendships f
            JOIN users u ON (CASE WHEN f.requester_id = ? THEN f.addressee_id ELSE f.requester_id END) = u.id
            LEFT JOIN daily_streak ds ON ds.user_id = u.id
            WHERE (f.requester_id = ? OR f.addressee_id = ?) AND f.status = 'accepted'
        `, [userId, userId, userId]);
        res.json({ friends });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

// GET /api/friends/requests
router.get('/friends/requests', authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        const requests = await allAsync(`
            SELECT f.id, f.created_at, u.id as user_id, u.username, u.display_name, u.avatar_url, u.rank
            FROM friendships f
            JOIN users u ON f.requester_id = u.id
            WHERE f.addressee_id = ? AND f.status = 'pending'
            ORDER BY f.created_at DESC
        `, [userId]);
        res.json({ requests });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

// GET /api/ranking/global
router.get('/ranking/global', async (req, res) => {
    try {
        const users = await allAsync(`
            SELECT id, username, display_name, avatar_url, xp, level, rank,
                   (SELECT current_streak FROM daily_streak WHERE user_id = users.id) as streak
            FROM users ORDER BY xp DESC LIMIT 100
        `);
        res.json({ ranking: users.map((u, i) => ({ ...u, position: i + 1 })) });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

// GET /api/ranking/friends
router.get('/ranking/friends', authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        const users = await allAsync(`
            SELECT u.id, u.username, u.display_name, u.avatar_url, u.xp, u.level, u.rank,
                   ds.current_streak as streak
            FROM users u
            LEFT JOIN daily_streak ds ON ds.user_id = u.id
            WHERE u.id = ? OR u.id IN (
                SELECT CASE WHEN requester_id = ? THEN addressee_id ELSE requester_id END
                FROM friendships WHERE (requester_id = ? OR addressee_id = ?) AND status = 'accepted'
            )
            ORDER BY u.xp DESC
        `, [userId, userId, userId, userId]);
        res.json({ ranking: users.map((u, i) => ({ ...u, position: i + 1 })) });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

// GET /api/notifications
router.get('/notifications', authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        const notifications = await allAsync(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY read ASC, created_at DESC LIMIT 50',
            [userId]
        );
        const parsed = notifications.map(n => {
            try { return { ...n, payload: JSON.parse(n.payload) }; }
            catch { return n; }
        });
        res.json({ notifications: parsed, unread_count: parsed.filter(n => !n.read).length });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

// POST /api/notifications/read
router.post('/notifications/read', authenticate, async (req, res) => {
    try {
        const { notification_id } = req.body;
        const userId = req.userId;
        if (notification_id === 'all') {
            await runAsync('UPDATE notifications SET read = 1 WHERE user_id = ?', [userId]);
        } else {
            await runAsync('UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?', [notification_id, userId]);
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

module.exports = router;
