import {
  classify,
  classifyAll,
  describeRanges,
  STANDARDS,
  verdictOf,
  type MetricKey,
} from "./standards";

console.log("--- Ranges as the website will show them ---");
for (const key of Object.keys(STANDARDS) as MetricKey[]) {
  const { label, unit } = STANDARDS[key];
  const r = describeRanges(key);
  console.log(`${label}${unit ? ` (${unit})` : ""}`);
  console.log(`  Good:     ${r.good.join("   |   ")}`);
  console.log(`  Moderate: ${r.moderate.join("   |   ")}`);
  console.log(`  Bad:      ${r.bad.join("   |   ")}`);
}

console.log("\n--- Boundary checks ---");
const checks: [MetricKey, number][] = [
  ["ph", 5.0],
  ["ph", 5.04],
  ["ph", 5.95],
  ["ph", 6.0],
  ["ph", 7.0],
  ["ph", 7.01],
  ["ph", 7.8],
  ["ph", 7.81],
  ["moisture", 10.9],
  ["moisture", 11],
  ["moisture", 15.5],
  ["moisture", 16],
  ["moisture", 25],
  ["moisture", 25.5],
  ["moisture", 35],
  ["moisture", 35.1],
  ["temperature", 19.9],
  ["temperature", 23.5],
  ["temperature", 24],
  ["temperature", 32],
  ["temperature", 32.5],
  ["temperature", 36],
  ["temperature", 36.1],
  ["nitrogen", 20],
  ["nitrogen", 40],
  ["nitrogen", 41],
  ["conductivity", 999],
  ["conductivity", 1000],
  ["conductivity", 2000],
  ["conductivity", 2001],
];
for (const [key, value] of checks) {
  const r = classify(key, value);
  console.log(
    `${key.padEnd(12)} ${String(value).padStart(6)}  ->  ${r.condition.padEnd(8)} ${String(r.direction).padEnd(5)} ${r.label}`,
  );
}

console.log("\n--- Verdicts ---");
const allGood = {
  moisture: 20,
  ph: 6.5,
  nitrogen: 50,
  phosphorus: 20,
  potassium: 150,
  temperature: 28,
  conductivity: 500,
};
const someModerate = { ...allGood, ph: 5.5, nitrogen: 30 };
const oneBad = { ...allGood, potassium: 30 };
console.log("all good      ->", verdictOf(classifyAll(allGood)));
console.log("2 moderate    ->", verdictOf(classifyAll(someModerate)));
console.log("1 bad         ->", verdictOf(classifyAll(oneBad)));
