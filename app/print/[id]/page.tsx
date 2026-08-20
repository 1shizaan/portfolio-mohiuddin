import { notFound } from "next/navigation";
import { DOCS, docById, identity } from "@/lib/resume";
import type { CVSection } from "@/lib/resume";

export const dynamicParams = false;

export function generateStaticParams() {
  return DOCS.map((d) => ({ id: d.id }));
}

function SectionBlock({ s }: { s: CVSection }) {
  return (
    <section className="p-sec">
      <div className="p-sec-h">{s.title}</div>

      {s.kind === "text" ? <p className="p-text">{s.text}</p> : null}

      {s.kind === "list" ? (
        <ul className="p-ul">
          {s.list.map((l, i) => <li key={i}>{l}</li>)}
        </ul>
      ) : null}

      {s.kind === "skills"
        ? s.skills.map((g) => (
            <div key={g.group} className="p-skill">
              <div className="p-skill-g">{g.group}</div>
              <div className="p-skill-i">{g.items}</div>
            </div>
          ))
        : null}

      {s.kind === "entries"
        ? s.entries.map((e, i) => (
            <div key={i} className="p-entry">
              <div className="p-when">{e.when}</div>
              <div>
                <div className="p-title">
                  {e.title}
                  {e.tag ? <span className="p-tag">{e.tag}</span> : null}
                </div>
                {e.sub ? <div className="p-sub">{e.sub}</div> : null}
                <ul className="p-ul">
                  {e.bullets.map((b, k) => <li key={k}>{b}</li>)}
                </ul>
                {e.tech ? <div className="p-tech">{e.tech}</div> : null}
              </div>
            </div>
          ))
        : null}
    </section>
  );
}

export default async function PrintDoc({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = docById(id);
  if (!doc) notFound();

  return (
    <div className="print-preview">
      <div className="shell" style={{ maxWidth: 880 }}>
        <article className="print-doc">
          <h1 className="p-name">{identity.name}</h1>
          <div className="p-contact">
            {identity.location} &nbsp;·&nbsp; {identity.email} &nbsp;·&nbsp; {identity.phone}
            &nbsp;·&nbsp; {identity.linkedin} &nbsp;·&nbsp; {identity.github}
          </div>
          <div className="p-role">{doc.headline}</div>
          <p className="p-summary">{doc.summary}</p>
          <hr className="p-hr" />

          {doc.sections.map((s, i) => <SectionBlock key={i} s={s} />)}

          {doc.kind === "CV" ? (
            <div className="p-foot">
              {doc.kind} · {doc.track} track · Full case studies with sources at {identity.site}
            </div>
          ) : null}
        </article>
      </div>
    </div>
  );
}
