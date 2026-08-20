"use client";

import { useMemo, useState } from "react";

/**
 * The wavelength scrubber. Move it and read what each hardware tier can
 * honestly claim at that wavelength. The point of the whole project is the
 * third column, which is often the word IMPOSSIBLE.
 */

type Verdict = "MEASURED" | "RECONSTRUCTED" | "SIMULATED" | "IMPOSSIBLE";

const TIERS = [
  { id: "phone", name: "Phone, as shipped", cost: "$0", note: "IR-cut filter glued over the sensor" },
  { id: "irpass", name: "IR-pass filter hack", cost: "~$0", note: "Front depth camera, or a weak IR-cut" },
  { id: "usb", name: "USB-C module, filter removed", cost: "~$40", note: "Bare silicon, no IR-cut" },
  { id: "leds", name: "Narrowband LED array", cost: "~$150", note: "16 to 24 LEDs strobed against a mono sensor" },
  { id: "bolo", name: "USB-C microbolometer", cost: "~$250", note: "Thermal. A different sensor material entirely" },
];

function verdictFor(tier: string, nm: number): Verdict {
  switch (tier) {
    case "phone":
      if (nm >= 400 && nm <= 660) return "MEASURED";
      if (nm >= 380 && nm <= 700) return "RECONSTRUCTED";
      return "IMPOSSIBLE";
    case "irpass":
      if (nm >= 700 && nm <= 1000) return "MEASURED";
      if (nm >= 400 && nm <= 700) return "RECONSTRUCTED";
      return "IMPOSSIBLE";
    case "usb":
      if (nm >= 350 && nm <= 1000) return "MEASURED";
      if (nm > 1000 && nm <= 1107) return "MEASURED";
      return "IMPOSSIBLE";
    case "leds":
      if (nm >= 400 && nm <= 1000) return "MEASURED";
      if (nm > 1000 && nm <= 1107) return "MEASURED";
      return "IMPOSSIBLE";
    case "bolo":
      if (nm >= 8000 && nm <= 14000) return "MEASURED";
      return "IMPOSSIBLE";
    default:
      return "IMPOSSIBLE";
  }
}

const V_COLOR: Record<Verdict, string> = {
  MEASURED: "var(--amber)",
  RECONSTRUCTED: "var(--text-2)",
  SIMULATED: "var(--text-3)",
  IMPOSSIBLE: "var(--bad)",
};

function bandName(nm: number) {
  if (nm < 400) return "UVA";
  if (nm < 700) return "VISIBLE";
  if (nm < 1400) return "NIR";
  if (nm < 3000) return "SWIR";
  if (nm < 8000) return "MWIR";
  return "LWIR / THERMAL";
}

function bandNote(nm: number) {
  if (nm < 400) return "Plastic and coated lens elements absorb below about 380nm. Needs fused silica.";
  if (nm < 700) return "The 300nm slit your eyes are stuck in. Everything else on this page is outside it.";
  if (nm < 900) return "The workhorse band. Bright cheap LEDs, sensor quantum efficiency around 18 to 25 percent at 850nm.";
  if (nm <= 1107) return "Invisible to the eye and getting dark to the sensor. Roughly 7 percent quantum efficiency at 940nm.";
  if (nm < 1400) return "Past the silicon bandgap wall at 1107nm. A photon here cannot lift an electron across it.";
  if (nm < 3000) return "InGaAs territory. Real, and about three thousand dollars away.";
  if (nm < 8000) return "Mid infrared. Neither silicon nor a consumer microbolometer reaches here.";
  return "Body heat lives here. A microbolometer sees it. A phone camera cannot, and every app that says otherwise is applying a colour map to brightness.";
}

// log scale positioning
const MIN = 350;
const MAX = 14000;
const toPos = (nm: number) =>
  (Math.log(nm) - Math.log(MIN)) / (Math.log(MAX) - Math.log(MIN));
const fromPos = (p: number) =>
  Math.exp(p * (Math.log(MAX) - Math.log(MIN)) + Math.log(MIN));

const MARKS = [400, 700, 850, 940, 1107, 2500, 8000, 14000];

