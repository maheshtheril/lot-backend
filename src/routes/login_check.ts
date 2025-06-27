import express from 'express';
import pool from '../config/db';

const router = express.Router();

// Check how many devices a user has logged in from
router.get('/device-check/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT COUNT(DISTINCT device_id) AS device_count
       FROM login_details
       WHERE user_id = $1`,
      [userId]
    );

    const deviceCount = result.rows[0].device_count;

    res.json({
      user_id: userId,
      multiple_devices: deviceCount > 1,
      device_count: deviceCount
    });
  } catch (error) {
    console.error('Error checking device usage:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
