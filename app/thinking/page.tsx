import type { Metadata } from "next";
import Link from "next/link";
import Caliper from "@/components/Caliper";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Method",
  description:
    "Six working rules, each one learned by getting it wrong first, with the project that taught it and the cost attached.",
};

const RULES = [
  {
    id: "baseline",
    n: "01",
    rule: "Build the ruler before the model.",
    body: [
      "A model is worth the difference between its score and the arithmetic baseline. If nobody built the baseline, that difference is unknown and the model's number is unreadable.",
      "The eyeglass fit model scored 85 percent. That sounds like a machine learning result until you know that comparing three facial ratios with plain arithmetic already scored 70. The learned layer was worth 15 points, which is a real contribution and a much smaller story than 85.",
      "MatchLedger is the same argument at a different scale. The first engine called an embedding API for every unresolved row. The engine that replaced it does a hash join, a date tolerance pass, and a fuzzy pass on the fragment that survives, and it makes zero API calls. Most financial data follows patterns that arithmetic handles. The model was never earning its cost.",
    ],
    from: "Fit Percentage, MatchLedger AI",
  },
  {
    id: "blocking",
    n: "02",
    rule: "Block before you compare.",
    body: [
      "Most scale problems are a cross product that nobody blocked. 100,000 ledger rows against 98,000 bank rows is 9.8 billion comparisons, and no language, machine or budget makes that finish.",
      "Block by amount bucket and date window first and only plausible pairs are ever compared. The same run takes 4.25 seconds. The difference between intractable and instant was a data structure, not hardware.",
      "This generalises further than it looks. Retrieval before generation is blocking. A stack trace forcing specific files into context before the embeddings run is blocking. A gyroscope discarding corrupted samples before signal processing is blocking. In every case you are refusing to spend the expensive operation on candidates that were never going to survive it.",
    ],
    from: "MatchLedger AI, DebugAI",
  },
  {
    id: "provenance",
    n: "03",
    rule: "Every claim carries how it was obtained.",
    body: [
      "Measured, derived, estimated, paper. Four words, applied without exception, and they do most of the work of being trustworthy.",
      "BeyondVision is built on this. A phone camera physically cannot see 8 micrometres, so every app claiming thermal vision is applying a colour map to brightness. The honest version tags each pixel MEASURED, RECONSTRUCTED or SIMULATED and refuses to export without the tag. It is more work and a worse screenshot.",
      "DebugAI does the same thing to itself. A fix that was mechanically verified, a fix that was verified and failed, and a fix nobody checked are three different states, and the third one displays as unchecked. It is the least flattering label on the screen and it is the only reason the other two mean anything.",
      "The counterexample is on the record. Published copy for DebugAI once said 750 installs while the real count was 193, because a downloads figure and an installs figure had been summed. Nobody lied. Two numbers were treated as one kind of number.",
    ],
    from: "BeyondVision, DebugAI, OptiXon",
  },
  {
    id: "pause",
    n: "04",
    rule: "A pause with a reason is information. A pause without one is a story you tell later.",
    body: [
      "Three months went into a cold email agent. It scraped, generated, scheduled, delivered and logged. Every operational metric was green. Then I read twenty sent emails in a row and they were the same email. It was a bulk sender with a language model attached.",
      "I stopped, wrote down that nothing in the system tested output quality, and went looking for a problem that was boring and real. That search produced MatchLedger.",
      "MatchLedger is paused too, and for a reason that no amount of engineering fixes: people do not hand confidential financial data to an individual. They hand it to a registered company. The engine is finished and waiting on a legal entity, which is the correct order to do those two things in.",
      "OptiXon is paused at the paper phase, before any prototype, and every performance figure on that page is labelled ESTIMATED because of it.",
    ],
    from: "The agent detour, MatchLedger AI, OptiXon",
  },
  {
    id: "failure",
    n: "05",
    rule: "Design the failure before the feature.",
    body: [
      "A battery protection circuit with a wrong pin map behaves perfectly. It charges, discharges, powers the device, passes every functional test, and provides no protection at all. On a lithium cell sitting against somebody's head. That is bug 37 in the OptiXon log, and it was found by verifying the same mapping three independent ways rather than once.",
      "PPG under motion is the same shape of problem. The signal is still there, still smooth, still plottable, and completely wrong. Averaging it produces a confident heart rate that nobody has. The gyroscope exists to mark those samples untrusted so the system discards them instead of believing them.",
      "The pattern is that the dangerous failures are the quiet ones. A crash is a gift. A system that keeps answering while being wrong is what actually costs you.",
    ],
    from: "OptiXon, DebugAI, the agent detour",
  },
  {
    id: "constraint",
    n: "06",
    rule: "The constraint is the design. Find it before you start.",
    body: [
      "A 138 by 10.5 millimetre temple arm produced the entire OptiXon parts list. Limited API credits produced the MatchLedger architecture. A GPL licence on the obvious tracing library is why Inkline has a boundary follower and a cubic fitter written from scratch, because wrapping the library would have made every font produced with it a legal problem for whoever tried to sell one.",
      "Thirty one percent internet penetration in rural Punjab is why Telecare has an IVR path over a button phone. Without that second channel the project solves the problem for people who already had options.",
      "None of these constraints were obstacles to route around. Each one is the reason the resulting system has a shape at all.",
    ],
    from: "OptiXon, MatchLedger AI, Inkline, Telecare Nabha",
  },
];

