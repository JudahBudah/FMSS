import prisma from './prisma';

// Generates a random number within a range, rounded to 2 decimals
function randomInRange(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

async function generateReading() {
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
setInterval(generateReading, 5000);