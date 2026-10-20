import type { Express } from 'express';
import { loadAverageReport } from './averageReport';
import { renderPdf } from './pdf';
import { buildAverageReportHTML } from './reportTemplate';

const asText = (value: unknown) => (typeof value === 'string' ? value : undefined);

// GET /api/average-report/pdf?latest=10
// GET /api/average-report/pdf?from=2026-10-17T06:00:00.000Z&to=2026-10-17T06:30:00.000Z
// (`render` can be swapped for a fake in tests)
export function addAverageReportRoute(app: Express, render = renderPdf) {
  app.get('/api/average-report/pdf', async (req, res) => {
    try {
      const result = await loadAverageReport({
        latest: asText(req.query.latest),
        from: asText(req.query.from),
        to: asText(req.query.to),
      });
      if (!result.ok) return res.status(result.status).json({ error: result.error });

      const pdf = await render(buildAverageReportHTML(result.report));
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="FMSS Average Soil Report.pdf"');
      res.send(pdf);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate the report' });
    }
  });
}