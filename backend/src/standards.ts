// The research behind the dashboard's conditions: one table of ranges per value.
// Everything that needs a range (classification, the "?" modal, the PDF) reads from here.

export type MetricKey =
  | "moisture"
  | "ph"
  | "nitrogen"
  | "phosphorus"
  | "potassium"
  | "temperature"
  | "conductivity";

export type Condition = "good" | "moderate" | "bad";

// Which side of the good range a reading is on: 'low' (below it), 'high' (above it),
// or null when it is good. Some advice depends on this (acidic soil needs lime, alkaline needs sulfur).
export type Direction = "low" | "high" | null;

export type Verdict = "perfectPositive" | "conditionalPositive" | "negative";

// A band covers the values from where the previous band stopped up to `upTo`.
// Bands run from lowest to highest, and the last one has upTo: Infinity.
// inclusive: true  -> `upTo` itself belongs to this band
// inclusive: false -> `upTo` itself belongs to the next band
interface Band {
  upTo: number;
  inclusive?: boolean;
  condition: Condition;
  direction: Direction;
  label: string; // shown on the dashboard and in the PDF
}

interface Standard {
  label: string; // "Moisture"
  unit: string; // "%"
  decimals?: number; // how many decimals to print in range text (pH uses 1)
  bands: Band[];
}

export const STANDARDS: Record<MetricKey, Standard> = {
  nitrogen: {
    label: "Nitrogen",
    unit: "mg/kg",
    bands: [
      { upTo: 20, condition: "bad", direction: "low", label: "Deficient" },
      {
        upTo: 40,
        inclusive: true,
        condition: "moderate",
        direction: "low",
        label: "Low",
      },
      { upTo: Infinity, condition: "good", direction: null, label: "Optimal" },
    ],
  },
  phosphorus: {
    label: "Phosphorus",
    unit: "mg/kg",
    bands: [
      { upTo: 6, condition: "bad", direction: "low", label: "Deficient" },
      {
        upTo: 15,
        inclusive: true,
        condition: "moderate",
        direction: "low",
        label: "Low",
      },
      { upTo: Infinity, condition: "good", direction: null, label: "Optimal" },
    ],
  },
  potassium: {
    label: "Potassium",
    unit: "mg/kg",
    bands: [
      { upTo: 50, condition: "bad", direction: "low", label: "Deficient" },
      {
        upTo: 100,
        inclusive: true,
        condition: "moderate",
        direction: "low",
        label: "Low",
      },
      { upTo: Infinity, condition: "good", direction: null, label: "Optimal" },
    ],
  },
  ph: {
    label: "pH",
    unit: "",
    decimals: 1,
    bands: [
      {
        upTo: 5.0,
        inclusive: true,
        condition: "bad",
        direction: "low",
        label: "Strongly acidic",
      },
      {
        upTo: 6.0,
        condition: "moderate",
        direction: "low",
        label: "Slightly acidic",
      },
      {
        upTo: 7.0,
        inclusive: true,
        condition: "good",
        direction: null,
        label: "Optimal",
      },
      {
        upTo: 7.8,
        inclusive: true,
        condition: "moderate",
        direction: "high",
        label: "Slightly alkaline",
      },
      {
        upTo: Infinity,
        condition: "bad",
        direction: "high",
        label: "Strongly alkaline",
      },
    ],
  },
  moisture: {
    label: "Moisture",
    unit: "%",
    bands: [
      { upTo: 11, condition: "bad", direction: "low", label: "Drought" },
      {
        upTo: 16,
        condition: "moderate",
        direction: "low",
        label: "Slightly dry",
      },
      {
        upTo: 25,
        inclusive: true,
        condition: "good",
        direction: null,
        label: "Optimal",
      },
      {
        upTo: 35,
        inclusive: true,
        condition: "moderate",
        direction: "high",
        label: "Too moist",
      },
      {
        upTo: Infinity,
        condition: "bad",
        direction: "high",
        label: "Waterlogged",
      },
    ],
  },
  temperature: {
    label: "Temperature",
    unit: "°C",
    bands: [
      { upTo: 20, condition: "bad", direction: "low", label: "Cold stress" },
      { upTo: 24, condition: "moderate", direction: "low", label: "Cool" },
      {
        upTo: 32,
        inclusive: true,
        condition: "good",
        direction: null,
        label: "Optimal",
      },
      {
        upTo: 36,
        inclusive: true,
        condition: "moderate",
        direction: "high",
        label: "Warm",
      },
      {
        upTo: Infinity,
        condition: "bad",
        direction: "high",
        label: "Heat stress",
      },
    ],
  },
  conductivity: {
    label: "Conductivity",
    unit: "µS/cm",
    bands: [
      { upTo: 1000, condition: "good", direction: null, label: "Optimal" },
      {
        upTo: 2000,
        inclusive: true,
        condition: "moderate",
        direction: "high",
        label: "Slightly saline",
      },
      { upTo: Infinity, condition: "bad", direction: "high", label: "Saline" },
    ],
  },
};

