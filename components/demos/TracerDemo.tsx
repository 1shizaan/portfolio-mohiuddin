"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The Inkline tracer, cut down to what fits on a page.
 * Draw a shape. The pipeline runs for real:
 *   raster -> Moore-neighbour boundary following -> staircase smoothing
 *   -> corner detection over an angular window -> Schneider cubic fitting.
 * No library. Potrace is GPL and would attach itself to any font made with it.
 */

type P = { x: number; y: number };

const W = 240;
const H = 240;

/* ---------- vector helpers ---------- */
const sub = (a: P, b: P): P => ({ x: a.x - b.x, y: a.y - b.y });
const add = (a: P, b: P): P => ({ x: a.x + b.x, y: a.y + b.y });
const mul = (a: P, s: number): P => ({ x: a.x * s, y: a.y * s });
const dot = (a: P, b: P) => a.x * b.x + a.y * b.y;
const len = (a: P) => Math.hypot(a.x, a.y);
const norm = (a: P): P => {
  const l = len(a) || 1;
  return { x: a.x / l, y: a.y / l };
};

/* ---------- Moore-neighbour boundary following ---------- */
function traceBoundary(mask: Uint8Array, w: number, h: number): P[] {
  let sx = -1;
  let sy = -1;
  outer: for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (mask[y * w + x]) {
        sx = x;
        sy = y;
        break outer;
      }
    }
  }
  if (sx < 0) return [];

  // clockwise neighbourhood starting west
  const N = [
    [-1, 0], [-1, -1], [0, -1], [1, -1],
    [1, 0], [1, 1], [0, 1], [-1, 1],
  ];
  const at = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < w && y < h && mask[y * w + x] === 1;

  const out: P[] = [];
  let cx = sx;
  let cy = sy;
  let bIdx = 0;
  const start = { x: sx, y: sy };
  let guard = 0;

  do {
    out.push({ x: cx, y: cy });
    let found = false;
    for (let k = 1; k <= 8; k++) {
      const i = (bIdx + k) % 8;
      const nx = cx + N[i][0];
      const ny = cy + N[i][1];
      if (at(nx, ny)) {
        bIdx = (i + 5) % 8; // back up to the previous background cell
        cx = nx;
        cy = ny;
        found = true;
        break;
      }
    }
    if (!found) break;
    guard++;
  } while ((cx !== start.x || cy !== start.y) && guard < w * h * 4);

  return out;
}

/* ---------- staircase smoothing: a 1px grid produces 90 degree noise ---------- */
function smooth(pts: P[], passes = 2): P[] {
  let cur = pts;
  for (let p = 0; p < passes; p++) {
    const next: P[] = [];
    const n = cur.length;
    for (let i = 0; i < n; i++) {
      const a = cur[(i - 1 + n) % n];
      const b = cur[i];
      const c = cur[(i + 1) % n];
      next.push({ x: (a.x + 2 * b.x + c.x) / 4, y: (a.y + 2 * b.y + c.y) / 4 });
    }
    cur = next;
  }
  return cur;
}

/* ---------- corner detection over an angular window ---------- */
function corners(pts: P[], win = 7, degThreshold = 62): number[] {
  const n = pts.length;
  const out: number[] = [];
  if (n < win * 3) return out;
  const cos = Math.cos((degThreshold * Math.PI) / 180);
  for (let i = 0; i < n; i++) {
    const a = norm(sub(pts[(i - win + n) % n], pts[i]));
    const b = norm(sub(pts[(i + win) % n], pts[i]));
    if (dot(a, b) > -cos) {
      // sharp enough. keep the sharpest inside a local run
      const prev = out[out.length - 1];
      if (prev !== undefined && i - prev < win) continue;
      out.push(i);
    }
  }
  return out;
}

/* ---------- Schneider cubic fitting ---------- */
function chordParams(pts: P[]): number[] {
  const u = [0];
  for (let i = 1; i < pts.length; i++) u.push(u[i - 1] + len(sub(pts[i], pts[i - 1])));
  const total = u[u.length - 1] || 1;
  return u.map((v) => v / total);
}

const B0 = (t: number) => (1 - t) ** 3;
const B1 = (t: number) => 3 * t * (1 - t) ** 2;
const B2 = (t: number) => 3 * t * t * (1 - t);
const B3 = (t: number) => t ** 3;

function evalBez(c: P[], t: number): P {
  return {
    x: c[0].x * B0(t) + c[1].x * B1(t) + c[2].x * B2(t) + c[3].x * B3(t),
    y: c[0].y * B0(t) + c[1].y * B1(t) + c[2].y * B2(t) + c[3].y * B3(t),
  };
}

