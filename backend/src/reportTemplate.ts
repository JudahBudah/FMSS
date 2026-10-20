import { adviceFor } from './advice';
import type { AverageReport } from './averageReport';
import {
  METRIC_ORDER,
  SOURCE_NOTE,
  STANDARDS,
  type Condition,
  type MetricKey,
  type Result,
  type Values,
} from './standards';

const SEVERITY: Record<Condition, number> = { bad: 0, moderate: 1, good: 2 };

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// "Oct 17, 2026, 2:30:05 PM"
function formatTime(date: Date): string {
  return new Date(date).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'medium' });
}

// 23.6 -> "23.6%", 6.36 -> "6.36", 41 -> "41 mg/kg"
function formatValue(key: MetricKey, value: number): string {
  const { unit } = STANDARDS[key];
  const number = String(Number(value.toFixed(2)));
  if (!unit) return number;
  return unit === '%' || unit === '°C' ? `${number}${unit}` : `${number} ${unit}`;
}

export const REPORT_CSS = `
  body { font-family: Arial, sans-serif; color: #1a1a1a; margin: 0; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  .subtitle { font-size: 14px; font-weight: bold; color: #4a7c2f; margin: 2px 0 6px; }
  .meta { color: #666; font-size: 12px; margin: 2px 0; }
  hr { border: none; border-top: 2px solid #4a7c2f; margin: 16px 0; }
  h2 { font-size: 16px; margin-bottom: 12px; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  thead { display: table-header-group; }
  tr { break-inside: avoid; }
  th { text-align: left; font-size: 12px; color: #666; border-bottom: 1px solid #ccc; padding: 6px 8px; }
  td { padding: 7px 8px; border-bottom: 1px solid #eee; }
  .readings th, .readings td { font-size: 11px; padding: 4px 5px; }
  .tag { font-size: 12px; font-weight: bold; }
  .tag.good { color: #2d5a16; }
  .tag.moderate { color: #8a5a00; }
  .tag.bad { color: #9b1c12; }
  .metric { break-inside: avoid; margin-bottom: 14px; }
  h3 { font-size: 14px; margin: 16px 0 6px; }
  ul { margin: 0; padding-left: 20px; }
  li { font-size: 13px; line-height: 1.45; margin-bottom: 6px; break-inside: avoid; }
  p { font-size: 13px; margin: 6px 0; }
  .note { font-size: 11px; color: #777; }
  .optimal { margin-top: 16px; color: #2d5a16; }
  .footer-note { margin-top: 30px; font-size: 11px; color: #888; border-top: 1px solid #ccc; padding-top: 10px; }
  .footer-note p { font-size: 11px; margin: 3px 0; }
`;

