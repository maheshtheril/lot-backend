import express from 'express';
import pool from '../config/db';

const router = express.Router();

// GET /draw-types or /draw-types?active=true
router.get('/', async (req, res) => {
  const showOnlyActive = req.query.active === 'true';

  try {
    const result = await pool.query(
      showOnlyActive
        ? 'SELECT * FROM draw_types WHERE is_active = true ORDER BY id'
        : 'SELECT * FROM draw_types ORDER BY id'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching draw types:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
