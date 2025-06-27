"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/purchase_items.ts
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const router = (0, express_1.Router)();
// Get all purchase items
router.get('/', async (req, res) => {
    try {
        const result = await db_1.default.query('SELECT * FROM purchase_items ORDER BY id DESC');
        res.json(result.rows);
    }
    catch (err) {
        console.error('Error fetching purchase items:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get items by purchase ID
router.get('/purchase/:purchase_id', async (req, res) => {
    const purchaseId = Number(req.params.purchase_id);
    try {
        const result = await db_1.default.query('SELECT * FROM purchase_items WHERE purchase_id = $1', [purchaseId]);
        res.json(result.rows);
    }
    catch (err) {
        console.error('Error fetching items by purchase_id:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Bulk insert items
router.post('/bulk', async (req, res) => {
    const { purchase_id, items } = req.body;
    if (!purchase_id || !Array.isArray(items)) {
        res.status(400).json({ error: 'Invalid request body' });
        return;
    }
    const client = await db_1.default.connect();
    try {
        await client.query('BEGIN');
        for (const item of items) {
            const { ticket_type_id, ticket_number, quantity } = item;
            await client.query(`INSERT INTO purchase_items (purchase_id, ticket_type_id, ticket_number, quantity)
         VALUES ($1, $2, $3, $4)`, [purchase_id, ticket_type_id, ticket_number, quantity]);
        }
        await client.query('COMMIT');
        res.status(201).json({ message: 'Items added successfully' });
    }
    catch (err) {
        await client.query('ROLLBACK');
        console.error('Bulk insert error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
    finally {
        client.release();
    }
});
// Update an item
router.put('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { ticket_type_id, ticket_number, quantity } = req.body;
    try {
        const result = await db_1.default.query(`UPDATE purchase_items
       SET ticket_type_id=$1, ticket_number=$2, quantity=$3
       WHERE id=$4 RETURNING *`, [ticket_type_id, ticket_number, quantity, id]);
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Item not found' });
            return;
        }
        res.json({ message: 'Item updated successfully', item: result.rows[0] });
    }
    catch (err) {
        console.error('Error updating item:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Delete an item
router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id);
    try {
        const result = await db_1.default.query('DELETE FROM purchase_items WHERE id=$1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Item not found' });
            return;
        }
        res.json({ message: 'Item deleted successfully' });
    }
    catch (err) {
        console.error('Error deleting item:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
