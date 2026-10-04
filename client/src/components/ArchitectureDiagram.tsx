import React from 'react';
import { Layout, Server, Database, ArrowDown, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { HealthResponse } from '../types';

interface ArchitectureDiagramProps {
  health: HealthResponse | null;
  loading: boolean;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ health, loading }) => {
  const isApiUp = health?.services?.api?.status === 'up';
  const isDbUp = health?.services?.postgres?.status === 'up';

  return (
    <div className="glass-card" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Container Architecture & Network Flow</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Multi-tier Docker network (`app-network`) with ordered health check dependencies
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
            <ShieldCheck size={12} /> Isolated Bridge Network
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
        
        {/* React Frontend Container */}
        <div style={{ 
          width: '100%', 
          maxWidth: '680px',
          background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)', 
          border: '1px solid rgba(56, 189, 248, 0.25)', 
          borderRadius: '12px',
          padding: '1.25rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '0.6rem', borderRadius: '10px' }}>
                <Layout size={22} color="#38bdf8" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: '#f8fafc' }}>React Frontend Container</span>
                  <span className="badge badge-green">Healthy</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Service: <code>client</code> · Port: <code>:3000</code> · Multi-stage Alpine Nginx
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--accent-cyan)' }}>Reverse Proxy: /api/*</span>
            </div>
          </div>
        </div>

        {/* Down Arrow Connector */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--accent-cyan)' }}>
          <ArrowDown size={22} />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            HTTP Reverse Proxy / REST API
          </span>
        </div>

        {/* Express API Container */}
        <div style={{ 
          width: '100%', 
          maxWidth: '680px',
          background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)', 
          border: `1px solid ${isApiUp ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, 
          borderRadius: '12px',
          padding: '1.25rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.6rem', borderRadius: '10px' }}>
                <Server size={22} color="#f59e0b" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: '#f8fafc' }}>Express API Container</span>
                  {loading ? (
                    <span className="badge badge-amber">Checking...</span>
                  ) : isApiUp ? (
                    <span className="badge badge-green"><CheckCircle2 size={12} /> Healthy</span>
                  ) : (
                    <span className="badge badge-rose"><AlertTriangle size={12} /> Unreachable</span>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Service: <code>api</code> · Port: <code>:5000</code> · Non-root user `node` · Healthcheck: <code>/api/health</code>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Uptime: <code style={{ color: 'var(--accent-amber)' }}>{health ? `${health.uptimeSeconds}s` : '---'}</code>
            </div>
          </div>
        </div>

        {/* Down Arrow Connector */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--accent-purple)' }}>
          <ArrowDown size={22} />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            TCP Connection Pool (pg · port 5432)
          </span>
        </div>

        {/* PostgreSQL Database Container */}
        <div style={{ 
          width: '100%', 
          maxWidth: '680px',
          background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)', 
          border: `1px solid ${isDbUp ? 'rgba(168, 85, 247, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, 
          borderRadius: '12px',
          padding: '1.25rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '0.6rem', borderRadius: '10px' }}>
                <Database size={22} color="#a855f7" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: '#f8fafc' }}>PostgreSQL Container</span>
                  {loading ? (
                    <span className="badge badge-amber">Checking...</span>
                  ) : isDbUp ? (
                    <span className="badge badge-green"><CheckCircle2 size={12} /> Healthy</span>
                  ) : (
                    <span className="badge badge-rose"><AlertTriangle size={12} /> Degraded</span>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Service: <code>postgres</code> · Port: <code>:5432</code> · Volume: <code>postgres_data</code> · <code>pg_isready</code> check
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              DB Latency: <code style={{ color: 'var(--accent-purple)' }}>{health?.services?.postgres?.latencyMs ?? '---'}ms</code>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