function fitOne(pts: P[], u: number[], t1: P, t2: P): P[] {
  const n = pts.length;
  let c00 = 0, c01 = 0, c11 = 0, x0 = 0, x1 = 0;
  for (let i = 0; i < n; i++) {
    const a1 = mul(t1, B1(u[i]));
    const a2 = mul(t2, B2(u[i]));
    c00 += dot(a1, a1);
    c01 += dot(a1, a2);
    c11 += dot(a2, a2);
    const tmp = sub(
      pts[i],
      add(
        add(mul(pts[0], B0(u[i])), mul(pts[0], B1(u[i]))),
        add(mul(pts[n - 1], B2(u[i])), mul(pts[n - 1], B3(u[i])))
      )
    );
    x0 += dot(a1, tmp);
    x1 += dot(a2, tmp);
  }
  const det = c00 * c11 - c01 * c01;
  let alphaL = 0;
  let alphaR = 0;
  if (Math.abs(det) > 1e-9) {
    alphaL = (x0 * c11 - x1 * c01) / det;
    alphaR = (c00 * x1 - c01 * x0) / det;
  }
  const segLen = len(sub(pts[n - 1], pts[0]));
  if (alphaL < 1e-6 || alphaR < 1e-6) {
    alphaL = alphaR = segLen / 3;
  }
  return [
    pts[0],
    add(pts[0], mul(t1, alphaL)),
    add(pts[n - 1], mul(t2, alphaR)),
    pts[n - 1],
  ];
}

function fitCubic(pts: P[], t1: P, t2: P, tol: number, depth = 0): P[][] {
  if (pts.length < 3) return [];
  if (pts.length === 3 || depth > 7) {
    return [fitOne(pts, chordParams(pts), t1, t2)];
  }
  const u = chordParams(pts);
  const bez = fitOne(pts, u, t1, t2);

  let maxErr = 0;
  let split = Math.floor(pts.length / 2);
  for (let i = 1; i < pts.length - 1; i++) {
    const d = len(sub(evalBez(bez, u[i]), pts[i]));
    if (d > maxErr) {
      maxErr = d;
      split = i;
    }
  }
  if (maxErr < tol) return [bez];

  const centre = norm(sub(pts[split - 1], pts[split + 1]));
  const left = fitCubic(pts.slice(0, split + 1), t1, centre, tol, depth + 1);
  const right = fitCubic(
    pts.slice(split),
    { x: -centre.x, y: -centre.y },
    t2,
    tol,
    depth + 1
  );
  return [...left, ...right];
}

/* ---------- component ---------- */

