const express = require('express');
const { getAsync, runAsync, allAsync } = require('./database');
const { authenticate } = require('./middleware');

const router = express.Router();

// Item pools for the Caixa Dopamina
const ITEMS = {
    comum: [
        { id: 'ak47_safari', name: 'AK-47 | Safari Mesh (Field-Tested)', rarity: 'mil-spec', price: 45, icon: '🔫', colorText: '#4b69ff', bgGradient: 'from-blue-900/40 to-transparent', colorBorder: '#4b69ff' },
        { id: 'm4a4_urban', name: 'M4A4 | Urban DDPAT (Minimal Wear)', rarity: 'mil-spec', price: 85, icon: '🔫', colorText: '#4b69ff', bgGradient: 'from-blue-900/40 to-transparent', colorBorder: '#4b69ff' },
        { id: 'glock_candy', name: 'Glock-18 | Candy Apple (Field-Tested)', rarity: 'mil-spec', price: 60, icon: '🔫', colorText: '#4b69ff', bgGradient: 'from-blue-900/40 to-transparent', colorBorder: '#4b69ff' },
        { id: 'p250_sand', name: 'P250 | Sand Dune (Factory New)', rarity: 'mil-spec', price: 35, icon: '🔫', colorText: '#4b69ff', bgGradient: 'from-blue-900/40 to-transparent', colorBorder: '#4b69ff' },
        { id: 'nova_predator', name: 'Nova | Predator (Field-Tested)', rarity: 'mil-spec', price: 55, icon: '🔫', colorText: '#4b69ff', bgGradient: 'from-blue-900/40 to-transparent', colorBorder: '#4b69ff' },
    ],
    incomum: [
        { id: 'm4a1s_basilisk', name: 'M4A1-S | Basilisk (Field-Tested)', rarity: 'restricted', price: 180, icon: '🔫', colorText: '#8847ff', bgGradient: 'from-purple-900/40 to-transparent', colorBorder: '#8847ff' },
        { id: 'awp_worm', name: 'AWP | Worm God (Field-Tested)', rarity: 'restricted', price: 220, icon: '🔫', colorText: '#8847ff', bgGradient: 'from-purple-900/40 to-transparent', colorBorder: '#8847ff' },
        { id: 'usp_kill', name: 'USP-S | Kill Confirmed (Field-Tested)', rarity: 'restricted', price: 250, icon: '🔫', colorText: '#8847ff', bgGradient: 'from-purple-900/40 to-transparent', colorBorder: '#8847ff' },
    ],
    raro: [
        { id: 'ak47_bloodsport', name: 'AK-47 | Bloodsport (Field-Tested)', rarity: 'classified', price: 420, icon: '🔫', colorText: '#eb4b4b', bgGradient: 'from-red-900/40 to-transparent', colorBorder: '#eb4b4b' },
        { id: 'awp_neo_noir', name: 'AWP | Neo-Noir (Field-Tested)', rarity: 'classified', price: 380, icon: '🔫', colorText: '#eb4b4b', bgGradient: 'from-red-900/40 to-transparent', colorBorder: '#eb4b4b' },
    ],
    epico: [
        { id: 'm4a1s_hyper_beast', name: 'M4A1-S | Hyper Beast (Field-Tested)', rarity: 'covert', price: 620, icon: '🔫', colorText: '#eb4b4b', bgGradient: 'from-red-900/40 to-transparent', colorBorder: '#eb4b4b' },
        { id: 'awp_fever_dream', name: 'AWP | Fever Dream (Field-Tested)', rarity: 'covert', price: 750, icon: '🔫', colorText: '#eb4b4b', bgGradient: 'from-red-900/40 to-transparent', colorBorder: '#eb4b4b' },
    ],
    faca: [
        { id: 'knife_flip_urban', name: 'Faca Flip | Urban Masked (Field-Tested)', rarity: 'extraordinary', price: 850, icon: '🔪', colorText: '#ffd700', bgGradient: 'from-yellow-900/40 to-transparent', colorBorder: '#ffd700' },
        { id: 'knife_gut_forest', name: 'Faca Gut | Forest DDPAT (Well-Worn)', rarity: 'extraordinary', price: 920, icon: '🔪', colorText: '#ffd700', bgGradient: 'from-yellow-900/40 to-transparent', colorBorder: '#ffd700' },
        { id: 'knife_bowie_night', name: 'Faca Bowie | Night (Field-Tested)', rarity: 'extraordinary', price: 980, icon: '🔪', colorText: '#ffd700', bgGradient: 'from-yellow-900/40 to-transparent', colorBorder: '#ffd700' },
    ],
};

// Chances by streak
function getChances(streak) {
    if (streak >= 10) return { comum: 35, incomum: 22, raro: 15, epico: 16, faca: 12 };
    if (streak >= 8)  return { comum: 40, incomum: 23, raro: 14, epico: 13, faca: 10 };
    if (streak >= 6)  return { comum: 45, incomum: 25, raro: 14, epico: 8,  faca: 8  };
    if (streak >= 4)  return { comum: 50, incomum: 25, raro: 12, epico: 7,  faca: 6  };
    if (streak >= 3)  return { comum: 55, incomum: 27, raro: 10, epico: 4,  faca: 4  };
    return               { comum: 65, incomum: 27, raro: 0,  epico: 8,  faca: 0  };
}

