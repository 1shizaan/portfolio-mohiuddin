#!/usr/bin/env node
/**
 * Point the site and the four documents at a real, live URL.
 *
 *   node scripts/set-site-url.mjs mohiuddin-portfolio.vercel.app
 *
 * Writes the host into lib/site.ts (metadata, sitemap, robots) and lib/resume.ts
 * (the contact line and the CV footer), and flips `siteIsLive` so the documents
 * start printing a Portfolio link. Rebuild and regenerate the PDFs afterwards.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const raw = process.argv[2];
if (!raw) {
  console.error("usage: node scripts/set-site-url.mjs <host>   e.g. mohiuddin.dev");
  process.exit(1);
}
const host = raw.replace(/^https?:\/\//, "").replace(/\/+$/, "");
if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(host)) {
  console.error(`not a host: ${raw}`);
  process.exit(1);
}

function patch(file, pairs) {
  const p = resolve(process.cwd(), file);
  let s = readFileSync(p, "utf8");
  for (const [re, next] of pairs) {
    if (!re.test(s)) {
      console.error(`pattern not found in ${file}: ${re}`);
      process.exit(1);
    }
    s = s.replace(re, next);
  }
  writeFileSync(p, s);
  console.log("patched", file);
}

patch("lib/site.ts", [[/url: "https:\/\/[^"]+"/, `url: "https://${host}"`]]);
patch("lib/resume.ts", [
  [/site: "[^"]+"/, `site: "${host}"`],
  [/siteIsLive: (true|false)/, "siteIsLive: true"],
]);

console.log(`\nsite is now https://${host}`);
console.log("next: npm run build, start the server, then node scripts/make-pdfs.mjs");
