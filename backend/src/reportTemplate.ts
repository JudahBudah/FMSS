interface Reading {
  timestamp: Date;
  moisture: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

interface Recommendations {
  moisture: { status: string; action: string };
  ph: { evaluation: string; action: string };
  npk: { analysis: string; action: string };
}

export function buildReportHTML(reading: Reading, recommendations: Recommendations): string {
  const generatedOn = new Date().toLocaleString();

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #1a1a1a;
            padding: 40px;
          }
          h1 {
            font-size: 22px;
            margin-bottom: 4px;
          }
          .meta {
            color: #666;
            font-size: 12px;
            margin-bottom: 16px;
          }
          hr {
            border: none;
            border-top: 2px solid #4a7c2f;
            margin: 16px 0;
          }
          h2 {
            font-size: 16px;
            margin-bottom: 12px;
          }
          .field {
            margin-bottom: 8px;
            font-size: 14px;
          }
          .field strong {
            display: inline-block;
            width: 160px;
          }
          h3 {
            font-size: 14px;
            margin-bottom: 4px;
            margin-top: 20px;
          }
          p {
            font-size: 13px;
            margin: 4px 0;
          }
          .footer-note {
            margin-top: 30px;
            font-size: 11px;
            color: #888;
            border-top: 1px solid #ccc;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <h1>SOIL HEALTH REPORT</h1>
        <p class="meta">Generated on: ${generatedOn}</p>
        <hr />

        <h2>SOIL ANALYSIS DATA:</h2>
        <div class="field"><strong>Soil Moisture:</strong> ${reading.moisture}%</div>
        <div class="field"><strong>Soil pH:</strong> ${reading.ph}</div>
        <div class="field"><strong>Nitrogen (N):</strong> ${reading.nitrogen} mg/kg</div>
        <div class="field"><strong>Phosphorus (P):</strong> ${reading.phosphorus} mg/kg</div>
        <div class="field"><strong>Potassium (K):</strong> ${reading.potassium} mg/kg</div>

        <hr />
        <h2>RECOMMENDATIONS:</h2>

        <h3>Moisture:</h3>
        <p>${recommendations.moisture.status}</p>
        <p><strong>Recommended Action:</strong> ${recommendations.moisture.action}</p>

        <h3>pH Level:</h3>
        <p>${recommendations.ph.evaluation}</p>
        <p><strong>Adjustment Method:</strong> ${recommendations.ph.action}</p>

        <h3>NPK Status:</h3>
        <p>${recommendations.npk.analysis}</p>
        <p><strong>Treatment Plan:</strong> ${recommendations.npk.action}</p>

        <div class="footer-note">
          Note: This recommendation is based on the sensor reading taken on ${new Date(reading.timestamp).toLocaleString()}.
        </div>
      </body>
    </html>
  `;
}