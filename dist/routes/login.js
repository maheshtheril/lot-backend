"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../config/db"));
const router = express_1.default.Router();
router.post('/', async (req, res) => {
    const { username, password, device_id, location_lat, location_lng } = req.body;
    try {
        const userResult = await db_1.default.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userResult.rows.length === 0 || userResult.rows[0].password !== password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const user = userResult.rows[0];
        await db_1.default.query(`INSERT INTO login_details (username, device_id, location_lat, location_lng, login_time)
       VALUES ($1, $2, $3, $4, NOW())`, [username, device_id, location_lat, location_lng]);
        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
