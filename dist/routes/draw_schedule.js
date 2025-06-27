"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/draw_schedule.ts
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../config/db"));
const router = express_1.default.Router();
// Get all draw schedules
router.get('/', async (req, res) => {
    try {
        const result = await db_1.default.query('SELECT * FROM draw_schedule');
        res.json(result.rows);
    }
    catch (err) {
        console.error('Error fetching draw schedule:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
