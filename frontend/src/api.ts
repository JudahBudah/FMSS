export const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface Reading {
  id: number;
  timestamp: string;
  moisture: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  conductivity: number;
  source: string;
}

// Prisma Decimal columns arrive as strings.
interface RawReading {
  id: number;
  timestamp: string;
  moisture: string | number;
  ph: string | number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: string | number;
  conductivity: string | number;
  source: string;
}

export function parseReading(raw: RawReading): Reading {
  return {
    ...raw,
    moisture: Number(raw.moisture),
    ph: Number(raw.ph),
    temperature: Number(raw.temperature),
    conductivity: Number(raw.conductivity),
  };
}

export interface Recommendations {
  moisture: { status: string; action: string };
  ph: { evaluation: string; action: string };
  npk: { analysis: string; action: string };
}

export interface ReportData {
  reading: Reading;
  recommendations: Recommendations;
}