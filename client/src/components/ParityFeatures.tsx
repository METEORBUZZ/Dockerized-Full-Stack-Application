import React from 'react';
import { Terminal, Shield, Zap, Check, AlertOctagon, HelpCircle, GitCommit, HeartPulse } from 'lucide-react';

export const ParityFeatures: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
      
      {/* Problem & Solution Grid */}
      <div className="grid-cols-2">
        <div className="glass-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <AlertOctagon size={20} color="#ef4444" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>The Problem</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            <strong>"Works on my machine"</strong> friction: Inconsistent Node versions, mismatched local PostgreSQL binaries, missing OS packages, and disparate environment configs were slowing down team onboarding and turning bug reproduction into days of environment troubleshooting.
          </p>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <Check size={20} color="#10b981" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>The Solution</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Defined the entire stack in <strong>Docker Compose</strong> with strict environment parity. Both local development and cloud production share identical OS base layers (Alpine), database versions, network isolation, and healthcheck contracts.
          </p>
        </div>
      </div>

      {/* Feature Deep Dive Grid */}
      <div className="grid-cols-3">
        {/* Security */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <Shield size={18} color="#38bdf8" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Security & Secrets</h4>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>🔒 <strong>Zero credentials committed:</strong> Gitignore enforces <code>.env</code> exclusion.</li>
            <li>👤 <strong>Non-root execution:</strong> Express container runs as unprivileged <code>node</code> user.</li>
            <li>🛡️ <strong>Security Headers:</strong> Helmet & CORS configure defenses out of the box.</li>
          </ul>
        </div>

        {/* Monitoring & Healthchecks */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <HeartPulse size={18} color="#f43f5e" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Monitoring & Probes</h4>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>🩺 <strong>Postgres Probe:</strong> <code>pg_isready</code> validates DB port and auth.</li>
            <li>🩺 <strong>API Probe:</strong> <code>GET /api/health</code> verifies active DB query response.</li>
            <li>🩺 <strong>Orchestrator sync:</strong> <code>condition: service_healthy</code> stops startup races.</li>
          </ul>
        </div>

        {/* Build Speed & Caching */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <Zap size={18} color="#f59e0b" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Build Optimization</h4>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>⚡ <strong>Multi-stage Dockerfiles:</strong> Strips dev dependencies from final images.</li>
            <li>📦 <strong>Layer Caching:</strong> <code>package*.json</code> separated from source edits.</li>
            <li>🚀 <strong>Alpine Base Images:</strong> Minimal footprint, ultra-fast container downloads.</li>
          </ul>
        </div>
      </div>

      {/* Results / Run command banner */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Terminal size={18} color="#38bdf8" />
              <span style={{ fontWeight: 700, fontSize: '1rem', color: '#f8fafc' }}>
                Single-Command Developer Onboarding
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              New developers clone the repo and run one single command to launch all 3 containers with seeded database:
            </p>
          </div>
          <div style={{ 
            background: 'rgba(0, 0, 0, 0.6)', 
            padding: '0.6rem 1.2rem', 
            borderRadius: '8px', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            color: '#38bdf8'
          }}>
            docker compose up --build
          </div>
        </div>
      </div>

    </div>
  );
};
