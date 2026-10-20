import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prisma";
import { adviceFor } from "./advice";
import { addAverageReportRoute } from './averageReportRoute';
import { renderPdf } from './pdf';
import { buildReportHTML } from "./reportTemplate";
import { buildStandardsPayload } from "./standardsPayload";
import {
  classifyAll,
  METRIC_ORDER,
  STANDARDS,
  summarize,
  valuesOf,
} from "./standards";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;



app.use(cors());
app.use(express.json());

addAverageReportRoute(app);

let isPaused = false;

// How many of the latest readings are averaged for the mascot's verdict
const CONDITIONS_WINDOW = 10;

// routes

app.get("/api/status", (req, res) => {
  res.json({ paused: isPaused });
});

app.post("/api/pause", (req, res) => {
  isPaused = true;
  res.json({ paused: isPaused });
});

app.post("/api/resume", (req, res) => {
  isPaused = false;
  res.json({ paused: isPaused });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// just checks if tere is a reading in the database
app.get("/api/latest", async (req, res) => {
  try {
    const latest = await prisma.reading.findFirst({
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.status(404).json({ error: "No readings found" });
    }

    res.json(latest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch latest reading" });
  }
});

// Returns the most recent readings, oldest to newest.
// Optional ?limit=N (default 20, clamped between 1 and 50)
app.get("/api/history", async (req, res) => {
  try {
    const requested = parseInt(String(req.query.limit), 10);
    const limit = Number.isNaN(requested)
      ? 20
      : Math.min(Math.max(requested, 1), 50);

    const readings = await prisma.reading.findMany({
      orderBy: { timestamp: "desc" },
      take: limit,
    });

    res.json(readings.reverse());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch reading history" });
  }
});

// Average of the latest readings, each value's condition, and the overall verdict
app.get("/api/conditions", async (req, res) => {
  try {
    const rows = await prisma.reading.findMany({
      orderBy: { timestamp: "desc" },
      take: CONDITIONS_WINDOW,
    });
    res.json(summarize(rows));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to calculate conditions" });
  }
});

// The ranges and labels for the "?" modal
app.get("/api/standards", (req, res) => {
  res.json(buildStandardsPayload());
});

// The report for one reading: every value with its rating and short advice (the Past Readings modal)
app.get("/api/report/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid reading ID" });
    }

    const reading = await prisma.reading.findUnique({ where: { id } });

    if (!reading) {
      return res.status(404).json({ error: "Reading not found" });
    }

    const values = valuesOf(reading);
    const results = classifyAll(values);

    const items = METRIC_ORDER.map((key) => ({
      key,
      label: STANDARDS[key].label,
      unit: STANDARDS[key].unit,
      value: values[key],
      condition: results[key].condition,
      status: results[key].label,
      advice: adviceFor(key, results[key]).map((rec) => rec.summary),
    }));

    res.json({ reading, items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

app.get('/api/report/:id/pdf', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid reading ID' });
    }

    const reading = await prisma.reading.findUnique({ where: { id } });

    if (!reading) {
      return res.status(404).json({ error: 'Reading not found' });
    }

    const values = valuesOf(reading);
    const pdf = await renderPdf(buildReportHTML(reading.timestamp, values, classifyAll(values)));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="FMSS Soil Report.pdf"');
    res.send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
