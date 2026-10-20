import puppeteer from 'puppeteer';

// Turns an HTML page into a PDF. The browser is always closed again, even if something fails.
export async function renderPdf(html: string): Promise<Uint8Array> {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    return await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', bottom: '15mm', left: '14mm', right: '14mm' },
    });
  } finally {
    await browser.close();
  }
}