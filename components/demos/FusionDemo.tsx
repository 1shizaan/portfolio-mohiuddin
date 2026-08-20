"use client";

import { useState } from "react";

/** Real numbers from fusion_classification_report.txt. Nothing here is invented. */
const CLASSES: { name: string; f1: number; support: number }[] = [
  { name: "Automotive", f1: 1.0, support: 12 },
  { name: "Books and Magazines", f1: 1.0, support: 22 },
  { name: "Entertainment", f1: 1.0, support: 12 },
  { name: "Government and Public Services", f1: 1.0, support: 12 },
  { name: "Nature", f1: 1.0, support: 14 },
  { name: "Productivity Tools", f1: 1.0, support: 11 },
  { name: "Receipts", f1: 1.0, support: 11 },
  { name: "Ronaldo (Celebrities)", f1: 1.0, support: 10 },
  { name: "Sports", f1: 1.0, support: 11 },
  { name: "Finance", f1: 0.966, support: 14 },
  { name: "E-commerce", f1: 0.96, support: 13 },
  { name: "Education", f1: 0.96, support: 12 },
  { name: "Quotes (Plain Cards)", f1: 0.96, support: 13 },
  { name: "Technology", f1: 0.96, support: 12 },
  { name: "Motivational Posters", f1: 0.957, support: 11 },
  { name: "Resources", f1: 0.944, support: 18 },
  { name: "Recipes", f1: 0.941, support: 16 },
  { name: "News", f1: 0.929, support: 14 },
  { name: "Food and Dining", f1: 0.9, support: 11 },
  { name: "Social Media Screens", f1: 0.9, support: 11 },
];

export default function FusionDemo() {
  const [hover, setHover] = useState<string | null>(null);
  const focus = CLASSES.find((c) => c.name === hover);

  return (
    <div className="demo">
      <div className="demo-bar">
        <span>per class f1</span>
        <span style={{ color: "var(--rule-3)" }}>|</span>
        <span>260 image held-out test set, 20 classes</span>
        <span className="fill" />
        <span style={{ color: "var(--amber)" }}>96.92% overall</span>
      </div>

      <div className="demo-body stack g18">
        <div className="stack g4">
          {CLASSES.map((c) => {
            const on = hover === c.name;
            const perfect = c.f1 === 1;
            // stretch the axis so the interesting range is visible
            const w = ((c.f1 - 0.86) / 0.14) * 100;
            return (
              <button
                key={c.name}
                onMouseEnter={() => setHover(c.name)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(c.name)}
                onBlur={() => setHover(null)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0,160px) 1fr 52px",
                  gap: 12,
                  alignItems: "center",
                  background: "transparent",
                  border: 0,
                  padding: "3px 0",
                  cursor: "default",
                  textAlign: "left",
                  color: "inherit",
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: on ? "var(--text)" : "var(--text-3)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    transition: "color 140ms ease",
                  }}
                >
                  {c.name}
                </span>
                <span
                  style={{
                    height: 8,
                    background: "var(--panel-3)",
                    borderRadius: 1,
                    overflow: "hidden",
                    display: "block",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      height: "100%",
                      width: `${Math.max(2, w)}%`,
                      background: perfect
                        ? "var(--rule-3)"
                        : c.f1 < 0.92
                        ? "var(--bad)"
                        : "var(--amber)",
                      opacity: on ? 1 : 0.82,
                      transition: "opacity 140ms ease",
                    }}
                  />
                </span>
                <span
                  className="num"
                  style={{ fontSize: 11.5, color: on ? "var(--text)" : "var(--text-3)" }}
                >
                  {c.f1.toFixed(3)}
                </span>
              </button>
            );
          })}
        </div>

        <p className="prose" style={{ fontSize: 14 }}>
          {focus ? (
            <>
              <strong>{focus.name}</strong> scored {focus.f1.toFixed(3)} across {focus.support}{" "}
              test images.
              {focus.f1 < 0.92
                ? " This is one of the two classes where OCR returns almost nothing, so the fusion collapses back to vision alone."
                : focus.f1 === 1
                ? " Perfect precision and recall. These classes have a strong visual signature and readable text."
                : " One or two images went to a neighbouring class."}
            </>
          ) : (
            <>
              Nine classes at a perfect 1.000. The floor is 0.900, and both classes sitting on it
              have the same cause: an image with no readable text, where the text half of the
              fused vector contributes nothing and the classifier falls back to pixels.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
