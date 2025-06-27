import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import pool from './config/db';

import userRoutes from './routes/users';
import drawTypesRoutes from './routes/draw_types';
import drawScheduleRoutes from './routes/draw_schedule';
import purchasesRoutes from './routes/purchases'; // ✅ correct
import purchaseItemRoutes from './routes/purchase_items';
import loginCheckRouter from './routes/login_check';
import loginHistoryRouter from './routes/login_history';
import authRoutes from './routes/login'; // ✅ auth route

dotenv.config();

const app = express();
app.use(express.json());

// Mount routes
app.use('/login-check', loginCheckRouter);
app.use('/purchase-items', purchaseItemRoutes);
app.use('/purchases', purchasesRoutes); // ✅ correctly used
app.use('/draw-schedule', drawScheduleRoutes);
app.use('/draw-types', drawTypesRoutes);
app.use('/users', userRoutes);
app.use('/login-history', loginHistoryRouter);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('✅ Lottery API running!');
});

app.get('/cause-error', (req: Request, res: Response) => {
  throw new Error('This is a test error');
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('🔴 Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
