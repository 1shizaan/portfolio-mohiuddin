import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Mohammed Mohi Uddin. Final year computer science student in Hyderabad, building systems under constraint since 2024.",
};

export default function About() {
  return (
    <section className="shell" style={{ paddingTop: 68, paddingBottom: 80 }}>
      <Reveal>
        <span className="eyebrow">// about</span>
        <h1 className="d1 mt20" style={{ maxWidth: "13ch", fontSize: "clamp(42px, 7vw, 92px)" }}>
          I go and <em>ask</em> people who know more.
        </h1>
      </Reveal>

      <div className="split about mt56">
        <Reveal delay={60}>
          <div className="prose lead">
            <p>
              Final year, computer science, Hyderabad. I started in 2024 with a model that
              scored how well a pair of glasses fit your face from a single photo, and the
              first version reported millimetres. You can&apos;t get millimetres out of an
              uncalibrated photo. Took me longer than it should have to see that, and once I
              did I threw the units out and worked in ratios instead.
            </p>
            <p>
              That is roughly how the last three years have gone. Fourteen projects now, and
              the thing they share is that the constraint turned up before the idea did, and I
              let it pick the architecture.
            </p>
            <p>
              The most useful thing I do isn&apos;t technical. OptiXon is a health sensor that
              lives inside the arm of a pair of glasses, pressed against your head, with a
              lithium cell in it. I did not trust myself with that. So I took it to M.Tech
              students at IIT Hyderabad and sat there while they pulled it apart, and I got a
              working hardware professional to go over the microcontroller side. Both said it
              could be built. Both had changes. I also sent about fifty pages of feasibility
              work to a professor at the University of Hyderabad and never heard back, which is
              the ordinary outcome and not a reason to skip the step.
            </p>
            <p>
              The bug that actually mattered I found myself, weeks later, and only because by
              then I was checking things three ways instead of once. The battery protection
              circuit had a wrong pin map. It would have charged, discharged, powered the whole
              device and passed every test I could think of, while protecting nothing at all.
              Number 37 in the log.
            </p>
            <p>
              I stop things too. In May 2025 I opened the sent folder of an outreach agent I had
              been building since March and read twenty emails in a row. Same email. Different
              name at the top, identical paragraphs underneath. Every dashboard in that system
              was green, because I had instrumented delivery and never once instrumented whether
              the output was any good. I shut it down that week and went looking for a problem
              that was boring and real.
            </p>
            <p>
              MatchLedger is paused for a duller reason. It works. It reconciles a hundred
              thousand rows against ninety eight thousand in four and a quarter seconds and
              calls no API at all. And nobody is going to hand their bank statements to a
              student with a GitHub account. That needs a registered company, not more code.
              Both of those are on this site with the reason written next to them.
            </p>
            <p>
              What I want next is a team where the problems are harder than the ones I can find
              on my own, and where somebody tells me I&apos;m wrong in a week instead of six
              months.
            </p>
          </div>

          <div className="row wrap g10 mt40">
            <a className="btn primary" href={`mailto:${site.email}`}>Email me</a>
            <Link className="btn" href="/resume">Resume and CV</Link>
            <a className="btn" href={site.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="stack g34">
            <div>
              <span className="eyebrow">// education</span>
              <div className="mt14">
                <div style={{ fontSize: 16, fontWeight: 500 }}>
                  B.Tech, Computer Science Engineering
                </div>
                <div className="cv-sub">Data science specialisation</div>
                <div className="cv-sub">Swami Vivekananda Institute of Technology, Hyderabad</div>
                <div className="mono muted mt8" style={{ fontSize: 11, letterSpacing: "0.08em" }}>
                  AUG 2023 – AUG 2027 · CGPA 7.85 / 10
                </div>
              </div>
            </div>

            <div>
              <span className="eyebrow">// recognition</span>
              <ul className="cv-ul mt14">
                <li>Second place, research paper competition, Techno Udbhav 2025, for OptiXon.</li>
                <li>Smart India Hackathon 2025, team Glitch Guardians, rural telemedicine.</li>
                <li>OptiXon design reviewed with M.Tech students at IIT Hyderabad and a working hardware professional.</li>
                <li>Generative AI with ML, Ethical Hacking, and Data Science certificates, IIT Hyderabad.</li>
              </ul>
            </div>

            <div>
              <span className="eyebrow">// currently</span>
              <ul className="cv-ul mt14">
                <li>Running DebugAI, which real people pay for and occasionally break.</li>
                <li>Reading toward uncertainty quantification and probabilistic ML.</li>
                <li>Looking for a summer 2027 research or engineering internship.</li>
              </ul>
            </div>

            <div>
              <span className="eyebrow">// languages</span>
              <p className="prose mt14" style={{ fontSize: 14.5 }}>
                English, fluent. Hindi, native. Python, first. TypeScript, second. C when the
                target has 64 kilobytes of RAM and no operating system.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
