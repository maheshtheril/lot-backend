import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users';
import authRoutes from './routes/auth'; // ✅ You forgot this!
import drawTypesRoutes from './routes/draw_types';



dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/draw-types', drawTypesRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes); // ✅ Mount your auth route!

// ✅ Health check or root
app.get('/', (req, res) => {
  res.send('✅ Backend is running! Use /users/top-level or /auth to test.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
