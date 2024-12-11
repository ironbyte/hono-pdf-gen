import puppeteer, { type LaunchOptions, type PDFOptions } from "puppeteer";

// https://pptr.dev/guides/configuration

const pdfOptions: PDFOptions = {
  format: "A4",
  printBackground: true,
};

const launchOptions: LaunchOptions = {
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
};

export async function generatePdf(html: string): Promise<Uint8Array> {
  const browser = await puppeteer.launch(launchOptions);

  const page = await browser.newPage();

  // Set content with better wait options
  await page.setContent(html, {
    waitUntil: ["networkidle0", "domcontentloaded", "load"],
    timeout: 15000, // 15 seconds timeout
  });

  const pdf = await page.pdf(pdfOptions);
  await browser.close();

  return pdf;
}
