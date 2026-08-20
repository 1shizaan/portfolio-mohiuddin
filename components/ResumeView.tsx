"use client";

import { useState } from "react";
import { DOCS, identity } from "@/lib/resume";
import type { Doc, CVSection } from "@/lib/resume";

function Section({ s }: { s: CVSection }) {
  return (
    <section style={{ borderTop: "1px solid var(--rule-2)", paddingTop: 18, marginTop: 34 }}>
      <span className="eyebrow" style={{ marginBottom: 18 }}>{s.title}</span>

      {s.kind === "text" ? (
        <p className="prose" style={{ fontSize: 15.5 }}>{s.text}</p>
      ) : null}

      {s.kind === "list" ? (
        <ul className="cv-ul">
          {s.list.map((l, i) => <li key={i}>{l}</li>)}
        </ul>
      ) : null}

      {s.kind === "skills" ? (
        <div className="stack">
          {s.skills.map((g) => (
            <div key={g.group} className="cv-row" style={{ padding: "13px 0" }}>
              <span className="cv-when">{g.group}</span>
              <span style={{ fontSize: 14.5, color: "var(--text-2)", lineHeight: 1.6 }}>{g.items}</span>
            </div>
          ))}
        </div>
      ) : null}

      {s.kind === "entries" ? (
        <div className="stack">
          {s.entries.map((e, i) => (
            <div key={i} className="cv-row">
              <span className="cv-when">{e.when}</span>
              <div>
                <div className="row between baseline wrap g10">
                  <span className="cv-h">{e.title}</span>
                  {e.tag ? <span className="stamp" data-s="LIVE"><span className="dot-live" />{e.tag}</span> : null}
                </div>
                {e.sub ? <div className="cv-sub">{e.sub}</div> : null}
                <ul className="cv-ul">
                  {e.bullets.map((b, k) => <li key={k}>{b}</li>)}
                </ul>
                {e.tech ? (
                  <div className="mono muted" style={{ fontSize: 11, marginTop: 10, lineHeight: 1.65 }}>
                    {e.tech}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default function ResumeView() {
  const [track, setTrack] = useState<"engineering" | "research">("engineering");
  const [kind, setKind] = useState<"Resume" | "CV">("Resume");

  const doc: Doc =
    DOCS.find((d) => d.track === track && d.kind === kind) ?? DOCS[0];

  return (
    <>
      <div className="row wrap g14 center" style={{ marginBottom: 30 }}>
        <div className="tabs">
          <button className="tab" data-on={track === "engineering" ? "1" : "0"} onClick={() => setTrack("engineering")}>
            Engineering
          </button>
          <button className="tab" data-on={track === "research" ? "1" : "0"} onClick={() => setTrack("research")}>
            Research
          </button>
        </div>
        <div className="tabs">
          <button className="tab" data-on={kind === "Resume" ? "1" : "0"} onClick={() => setKind("Resume")}>
            Resume
          </button>
          <button className="tab" data-on={kind === "CV" ? "1" : "0"} onClick={() => setKind("CV")}>
            CV
          </button>
        </div>
        <span className="fill" />
        <a className="btn primary" href={`/docs/${doc.file}.pdf`} download>
          Download PDF
        </a>
        <a className="btn" href={`/docs/${doc.file}.md`} download>
          Markdown
        </a>
      </div>

      <div className="panel" style={{ padding: "38px 40px", background: "var(--panel)" }}>
        <div className="row between wrap g14 baseline">
          <div>
            <h2 className="d3" style={{ fontSize: 30 }}>{identity.name}</h2>
            <div className="mono muted mt8" style={{ fontSize: 11.5, letterSpacing: "0.06em" }}>
              {identity.location} · {identity.email} · {identity.linkedin} · {identity.github}
            </div>
          </div>
          <div className="row g8 wrap">
            <span className="stamp" data-p="MEASURED">{doc.track}</span>
            <span className="stamp">{doc.kind}</span>
            <span className="stamp">{doc.pages}</span>
          </div>
        </div>

        <p className="mono mt20" style={{ fontSize: 12, color: "var(--amber)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {doc.headline}
        </p>
        <p className="prose lead mt14" style={{ fontSize: 16.5 }}>{doc.summary}</p>

        <p className="mono muted mt20" style={{ fontSize: 11, lineHeight: 1.7 }}>
          Sent to: {doc.audience}
        </p>

        {doc.sections.map((s, i) => <Section key={i} s={s} />)}
      </div>
    </>
  );
}
