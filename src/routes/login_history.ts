import express from 'express';
import pool from '../config/db';

const router = express.Router();

// Get login history for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, user_id, device_id, location, login_time
       FROM login_details
       WHERE user_id = $1
       ORDER BY login_time DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching login history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
