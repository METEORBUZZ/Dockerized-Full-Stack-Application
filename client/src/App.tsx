import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { HealthStatusCard } from './components/HealthStatusCard';
import { ItemManager } from './components/ItemManager';
import { ParityFeatures } from './components/ParityFeatures';
import { HealthResponse, SystemInfo, Item } from './types';

export const App: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [system, setSystem] = useState<SystemInfo | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch healthcheck status
  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      } else {
        setHealth(null);
      }
    } catch (err) {
      setHealth(null);
    }
  }, []);

  // Fetch system diagnostics
  const fetchSystem = useCallback(async () => {
    try {
      const res = await fetch('/api/system-info');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setSystem(json.data);
        }
      }
    } catch (err) {
      setSystem(null);
    }
  }, []);

  // Fetch persistent items
  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/items');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setItems(json.data);
        }
      }
    } catch (err) {
      // Fallback for initial UI rendering before API is up
    }
  }, []);

  // Refresh all state
  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.allSettled([fetchHealth(), fetchSystem(), fetchItems()]);
    setIsRefreshing(false);
    setLoading(false);
  }, [fetchHealth, fetchSystem, fetchItems]);

  useEffect(() => {
    refreshAll();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, [refreshAll, fetchHealth]);

  // CRUD operations
  const handleAddItem = async (title: string, description: string, category: string, priority: string) => {
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category, priority }),
      });
      if (res.ok) {
        await fetchItems();
      }
    } catch (err) {
      console.error('Failed to create item:', err);
    }
  };

  const handleUpdateStatus = async (id: number, status: Item['status']) => {
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchItems();
      }
    } catch (err) {
      console.error('Failed to update item:', err);
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchItems();
      }
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  return (
    <div className="container">
      <Header onRefresh={refreshAll} isRefreshing={isRefreshing} />

      <ArchitectureDiagram health={health} loading={loading} />

      <HealthStatusCard health={health} system={system} loading={loading} />

      <ItemManager
        items={items}
        onAddItem={handleAddItem}
        onUpdateStatus={handleUpdateStatus}
        onDeleteItem={handleDeleteItem}
        loading={loading}
      />

      <ParityFeatures />

      <footer style={{ 
        textAlign: 'center', 
        padding: '2rem 0', 
        borderTop: '1px solid var(--border-color)', 
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
      }}>
        Dockerized Full Stack Application · Production-Grade Container Architecture · Built with React, Express & PostgreSQL
      </footer>
    </div>
  );
};
