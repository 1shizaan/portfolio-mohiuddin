"use client";

import { useEffect, useRef } from "react";

/**
 * An oscilloscope with three traces, which is the whole argument of this site
 * in one picture:
 *   1. the raw signal, buried in noise
 *   2. the motion gate, marking the samples that cannot be trusted
 *   3. the recovered pulse, drawn only where the gate is open
 *
 * This is the OptiXon problem, and it is also every other problem here.
 */
export default function SignalHero() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let t = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = cv.getBoundingClientRect();
      w = Math.max(1, Math.floor(r.width));
      h = Math.max(1, Math.floor(r.height));
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // deterministic pseudo-noise, so the picture is reproducible
    const noise = (x: number) => {
      const s = Math.sin(x * 12.9898) * 43758.5453;
      return (s - Math.floor(s)) * 2 - 1;
    };

    // a plausible photoplethysmogram: sharp systolic rise, dicrotic notch
    const pulse = (p: number) => {
      const u = p % 1;
      const main = Math.exp(-Math.pow((u - 0.16) / 0.085, 2));
      const notch = 0.34 * Math.exp(-Math.pow((u - 0.42) / 0.12, 2));
      return main + notch;
    };

    // motion bursts: where the wearer moved and the reading is untrustworthy
    const gated = (x: number) => {
      const g = Math.sin(x * 0.9 + 1.2) + 0.62 * Math.sin(x * 2.3 + 4.1);
      return g > 0.95;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      const mid = h * 0.52;
      const amp = Math.min(h * 0.3, 76);
      const step = 2;
      const period = 118;

      // baseline
      ctx.strokeStyle = "rgba(255,255,255,0.045)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, mid + 0.5);
      ctx.lineTo(w, mid + 0.5);
      ctx.stroke();

      // 1. raw, noisy
      ctx.strokeStyle = "rgba(170,176,183,0.30)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= w; x += step) {
        const phase = (x + t) / period;
        const motion = gated(( x + t) / 90);
        const n = noise(x * 0.7 + Math.floor(t / 4)) * (motion ? 0.72 : 0.13);
        const y = mid - (pulse(phase) * 0.72 + n) * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 2. the gate: vertical bands over the untrusted samples
      ctx.fillStyle = "rgba(255,95,99,0.075)";
      let bandStart: number | null = null;
      for (let x = 0; x <= w + step; x += step) {
        const motion = gated((x + t) / 90);
        if (motion && bandStart === null) bandStart = x;
        if (!motion && bandStart !== null) {
          ctx.fillRect(bandStart, mid - amp * 1.12, x - bandStart, amp * 2.24);
          bandStart = null;
        }
      }
      if (bandStart !== null) ctx.fillRect(bandStart, mid - amp * 1.12, w - bandStart, amp * 2.24);

      // 3. recovered, drawn only where the gate is open
      ctx.strokeStyle = "#FFB020";
      ctx.lineWidth = 1.6;
      ctx.lineJoin = "round";
      let pen = false;
      ctx.beginPath();
      for (let x = 0; x <= w; x += step) {
        const phase = (x + t) / period;
        const motion = gated((x + t) / 90);
        if (motion) {
          pen = false;
          continue;
        }
        const y = mid - pulse(phase) * 0.72 * amp;
        if (!pen) {
          ctx.moveTo(x, y);
          pen = true;
        } else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (!reduce) {
        t += 0.75;
        raf = requestAnimationFrame(draw);
      }
    };

    const onResize = () => {
      resize();
      if (reduce) draw();
    };

    resize();
    draw();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        border: "1px solid var(--rule)",
        borderRadius: 4,
        background: "var(--panel)",
        overflow: "hidden",
      }}
    >
      <div className="demo-bar">
        <span>scope</span>
        <span style={{ color: "var(--rule-3)" }}>|</span>
        <span>ppg + motion gate</span>
        <span className="fill" />
        <span style={{ color: "var(--text-2)" }}>raw</span>
        <span style={{ color: "var(--bad)" }}>gated</span>
        <span style={{ color: "var(--amber)" }}>trusted</span>
      </div>
      <canvas
        ref={ref}
        style={{ display: "block", width: "100%", height: 210 }}
        aria-label="An oscilloscope trace. A noisy pulse signal, bands marking samples corrupted by motion, and the recovered waveform drawn only where the signal can be trusted."
        role="img"
      />
    </div>
  );
}
