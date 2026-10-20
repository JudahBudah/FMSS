// Fake sensor readings for demos. Each scenario holds steady values (plus a little noise) so
// the mascot's verdict stays put long enough to show. The numbers are picked from the ranges
// in standards.ts.
import type { Values } from './standards';

export const SCENARIO_NAMES = ['perfect', 'conditional', 'negative'] as const;
export type ScenarioName = (typeof SCENARIO_NAMES)[number];

const CENTERS: Record<ScenarioName, Values> = {
  // Everything Optimal -> Perfect Positive
  perfect: { moisture: 20, ph: 6.5, nitrogen: 55, phosphorus: 22, potassium: 130, temperature: 28, conductivity: 600 },
  // Moisture, pH and nitrogen Moderate, the rest Optimal -> Conditional Positive
  conditional: { moisture: 28, ph: 5.6, nitrogen: 30, phosphorus: 22, potassium: 130, temperature: 28, conductivity: 600 },
  // Moisture, potassium, temperature and conductivity Bad -> Negative
  negative: { moisture: 8, ph: 6.5, nitrogen: 55, phosphorus: 10, potassium: 30, temperature: 38, conductivity: 2500 },
};

// How far a single reading can wander from its scenario's value
const SPREAD: Values = {
  moisture: 1.5,
  ph: 0.15,
  nitrogen: 4,
  phosphorus: 2,
  potassium: 8,
  temperature: 0.8,
  conductivity: 40,
};

function wobble(center: number, spread: number): number {
  return center + (Math.random() * 2 - 1) * spread;
}

const round2 = (x: number) => Math.round(x * 100) / 100;
const whole = (x: number) => Math.max(0, Math.round(x));

export function makeReading(scenario: ScenarioName) {
  const c = CENTERS[scenario];
  return {
    moisture: round2(wobble(c.moisture, SPREAD.moisture)),
    ph: round2(wobble(c.ph, SPREAD.ph)),
    nitrogen: whole(wobble(c.nitrogen, SPREAD.nitrogen)),
    phosphorus: whole(wobble(c.phosphorus, SPREAD.phosphorus)),
    potassium: whole(wobble(c.potassium, SPREAD.potassium)),
    temperature: round2(wobble(c.temperature, SPREAD.temperature)),
    conductivity: round2(wobble(c.conductivity, SPREAD.conductivity)),
  };
}