function rollItem(streak) {
    const chances = getChances(streak);
    const roll = Math.random() * 100;
    let cumulative = 0;
    const tiers = ['faca', 'epico', 'raro', 'incomum', 'comum'];
    const tierChances = [chances.faca, chances.epico, chances.raro, chances.incomum, chances.comum];
    
    for (let i = 0; i < tiers.length; i++) {
        cumulative += tierChances[i];
        if (roll <= cumulative) {
            const pool = ITEMS[tiers[i]];
            return { ...pool[Math.floor(Math.random() * pool.length)], tier: tiers[i] };
        }
    }
    // Fallback to comum
    const pool = ITEMS.comum;
    return { ...pool[Math.floor(Math.random() * pool.length)], tier: 'comum' };
}

function getStreakRewards(streak) {
    return {
        comum: true,
        incomum: true,
        raro: streak >= 3,
        epico: true,
        faca: streak >= 3,
        descricao: streak >= 10 ? 'Pool completo desbloqueado! (Faca + Épico)' :
                   streak >= 6  ? 'Chance de faca aumentada!' :
                   streak >= 3  ? 'Faca desbloqueada!' : 'Continue jogando para desbloquear mais!',
    };
}

// GET /api/daily/status
router.get('/daily/status', authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        let streak = await getAsync('SELECT * FROM daily_streak WHERE user_id = ?', [userId]);
        if (!streak) {
            await runAsync('INSERT INTO daily_streak (user_id) VALUES (?)', [userId]);
            streak = { current_streak: 0, longest_streak: 0, last_claim_date: null, cases_claimed_today: 0 };
        }

        const today = new Date().toISOString().split('T')[0];
        const isToday = streak.last_claim_date === today;
        const casesRemaining = isToday ? Math.max(0, 2 - streak.cases_claimed_today) : 2;
        
        // Calculate next claim time (midnight UTC)
        const tomorrow = new Date();
        tomorrow.setUTCHours(24, 0, 0, 0);

        res.json({
            can_claim: casesRemaining > 0,
            cases_remaining: casesRemaining,
            current_streak: streak.current_streak,
            longest_streak: streak.longest_streak,
            next_claim_at: isToday && casesRemaining === 0 ? tomorrow.toISOString() : null,
            streak_rewards: getStreakRewards(streak.current_streak),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno' });
    }
});

// POST /api/daily/claim
router.post('/daily/claim', authenticate, async (req, res) => {
    try {
        const userId = req.userId;
        let streak = await getAsync('SELECT * FROM daily_streak WHERE user_id = ?', [userId]);
        if (!streak) {
            await runAsync('INSERT INTO daily_streak (user_id) VALUES (?)', [userId]);
            streak = { current_streak: 0, longest_streak: 0, last_claim_date: null, cases_claimed_today: 0 };
        }

        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // Check if already claimed both today
        if (streak.last_claim_date === today && streak.cases_claimed_today >= 2) {
            return res.status(400).json({ error: 'Você já abriu as 2 caixas de hoje!' });
        }

        // Update streak
        let newStreak = streak.current_streak;
        let newClaimedToday = streak.cases_claimed_today;

        if (streak.last_claim_date === today) {
            // Same day, just increment claimed count
            newClaimedToday++;
        } else if (streak.last_claim_date === yesterday) {
            // Consecutive day - increment streak
            newStreak++;
            newClaimedToday = 1;
        } else {
            // Streak broken or first time
            newStreak = 1;
            newClaimedToday = 1;
        }

        const newLongest = Math.max(newStreak, streak.longest_streak || 0);

        // Roll item based on streak
        const item = rollItem(newStreak);

        // Save item to inventory
        await runAsync(
            `INSERT INTO inventory (user_id, item_id, item_data, source) VALUES (?, ?, ?, 'daily')`,
            [userId, item.id, JSON.stringify(item)]
        );

        // Grant XP: +5 base + 5*streak bonus
        const xpGained = 5 + (5 * newStreak);
        const user = await getAsync('SELECT xp, level FROM users WHERE id = ?', [userId]);
        const newXP = (user?.xp || 0) + xpGained;
        const newLevel = Math.floor(newXP / 500) + 1;
        let newRank = 'bronze';
        if (newXP >= 15000) newRank = 'lenda';
        else if (newXP >= 5000) newRank = 'diamante';
        else if (newXP >= 2000) newRank = 'ouro';
        else if (newXP >= 500) newRank = 'prata';

        await runAsync('UPDATE users SET xp = ?, level = ?, rank = ? WHERE id = ?', [newXP, newLevel, newRank, userId]);

        // Update streak table
        await runAsync(
            `UPDATE daily_streak SET current_streak = ?, longest_streak = ?, last_claim_date = ?, cases_claimed_today = ? WHERE user_id = ?`,
            [newStreak, newLongest, today, newClaimedToday, userId]
        );

        const updatedUser = await getAsync('SELECT coins FROM users WHERE id = ?', [userId]);

        res.json({
            success: true,
            item,
            xp_gained: xpGained,
            streak: {
                current: newStreak,
                longest: newLongest,
                cases_today: newClaimedToday,
                cases_remaining: 2 - newClaimedToday,
            },
            coins_balance: updatedUser.coins,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno' });
    }
});

module.exports = { router, ITEMS, rollItem };
