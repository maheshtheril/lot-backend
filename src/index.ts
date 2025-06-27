import express, { Request, Response, NextFunction } from 'express'; // 👈 added Request, Response, NextFunction
import dotenv from 'dotenv';
import pool from './config/db';

import userRoutes from './routes/users';
import drawTypesRoutes from './routes/draw_types';
import drawScheduleRoutes from './routes/draw_schedule';
import purchasesRoutes from './routes/purchases';
import purchaseItemRoutes from './routes/purchase_items';
import loginCheckRouter from './routes/login_check';
import loginHistoryRouter from './routes/login_history';
import authRoutes from './routes/login'; // ✅ keep only this one

dotenv.config();

const app = express();
app.use(express.json());

// Mount routes
app.use('/login-check', loginCheckRouter);
app.use('/purchase-items', purchaseItemRoutes);
app.use('/purchases', purchasesRoutes);
app.use('/draw-schedule', drawScheduleRoutes);
app.use('/draw-types', drawTypesRoutes);
app.use('/users', userRoutes);
app.use('/login-history', loginHistoryRouter);
app.use('/auth', authRoutes); // 🔐 login route

app.get('/', (req, res) => {
  res.send('✅ Lottery API running!');
});


app.get('/cause-error', (req: Request, res: Response) => {
  throw new Error('This is a test error');
});
// ✅ Global error handler (MUST be after all routes)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('🔴 Error:', err.stack); // Log to console (or logging service)
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
