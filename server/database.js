const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'dopashop.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) { console.error("Error opening database:", err.message); }
    else { console.log("Connected to SQLite database."); initDB(); }
});

function generateReferralCode() {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
}

function initDB() {
    db.serialize(() => {
        // Users - full schema compatible with Supabase
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT UNIQUE,
            email TEXT UNIQUE,
            password_hash TEXT,
            username TEXT UNIQUE,
            display_name TEXT,
            avatar_url TEXT,
            bio TEXT DEFAULT '',
            coins REAL DEFAULT 2500,
            xp INTEGER DEFAULT 0,
            level INTEGER DEFAULT 1,
            rank TEXT DEFAULT 'bronze',
            referral_code TEXT UNIQUE,
            referred_by INTEGER,
            is_email_verified INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now'))
        )`);

        // Inventory
        db.run(`CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            item_id TEXT,
            item_data TEXT,
            locked INTEGER DEFAULT 0,
            source TEXT DEFAULT 'case',
            acquired_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        // Daily streak
        db.run(`CREATE TABLE IF NOT EXISTS daily_streak (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE,
            current_streak INTEGER DEFAULT 0,
            longest_streak INTEGER DEFAULT 0,
            last_claim_date TEXT,
            cases_claimed_today INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        // Friendships
        db.run(`CREATE TABLE IF NOT EXISTS friendships (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            requester_id INTEGER,
            addressee_id INTEGER,
            status TEXT DEFAULT 'pending',
            created_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (requester_id) REFERENCES users(id),
            FOREIGN KEY (addressee_id) REFERENCES users(id)
        )`);

        // Battles
        db.run(`CREATE TABLE IF NOT EXISTS battles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            challenger_id INTEGER,
            opponent_id INTEGER,
            case_name TEXT DEFAULT 'dopamina',
            entry_fee REAL DEFAULT 0,
            status TEXT DEFAULT 'pending',
            winner_id INTEGER,
            challenger_item TEXT,
            opponent_item TEXT,
            invite_code TEXT UNIQUE,
            created_at TEXT DEFAULT (datetime('now')),
            finished_at TEXT,
            FOREIGN KEY (challenger_id) REFERENCES users(id),
            FOREIGN KEY (opponent_id) REFERENCES users(id)
        )`);

        // Notifications
        db.run(`CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            type TEXT,
            payload TEXT,
            read INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        // Referrals
        db.run(`CREATE TABLE IF NOT EXISTS referrals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            referrer_id INTEGER,
            referred_id INTEGER,
            rewarded INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (referrer_id) REFERENCES users(id),
            FOREIGN KEY (referred_id) REFERENCES users(id)
        )`);

        // Add missing columns to existing users table (migration safety)
        const newCols = [
            `ALTER TABLE users ADD COLUMN uuid TEXT`,
            `ALTER TABLE users ADD COLUMN email TEXT`,
            `ALTER TABLE users ADD COLUMN password_hash TEXT`,
            `ALTER TABLE users ADD COLUMN username TEXT`,
            `ALTER TABLE users ADD COLUMN display_name TEXT`,
            `ALTER TABLE users ADD COLUMN avatar_url TEXT`,
            `ALTER TABLE users ADD COLUMN bio TEXT DEFAULT ''`,
            `ALTER TABLE users ADD COLUMN xp INTEGER DEFAULT 0`,
            `ALTER TABLE users ADD COLUMN level INTEGER DEFAULT 1`,
            `ALTER TABLE users ADD COLUMN rank TEXT DEFAULT 'bronze'`,
            `ALTER TABLE users ADD COLUMN referral_code TEXT`,
            `ALTER TABLE users ADD COLUMN referred_by INTEGER`,
            `ALTER TABLE users ADD COLUMN is_email_verified INTEGER DEFAULT 0`,
        ];
        newCols.forEach(sql => { db.run(sql, () => {}); }); // ignore errors (column exists)

        // Create default user with full data if not exists
        db.get(`SELECT id FROM users WHERE id = 1`, (err, row) => {
            if (!row) {
                const uid = crypto.randomUUID();
                const code = generateReferralCode();
                db.run(`INSERT INTO users (id, uuid, email, username, display_name, coins, referral_code)
                        VALUES (1, ?, 'admin@dopashop.gg', 'admin', 'Admin', 2500, ?)`, [uid, code]);
                db.run(`INSERT INTO daily_streak (user_id) VALUES (1)`, () => {});
                console.log("Created default user ID: 1");
            } else {
                // Ensure daily_streak exists for user 1
                db.run(`INSERT OR IGNORE INTO daily_streak (user_id) VALUES (1)`);
                // Ensure referral_code exists
                db.get(`SELECT referral_code FROM users WHERE id = 1`, (e, u) => {
                    if (u && !u.referral_code) {
                        db.run(`UPDATE users SET referral_code = ? WHERE id = 1`, [generateReferralCode()]);
                    }
                    if (u && !u.uuid) {
                        db.run(`UPDATE users SET uuid = ? WHERE id = 1`, [crypto.randomUUID()]);
                    }
                });
            }
        });
    });
}

function runAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err); else resolve(this);
        });
    });
}

function getAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err); else resolve(row);
        });
    });
}

function allAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err); else resolve(rows);
        });
    });
}

module.exports = { db, runAsync, getAsync, allAsync, generateReferralCode };
