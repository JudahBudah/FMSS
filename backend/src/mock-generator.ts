import prisma from './prisma';
import { SCENARIO_NAMES, makeReading, type ScenarioName } from './mockScenarios';

const INTERVAL_MS = 3000; // same cadence as the real sensor
const READINGS_PER_SCENARIO = 30; // in cycle mode, how long each scenario lasts (about 1.5 minutes)

// npm run mock              -> cycles through all the scenarios
// npm run mock -- perfect   -> holds one scenario (perfect, conditional, or negative)
const arg = process.argv[2];
if (arg !== undefined && !SCENARIO_NAMES.includes(arg as ScenarioName)) {
  console.error(`Unknown scenario "${arg}". Use one of: ${SCENARIO_NAMES.join(', ')} (or nothing, to cycle).`);
  process.exit(1);
}
const fixed = arg as ScenarioName | undefined;

let count = 0;

async function isPaused(): Promise<boolean> {
  try {
    const res = await fetch('http://localhost:3001/api/status');
    const data = await res.json();
    return data.paused;
  } catch (err) {
    console.error('Could not reach server to check status:', err);
    return true; // if we can't confirm, don't write blindly
  }
}

async function generateReading() {
  if (await isPaused()) {
    console.log('Paused, skipping this cycle');
    return;
  }

  const scenario = fixed ?? SCENARIO_NAMES[Math.floor(count / READINGS_PER_SCENARIO) % SCENARIO_NAMES.length];
  count++;

  const reading = await prisma.reading.create({
    data: { ...makeReading(scenario), source: 'MOCK' },
  });

  console.log(`[${scenario}] inserted mock reading #${reading.id}`);
}

generateReading();
setInterval(generateReading, INTERVAL_MS);