#!/usr/bin/env node
/**
 * Renders the four documents to A4 PDFs in public/docs.
 * Requires the production server to be running on PORT (default 3111).
 *
 *   npm run build && npx next start -p 3111 &
 *   node scripts/make-pdfs.mjs
 */
import { getChromium } from "./browser.mjs";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const PORT = process.env.PORT || 3111;
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = resolve(process.cwd(), "public/docs");

const DOCS = [
  ["eng-resume", "Mohi-Uddin-Resume-Engineering"],
  ["eng-cv", "Mohi-Uddin-CV-Engineering"],
  ["res-resume", "Mohi-Uddin-Resume-Research"],
  ["res-cv", "Mohi-Uddin-CV-Research"],
];

mkdirSync(OUT, { recursive: true });

const chromium = await getChromium();
const browser = await chromium.launch();
const page = await browser.newPage();

for (const [id, file] of DOCS) {
  const url = `${BASE}/print/${id}`;
  await page.goto(url, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => document.fonts.ready);
  const out = `${OUT}/${file}.pdf`;
  await page.pdf({
    path: out,
    format: "A4",
    printBackground: true,
    margin: { top: "12mm", right: "12mm", bottom: "12mm", left: "12mm" },
  });
  console.log("wrote", out);
}

await browser.close();
