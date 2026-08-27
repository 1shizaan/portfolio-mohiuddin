import Link from "next/link";
import SignalHero from "@/components/SignalHero";
import Caliper from "@/components/Caliper";
import Reveal from "@/components/Reveal";
import { ProvStamp, StatusStamp } from "@/components/Stamp";
import { projects, chronological, featured } from "@/lib/projects";
import { site } from "@/lib/site";

const MARKS = [
  { id: "top", label: "Top" },
  { id: "ledger", label: "Ledger" },
  { id: "line", label: "Timeline" },
  { id: "selected", label: "Selected" },
  { id: "method", label: "Method" },
  { id: "reach", label: "Contact" },
];

const YEARS: { year: string; note: string; slugs: string[] }[] = [
  {
    year: "2024",
    note: "Computer vision, and then hardware, which I picked up mostly because I could not talk my way out of it.",
    slugs: ["fit-percentage", "ss-categorise", "optixon"],
  },
  {
    year: "2025",
    note: "Three months on the wrong problem. Then six on a better one, found by admitting the first.",
    slugs: ["agent-era", "matchledger", "rag-qa", "telecare"],
  },
  {
    year: "2026",
    note: "A product people pay for, and the small tools that fell out of building it.",
    slugs: ["debugai", "secaudit", "mediagrab", "deconstruct", "inkline", "beyondvision", "human-writing"],
  },
];

