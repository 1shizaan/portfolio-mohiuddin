/**
 * Resolve a Playwright chromium launcher.
 *
 * Tries the local install first. If Playwright is not a dependency here, falls
 * back to any path listed in PLAYWRIGHT_PATH. Install it with:
 *
 *   npm i -D playwright && npx playwright install chromium
 */
export async function getChromium() {
  const candidates = ["playwright", process.env.PLAYWRIGHT_PATH].filter(Boolean);
  for (const c of candidates) {
    try {
      const mod = await import(c);
      if (mod.chromium) return mod.chromium;
    } catch {
      // try the next one
    }
  }
  throw new Error(
    "Playwright not found. Run: npm i -D playwright && npx playwright install chromium"
  );
}
