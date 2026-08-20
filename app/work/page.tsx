import type { Metadata } from "next";
import WorkIndex from "@/components/WorkIndex";
import Reveal from "@/components/Reveal";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Fourteen projects across AI systems, computer vision, embedded hardware, security tooling and developer products. Status and provenance on every one.",
};

export default function WorkPage() {
  const live = projects.filter((p) => p.status === "LIVE" || p.status === "SHIPPED").length;
  const stopped = projects.filter((p) => p.status === "RETIRED" || p.status === "PAUSED").length;
  const paper = projects.filter((p) => p.status === "PAPER").length;

  return (
    <section className="shell" style={{ paddingTop: 68, paddingBottom: 80 }}>
      <Reveal>
        <span className="eyebrow">// index</span>
        <h1 className="d1 mt20" style={{ maxWidth: "12ch", fontSize: "clamp(44px, 7vw, 96px)" }}>
          Everything, <em>including</em> the dead ones.
        </h1>
      </Reveal>

      <Reveal delay={80}>
        <div className="split ends mt40">
          <p className="prose">
            Sorted newest first. Filter by domain if you are looking for a specific kind of
            problem. Each case study is written the same way: the problem, the constraint that
            shaped it, what was actually built, the part that was genuinely hard, the numbers with
            their sources, and what I got wrong.
          </p>
          <div className="row wrap g24 end" style={{ justifyContent: "flex-start" }}>
            <span className="stack">
              <span className="num" style={{ fontSize: 30 }}>{live}</span>
              <span className="mono muted" style={{ fontSize: 10.5, letterSpacing: "0.1em" }}>SHIPPED OR LIVE</span>
            </span>
            <span className="stack">
              <span className="num" style={{ fontSize: 30 }}>{stopped}</span>
              <span className="mono muted" style={{ fontSize: 10.5, letterSpacing: "0.1em" }}>PAUSED OR RETIRED</span>
            </span>
            <span className="stack">
              <span className="num" style={{ fontSize: 30 }}>{paper}</span>
              <span className="mono muted" style={{ fontSize: 10.5, letterSpacing: "0.1em" }}>PAPER ONLY</span>
            </span>
          </div>
        </div>
      </Reveal>

      <div className="mt56">
        <WorkIndex projects={projects} />
      </div>
    </section>
  );
}