function page(title: string, body: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${escapeHtml(title)}</title>
        <style>${REPORT_CSS}</style>
      </head>
      <body>${body}</body>
    </html>
  `;
}

function ratingTag(result: Result): string {
  return `<span class="tag ${result.condition}">${escapeHtml(result.label)}</span>`;
}

// The advice for every value that is not Optimal, worst first, then a line naming the optimal ones
function recommendationsHTML(results: Record<MetricKey, Result>): string {
  const needsAction = METRIC_ORDER.filter((key) => results[key].condition !== 'good').sort(
    (a, b) => SEVERITY[results[a].condition] - SEVERITY[results[b].condition],
  );
  const optimal = METRIC_ORDER.filter((key) => results[key].condition === 'good');

  if (needsAction.length === 0) {
    return '<p>All values are in optimal condition. No action is needed.</p>';
  }

  const sections = needsAction
    .map((key) => {
      const items = adviceFor(key, results[key])
        .map((rec) => `<li>${escapeHtml(rec.text)}</li>`)
        .join('');
      return `
        <div class="metric">
          <h3>${STANDARDS[key].label}: ${ratingTag(results[key])}</h3>
          <ul>${items}</ul>
        </div>`;
    })
    .join('');

  const optimalLine =
    optimal.length > 0
      ? `<p class="optimal">In optimal condition, no action needed: ${optimal
          .map((key) => STANDARDS[key].label)
          .join(', ')}.</p>`
      : '';

  return sections + optimalLine;
}

function footerHTML(): string {
  return `
    <div class="footer-note">
      <p>${escapeHtml(SOURCE_NOTE)}</p>
    </div>`;
}

// One reading
export function buildReportHTML(
  timestamp: Date,
  values: Values,
  results: Record<MetricKey, Result>,
): string {
  const dataRows = METRIC_ORDER.map(
    (key) => `
      <tr>
        <td>${STANDARDS[key].label}</td>
        <td>${formatValue(key, values[key])}</td>
        <td>${ratingTag(results[key])}</td>
      </tr>`,
  ).join('');

  return page(
    'FMSS Soil Report',
    `
      <h1>SOIL HEALTH REPORT</h1>
      <p class="subtitle">Single reading</p>
      <p class="meta">Sensor reading taken on: ${formatTime(timestamp)}</p>
      <p class="meta">Generated on: ${formatTime(new Date())}</p>
      <hr />

      <h2>SOIL ANALYSIS DATA:</h2>
      <table>
        <thead><tr><th>Measurement</th><th>Reading</th><th>Condition</th></tr></thead>
        <tbody>${dataRows}</tbody>
      </table>

      <hr />
      <h2>RECOMMENDATIONS:</h2>
      ${recommendationsHTML(results)}
      ${footerHTML()}
    `,
  );
}

// Average of several reading
const READING_HEADERS: Record<MetricKey, string> = {
  moisture: 'Moisture (%)',
  ph: 'pH',
  nitrogen: 'N',
  phosphorus: 'P',
  potassium: 'K',
  temperature: 'Temp (°C)',
  conductivity: 'EC (µS/cm)',
};

export function buildAverageReportHTML(report: AverageReport): string {
  const { count, from, to, averages, lowest, highest, results, readings } = report;
  const noun = count === 1 ? 'reading' : 'readings';

  const readingsSection = readings
    ? `
      <h2>READINGS USED:</h2>
      <table class="readings">
        <thead>
          <tr><th>Time</th>${METRIC_ORDER.map((k) => `<th>${READING_HEADERS[k]}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${readings
            .map(
              (r) => `
            <tr>
              <td>${formatTime(r.timestamp)}</td>
              ${METRIC_ORDER.map((k) => `<td>${Number(r.values[k].toFixed(2))}</td>`).join('')}
            </tr>`,
            )
            .join('')}
        </tbody>
      </table>
      <p class="note">N, P and K are in mg/kg.</p>`
    : `
      <h2>READINGS USED:</h2>
      <p>${count.toLocaleString('en-US')} readings were taken in this period, which is too many to list here.
      The table below shows their average, lowest, and highest values.</p>`;

  const averageRows = METRIC_ORDER.map(
    (key) => `
      <tr>
        <td>${STANDARDS[key].label}</td>
        <td>${formatValue(key, averages[key])}</td>
        <td>${formatValue(key, lowest[key])}</td>
        <td>${formatValue(key, highest[key])}</td>
        <td>${ratingTag(results[key])}</td>
      </tr>`,
  ).join('');

  return page(
    'FMSS Average Soil Report',
    `
      <h1>SOIL HEALTH REPORT</h1>
      <p class="subtitle">Average of ${count.toLocaleString('en-US')} ${noun}</p>
      <p class="meta">${count === 1 ? 'Reading taken on' : 'Period'}: ${
        count === 1 ? formatTime(from) : `${formatTime(from)} to ${formatTime(to)}`
      }</p>
      <p class="meta">Generated on: ${formatTime(new Date())}</p>
      <hr />

      ${readingsSection}

      <hr />
      <h2>AVERAGE SOIL ANALYSIS:</h2>
      <table>
        <thead>
          <tr><th>Measurement</th><th>Average</th><th>Lowest</th><th>Highest</th><th>Condition</th></tr>
        </thead>
        <tbody>${averageRows}</tbody>
      </table>

      <hr />
      <h2>RECOMMENDATIONS:</h2>
      <p class="note">Based on the average values.</p>
      ${recommendationsHTML(results)}
      ${footerHTML()}
    `,
  );
}