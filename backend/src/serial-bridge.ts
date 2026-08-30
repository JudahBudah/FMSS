import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import dotenv from 'dotenv';
import prisma from './prisma';

dotenv.config();

const SERIAL_PORT = process.env.SERIAL_PORT || '/dev/ttyACM0';
const BAUD_RATE = 9600; 

async function isPaused(): Promise<boolean> {
  try {
    const res = await fetch('http://localhost:3001/api/status');
    const data = await res.json();
    return data.paused;
  } catch (err) {
    console.error('Could not reach server to check status:', err);
    return true; // if can't confirm, don't write blindly
  }
}

const port = new SerialPort({ path: SERIAL_PORT, baudRate: BAUD_RATE });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

port.on('open', () => {
  console.log(`Serial port ${SERIAL_PORT} opened at ${BAUD_RATE} baud`);
});

port.on('error', (err) => {
  console.error('Serial port error:', err.message);
});

parser.on('data', async (line: string) => {
  const trimmed = line.trim();

  // Ignore startup message and error lines from the Arduino
  if (!trimmed || trimmed === 'Initializing 7-in-1 Soil Sensor...' || trimmed === 'ERROR') {
    if (trimmed === 'ERROR') console.log('Sensor reported an error — skipping this reading');
    return;
  }

  const parts = trimmed.split(',').map((p) => parseFloat(p));

  // Expecting exactly 7 numeric values: moisture,temperature,ec,ph,nitrogen,phosphorus,potassium
  if (parts.length !== 7 || parts.some((p) => isNaN(p))) {
    console.log('Ignoring unrecognized line:', trimmed);
    return;
  }

  const [moisture, temperature, ec, ph, nitrogen, phosphorus, potassium] = parts;

  const paused = await isPaused();
  if (paused) {
    console.log('Paused — skipping this reading');
    return;
  }

  try {
    const reading = await prisma.reading.create({
      data: {
        moisture,
        ph,
        nitrogen: Math.round(nitrogen),
        phosphorus: Math.round(phosphorus),
        potassium: Math.round(potassium),
        temperature,
        conductivity: ec,
        source: 'SENSOR',
      },
    });

    console.log('Inserted sensor reading:', reading);
  } catch (err) {
    console.error('Failed to save reading:', err);
  }
});