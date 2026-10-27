import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { errorHandler, notFound } from './middleware/errorHandler';
import routes from './routes';

const app = express();

app.use(helmet());

// Izinkan request dari frontend (Vercel) dan localhost saat development
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3001')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Izinkan jika tidak ada origin (curl / Thunder Client) atau origin terdaftar
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin '${origin}' tidak diizinkan`));
      }
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
