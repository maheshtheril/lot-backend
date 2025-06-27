import { Router, Request, Response, NextFunction } from 'express';
import pool from '../config/db';

const router = Router(); // ✅ No need to use express.Router()

interface PurchaseRequestBody {
  user_id: number;
  draw_schedule_id: number;
  items: {
    ticket_type_id: number;
    ticket_number: string;
    quantity: number;
  }[];
}

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { user_id, draw_schedule_id, items } = req.body as PurchaseRequestBody;

  if (!user_id || !draw_schedule_id || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const purchaseResult = await client.query(
      'INSERT INTO purchases (user_id, draw_schedule_id) VALUES ($1, $2) RETURNING id',
      [user_id, draw_schedule_id]
    );
    const purchaseId = purchaseResult.rows[0].id;

    for (const item of items) {
      const { ticket_type_id, ticket_number, quantity } = item;

      await client.query(
        `INSERT INTO purchase_items (purchase_id, ticket_type_id, ticket_number, quantity)
         VALUES ($1, $2, $3, $4)`,
        [purchaseId, ticket_type_id, ticket_number, quantity]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Purchase successful', purchase_id: purchaseId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('🔴 Purchase error:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

export default router;
