import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import articleRoutes from './routes/articleRoutes';
import videoRoutes from './routes/videoRoutes';
import categoryRoutes from './routes/categoryRoutes';
import interactionRoutes from './routes/interactionRoutes';
import adminRoutes from './routes/adminRoutes';
import searchRoutes from './routes/searchRoutes';
import { errorHandler, notFoundHandler } from './middleware/error';
import { seedInitialData } from './seeds/seedData';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & HTTP Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
);

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'production') {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// Static files for local media uploads (videos & images)
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'MarketSphere Educational Platform API',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);

// Production Static Serving for React SPA
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexFile = path.join(clientDistPath, 'index.html');
  res.sendFile(indexFile, (err) => {
    if (err) {
      next();
    }
  });
});

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  await connectDB();
  
  // Seed sample data if database is empty
  await seedInitialData();

  app.listen(PORT, () => {
    console.log(`🚀 MarketSphere Server running at http://localhost:${PORT}`);
    console.log(`📚 API documentation & endpoints active.`);
  });
};

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});

export default app;