export default function Home() {
  const headline = [
    projects.find((p) => p.slug === "matchledger")!.metrics[0],
    projects.find((p) => p.slug === "debugai")!.metrics[0],
    projects.find((p) => p.slug === "ss-categorise")!.metrics[0],
    projects.find((p) => p.slug === "optixon")!.metrics[2],
    projects.find((p) => p.slug === "beyondvision")!.metrics[0],
    projects.find((p) => p.slug === "secaudit")!.metrics[1],
  ];

  return (
    <>
      <Caliper marks={MARKS} />

      {/* ---------------- hero ---------------- */}
      <section id="top" className="shell" style={{ paddingTop: 76, paddingBottom: 24 }}>
        <Reveal>
          <span className="eyebrow">
            {site.location} <span className="on">·</span> B.Tech CSE, data science, final year
          </span>
        </Reveal>

        <Reveal delay={60}>
          <h1 className="d1 mt20" style={{ maxWidth: "13ch" }}>
            Deterministic <em>first.</em> Models later.
          </h1>
        </Reveal>

        <div className="split hero mt40">
          <Reveal delay={120}>
            <div className="prose lead">
              <p>
                I&apos;m Mohammed Mohi Uddin. Most of what I build starts with something I
                can&apos;t have. No inference budget. No network on the other end. Ten and a
                half millimetres of width inside a pair of glasses. Whatever the shortage is,
                it usually ends up designing the system better than I would have.
              </p>
              <p>
                Fourteen projects here. Four of them are paused or dead and I&apos;ve written
                down why on each one. Every number on this site is tagged with how I got it,
                because I published a wrong one once and I&apos;d rather not do it again.
              </p>
            </div>
            <div className="row wrap g10 mt28">
              <Link className="btn primary" href="/work">
                Fourteen projects →
              </Link>
              <Link className="btn" href="/resume">
                Resume and CV
              </Link>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <SignalHero />
            <p className="mono muted mt14" style={{ fontSize: 11, lineHeight: 1.75, maxWidth: "52ch" }}>
              A pulse waveform recorded while somebody is moving. The red bands are the stretches
              the gyroscope flagged as corrupt. The amber trace only gets drawn where the signal
              can be trusted. That is the OptiXon design, and roughly the argument of everything
              underneath it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- the ledger ---------------- */}
      <section id="ledger" className="section">
        <div className="shell">
          <Reveal>
            <div className="row between baseline wrap g14">
              <span className="eyebrow">// the ledger</span>
              <span className="mono muted" style={{ fontSize: 10.5, letterSpacing: "0.1em" }}>
                HOVER A STAMP FOR ITS DEFINITION
              </span>
            </div>
            <h2 className="d2 mt20" style={{ maxWidth: "18ch" }}>
              Numbers, and where each one <em>came from.</em>
            </h2>
          </Reveal>

          <Reveal delay={80}>
            <div className="row wrap g8 mt28">
              <ProvStamp p="MEASURED" />
              <ProvStamp p="DERIVED" />
              <ProvStamp p="ESTIMATED" />
              <ProvStamp p="PAPER" />
              <ProvStamp p="REPORTED" />
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="slabs mt40">
              {headline.map((m, i) => (
                <div key={i} className="slab">
                  <span className="slab-n">
                    {m.value}
                    {m.unit ? <u>{m.unit}</u> : null}
                  </span>
                  <span className="slab-l">{m.label}</span>
                  <div className="row g6 wrap">
                    <ProvStamp p={m.provenance} />
                  </div>
                  <span className="slab-src">{m.source}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <p className="prose mt40" style={{ fontSize: 15 }}>
              The stamps exist because of a specific afternoon. Published copy for DebugAI said
              750 installs. The real install count was 193. Nobody lied. I had added a downloads
              figure to an installs figure without noticing they were different kinds of number,
              and then put it on a website. Now every claim on this site says where it came from,
              and the ones I only calculated say so too.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- timeline ---------------- */}
      <section id="line" className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <Reveal>
            <span className="eyebrow">// the line</span>
            <h2 className="d2 mt20" style={{ maxWidth: "20ch" }}>
              Three years, in the order they <em>actually</em> happened.
            </h2>
            <p className="prose mt20" style={{ fontSize: 15 }}>
              Including the parts that stopped. Two of these got shut down on purpose and I
              found both endings more useful than most of the things that shipped.
            </p>
          </Reveal>

          <div className="tl mt40">
            {YEARS.map((y, yi) => (
              <Reveal key={y.year} delay={yi * 70} className="tl-year">
                <div className="tl-y">
                  {y.year}
                  <div className="mt8" style={{ fontFamily: "var(--ui)", fontSize: 12, color: "var(--text-3)", letterSpacing: 0, lineHeight: 1.5, textTransform: "none" }}>
                    {y.note}
                  </div>
                </div>
                <div className="tl-items">
                  {y.slugs.map((s) => {
                    const p = projects.find((x) => x.slug === s)!;
                    return (
                      <Link
                        key={s}
                        href={`/work/${p.slug}`}
                        className="tl-item"
                        data-kill={p.status === "RETIRED" || p.status === "PAPER" ? "1" : "0"}
                      >
                        <span className="tl-node" />
                        <span>
                          <span className="row between baseline wrap g10">
                            <span className="tl-h">{p.name}</span>
                            <StatusStamp s={p.status} />
                          </span>
                          <span className="tl-p">{p.kicker}. {p.years}.</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- selected ---------------- */}
      <section id="selected" className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <Reveal>
            <span className="eyebrow">// selected</span>
            <h2 className="d2 mt20" style={{ maxWidth: "16ch" }}>
              Four I would defend in a <em>viva.</em>
            </h2>
          </Reveal>

          <div className="mt40 stack g24">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={i * 60}>
                <Link
                  href={`/work/${p.slug}`}
                  className="panel split card"
                  style={{ padding: 28, textDecoration: "none" }}
                >
                  <div className="stack g14">
                    <div className="row wrap g8 center">
                      <span className="mono muted" style={{ fontSize: 11, letterSpacing: "0.1em" }}>
                        {p.n}
                      </span>
                      <StatusStamp s={p.status} />
                      <span className="mono muted" style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        {p.years}
                      </span>
                    </div>
                    <h3 className="d3">{p.name}</h3>
                    <p style={{ margin: 0, fontSize: 15, color: "var(--text-2)", lineHeight: 1.65 }}>
                      {p.summary}
                    </p>
                    <div className="chips">
                      {p.stack.slice(0, 6).map((s) => (
                        <span key={s} className="chip">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="stack g18">
                    {p.metrics.slice(0, 2).map((m, mi) => (
                      <div key={mi} className="slab">
                        <span className="slab-n">
                          {m.value}
                          {m.unit ? <u>{m.unit}</u> : null}
                        </span>
                        <span className="slab-l">{m.label}</span>
                        <div className="row g6"><ProvStamp p={m.provenance} /></div>
                      </div>
                    ))}
                    <span className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "var(--amber)", textTransform: "uppercase" }}>
                      Read the case study →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="row center g14 mt40">
              <Link className="btn" href="/work">
                All {projects.length} projects
              </Link>
              <span className="mono muted" style={{ fontSize: 11 }}>
                including the {chronological.filter((p) => p.status === "RETIRED" || p.status === "PAPER").length} that did not ship
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- method ---------------- */}
      <section id="method" className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div
            className="panel"
            style={{ padding: "44px 40px", background: "var(--panel-2)" }}
          >
            <Reveal>
              <span className="eyebrow">// method</span>
              <h2 className="d2 mt20" style={{ maxWidth: "22ch" }}>
                Four rules I got <em>wrong</em> before I got them right.
              </h2>
            </Reveal>

            <Reveal delay={80}>
              <div
                className="mt40"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                  gap: 30,
                }}
              >
                {[
                  ["Build the ruler first", "My fit model scored 85 percent, which sounded like a result until I built the arithmetic version and it scored 70. The learned part was worth fifteen points. Still real, much smaller story."],
                  ["Block before you compare", "A hundred thousand rows against ninety eight thousand is 9.8 billion comparisons and it never finishes. Bucket them by amount and date first and the same run takes four seconds. That was a data structure, not a bigger machine."],
                  ["Tag every claim", "Measured, derived, estimated, paper. Four words. I started using them after publishing a number I had assembled out of two other numbers."],
                  ["A pause is data", "Three months on an agent that turned out to be a bulk sender. Stopping was fine. Writing down exactly what I had failed to measure is what produced the next project."],
                ].map(([h, b], i) => (
                  <div key={h} className="stack g8">
                    <span className="mono muted" style={{ fontSize: 11, letterSpacing: "0.1em" }}>
                      0{i + 1}
                    </span>
                    <span style={{ fontSize: 16.5, fontWeight: 500, letterSpacing: "-0.012em" }}>{h}</span>
                    <span style={{ fontSize: 14.5, color: "var(--text-2)", lineHeight: 1.65 }}>{b}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt40">
                <Link className="btn" href="/thinking">
                  The longer version
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- contact ---------------- */}
      <section id="reach" className="section tight" style={{ paddingTop: 0 }}>
        <div className="shell">
          <Reveal>
            <h2 className="d2" style={{ maxWidth: "17ch" }}>
              Hiring for something <em>hard?</em>
            </h2>
            <p className="prose mt20" style={{ fontSize: 16 }}>
              I&apos;m in my final year, looking for a summer 2027 internship in AI engineering,
              systems, or applied research. Strongest in Python, then TypeScript, and I&apos;ll
              write C when the target has 64 kilobytes of RAM and no operating system. If you ask
              me something I don&apos;t know, I&apos;ll say so rather than guess at you.
            </p>
            <div className="row wrap g10 mt28">
              <a className="btn primary" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <a className="btn" href={site.github} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
              <a className="btn" href={site.linkedin} target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
