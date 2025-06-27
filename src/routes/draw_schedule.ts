// src/routes/draw_schedule.ts
import express from 'express';
import pool from '../config/db';

const router = express.Router();

// Get all draw schedules
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM draw_schedule');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching draw schedule:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