const MARKS = [
  { id: "top", label: "Top" },
  ...RULES.map((r) => ({ id: r.id, label: r.rule.split(" ").slice(0, 3).join(" ") })),
  { id: "close", label: "Close" },
];

export default function Thinking() {
  return (
    <>
      <Caliper marks={MARKS} />
      <section id="top" className="shell" style={{ paddingTop: 68 }}>
        <Reveal>
          <span className="eyebrow">// method</span>
          <h1 className="d1 mt20" style={{ maxWidth: "13ch", fontSize: "clamp(42px, 7vw, 96px)" }}>
            Six rules. Each one <em>cost</em> me something.
          </h1>
          <p className="prose lead mt40">
            None of these came from a book. Every one is a mistake I made, noticed late, and
            wrote down so it would only be expensive once. The projects that taught each rule are
            named underneath it, and you can go read what happened.
          </p>
        </Reveal>
      </section>

      <div className="shell">
        <div className="blocks mt56">
          {RULES.map((r, i) => (
            <section key={r.id} id={r.id} className="block">
              <div className="block-l">
                <span className="mono muted" style={{ fontSize: 11, letterSpacing: "0.12em" }}>{r.n}</span>
                <div className="mt14 mono" style={{ fontSize: 10.5, letterSpacing: "0.1em", color: "var(--amber)", textTransform: "uppercase", lineHeight: 1.7 }}>
                  {r.from}
                </div>
              </div>
              <Reveal delay={i * 30}>
                <h2 className="d3" style={{ maxWidth: "22ch" }}>{r.rule}</h2>
                <div className="prose mt20" style={{ fontSize: 16.5 }}>
                  {r.body.map((para, k) => (
                    <p key={k}>{para}</p>
                  ))}
                </div>
              </Reveal>
            </section>
          ))}
        </div>

        <section id="close" className="section">
          <Reveal>
            <div className="panel" style={{ padding: "40px", background: "var(--panel-2)" }}>
              <span className="eyebrow">// the short version</span>
              <p className="d3 mt20" style={{ maxWidth: "26ch", fontFamily: "var(--display)" }}>
                I do not build AI projects. I build solutions to real problems that <em>happen</em> to use AI.
              </p>
              <p className="prose mt20" style={{ fontSize: 15 }}>
                That line has been at the bottom of my CV since 2025 and it is the only sentence
                on this site I have not rewritten.
              </p>
              <div className="row wrap g10 mt28">
                <Link className="btn primary" href="/work">See the fourteen →</Link>
                <Link className="btn" href="/resume">Resume and CV</Link>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </>
  );
}
