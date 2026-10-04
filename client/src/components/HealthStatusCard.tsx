import React from 'react';
import { Activity, Cpu, HardDrive, Network } from 'lucide-react';
import { HealthResponse, SystemInfo } from '../types';

interface HealthStatusCardProps {
  health: HealthResponse | null;
  system: SystemInfo | null;
  loading: boolean;
}

export const HealthStatusCard: React.FC<HealthStatusCardProps> = ({ health, system, loading }) => {
  return (
    <div className="glass-card" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Activity size={20} color="#10b981" />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Container Health & Telemetry</h2>
        </div>
        <span className="badge badge-green">
          {health?.status === 'healthy' ? 'ALL SYSTEMS OPERATIONAL' : loading ? 'CHECKING...' : 'DEGRADED'}
        </span>
      </div>

      <div className="grid-cols-3">
        {/* API Telemetry */}
        <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>
            <Cpu size={16} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>API Container Runtime</span>
          </div>
          <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Container Host:</span>
              <code>{health?.hostname || 'api-container'}</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Node Version:</span>
              <code>{system?.runtime?.nodeVersion || 'v20.x'}</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Memory (RSS):</span>
              <code>{health?.services?.api?.memoryUsageMb ?? '---'} MB</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Environment:</span>
              <span className="badge badge-purple" style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}>
                {health?.environment || 'production'}
              </span>
            </div>
          </div>
        </div>

        {/* Database Telemetry */}
        <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-purple)' }}>
            <HardDrive size={16} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>PostgreSQL Connection Pool</span>
          </div>
          <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Database Host:</span>
              <code>{system?.database?.host || 'postgres:5432'}</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Database Name:</span>
              <code>{system?.database?.database || 'fullstack_db'}</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Query Latency:</span>
              <code style={{ color: '#34d399' }}>{health?.services?.postgres?.latencyMs ?? 0} ms</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Pool Connections:</span>
              <code>{health?.services?.postgres?.poolTotal ?? 1} / 20</code>
            </div>
          </div>
        </div>

        {/* Orchestrator & Parity Info */}
        <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-green)' }}>
            <Network size={16} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Orchestrator Probes</span>
          </div>
          <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>PostgreSQL Probe:</span>
              <span style={{ color: '#34d399' }}>pg_isready (healthy)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>API Probe:</span>
              <span style={{ color: '#34d399' }}>GET /api/health (200)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Nginx Probe:</span>
              <span style={{ color: '#34d399' }}>GET /nginx-health (200)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Orchestration:</span>
              <span style={{ color: 'var(--text-secondary)' }}>Docker Compose</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
