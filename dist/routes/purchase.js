"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../config/db"));
const router = express_1.default.Router();
router.post('/', async (req, res) => {
    const { user_id, draw_schedule_id, items } = req.body;
    if (!user_id || !draw_schedule_id || !Array.isArray(items)) {
        return res.status(400).json({ error: 'Invalid request body' });
    }
    const client = await db_1.default.connect();
    try {
        await client.query('BEGIN');
        const purchaseResult = await client.query('INSERT INTO purchases (user_id, draw_schedule_id) VALUES ($1, $2) RETURNING id', [user_id, draw_schedule_id]);
        const purchaseId = purchaseResult.rows[0].id;
        for (const item of items) {
            const { ticket_type_id, ticket_number, quantity } = item;
            await client.query(`INSERT INTO purchase_items (purchase_id, ticket_type_id, ticket_number, quantity)
         VALUES ($1, $2, $3, $4)`, [purchaseId, ticket_type_id, ticket_number, quantity]);
        }
        await client.query('COMMIT');
        res.status(201).json({ message: 'Purchase successful', purchase_id: purchaseId });
    }
    catch (err) {
        await client.query('ROLLBACK');
        console.error('Purchase error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
    finally {
        client.release();
    }
});
exports.default = router;
