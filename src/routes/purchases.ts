// src/routes/ticket_types.ts
import express from 'express';
import pool from '../config/db';

const router = express.Router();

// GET all ticket types
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ticket_types ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching ticket types:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Optional: Add more endpoints like POST, PUT, DELETE if needed

export default router;
