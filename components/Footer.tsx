import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="shell">
        <div className="foot-grid">
          <div>
            <div className="foot-h">Contact</div>
            <div className="prose" style={{ fontSize: 15, maxWidth: "34ch" }}>
              <p>
                Building DebugAI from Hyderabad. Reachable at any hour, answers within a
                day.
              </p>
            </div>
            <div className="mt14">
              <a className="btn primary" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </div>
          </div>

          <div>
            <div className="foot-h">Elsewhere</div>
            <div className="foot-list">
              <a href={site.github} target="_blank" rel="noreferrer">
                GitHub / {site.githubHandle} ↗
              </a>
              <a href={site.linkedin} target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
              <a href={site.debugai} target="_blank" rel="noreferrer">
                debugai.io ↗
              </a>
            </div>
          </div>

          <div>
            <div className="foot-h">This site</div>
            <div className="foot-list">
              <Link href="/work">All fourteen projects</Link>
              <Link href="/thinking">How I decide things</Link>
              <Link href="/resume">Resume and CV</Link>
              <Link href="/about">About</Link>
            </div>
          </div>
        </div>

        <div
          className="row between wrap g14 mt40"
          style={{ borderTop: "1px solid var(--rule)", paddingTop: 20 }}
        >
          <span className="mono muted" style={{ fontSize: 10.5, letterSpacing: "0.1em" }}>
            {site.location.toUpperCase()} · BUILT WITH NEXT.JS · NO ANALYTICS, NO COOKIES
          </span>
          <span className="mono muted" style={{ fontSize: 10.5, letterSpacing: "0.1em" }}>
            EVERY NUMBER HERE CARRIES ITS SOURCE
          </span>
        </div>
      </div>
    </footer>
  );
}
