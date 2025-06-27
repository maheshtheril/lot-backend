"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../config/db"));
const router = express_1.default.Router();
// Get login history for a user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db_1.default.query(`SELECT id, user_id, device_id, location, login_time
       FROM login_details
       WHERE user_id = $1
       ORDER BY login_time DESC`, [userId]);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error fetching login history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
