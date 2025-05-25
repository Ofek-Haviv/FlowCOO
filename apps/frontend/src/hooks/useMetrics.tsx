import { useState, useEffect } from 'react';
import { Metric } from '@/components/MetricCard';

const API_URL = 'http://localhost:4000';

export const useMetrics = (userId: string) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`${API_URL}/metrics?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, [userId]);

  const addMetric = async (metric: Omit<Metric, 'id'>) => {
    try {
      const response = await fetch(`${API_URL}/metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...metric, userId }),
      });
      if (!response.ok) throw new Error('Failed to add metric');
      const newMetric = await response.json();
      setMetrics(prev => [newMetric, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const updateMetric = async (id: string, data: Partial<Metric>) => {
    try {
      const response = await fetch(`${API_URL}/metrics/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update metric');
      const updatedMetric = await response.json();
      setMetrics(prev => prev.map(metric => metric.id === id ? updatedMetric : metric));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const deleteMetric = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/metrics/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete metric');
      setMetrics(prev => prev.filter(metric => metric.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return { metrics, isLoading, error, addMetric, updateMetric, deleteMetric };
}; 