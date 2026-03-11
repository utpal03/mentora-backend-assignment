import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { connectDb } from './config/db.js';
import authRoutes from './modules/auth/auth.routes.js';
import * as authController from './modules/auth/auth.controller.js';
import studentRoutes from './modules/student/student.routes.js';
import lessonRoutes from './modules/lesson/lesson.routes.js';
import bookingRoutes from './modules/booking/booking.routes.js';
import sessionRoutes from './modules/session/session.routes.js';
import llmRoutes from './modules/llm/llm.routes.js';
import { authenticate } from './middleware/auth.js';

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server and same-origin requests without Origin header.
      if (!origin) {
        callback(null, true);
        return;
      }
      if (config.corsAllowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      const error = new Error('CORS origin is not allowed');
      error.statusCode = 403;
      callback(error);
    },
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello this is master backend of Mentora please refer README.md for more information');
});

app.use('/auth', authRoutes);
app.get('/me', authenticate, authController.getMe);
app.use('/students', studentRoutes);
app.use('/lessons', lessonRoutes);
app.use('/bookings', bookingRoutes);
app.use('/sessions', sessionRoutes);
app.use('/llm', llmRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Internal server error';
  res.status(status).json({ error: message });
});

async function start() {
  try {
    await connectDb();
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
