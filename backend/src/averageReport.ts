import prisma from './prisma';
import {
  METRIC_ORDER,
  classifyAll,
  round2,
  valuesOf,
  type MetricKey,
  type Result,
  type Values,
} from './standards';

// Most readings a report lists one by one. Above this it only shows the summary.
export const LIST_CAP = 30;

export interface ReadingRow {
  timestamp: Date;
  values: Values;
}

export interface AverageReport {
  count: number;
  from: Date; // time of the first reading
  to: Date; // time of the last reading
  averages: Values; // rounded to 2 decimals
  lowest: Values;
  highest: Values;
  results: Record<MetricKey, Result>; // the averages, rated
  readings: ReadingRow[] | null; // oldest first, or null when there are too many to list
}

export type Loaded =
  | { ok: true; report: AverageReport }
  | { ok: false; status: number; error: string };

interface Query {
  latest?: string; // "10" -> the 10 newest readings
  from?: string; // ISO date-time
  to?: string; // ISO date-time
}

const fail = (status: number, error: string): Loaded => ({ ok: false, status, error });

function eachMetric(fn: (key: MetricKey) => number): Values {
  return Object.fromEntries(METRIC_ORDER.map((key) => [key, fn(key)])) as Values;
}

// Which values the database should average, and the lowest and highest of
const FIELDS = {
  moisture: true,
  ph: true,
  nitrogen: true,
  phosphorus: true,
  potassium: true,
  temperature: true,
  conductivity: true,
} as const;

// Works from the readings themselves (used when there are few enough to list)
function fromRows(rows: (Record<MetricKey, unknown> & { timestamp: Date })[]): AverageReport {
  const readings = rows.map((row) => ({ timestamp: row.timestamp, values: valuesOf(row) }));
  const averages = eachMetric((k) =>
    round2(readings.reduce((sum, r) => sum + r.values[k], 0) / readings.length),
  );
  return {
    count: readings.length,
    from: readings[0].timestamp,
    to: readings[readings.length - 1].timestamp,
    averages,
    lowest: eachMetric((k) => Math.min(...readings.map((r) => r.values[k]))),
    highest: eachMetric((k) => Math.max(...readings.map((r) => r.values[k]))),
    results: classifyAll(averages),
    readings,
  };
}

// Finds the readings a report is about and works out the averages.
//   latest=10          the 10 newest readings
//   from=...&to=...    every reading in a time range (any size)
export async function loadAverageReport(query: Query): Promise<Loaded> {
  if (query.latest !== undefined) {
    const n = Number(query.latest);
    if (!Number.isInteger(n) || n < 1 || n > LIST_CAP) {
      return fail(400, `latest must be a whole number from 1 to ${LIST_CAP}.`);
    }
    const rows = await prisma.reading.findMany({ orderBy: { timestamp: 'desc' }, take: n });
    if (rows.length === 0) return fail(404, 'No readings found.');
    return { ok: true, report: fromRows(rows.reverse()) };
  }

  if (!query.from || !query.to) return fail(400, 'Send either latest, or both from and to.');
  const from = new Date(query.from);
  const to = new Date(query.to);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return fail(400, 'from and to must be valid dates.');
  }
  if (from >= to) return fail(400, 'The start must be before the end.');

  const where = { timestamp: { gte: from, lte: to } };
  const count = await prisma.reading.count({ where });
  if (count === 0) return fail(404, 'No readings in that time range.');

  if (count <= LIST_CAP) {
    const rows = await prisma.reading.findMany({ where, orderBy: { timestamp: 'asc' } });
    return { ok: true, report: fromRows(rows) };
  }

  // Too many to list: let the database do the maths instead of loading every row
  const agg = await prisma.reading.aggregate({
    where,
    _avg: FIELDS,
    _min: { ...FIELDS, timestamp: true },
    _max: { ...FIELDS, timestamp: true },
  });
  const averages = eachMetric((k) => round2(Number(agg._avg[k])));
  return {
    ok: true,
    report: {
      count,
      from: agg._min.timestamp ?? from,
      to: agg._max.timestamp ?? to,
      averages,
      lowest: valuesOf(agg._min),
      highest: valuesOf(agg._max),
      results: classifyAll(averages),
      readings: null,
    },
  };
}