export type Values = Record<MetricKey, number>;
export interface Result {
  condition: Condition;
  direction: Direction;
  label: string;
}

// Which band does this value fall in?
export function classify(key: MetricKey, value: number): Result {
  if (Number.isNaN(value))
    throw new Error(`Cannot classify ${key}: value is not a number`);
  const { bands } = STANDARDS[key];
  const band =
    bands.find((b) => (b.inclusive ? value <= b.upTo : value < b.upTo)) ??
    bands[bands.length - 1];
  return {
    condition: band.condition,
    direction: band.direction,
    label: band.label,
  };
}

export function classifyAll(values: Values): Record<MetricKey, Result> {
  const keys = Object.keys(STANDARDS) as MetricKey[];
  return Object.fromEntries(
    keys.map((k) => [k, classify(k, values[k])]),
  ) as Record<MetricKey, Result>;
}

// Any Bad -> negative. Otherwise any Moderate -> conditionalPositive. Otherwise perfectPositive.
export function verdictOf(results: Record<MetricKey, Result>): Verdict {
  const conditions = Object.values(results).map((r) => r.condition);
  if (conditions.includes("bad")) return "negative";
  if (conditions.includes("moderate")) return "conditionalPositive";
  return "perfectPositive";
}

function bandText(
  prev: Band | undefined,
  band: Band,
  decimals: number,
): string {
  const n = (x: number) => x.toFixed(decimals);
  if (!prev)
    return band.inclusive
      ? `${n(band.upTo)} or below`
      : `below ${n(band.upTo)}`;
  const lo = n(prev.upTo);
  if (band.upTo === Infinity)
    return prev.inclusive ? `above ${lo}` : `${lo} or above`;
  const hi = n(band.upTo);
  if (!prev.inclusive)
    return band.inclusive ? `${lo} to ${hi}` : `${lo} to below ${hi}`;
  return band.inclusive
    ? `above ${lo} up to ${hi}`
    : `above ${lo} and below ${hi}`;
}

export interface BandInfo {
  condition: Condition;
  direction: Direction;
  label: string;
  range: string; // "above 5.0 and below 6.0"
}

// Every band of a value, lowest to highest, with its range written out for the website.
// The text is generated from the same bands that classify() uses, so what the modal says
// can never differ from what the code does.
export function describeBands(key: MetricKey): BandInfo[] {
  const { bands, decimals = 0 } = STANDARDS[key];
  return bands.map((band, i) => ({
    condition: band.condition,
    direction: band.direction,
    label: band.label,
    range: bandText(bands[i - 1], band, decimals),
  }));
}

// The same ranges grouped by condition. A condition can have two ranges (pH is Moderate on
// both the acidic and the alkaline side), so each one is a list; show one range per line.
export function describeRanges(key: MetricKey): Record<Condition, string[]> {
  const ranges: Record<Condition, string[]> = {
    good: [],
    moderate: [],
    bad: [],
  };
  for (const band of describeBands(key))
    ranges[band.condition].push(band.range);
  return ranges;
}

const KEYS = Object.keys(STANDARDS) as MetricKey[];

// Rounded to 2 decimals, the most the dashboard ever shows
export const round2 = (x: number) => Math.round(x * 100) / 100;

// A database row as plain numbers (Prisma sends some columns as Decimal objects).
export function valuesOf(row: Record<MetricKey, unknown>): Values {
  return Object.fromEntries(KEYS.map((k) => [k, Number(row[k])])) as Values;
}

// Average each value over the given readings (rounded to 2 decimals, the most the dashboard
// ever shows), then classify the averages, so a number and its label always agree.
export function summarize(rows: Record<MetricKey, unknown>[]) {
  if (rows.length === 0)
    return { count: 0, averages: null, conditions: null, verdict: null };

  const averages = Object.fromEntries(
    KEYS.map((k) => {
      const mean =
        rows.reduce((sum, row) => sum + Number(row[k]), 0) / rows.length;
      return [k, round2(mean)];
    }),
  ) as Values;

  const conditions = classifyAll(averages);
  return {
    count: rows.length,
    averages,
    conditions,
    verdict: verdictOf(conditions),
  };
}

// The order the values appear in on the dashboard cards, the PDF, and the modal tabs.
export const METRIC_ORDER: MetricKey[] = [
  "moisture",
  "ph",
  "nitrogen",
  "phosphorus",
  "potassium",
  "temperature",
  "conductivity",
];

export interface Source {
  name: string;
  url?: string; // No link for now
}

// Where the ranges and advice come from 
// Sources
export const SOURCES: Source[] = [
  { name: "Bureau of Soils and Water Management (DA-BSWM) Official Portal" },
  { name: "DA-BSWM National Soil Health Program & FertMap Database" },
  { name: "DA-BSWM Laboratory Services Division Soil Analysis Standards" },
  { name: "DA-BSWM Automated Fertilizer Recommendation System" },
  { name: "DA Soil Health Assessment and Water Quality Manual" },
];

// PDF bottom
export const SOURCE_NOTE =
  "Ranges follow the DA-BSWM soil health guidelines.";
