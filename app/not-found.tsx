import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell" style={{ paddingTop: 120, paddingBottom: 140 }}>
      <span className="eyebrow">// 404</span>
      <h1 className="d1 mt20" style={{ maxWidth: "14ch", fontSize: "clamp(40px, 6vw, 80px)" }}>
        Nothing here. Not even a <em>stack trace.</em>
      </h1>
      <p className="prose mt28">
        The page you asked for does not exist, which at least is a clear failure rather than a
        confident wrong answer.
      </p>
      <div className="row wrap g10 mt28">
        <Link className="btn primary" href="/">Back to the index</Link>
        <Link className="btn" href="/work">See the work</Link>
      </div>
    </section>
  );
}