export default function SpectrumDemo() {
  const [pos, setPos] = useState(0.32);
  const nm = useMemo(() => Math.round(fromPos(pos)), [pos]);

  const anyMeasured = TIERS.some((t) => verdictFor(t.id, nm) === "MEASURED");

  return (
    <div className="demo">
      <div className="demo-bar">
        <span>wavelength scrubber</span>
        <span style={{ color: "var(--rule-3)" }}>|</span>
        <span>{bandName(nm)}</span>
        <span className="fill" />
        <span style={{ color: anyMeasured ? "var(--amber)" : "var(--bad)" }}>
          {anyMeasured ? "reachable" : "no honest path"}
        </span>
      </div>

      <div className="demo-body stack g18">
        <div className="row baseline g10">
          <span className="num" style={{ fontSize: 44, color: "var(--amber)", lineHeight: 1 }}>
            {nm.toLocaleString()}
          </span>
          <span className="mono muted" style={{ fontSize: 14 }}>nm</span>
          <span className="fill" />
          <span className="stamp" data-p={anyMeasured ? "MEASURED" : "PAPER"}>
            {bandName(nm)}
          </span>
        </div>

        {/* the spectrum bar */}
        <div className="stack g6">
          <div
            style={{
              position: "relative",
              height: 30,
              border: "1px solid var(--rule-2)",
              borderRadius: 2,
              overflow: "hidden",
              background: "var(--void)",
            }}
          >
            {/* visible band */}
            <div
              style={{
                position: "absolute",
                left: `${toPos(400) * 100}%`,
                width: `${(toPos(700) - toPos(400)) * 100}%`,
                top: 0,
                bottom: 0,
                background:
                  "linear-gradient(90deg,#6D28D9,#2563EB,#059669,#CA8A04,#DC2626)",
                opacity: 0.55,
              }}
            />
            {/* silicon reach */}
            <div
              style={{
                position: "absolute",
                left: `${toPos(350) * 100}%`,
                width: `${(toPos(1107) - toPos(350)) * 100}%`,
                top: 0,
                bottom: 0,
                borderRight: "2px solid var(--bad)",
                background: "rgba(255,176,32,0.07)",
              }}
            />
            {/* thermal */}
            <div
              style={{
                position: "absolute",
                left: `${toPos(8000) * 100}%`,
                width: `${(toPos(14000) - toPos(8000)) * 100}%`,
                top: 0,
                bottom: 0,
                background: "rgba(255,95,99,0.16)",
              }}
            />
            {/* marker */}
            <div
              style={{
                position: "absolute",
                left: `${pos * 100}%`,
                top: -2,
                bottom: -2,
                width: 2,
                background: "var(--amber)",
                transform: "translateX(-1px)",
              }}
            />
          </div>

          <input
            className="range"
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={pos}
            onChange={(e) => setPos(parseFloat(e.target.value))}
            aria-label="Wavelength in nanometres, logarithmic"
          />

          <div style={{ position: "relative", height: 16 }}>
            {MARKS.map((m) => (
              <span
                key={m}
                className="mono muted"
                style={{
                  position: "absolute",
                  left: `${toPos(m) * 100}%`,
                  transform: "translateX(-50%)",
                  fontSize: 9,
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                  color: m === 1107 ? "var(--bad)" : "var(--text-3)",
                }}
              >
                {m >= 1000 ? `${m / 1000}k` : m}
              </span>
            ))}
          </div>
        </div>

        <p className="prose" style={{ fontSize: 14.5 }}>
          {bandNote(nm)}
        </p>

        <hr className="rule" />

        <table className="tbl">
          <thead>
            <tr>
              <th>Hardware tier</th>
              <th style={{ width: 78 }}>Cost</th>
              <th style={{ width: 148 }}>At {nm.toLocaleString()}nm</th>
            </tr>
          </thead>
          <tbody>
            {TIERS.map((t) => {
              const v = verdictFor(t.id, nm);
              return (
                <tr key={t.id}>
                  <td>
                    <span style={{ color: "var(--text)" }}>{t.name}</span>
                    <div className="mono muted" style={{ fontSize: 10.5, marginTop: 3 }}>
                      {t.note}
                    </div>
                  </td>
                  <td className="v">{t.cost}</td>
                  <td>
                    <span
                      className="mono"
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.12em",
                        color: V_COLOR[v],
                        border: `1px solid ${v === "MEASURED" ? "var(--amber-line)" : "var(--rule-2)"}`,
                        borderRadius: 2,
                        padding: "3px 6px",
                        display: "inline-block",
                      }}
                    >
                      {v}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <p className="mono muted" style={{ fontSize: 11, lineHeight: 1.75 }}>
          Silicon stops at 1107nm because its bandgap is 1.12 electronvolts. That red line is a
          materials limit, not an engineering one, and no firmware crosses it.
        </p>
      </div>
    </div>
  );
}
