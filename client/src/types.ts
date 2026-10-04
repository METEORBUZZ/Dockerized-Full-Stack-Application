export interface Item {
  id: number;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptimeSeconds: number;
  hostname: string;
  environment: string;
  services: {
    api: {
      status: 'up' | 'down';
      memoryUsageMb: number;
    };
    postgres: {
      status: 'up' | 'down';
      latencyMs: number;
      error?: string;
      poolTotal: number;
      poolIdle: number;
      poolWaiting: number;
    };
  };
}

export interface SystemInfo {
  container: {
    hostname: string;
    platform: string;
    arch: string;
    cpus: number;
    totalMemoryMb: number;
    freeMemoryMb: number;
    uptimeSeconds: number;
  };
  runtime: {
    nodeVersion: string;
    processUptime: number;
    pid: number;
    memoryUsage: {
      rssMb: number;
      heapTotalMb: number;
      heapUsedMb: number;
    };
    environment: string;
  };
  database: {
    host: string;
    database: string;
    user: string;
    poolTotal: number;
    poolIdle: number;
    poolWaiting: number;
  };
}
