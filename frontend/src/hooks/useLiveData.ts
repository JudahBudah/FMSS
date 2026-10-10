import { useEffect, useState } from 'react';
import { API_URL, parseReading } from '../api';
import type { Reading } from '../api';

// loading = first fetch pending, ok = have data, empty = server is up but no readings yet,
// offline = server unreachable (last known data stays on screen)
export type LoadStatus = 'loading' | 'ok' | 'empty' | 'offline';

const POLL_MS = 3000;

export function useLiveData(chartLimit = 10) {
  const [reading, setReading] = useState<Reading | null>(null);
  const [history, setHistory] = useState<Reading[]>([]);
  const [paused, setPaused] = useState(false);
  const [status, setStatus] = useState<LoadStatus>('loading');

  useEffect(() => {
    async function fetchData() {
      try {
        const [latestRes, historyRes, statusRes] = await Promise.all([
          fetch(`${API_URL}/api/latest`),
          fetch(`${API_URL}/api/history?limit=${chartLimit}`),
          fetch(`${API_URL}/api/status`),
        ]);

        // /api/latest answers 404 when the database has no readings yet. That's not an outage.
        const noReadings = latestRes.status === 404;
        if (!historyRes.ok || !statusRes.ok || (!latestRes.ok && !noReadings)) {
          throw new Error('Failed to fetch');
        }

        const statusData = await statusRes.json();
        const historyData = await historyRes.json();
        setPaused(statusData.paused);
        setHistory(historyData.map(parseReading));

        if (noReadings) {
          setReading(null);
          setStatus('empty');
        } else {
          setReading(parseReading(await latestRes.json()));
          setStatus('ok');
        }
      } catch {
        setStatus('offline'); // reading and history are left alone, so the last data stays visible
      }
    }

    fetchData();
    const interval = setInterval(fetchData, POLL_MS);
    return () => clearInterval(interval);
  }, [chartLimit]);

  async function togglePause() {
    try {
      const res = await fetch(`${API_URL}/api/${paused ? 'resume' : 'pause'}`, { method: 'POST' });
      const data = await res.json();
      setPaused(data.paused);
    } catch {
      setStatus('offline');
    }
  }

  return { reading, history, paused, status, togglePause };
}