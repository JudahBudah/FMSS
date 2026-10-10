import { useState } from 'react';
import { API_URL, parseReading } from '../api';
import type { ReportData } from '../api';

export function useReport() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function openReport(id: number) {
    try {
      const res = await fetch(`${API_URL}/api/report/${id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setReport({ reading: parseReading(data.reading), recommendations: data.recommendations });
      setError(null);
    } catch {
      setError('Could not load the report.');
    }
  }

  function closeReport() {
    setReport(null);
  }

  return { report, error, openReport, closeReport };
}