import express from 'express';
import db from '../db'; // Make sure this exports your pg `Pool` or `Client`

const router = express.Router();

// ✅ Login route (example, expand with real logic later)
router.post('/login', async (req, res) => {
  const { username, password, deviceId, latitude, longitude } = req.body;

  try {
    // Authenticate user from DB
    const result = await db.query(
      `SELECT id, username, name, role FROM users WHERE username = $1 AND password = $2`,
      [username, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // TODO: Save login log with deviceId, location if needed

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ Top-level users route
router.get('/top-level', async (_req, res) => {
  try {
    const result = await db.query(
      `SELECT id, username, name, role, parent_id, is_active, created_at
       FROM users
       WHERE parent_id IS NULL OR parent_id = 0`
    );

    res.json({ users: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch top-level users' });
  }
});

export default router;
