"use client";

import { useCallback, useState } from "react";

/**
 * A JavaScript reimplementation of the three-pass matching engine, running on
 * synthetic data generated in your browser. Same passes and same blocking
 * strategy as the Python original. Different language, smaller scale, and the
 * timings below are this machine, not the benchmark box.
 */

type Row = {
  i: number;
  day: number;
  amt: number;
  ref: string;
  narr: string;
  truth: number; // index of the true partner, or -1
};

const PAYEES = [
  "ACME SUPPLY CO", "NORTHWIND TRADING", "BLUE RIVER LOGISTICS", "STELLAR OFFICE",
  "MERIDIAN FUEL", "CASCADE PRINTWORKS", "HALCYON SOFTWARE", "IRONGATE SECURITY",
  "PARAMOUNT CATERING", "VERTEX COURIERS", "LUMEN UTILITIES", "SABLE INSURANCE",
];
const NOISE_WORDS = ["PMT", "REF", "INV", "TXN", "NEFT", "IMPS", "ACH", "SETTLEMENT"];

function mulberry(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generate(n: number, seed = 7) {
  const rnd = mulberry(seed);
  const ledger: Row[] = [];
  const bank: Row[] = [];

  for (let i = 0; i < n; i++) {
    const payee = PAYEES[Math.floor(rnd() * PAYEES.length)];
    const amt = Math.floor(rnd() * 900000) + 500; // cents
    const day = Math.floor(rnd() * 90);
    const ref = "R" + (100000 + Math.floor(rnd() * 899999));
    const narr = `${payee} ${NOISE_WORDS[Math.floor(rnd() * NOISE_WORDS.length)]} ${ref}`;
    ledger.push({ i, day, amt, ref, narr, truth: -1 });
  }

  // build the bank side with a known ground truth
  let bi = 0;
  for (let i = 0; i < n; i++) {
    const L = ledger[i];
    const roll = rnd();
    if (roll < 0.05) continue; // 5% genuinely unmatched

    let day = L.day;
    let ref = L.ref;
    let narr = L.narr;
    let amt = L.amt;

    if (roll < 0.20) {
      // 15% cleared on a different day
      day = L.day + (rnd() < 0.5 ? 1 : 2) * (rnd() < 0.5 ? -1 : 1);
    } else if (roll < 0.30) {
      // 10% the bank truncated the narration, dropped the reference, and
      // rounded the amount by a cent or two. Passes 1 and 2 both miss these.
      ref = "";
      const words = L.narr.split(" ");
      const payee = words.slice(0, Math.max(1, words.length - 2)).join(" ");
      narr = `${payee.slice(0, 15).trim()} ${NOISE_WORDS[Math.floor(rnd() * NOISE_WORDS.length)]} ${Math.floor(rnd() * 99999)}`;
      amt = L.amt + (rnd() < 0.5 ? 1 : 2) * (rnd() < 0.5 ? -1 : 1);
      day = L.day + (rnd() < 0.4 ? 1 : 0);
    }

    const row: Row = { i: bi, day, amt, ref, narr, truth: i };
    bank.push(row);
    L.truth = bi;
    bi++;
  }

  // bank-only rows, roughly 3%, that should never match anything
  const extras = Math.floor(n * 0.03);
  for (let k = 0; k < extras; k++) {
    const payee = PAYEES[Math.floor(rnd() * PAYEES.length)];
    bank.push({
      i: bi++,
      day: Math.floor(rnd() * 90),
      amt: Math.floor(rnd() * 900000) + 500,
      ref: "R" + (100000 + Math.floor(rnd() * 899999)),
      narr: `${payee} BANK CHARGE`,
      truth: -1,
    });
  }

  return { ledger, bank };
}

function bigrams(s: string) {
  const out = new Set<string>();
  for (let i = 0; i < s.length - 1; i++) out.add(s.slice(i, i + 2));
  return out;
}
function dice(a: Set<string>, b: Set<string>) {
  if (!a.size || !b.size) return 0;
  let hit = 0;
  for (const g of a) if (b.has(g)) hit++;
  return (2 * hit) / (a.size + b.size);
}

type PassResult = { name: string; matched: number; ms: number; compares: number };

export default function MatchLedgerDemo() {
  const [size, setSize] = useState(10000);
  const [running, setRunning] = useState(false);
  const [passes, setPasses] = useState<PassResult[]>([]);
  const [total, setTotal] = useState<{
    ms: number;
    matched: number;
    ledger: number;
    bank: number;
    correct: number;
    wrong: number;
    naive: number;
  } | null>(null);

  const run = useCallback(() => {
    setRunning(true);
    setPasses([]);
    setTotal(null);

    // let the button repaint before we block the thread
    setTimeout(() => {
      const t0 = performance.now();
      const { ledger, bank } = generate(size);

      const takenL = new Uint8Array(ledger.length);
      const takenB = new Uint8Array(bank.length);
      const pairs: [number, number][] = [];
      const results: PassResult[] = [];

      // ---- pass 1: exact hash join on amount + day + reference ----
      let p = performance.now();
      let compares = 0;
      const exact = new Map<string, number[]>();
      for (const b of bank) {
        if (!b.ref) continue;
        const k = `${b.amt}|${b.day}|${b.ref}`;
        const bucket = exact.get(k);
        if (bucket) bucket.push(b.i);
        else exact.set(k, [b.i]);
      }
      let m1 = 0;
      for (const l of ledger) {
        const bucket = exact.get(`${l.amt}|${l.day}|${l.ref}`);
        compares++;
        if (!bucket) continue;
        for (const bIdx of bucket) {
          if (takenB[bIdx]) continue;
          takenB[bIdx] = 1;
          takenL[l.i] = 1;
          pairs.push([l.i, bIdx]);
          m1++;
          break;
        }
      }
      results.push({ name: "exact", matched: m1, ms: performance.now() - p, compares });

      // ---- pass 2: exact amount, date inside a three day window ----
      p = performance.now();
      compares = 0;
      const byAmt = new Map<number, number[]>();
      for (const b of bank) {
        if (takenB[b.i]) continue;
        const bucket = byAmt.get(b.amt);
        if (bucket) bucket.push(b.i);
        else byAmt.set(b.amt, [b.i]);
      }
      let m2 = 0;
      for (const l of ledger) {
        if (takenL[l.i]) continue;
        const bucket = byAmt.get(l.amt);
        if (!bucket) continue;
        let best = -1;
        let bestD = 4;
        for (const bIdx of bucket) {
          if (takenB[bIdx]) continue;
          compares++;
          const d = Math.abs(bank[bIdx].day - l.day);
          if (d <= 3 && d < bestD) {
            bestD = d;
            best = bIdx;
          }
        }
        if (best >= 0) {
          takenB[best] = 1;
          takenL[l.i] = 1;
          pairs.push([l.i, best]);
          m2++;
        }
      }
      results.push({ name: "tolerance", matched: m2, ms: performance.now() - p, compares });

      // ---- pass 3: fuzzy narration, blocked by amount bucket and date ----
      p = performance.now();
      compares = 0;
      const BUCKET = 5000; // cents. blocking key, not a tolerance
      const blocks = new Map<number, number[]>();
      for (const b of bank) {
        if (takenB[b.i]) continue;
        const key = Math.floor(b.amt / BUCKET);
        for (const k of [key - 1, key, key + 1]) {
          const bucket = blocks.get(k);
          if (bucket) bucket.push(b.i);
          else blocks.set(k, [b.i]);
        }
      }
      const gramCache = new Map<number, Set<string>>();
      let m3 = 0;
      for (const l of ledger) {
        if (takenL[l.i]) continue;
        const bucket = blocks.get(Math.floor(l.amt / BUCKET));
        if (!bucket) continue;
        const lg = bigrams(l.narr);
        let best = -1;
        let bestS = 0.55; // threshold
        for (const bIdx of bucket) {
          if (takenB[bIdx]) continue;
          const b = bank[bIdx];
          if (Math.abs(b.day - l.day) > 3) continue;
          if (Math.abs(b.amt - l.amt) > 2) continue;
          compares++;
          let bg = gramCache.get(bIdx);
          if (!bg) {
            bg = bigrams(b.narr);
            gramCache.set(bIdx, bg);
          }
          const s = dice(lg, bg);
          if (s > bestS) {
            bestS = s;
            best = bIdx;
          }
        }
        if (best >= 0) {
          takenB[best] = 1;
          takenL[l.i] = 1;
          pairs.push([l.i, best]);
          m3++;
        }
      }
      results.push({ name: "fuzzy", matched: m3, ms: performance.now() - p, compares });

      // ---- score against the ground truth we generated ----
      let correct = 0;
      let wrong = 0;
      for (const [li, bi] of pairs) {
        if (ledger[li].truth === bi) correct++;
        else wrong++;
      }

      setPasses(results);
      setTotal({
        ms: performance.now() - t0,
        matched: pairs.length,
        ledger: ledger.length,
        bank: bank.length,
        correct,
        wrong,
        naive: ledger.length * bank.length,
      });
      setRunning(false);
    }, 30);
  }, [size]);

  const totalCompares = passes.reduce((a, b) => a + b.compares, 0);

  return (
    <div className="demo">
      <div className="demo-bar">
        <span>matching engine</span>
        <span style={{ color: "var(--rule-3)" }}>|</span>
        <span>synthetic data, your browser, your CPU</span>
      </div>

      <div className="demo-body stack g18">
        <div className="row wrap g10 center">
          <span className="eyebrow" style={{ display: "inline" }}>rows per side</span>
          {[2000, 10000, 40000].map((n) => (
            <button
              key={n}
              className="tab"
              data-on={size === n ? "1" : "0"}
              onClick={() => setSize(n)}
              disabled={running}
              style={{ border: "1px solid var(--rule-2)", borderRadius: 2 }}
            >
              {n.toLocaleString()}
            </button>
          ))}
          <span className="fill" />
          <button className="btn primary" onClick={run} disabled={running}>
            {running ? "running" : "run reconciliation"}
          </button>
        </div>

        {!total && !running ? (
          <p className="prose" style={{ fontSize: 14.5 }}>
            Generates two transaction lists with a known answer key: 70 percent identical,
            15 percent cleared on a different day, 10 percent where the bank truncated the
            narration, dropped the reference and rounded the amount by a cent, and 5 percent
            with no partner at all. Then runs the three passes and scores itself against the key.
          </p>
        ) : null}

        {passes.length ? (
          <div className="stack g14">
            {passes.map((r, i) => {
              const pct = total ? (r.matched / total.ledger) * 100 : 0;
              return (
                <div key={r.name} className="stack g6">
                  <div className="row between baseline g10">
                    <span className="mono" style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-2)" }}>
                      {i + 1} · {r.name}
                    </span>
                    <span className="mono" style={{ fontSize: 12, color: "var(--text)" }}>
                      {r.matched.toLocaleString()}
                      <span className="muted"> matched · </span>
                      {r.ms.toFixed(1)}
                      <span className="muted"> ms</span>
                    </span>
                  </div>
                  <div className="bar-track">
                    <div
                      className={`bar-fill ${i === 1 ? "b2" : i === 2 ? "b3" : ""}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                  <span className="mono muted" style={{ fontSize: 10.5 }}>
                    {r.compares.toLocaleString()} comparisons
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}

        {total ? (
          <>
            <hr className="rule" />
            <div className="slabs">
              <div className="slab">
                <span className="slab-n">
                  {total.ms.toFixed(0)}<u>ms</u>
                </span>
                <span className="slab-l">
                  End to end, including generating {(total.ledger + total.bank).toLocaleString()} rows
                </span>
              </div>
              <div className="slab">
                <span className="slab-n">
                  {((total.matched / total.ledger) * 100).toFixed(1)}<u>%</u>
                </span>
                <span className="slab-l">
                  {total.matched.toLocaleString()} of {total.ledger.toLocaleString()} ledger rows resolved
                </span>
              </div>
              <div className="slab">
                <span className="slab-n">{total.wrong.toLocaleString()}</span>
                <span className="slab-l">
                  Wrong pairs against the answer key. {total.correct.toLocaleString()} correct
                </span>
              </div>
              <div className="slab">
                <span className="slab-n">
                  {(totalCompares / total.naive * 100).toFixed(3)}<u>%</u>
                </span>
                <span className="slab-l">
                  Of the {(total.naive / 1e6).toFixed(1)} million comparisons a naive cross product would need
                </span>
              </div>
            </div>
            <p className="mono muted" style={{ fontSize: 11, lineHeight: 1.7 }}>
              Blocking is the whole trick. Without it this is an O(n x m) scan and the 40,000
              row option would not return.
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}
