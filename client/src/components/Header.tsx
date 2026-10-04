import React from 'react';
import { Layers, Server, Database, RefreshCw, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh, isRefreshing }) => {
  return (
    <header style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #0284c7, #2563eb)', 
              padding: '0.6rem', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)'
            }}>
              <Layers size={24} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
                Dockerized Full Stack Application
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Environment Parity · Multi-stage Containerization · Healthchecks · Orchestration
              </p>
            </div>
          </div>

          {/* Tech Stack Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
            <span className="badge badge-blue">
              <span className="status-dot active"></span> Docker & Compose
            </span>
            <span className="badge badge-cyan" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              React 18 (Vite)
            </span>
            <span className="badge badge-amber">
              <Server size={12} /> Express API
            </span>
            <span className="badge badge-purple">
              <Database size={12} /> PostgreSQL 16
            </span>
            <span className="badge badge-green">
              <ShieldCheck size={12} /> Zero-Secret Repo
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={onRefresh}
            disabled={isRefreshing}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Polling Containers...' : 'Refresh Status'}
          </button>
        </div>
      </div>
    </header>
  );
};
