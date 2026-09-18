const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getAsync, runAsync, generateReferralCode } = require('./database');
const { JWT_SECRET } = require('./middleware');

const router = express.Router();

function sanitizeUser(user) {
    if (!user) return null;
    const { password_hash, ...safe } = user;
    return safe;
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { email, password, username, referral_code } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({ error: 'Email, senha e username são obrigatórios' });
        }
        if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
            return res.status(400).json({ error: 'Username inválido (mín 3 chars, apenas letras/números/_)' });
        }

        const existingEmail = await getAsync('SELECT id FROM users WHERE email = ?', [email]);
        if (existingEmail) return res.status(400).json({ error: 'Email já cadastrado' });

        const existingUser = await getAsync('SELECT id FROM users WHERE username = ?', [username]);
        if (existingUser) return res.status(400).json({ error: 'Username já em uso' });

        const password_hash = await bcrypt.hash(password, 10);
        const uuid = crypto.randomUUID();
        const myReferralCode = generateReferralCode();
        const display_name = username;

        const result = await runAsync(
            `INSERT INTO users (uuid, email, password_hash, username, display_name, coins, referral_code, is_email_verified)
             VALUES (?, ?, ?, ?, ?, 2500, ?, 1)`,
            [uuid, email.toLowerCase(), password_hash, username, display_name, myReferralCode]
        );
        const newUserId = result.lastID;

        // Create daily_streak record
        await runAsync(`INSERT INTO daily_streak (user_id) VALUES (?)`, [newUserId]);

        // Handle referral
        if (referral_code) {
            const referrer = await getAsync('SELECT id FROM users WHERE referral_code = ?', [referral_code]);
            if (referrer && referrer.id !== newUserId) {
                await runAsync(
                    `INSERT INTO referrals (referrer_id, referred_id) VALUES (?, ?)`,
                    [referrer.id, newUserId]
                );
                await runAsync(`UPDATE users SET coins = coins + 333 WHERE id = ?`, [referrer.id]);
                await runAsync(`UPDATE users SET coins = coins + 333, referred_by = ? WHERE id = ?`, [referrer.id, newUserId]);
                await runAsync(
                    `INSERT INTO notifications (user_id, type, payload) VALUES (?, 'reward', ?)`,
                    [referrer.id, JSON.stringify({ message: `Seu amigo ${username} se cadastrou! +333 DopaCoins!`, icon: '🎁' })]
                );
            }
        }

        const user = await getAsync('SELECT * FROM users WHERE id = ?', [newUserId]);
        const token = jwt.sign({ userId: newUserId }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ success: true, user: sanitizeUser(user), token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

        const user = await getAsync('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
        if (!user) return res.status(401).json({ error: 'Email ou senha incorretos' });

        // Allow login without password_hash for legacy admin user
        if (user.password_hash) {
            const valid = await bcrypt.compare(password, user.password_hash);
            if (!valid) return res.status(401).json({ error: 'Email ou senha incorretos' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, user: sanitizeUser(user), token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await getAsync('SELECT * FROM users WHERE id = ?', [decoded.userId]);
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
        res.json({ user: sanitizeUser(user) });
    } catch (err) {
        res.status(401).json({ error: 'Token inválido' });
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    res.json({ success: true });
});

module.exports = router;
