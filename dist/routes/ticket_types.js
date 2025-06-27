"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/ticket_types.ts
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../config/db"));
const router = express_1.default.Router();
// GET all ticket types
router.get('/', async (req, res) => {
    try {
        const result = await db_1.default.query('SELECT * FROM ticket_types ORDER BY id');
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error fetching ticket types:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Optional: Add more endpoints like POST, PUT, DELETE if needed
exports.default = router;
