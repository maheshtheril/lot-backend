// src/routes/users.ts
import express from 'express';

const router = express.Router();

// Example login route
router.post('/login', async (req, res) => {
  const { username, password, deviceId, latitude, longitude } = req.body;

  try {
    // TODO: Authenticate user and store login info
    console.log({ username, password, deviceId, latitude, longitude });

    // For now, return mock response
    res.json({ success: true, message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
