import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Caliper from "@/components/Caliper";
import Reveal from "@/components/Reveal";
import DemoSlot from "@/components/demos/DemoSlot";
import { ProvStamp, StatusStamp } from "@/components/Stamp";
import { projects, bySlug, chronological } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) return { title: "Not found" };
  return {
    title: `${p.name} · ${p.kicker}`,
    description: p.summary,
    openGraph: { title: p.name, description: p.summary },
  };
}

const DEMO_TITLE: Record<string, string> = {
  matchledger: "Run the engine",
  secaudit: "Run the scanner",
  tracer: "Run the tracer",
  spectrum: "Move the wavelength",
  fusion: "Read the per class report",
};

const DEMO_NOTE: Record<string, string> = {
  matchledger:
    "A JavaScript port of the three passes, on data generated in your browser with a known answer key. The Python original is faster and runs at 100,000 rows a side.",
  secaudit:
    "Twenty four of the sixty plus rules, running on every keystroke. The real tool is a single Python file you point at a directory.",
  tracer:
    "The actual boundary follower, corner detector and cubic fitter from the pipeline. No tracing library is involved, which was the constraint that produced it.",
  spectrum:
    "The provenance table from the specification, made interactive. Nothing here is a rendering. It is a statement about what each tier of hardware can honestly claim.",
  fusion:
    "The real classification report from the held-out test set, class by class.",
};

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) notFound();

  const order = [...chronological].reverse();
  const idx = order.findIndex((x) => x.slug === p.slug);
  const prev = order[idx - 1];
  const next = order[idx + 1];

  const marks = [
    { id: "head", label: p.name },
    { id: "problem", label: "Problem" },
    { id: "built", label: "Built" },
    { id: "hard", label: "Hard part" },
    ...(p.demo ? [{ id: "demo", label: "Demo" }] : []),
    { id: "numbers", label: "Numbers" },
    { id: "wrong", label: "Got wrong" },
  ];

  return (
    <>
      <Caliper marks={marks} />

      <article className="shell">
        {/* ---- head ---- */}
        <header id="head" className="case-head">
          <div className="case-meta">
            <Link
              href="/work"
              className="mono"
              style={{ fontSize: 10.5, letterSpacing: "0.12em", color: "var(--text-3)", textDecoration: "none", textTransform: "uppercase" }}
            >
              ← index
            </Link>
            <span className="mono muted" style={{ fontSize: 10.5, letterSpacing: "0.12em" }}>{p.n}</span>
            <StatusStamp s={p.status} />
            <span className="mono muted" style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {p.years}
            </span>
            <span className="mono muted" style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {p.domain}
            </span>
            <span className="mono muted" style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {p.role}
            </span>
          </div>

          <Reveal>
            <h1 className="d1" style={{ fontSize: "clamp(42px, 6.6vw, 92px)", maxWidth: "14ch" }}>
              {p.name}
            </h1>
            <p className="h-ui mt20" style={{ color: "var(--amber)", fontFamily: "var(--mono)", fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 400 }}>
              {p.kicker}
            </p>
            <p className="prose lead mt28">{p.summary}</p>
            <div className="chips mt28">
              {p.stack.map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
            {p.links?.length ? (
              <div className="row wrap g10 mt28">
                {p.links.map((l) => (
                  <a key={l.href} className="btn" href={l.href} target="_blank" rel="noreferrer">
                    {l.label} ↗
                  </a>
                ))}
              </div>
            ) : null}
          </Reveal>
        </header>

        <div className="blocks">
          {/* ---- problem + constraint ---- */}
          <section id="problem" className="block">
            <div className="block-l">
              <span className="eyebrow">// the problem</span>
            </div>
            <div className="stack g34">
              <p className="prose" style={{ fontSize: 17 }}>{p.problem}</p>
              <div>
                <span className="eyebrow" style={{ marginBottom: 10 }}>// the constraint that shaped it</span>
                <p className="prose" style={{ fontSize: 17, borderLeft: "2px solid var(--amber)", paddingLeft: 20 }}>
                  {p.constraint}
                </p>
              </div>
            </div>
          </section>

          {/* ---- what I built ---- */}
          <section id="built" className="block">
            <div className="block-l">
              <span className="eyebrow">// what I built</span>
            </div>
            <div className="steps">
              {p.approach.map((a, i) => (
                <Reveal key={i} delay={i * 50} className="step">
                  <span className="step-n">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="step-h" style={{ display: "block" }}>{a.head}</span>
                    <span className="step-b" style={{ display: "block" }}>{a.body}</span>
                  </span>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ---- hard part ---- */}
          <section id="hard" className="block">
            <div className="block-l">
              <span className="eyebrow">// the hard part</span>
            </div>
            <Reveal className="hardpart">
              <h2 className="d3" style={{ maxWidth: "24ch" }}>{p.hardPart.head}</h2>
              <p className="prose mt20" style={{ fontSize: 16, color: "var(--text-2)" }}>
                {p.hardPart.body}
              </p>
            </Reveal>
          </section>

          {/* ---- demo ---- */}
          {p.demo ? (
            <section id="demo" className="block">
              <div className="block-l">
                <span className="eyebrow">// {DEMO_TITLE[p.demo]}</span>
              </div>
              <div className="stack g18">
                <p className="prose" style={{ fontSize: 15 }}>{DEMO_NOTE[p.demo]}</p>
                <DemoSlot id={p.demo} />
              </div>
            </section>
          ) : null}

          {/* ---- numbers ---- */}
          <section id="numbers" className="block">
            <div className="block-l">
              <span className="eyebrow">// the numbers</span>
              {p.scale?.length ? (
                <div className="stack g10 mt20">
                  {p.scale.map((s) => (
                    <span key={s.label} className="stack">
                      <span className="mono" style={{ fontSize: 13, color: "var(--text)" }}>{s.value}</span>
                      <span className="mono muted" style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        {s.label}
                      </span>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="slabs">
              {p.metrics.map((m, i) => (
                <Reveal key={i} delay={i * 40} className="slab">
                  <span className="slab-n">
                    {m.value}
                    {m.unit ? <u>{m.unit}</u> : null}
                  </span>
                  <span className="slab-l">{m.label}</span>
                  <div className="row g6 wrap"><ProvStamp p={m.provenance} /></div>
                  <span className="slab-src">{m.source}</span>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ---- what I got wrong ---- */}
          <section id="wrong" className="block">
            <div className="block-l">
              <span className="eyebrow">// what I got wrong</span>
            </div>
            <div className="stack g34">
              <div className="faults">
                {p.wrong.map((w, i) => (
                  <div key={i} className="fault">
                    <span className="fault-x">{String(i + 1).padStart(2, "0")}</span>
                    <span>{w}</span>
                  </div>
                ))}
              </div>
              <div>
                <span className="eyebrow" style={{ marginBottom: 10 }}>// what it left behind</span>
                <p className="prose" style={{ fontSize: 17, color: "var(--text)" }}>{p.learned}</p>
              </div>
            </div>
          </section>
        </div>

        {/* ---- prev / next ---- */}
        <nav
          className="row between wrap g18"
          style={{ borderTop: "1px solid var(--rule)", padding: "34px 0 60px" }}
        >
          {prev ? (
            <Link href={`/work/${prev.slug}`} style={{ textDecoration: "none" }}>
              <span className="mono muted" style={{ fontSize: 10.5, letterSpacing: "0.12em" }}>← NEWER</span>
              <div className="d3 mt8" style={{ fontSize: 24 }}>{prev.name}</div>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/work/${next.slug}`} style={{ textDecoration: "none", textAlign: "right" }}>
              <span className="mono muted" style={{ fontSize: 10.5, letterSpacing: "0.12em" }}>OLDER →</span>
              <div className="d3 mt8" style={{ fontSize: 24 }}>{next.name}</div>
            </Link>
          ) : <span />}
        </nav>
      </article>
    </>
  );
}
