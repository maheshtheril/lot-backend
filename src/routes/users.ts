// src/routes/users.ts
import express from 'express';
import pool from '../config/db'; // ✅ Make sure this is your PostgreSQL connection

const router = express.Router();

// ✅ Route: Get all top-level users
router.get('/top-level', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE parent_id IS NULL OR parent_id = 0'
    );
    res.json({ users: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ Example login (keep this too if needed)
router.post('/login', async (req, res) => {
  const { username, password, deviceId, latitude, longitude } = req.body;

  try {
    console.log({ username, password, deviceId, latitude, longitude });
    res.json({ success: true, message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
