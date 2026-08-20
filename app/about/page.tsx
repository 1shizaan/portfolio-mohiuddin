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
              I am Mohammed Mohi Uddin, in my final year of a computer science degree in
              Hyderabad. I started building in 2024 with a computer vision model that scored
              faces against eyeglass frames, and I have not stopped since. Fourteen projects
              later the pattern is clearer to me than it was at the time: I go looking for the
              constraint, and then I let it decide the architecture.
            </p>
            <p>
              The most useful thing I do is not technical. When I designed a health sensing
              circuit that would sit against somebody&apos;s head, I did not trust myself with
              it. I spent days at IIT Hyderabad asking M.Tech students to tear the design apart,
              got a working professional to review the microcontroller architecture, and sent
              fifty pages of feasibility analysis to a faculty researcher at the University of
              Hyderabad. Three of those conversations found errors. One of them was a battery
              protection bug that would have passed every functional test and protected nothing.
            </p>
            <p>
              I also stop things. Three months went into a cold email agent before I read twenty
              of its emails in a row and realised it was a bulk sender with a language model
              attached. A reconciliation engine that works is paused because people do not hand
              their financial data to an individual, and no amount of engineering changes that.
              Both of those are on this site with the reason written down, because a portfolio
              that only lists wins is a sales page.
            </p>
            <p>
              What I want next is a lab or a team where the problems are harder than the ones I
              can find alone, and where somebody will tell me when I am wrong faster than six
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
                <li>OptiXon feasibility validated by Prof. Nagender Kumar Suryadevara, University of Hyderabad.</li>
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
