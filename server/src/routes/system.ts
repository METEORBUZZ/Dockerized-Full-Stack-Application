import { Router, Request, Response } from 'express';
import os from 'os';
import { pool } from '../config/db';

const router = Router();

router.get('/system-info', async (_req: Request, res: Response) => {
  try {
    const memory = process.memoryUsage();
    
    res.json({
      success: true,
      data: {
        container: {
          hostname: os.hostname(),
          platform: os.platform(),
          arch: os.arch(),
          cpus: os.cpus().length,
          totalMemoryMb: Math.round(os.totalmem() / (1024 * 1024)),
          freeMemoryMb: Math.round(os.freemem() / (1024 * 1024)),
          uptimeSeconds: Math.floor(os.uptime()),
        },
        runtime: {
          nodeVersion: process.version,
          processUptime: Math.floor(process.uptime()),
          pid: process.pid,
          memoryUsage: {
            rssMb: Math.round(memory.rss / (1024 * 1024)),
            heapTotalMb: Math.round(memory.heapTotal / (1024 * 1024)),
            heapUsedMb: Math.round(memory.heapUsed / (1024 * 1024)),
          },
          environment: process.env.NODE_ENV || 'production',
        },
        database: {
          host: process.env.DB_HOST || 'postgres',
          database: process.env.DB_NAME || 'fullstack_db',
          user: process.env.DB_USER || 'postgres',
          poolTotal: pool.totalCount,
          poolIdle: pool.idleCount,
          poolWaiting: pool.waitingCount,
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve system info' });
  }
});

export default router;
