import type { StatKey } from "./statCards";

export const API_URL: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:3001";

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

export type Condition = "good" | "moderate" | "bad";

// One row of the report: a measured value, how it rates, and the short advice for it
export interface ReportItem {
  key: string;
  label: string;
  unit: string;
  value: number;
  condition: Condition;
  status: string; // "Optimal", "Low", ...
  advice: string[];
}

export interface ReportData {
  reading: Reading;
  items: ReportItem[];
}

export type Verdict = "perfectPositive" | "conditionalPositive" | "negative";

export interface ConditionResult {
  condition: Condition;
  direction: "low" | "high" | null;
  label: string; // "Optimal", "Slightly acidic", ...
}

// What /api/conditions sends: the average of the latest readings, how each value rates, and the verdict
export interface ConditionsData {
  count: number;
  averages: Record<StatKey, number> | null;
  conditions: Record<StatKey, ConditionResult> | null;
  verdict: Verdict | null;
}

export interface StandardBand {
  condition: Condition;
  direction: "low" | "high" | null;
  label: string; // "Optimal", "Slightly acidic", ...
  range: string; // "above 5.0 and below 6.0"
}

export interface StandardAdvice {
  for: "low" | "high" | "any"; // which side of the good range it applies to
  summary: string;
}

export interface StandardMetric {
  key: StatKey;
  label: string;
  unit: string;
  bands: StandardBand[];
  advice: { moderate: StandardAdvice[]; bad: StandardAdvice[] };
}

export interface StandardSource {
  name: string;
  url?: string;
}

// What /api/standards sends: the ranges and short advice for every value, plus the sources
export interface StandardsData {
  metrics: StandardMetric[];
  sources: StandardSource[];
  sourceNote: string;
}
