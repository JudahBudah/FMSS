import { useEffect, useState } from 'react';
import { API_URL, parseReading } from '../api';
import type { Reading } from '../api';

const INITIAL = 20;
const STEP = 10;
const MAX = 50;

export function useHistory() {
  const [limit, setLimit] = useState(INITIAL);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [status, setStatus] = useState<'loading' | 'ok' | 'offline'>('loading');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/history?limit=${limit}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (!cancelled) {
          // The API sends oldest to newest. This list is newest first.
          setReadings(data.map(parseReading).reverse());
          setStatus('ok');
        }
      } catch {
        if (!cancelled) setStatus('offline');
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  const canLoadMore = readings.length >= limit && limit < MAX;

  function loadMore() {
    setLimit((current) => Math.min(current + STEP, MAX));
  }

  return { readings, status, canLoadMore, loadMore };
}