export default function TracerDemo() {
  const inkRef = useRef<HTMLCanvasElement | null>(null);
  const outRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const last = useRef<P | null>(null);

  const [stats, setStats] = useState<{
    boundary: number;
    corners: number;
    curves: number;
    tol: number;
  } | null>(null);
  const [tol, setTol] = useState(1.6);
  const [empty, setEmpty] = useState(true);

  const clear = useCallback(() => {
    const cv = inkRef.current;
    const out = outRef.current;
    if (!cv || !out) return;
    const c = cv.getContext("2d")!;
    c.fillStyle = "#0A0B0D";
    c.fillRect(0, 0, W, H);
    const o = out.getContext("2d")!;
    o.clearRect(0, 0, W, H);
    setStats(null);
    setEmpty(true);
  }, []);

  useEffect(() => {
    clear();
    // a starting glyph so the demo is not blank on arrival
    const cv = inkRef.current;
    if (!cv) return;
    const c = cv.getContext("2d")!;
    c.strokeStyle = "#EDEFF1";
    c.lineWidth = 15;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.beginPath();
    c.moveTo(72, 52);
    c.bezierCurveTo(150, 40, 196, 96, 158, 132);
    c.bezierCurveTo(126, 162, 74, 140, 72, 118);
    c.moveTo(72, 52);
    c.lineTo(70, 198);
    c.stroke();
    setEmpty(false);
  }, [clear]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>): P => {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * W,
      y: ((e.clientY - r.top) / r.height) * H,
    };
  };

  const down = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = pos(e);
    setEmpty(false);
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const cv = inkRef.current;
    if (!cv) return;
    const c = cv.getContext("2d")!;
    const p = pos(e);
    c.strokeStyle = "#EDEFF1";
    c.lineWidth = 15;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.beginPath();
    c.moveTo(last.current!.x, last.current!.y);
    c.lineTo(p.x, p.y);
    c.stroke();
    last.current = p;
  };
  const up = () => {
    drawing.current = false;
    last.current = null;
  };

  const run = useCallback(() => {
    const cv = inkRef.current;
    const out = outRef.current;
    if (!cv || !out) return;

    const img = cv.getContext("2d")!.getImageData(0, 0, W, H).data;
    const mask = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) {
      mask[i] = img[i * 4] > 110 ? 1 : 0;
    }

    const raw = traceBoundary(mask, W, H);
    const o = out.getContext("2d")!;
    o.clearRect(0, 0, W, H);
    if (raw.length < 24) {
      setStats(null);
      return;
    }

    const sm = smooth(raw, 2);
    const cIdx = corners(sm, 7, 62);

    // split the closed contour at corners. no corners means one closed run.
    const runs: P[][] = [];
    if (cIdx.length < 2) {
      runs.push([...sm, sm[0]]);
    } else {
      for (let k = 0; k < cIdx.length; k++) {
        const a = cIdx[k];
        const b = cIdx[(k + 1) % cIdx.length];
        const seg: P[] = [];
        let i = a;
        do {
          seg.push(sm[i]);
          i = (i + 1) % sm.length;
        } while (i !== b);
        seg.push(sm[b]);
        if (seg.length >= 4) runs.push(seg);
      }
    }

    let curves = 0;
    o.lineWidth = 1.6;
    o.strokeStyle = "#FFB020";
    for (const seg of runs) {
      const t1 = norm(sub(seg[1], seg[0]));
      const t2 = norm(sub(seg[seg.length - 2], seg[seg.length - 1]));
      const beziers = fitCubic(seg, t1, t2, tol);
      for (const b of beziers) {
        o.beginPath();
        o.moveTo(b[0].x, b[0].y);
        o.bezierCurveTo(b[1].x, b[1].y, b[2].x, b[2].y, b[3].x, b[3].y);
        o.stroke();
        curves++;

        // control polygon, drawn faintly, because it is the point of the demo
        o.strokeStyle = "rgba(255,176,32,0.24)";
        o.lineWidth = 1;
        o.beginPath();
        o.moveTo(b[0].x, b[0].y);
        o.lineTo(b[1].x, b[1].y);
        o.moveTo(b[3].x, b[3].y);
        o.lineTo(b[2].x, b[2].y);
        o.stroke();
        o.fillStyle = "rgba(255,176,32,0.55)";
        for (const k of [1, 2]) {
          o.beginPath();
          o.arc(b[k].x, b[k].y, 1.6, 0, Math.PI * 2);
          o.fill();
        }
        o.fillStyle = "#EDEFF1";
        o.beginPath();
        o.arc(b[0].x, b[0].y, 2.2, 0, Math.PI * 2);
        o.fill();
        o.strokeStyle = "#FFB020";
        o.lineWidth = 1.6;
      }
    }

    setStats({ boundary: raw.length, corners: cIdx.length, curves, tol });
  }, [tol]);

  return (
    <div className="demo">
      <div className="demo-bar">
        <span>tracer</span>
        <span style={{ color: "var(--rule-3)" }}>|</span>
        <span>moore boundary, corner detect, schneider cubic fit</span>
      </div>

      <div className="demo-body stack g18">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <div className="stack g8">
            <span className="eyebrow">1 · draw</span>
            <canvas
              ref={inkRef}
              width={W}
              height={H}
              onPointerDown={down}
              onPointerMove={move}
              onPointerUp={up}
              onPointerCancel={up}
              style={{
                width: "100%",
                aspectRatio: "1",
                border: "1px solid var(--rule-2)",
                borderRadius: 3,
                touchAction: "none",
                cursor: "crosshair",
                background: "#0A0B0D",
              }}
            />
          </div>
          <div className="stack g8">
            <span className="eyebrow">2 · outline</span>
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "1",
                border: "1px solid var(--rule-2)",
                borderRadius: 3,
                background: "#0A0B0D",
              }}
            >
              <canvas
                ref={outRef}
                width={W}
                height={H}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </div>

        <div className="row wrap g10 center">
          <button className="btn primary" onClick={run} disabled={empty}>
            trace
          </button>
          <button className="btn" onClick={clear}>
            clear
          </button>
          <span className="fill" />
          <label className="mono muted" htmlFor="tol" style={{ fontSize: 10.5, letterSpacing: "0.1em" }}>
            FIT TOLERANCE {tol.toFixed(1)}px
          </label>
          <input
            id="tol"
            className="range"
            type="range"
            min={0.4}
            max={5}
            step={0.2}
            value={tol}
            onChange={(e) => setTol(parseFloat(e.target.value))}
            style={{ maxWidth: 150 }}
          />
        </div>

        {stats ? (
          <div className="slabs">
            <div className="slab">
              <span className="slab-n">{stats.boundary}</span>
              <span className="slab-l">Boundary pixels found by Moore following</span>
            </div>
            <div className="slab">
              <span className="slab-n">{stats.corners}</span>
              <span className="slab-l">Corners detected over a 7 point angular window</span>
            </div>
            <div className="slab">
              <span className="slab-n">{stats.curves}</span>
              <span className="slab-l">Cubic segments fitted at {stats.tol.toFixed(1)}px tolerance</span>
            </div>
            <div className="slab">
              <span className="slab-n">
                {(stats.boundary / Math.max(1, stats.curves)).toFixed(0)}<u>×</u>
              </span>
              <span className="slab-l">Compression from pixels to control points</span>
            </div>
          </div>
        ) : (
          <p className="prose" style={{ fontSize: 14.5 }}>
            Draw something and press trace. Lower the tolerance and the fitter splits into more
            curves to stay close to the pixels. Raise it and the outline gets smoother and less
            faithful. That single number is the whole quality decision in a tracer.
          </p>
        )}
      </div>
    </div>
  );
}
