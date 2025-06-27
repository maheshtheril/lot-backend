"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../config/db"));
const router = express_1.default.Router();
// Check how many devices a user has logged in from
router.get('/device-check/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db_1.default.query(`SELECT COUNT(DISTINCT device_id) AS device_count
       FROM login_details
       WHERE user_id = $1`, [userId]);
        const deviceCount = result.rows[0].device_count;
        res.json({
            user_id: userId,
            multiple_devices: deviceCount > 1,
            device_count: deviceCount
        });
    }
    catch (error) {
        console.error('Error checking device usage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
