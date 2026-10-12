import prisma from './prisma';

function randomInRange(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

async function isPaused(): Promise<boolean> {
  try {
    const res = await fetch('http://localhost:3001/api/status');
    const data = await res.json();
    return data.paused;
  } catch (err) {
    console.error('Could not reach server to check status:', err);
    return true; // if can't reach the server — treat as paused
  }
}

async function generateReading() {
  const paused = await isPaused();

  if (paused) {
    console.log('Paused — skipping this cycle');
    return;
  }

  const reading = await prisma.reading.create({
    data: {
      moisture: randomInRange(10, 40),
      ph: randomInRange(4.5, 8.0),
      nitrogen: Math.floor(randomInRange(0, 50)),
      phosphorus: Math.floor(randomInRange(0, 50)),
      potassium: Math.floor(randomInRange(0, 50)),
      temperature: randomInRange(18, 32),
      conductivity: randomInRange(50, 500),
      source: 'MOCK',
    },
  });

  console.log('Inserted mock reading:', reading);
}

generateReading();
setInterval(generateReading, 3000);