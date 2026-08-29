import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/latest', async (req, res) => {
  try {
    const latest = await prisma.reading.findFirst({
      orderBy: { timestamp: 'desc' },
    });

    if (!latest) {
      return res.status(404).json({ error: 'No readings found' });
    }

    res.json(latest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch latest reading' });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const readings = await prisma.reading.findMany({
      orderBy: { timestamp: 'asc' },
      take: 100, // cap for now 
    });

    res.json(readings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch reading history' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});