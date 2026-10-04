import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Clock, AlertCircle, Sparkles, Database } from 'lucide-react';
import { Item } from '../types';

interface ItemManagerProps {
  items: Item[];
  onAddItem: (title: string, description: string, category: string, priority: string) => Promise<void>;
  onUpdateStatus: (id: number, status: Item['status']) => Promise<void>;
  onDeleteItem: (id: number) => Promise<void>;
  loading: boolean;
}

export const ItemManager: React.FC<ItemManagerProps> = ({
  items,
  onAddItem,
  onUpdateStatus,
  onDeleteItem,
  loading,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('DevOps');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onAddItem(title, description, category, priority);
      setTitle('');
      setDescription('');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'high':
        return <span className="badge badge-rose">High</span>;
      case 'medium':
        return <span className="badge badge-amber">Medium</span>;
      default:
        return <span className="badge badge-blue">Low</span>;
    }
  };

  const getStatusBadge = (status: Item['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="badge badge-green">
            <CheckCircle2 size={12} /> Done
          </span>
        );
      case 'in-progress':
        return (
          <span className="badge badge-blue">
            <Clock size={12} /> In Progress
          </span>
        );
      default:
        return (
          <span className="badge badge-amber">
            <AlertCircle size={12} /> Pending
          </span>
        );
    }
  };

  return (
    <div className="glass-card" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={20} color="#a855f7" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>PostgreSQL Persistent State Demo</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Live CRUD mutations synced to the PostgreSQL volume across container restarts
          </p>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.25rem', borderRadius: '8px' }}>
          {(['all', 'pending', 'in-progress', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className="btn"
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                background: filter === tab ? 'var(--accent-blue)' : 'transparent',
                color: filter === tab ? '#fff' : 'var(--text-secondary)',
                borderRadius: '6px',
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Item Creation Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', background: 'rgba(15, 23, 42, 0.4)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Item Title *</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Implement Redis caching layer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Category</label>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="DevOps">DevOps</option>
              <option value="Docker">Docker</option>
              <option value="Database">Database</option>
              <option value="Backend">Backend</option>
              <option value="Frontend">Frontend</option>
              <option value="Security">Security</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Priority</label>
            <select className="input" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="text"
            className="input"
            placeholder="Optional detailed description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" disabled={submitting || !title.trim()}>
            <Plus size={16} />
            {submitting ? 'Persisting...' : 'Add to PostgreSQL'}
          </button>
        </div>
      </form>

      {/* Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No items found for the selected filter.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.85rem 1rem',
                background: 'rgba(15, 23, 42, 0.4)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                transition: 'background 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <button
                  onClick={() => {
                    const nextStatus = item.status === 'completed' ? 'pending' : item.status === 'pending' ? 'in-progress' : 'completed';
                    onUpdateStatus(item.id, nextStatus);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: item.status === 'completed' ? '#10b981' : 'var(--text-muted)',
                    marginTop: '2px',
                  }}
                  title="Click to advance status"
                >
                  <CheckCircle2 size={20} />
                </button>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        textDecoration: item.status === 'completed' ? 'line-through' : 'none',
                        color: item.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)',
                      }}
                    >
                      {item.title}
                    </span>
                    <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                      {item.category}
                    </span>
                    {getPriorityBadge(item.priority)}
                    {getStatusBadge(item.status)}
                  </div>
                  {item.description && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      {item.description}
                    </p>
                  )}
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    ID: #{item.id} · Created: {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  className="btn btn-danger"
                  style={{ padding: '0.4rem 0.6rem' }}
                  onClick={() => onDeleteItem(item.id)}
                  title="Delete from PostgreSQL"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
