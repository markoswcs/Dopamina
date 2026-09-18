const express = require('express');
const { getAsync, runAsync, allAsync } = require('./database');
const { authenticate } = require('./middleware');

const router = express.Router();

// GET /api/referral/status
router.get('/referral/status', authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await getAsync('SELECT referral_code FROM users WHERE id = ?', [userId]);
        const referrals = await allAsync(`
            SELECT r.id, r.rewarded, r.created_at, u.username, u.display_name
            FROM referrals r
            JOIN users u ON u.id = r.referred_id
            WHERE r.referrer_id = ?
            ORDER BY r.created_at DESC
        `, [userId]);

        res.json({
            referral_code: user.referral_code,
            referral_link: `https://dopashop.gg/r/${user.referral_code}`,
            total_referrals: referrals.length,
            referrals,
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

// POST /api/referral/claim
router.post('/referral/claim', authenticate, async (req, res) => {
    try {
        const { referral_code } = req.body;
        const userId = req.userId;

        const user = await getAsync('SELECT referred_by, referral_code FROM users WHERE id = ?', [userId]);
        if (user.referred_by) return res.status(400).json({ error: 'Você já usou um código de indicação' });
        if (user.referral_code === referral_code) return res.status(400).json({ error: 'Você não pode usar seu próprio código' });

        const referrer = await getAsync('SELECT id, username FROM users WHERE referral_code = ?', [referral_code]);
        if (!referrer) return res.status(404).json({ error: 'Código de indicação inválido' });

        const existingReferral = await getAsync('SELECT id FROM referrals WHERE referrer_id = ? AND referred_id = ?', [referrer.id, userId]);
        if (existingReferral) return res.status(400).json({ error: 'Indicação já registrada' });

        await runAsync('INSERT INTO referrals (referrer_id, referred_id, rewarded) VALUES (?, ?, 1)', [referrer.id, userId]);
        await runAsync('UPDATE users SET coins = coins + 333, referred_by = ? WHERE id = ?', [referrer.id, userId]);
        await runAsync('UPDATE users SET coins = coins + 333 WHERE id = ?', [referrer.id]);
        await runAsync(
            'INSERT INTO notifications (user_id, type, payload) VALUES (?, "reward", ?)',
            [referrer.id, JSON.stringify({ message: `Alguém usou seu código de indicação! +333 DopaCoins! 🎁`, icon: '🎁' })]
        );

        const updatedUser = await getAsync('SELECT coins FROM users WHERE id = ?', [userId]);
        res.json({ success: true, coins_balance: updatedUser.coins, bonus: 333 });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno' });
    }
});

module.exports = router;
