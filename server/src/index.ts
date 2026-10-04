import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import healthRoutes from './routes/health';
import itemRoutes from './routes/items';
import systemRoutes from './routes/system';
import { closePool } from './config/db';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = process.env.API_HOST || '0.0.0.0';

// Security Headers
app.use(helmet());

// Cross-Origin Resource Sharing
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:3000', 'http://localhost:80'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, docker internal health checks)
      if (!origin || corsOrigins.includes(origin) || corsOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in local docker setup to ease onboarding
      }
    },
    credentials: true,
  })
);

// Logging
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', healthRoutes);
app.use('/api', itemRoutes);
app.use('/api', systemRoutes);

// Root fallback / ping
app.get('/', (_req: Request, res: Response) => {
  res.json({
    service: 'Dockerized Full Stack Express API',
    status: 'online',
    version: '1.0.0',
    documentation: '/api/health, /api/items, /api/system-info',
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Centralized Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start HTTP Server
const server = app.listen(PORT, HOST, () => {
  console.log(`===============================================`);
  console.log(`🚀 Express API Container running at http://${HOST}:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🔗 Connected PostgreSQL Host: ${process.env.DB_HOST || 'postgres'}`);
  console.log(`🩺 Health check ready at http://${HOST}:${PORT}/api/health`);
  console.log(`===============================================`);
});

// Graceful shutdown handling for container stops (Docker stop sends SIGTERM)
const handleGracefulShutdown = async (signal: string) => {
  console.log(`\n[${signal}] received. Initiating graceful shutdown...`);
  server.close(async () => {
    console.log('[Express API]: Closed HTTP server.');
    await closePool();
    console.log('[Express API]: Process terminated cleanly.');
    process.exit(0);
  });

  // Force shutdown after 10s if connections linger
  setTimeout(() => {
    console.error('[Express API]: Forcefully terminating process after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
