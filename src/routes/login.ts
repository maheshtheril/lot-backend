import express, { Request, Response, Router, NextFunction } from 'express';
import pool from '../config/db';

const router: Router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, device_id, location_lat, location_lng } = req.body;

    // Validate input
    if (!username || !password || !device_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const userResult = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (
      userResult.rows.length === 0 ||
      userResult.rows[0].password !== password
    ) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = userResult.rows[0];

    // Insert login details
    await pool.query(
      `INSERT INTO login_details (username, device_id, location_lat, location_lng, login_time)
       VALUES ($1, $2, $3, $4, NOW())`,
      [username, device_id, location_lat, location_lng]
    );

    // Respond with user details
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    next(err); // Forward to global error handler
  }
});

export default router;
