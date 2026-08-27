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
      "My first model scored 85 percent and I was pleased with myself for about a week. Then I wrote the dumb version, the one that just compares three facial ratios with arithmetic and a tolerance band, mostly as a sanity check. It scored 70.",
      "So the learned layer was worth fifteen points. That is a real contribution. It is also a completely different sentence to say out loud than 85 percent, and I had been saying the wrong one.",
      "The same thing caught me again at a bigger scale. MatchLedger v1 called an embedding API on every unresolved row, which felt sophisticated and cost money per row. The engine that replaced it is a hash join, then a date tolerance pass, then a fuzzy pass on whatever fragment survives. Zero API calls. It turns out most bank transactions are not ambiguous, and the model had been getting paid to confirm the obvious.",
    ],
    from: "Fit Percentage, MatchLedger AI",
  },
  {
    id: "blocking",
    n: "02",
    rule: "Block before you compare.",
    body: [
      "100,000 ledger rows against 98,000 bank rows is 9.8 billion comparisons. I let that run once. It was never going to finish, on any machine, in any language, and no amount of profiling was going to save it, because the problem was not that the comparison was slow.",
      "Bucket the rows by amount and by date window first, so that only pairs that could plausibly match ever get compared at all. Same data, same laptop, 4.25 seconds.",
      "I keep finding this shape elsewhere. Retrieval before generation is blocking. Forcing the files a stack trace names into context before the embedding search runs is blocking. A gyroscope throwing away corrupted samples before the signal processing touches them is blocking. Every time, the trick is refusing to spend the expensive operation on candidates that were never going to survive it.",
    ],
    from: "MatchLedger AI, DebugAI",
  },
  {
    id: "provenance",
    n: "03",
    rule: "Every claim carries how it was obtained.",
    body: [
      "Measured, derived, estimated, paper. Four words, no exceptions, and between them they do most of the work of being worth believing.",
      "I did not arrive at that by being principled. Published copy for DebugAI said 750 installs. The real install count was 193. Nobody lied to anybody. I had added a downloads figure to an installs figure, because they were both numbers on the same dashboard and I was in a hurry, and then I put the total on a website where people could read it.",
      "So now BeyondVision tags every pixel. A phone camera physically cannot see 8 micrometres, which means every app on the store promising thermal vision is applying a colour map to brightness and hoping you don't ask. The honest build labels each pixel MEASURED, RECONSTRUCTED or SIMULATED, and refuses to export anything without the label. More work, worse screenshot.",
      "DebugAI does it to itself as well. A fix that was mechanically checked and passed, a fix that was checked and failed, and a fix nobody ever checked are three different claims. The third one shows up on screen as unchecked. It is the least flattering thing in the interface. It is also the only reason anyone should believe the other two.",
    ],
    from: "BeyondVision, DebugAI, OptiXon",
  },
  {
    id: "pause",
    n: "04",
    rule: "A pause with a reason is information. A pause without one is a story you tell later.",
    body: [
      "March to May 2025 went into a cold email agent. It scraped recipients, generated per person, scheduled, delivered through two providers, handled bounces and logged replies. There was a dashboard. Everything on it was green.",
      "In May I opened the sent folder and read twenty of them back to back, which I had somehow never done. Same email. Different name at the top, the same three paragraphs underneath, because the instruction I had written dominated whatever the per recipient signal was supposed to contribute. It was a bulk sender with a model bolted on.",
      "What actually went wrong is smaller and worse than that. Every check I had built measured whether the thing ran. Not one measured whether the output was any good. Three months to notice.",
      "MatchLedger is paused for a reason I cannot engineer around at all. People do not give confidential financial records to an individual with a GitHub account. They give them to a registered company. The engine is done and sitting there waiting on a legal entity, and I would rather say that plainly than let the repository look abandoned.",
      "OptiXon stopped at the paper phase, before any prototype existed, and that is why every performance number on its page says ESTIMATED.",
    ],
    from: "The agent detour, MatchLedger AI, OptiXon",
  },
  {
    id: "failure",
    n: "05",
    rule: "Design the failure before the feature.",
    body: [
      "A battery protection circuit with a wrong pin map behaves beautifully. It charges. It discharges. It powers the board, it passes every functional test you can write, and it protects nothing whatsoever. On a lithium cell that is going to sit against somebody's head all day.",
      "That is entry 37 in the OptiXon bug log, and I did not catch it by being careful. I caught it because I had started checking the same mapping three separate ways, against the datasheet, against the reference topology, and in ngspice, and the third one disagreed with the other two. Visual review had passed it. It looked fine.",
      "PPG under motion has the same shape. The waveform is still there, still smooth, still perfectly plottable, and completely wrong, so averaging it hands you a confident heart rate belonging to nobody. That is the entire reason the gyroscope is on the board. Not to add a feature. To mark those samples untrusted so the system throws them out instead of believing them.",
      "I would rather have a crash than either of those. A crash tells you.",
    ],
    from: "OptiXon, DebugAI, the agent detour",
  },
  {
    id: "constraint",
    n: "06",
    rule: "The constraint is the design. Find it before you start.",
    body: [
      "A temple arm is 138mm long and about 10.5mm wide before it tapers. That single measurement chose the microcontroller, the radio, the battery, the protection circuit and the sensor, in that order, and I did not really get a vote.",
      "Being short on API credits is what produced the MatchLedger architecture, and the architecture turned out better than the funded version would have been. A GPL licence on the obvious tracing library is why Inkline has a boundary follower and a cubic fitter I wrote myself. Wrapping Potrace would have been a day. It also would have made every font anyone produced with the tool a legal problem for them later, which is a strange gift to hand a stranger.",
      "Thirty one percent of rural Punjab households have internet. That number is the only reason Telecare has an IVR path over a button phone, and without that second channel the whole thing solves the problem exclusively for people who already had options.",
      "None of those were obstacles I worked around. Each one is why the finished thing has a shape at all.",
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
            None of these came from a book. Each one is something I got wrong, noticed later than
            I should have, and wrote down so it would only be expensive the once. The project that
            taught each rule is named beside it if you want to go and read what actually happened.
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
                That line has been sitting at the bottom of my CV since 2025. It is the only
                sentence on this site I have never gone back and rewritten.
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
