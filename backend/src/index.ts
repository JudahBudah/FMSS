import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prisma";
import { generateRecommendations } from "./recommendations";
import puppeteer from "puppeteer";
import { buildReportHTML } from "./reportTemplate";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// routes

let isPaused = false;

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
app.get('/api/history', async (req, res) => {
  try {
    const requested = parseInt(String(req.query.limit), 10);
    const limit = Number.isNaN(requested) ? 20 : Math.min(Math.max(requested, 1), 50);

    const readings = await prisma.reading.findMany({
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    res.json(readings.reverse());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch reading history' });
  }
});

app.get("/api/report/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid reading ID" });
    }

    const reading = await prisma.reading.findUnique({
      where: { id },
    });

    if (!reading) {
      return res.status(404).json({ error: "Reading not found" });
    }

    const recommendations = generateRecommendations({
      moisture: Number(reading.moisture),
      ph: Number(reading.ph),
      nitrogen: reading.nitrogen,
      phosphorus: reading.phosphorus,
      potassium: reading.potassium,
    });

    // TODO: render this into a PDF with Puppeteer
    res.json({ reading, recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

app.get("/api/report/:id/pdf", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid reading ID" });
    }

    const reading = await prisma.reading.findUnique({ where: { id } });

    if (!reading) {
      return res.status(404).json({ error: "Reading not found" });
    }

    const recommendations = generateRecommendations({
      moisture: Number(reading.moisture),
      ph: Number(reading.ph),
      nitrogen: reading.nitrogen,
      phosphorus: reading.phosphorus,
      potassium: reading.potassium,
    });

    const html = buildReportHTML(
      {
        timestamp: reading.timestamp,
        moisture: Number(reading.moisture),
        ph: Number(reading.ph),
        nitrogen: reading.nitrogen,
        phosphorus: reading.phosphorus,
        potassium: reading.potassium,
      },
      recommendations,
    );

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=soil-report-${id}.pdf`,
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
