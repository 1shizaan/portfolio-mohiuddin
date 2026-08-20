#!/usr/bin/env node
/** Screenshots every route at three widths into .shots/ so layout can be checked. */
import { getChromium } from "./browser.mjs";
import { mkdirSync } from "node:fs";

const PORT = process.env.PORT || 3111;
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = process.env.SHOTS_DIR || ".shots";
mkdirSync(OUT, { recursive: true });

const ROUTES = process.env.ROUTES
  ? process.env.ROUTES.split(",")
  : ["/", "/work", "/work/matchledger", "/work/beyondvision", "/work/inkline", "/thinking", "/resume", "/about"];
const SIZES = [
  ["desk", 1440, 1000],
  ["tab", 834, 1100],
  ["phone", 390, 860],
];

const chromium = await getChromium();
const browser = await chromium.launch();
for (const [tag, w, h] of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const r of ROUTES) {
    await page.goto(BASE + r, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => {
      await new Promise((res) => {
        let y = 0;
        const step = () => {
          window.scrollTo(0, y);
          y += window.innerHeight;
          if (y < document.body.scrollHeight) requestAnimationFrame(step);
          else { window.scrollTo(0, 0); setTimeout(res, 260); }
        };
        step();
      });
    });
    const name = r === "/" ? "home" : r.replace(/^\//, "").replace(/\//g, "-");
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    await page.screenshot({ path: `${OUT}/${name}-${tag}.png`, fullPage: true });
    console.log(`${name}-${tag}  overflow=${overflow}px`);
  }
  await ctx.close();
}
await browser.close();
