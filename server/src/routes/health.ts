import { Router, Request, Response } from 'express';
import os from 'os';
import { checkDbConnection, pool } from '../config/db';

const router = Router();

router.get('/health', async (_req: Request, res: Response) => {
  const dbStatus = await checkDbConnection();
  const uptimeSeconds = Math.floor(process.uptime());
  
  const healthData = {
    status: dbStatus.healthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    hostname: os.hostname(),
    environment: process.env.NODE_ENV || 'production',
    services: {
      api: {
        status: 'up',
        memoryUsageMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
      },
      postgres: {
        status: dbStatus.healthy ? 'up' : 'down',
        latencyMs: dbStatus.latencyMs,
        error: dbStatus.error,
        poolTotal: pool.totalCount,
        poolIdle: pool.idleCount,
        poolWaiting: pool.waitingCount,
      }
    }
  };

  if (!dbStatus.healthy) {
    return res.status(503).json(healthData);
  }

  return res.status(200).json(healthData);
});

export default router;
