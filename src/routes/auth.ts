// src/routes/auth.ts
import { Router, Request, Response, NextFunction } from 'express';
import pool from '../config/db';

const router = Router(); // ✅ CORRECT way to initialize a router

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, device_id, location_lat, location_lng } = req.body;

    if (!username || !password || !device_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

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

    await pool.query(
      `INSERT INTO login_details (username, device_id, location_lat, location_lng, login_time)
       VALUES ($1, $2, $3, $4, NOW())`,
      [username, device_id, location_lat, location_lng]
    );

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
