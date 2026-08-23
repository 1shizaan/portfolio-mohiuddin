import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DOCS, docById, identity } from "@/lib/resume";
import type { CVSection } from "@/lib/resume";

export const dynamicParams = false;

/* Chromium writes the document title into the PDF's title field, which is what
   a reader sees in their viewer tab and what some parsers read first. Without
   this it inherits the site's tagline, which is not what this file is. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const doc = docById(id);
  if (!doc) return { title: { absolute: identity.name } };
  const track = doc.track === "research" ? "Research" : "Engineering";
  return {
    title: { absolute: `${identity.name} · ${doc.kind} · ${track}` },
    description: doc.headline,
    authors: [{ name: identity.name }],
    robots: { index: false, follow: false },
  };
}

export function generateStaticParams() {
  return DOCS.map((d) => ({ id: d.id }));
}

/* Bullets may carry **bold** around the thing a reader should catch when
   skimming. Kept to a marker rather than markup so the same string still
   renders as plain text in the markdown twin. */
function rich(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/* "MatchLedger AI · bank reconciliation engine" sets the name in bold and the
   description after it in normal weight, the way a printed resume does. */
function splitTitle(title: string) {
  const i = title.indexOf(" · ");
  if (i === -1) return { head: title, tail: "" };
  return { head: title.slice(0, i), tail: title.slice(i + 3) };
}

function SectionBlock({ s }: { s: CVSection }) {
  return (
    <section className="p-sec">
      <div className="p-sec-h">{s.title}</div>

      {s.kind === "text" ? <p className="p-text">{rich(s.text)}</p> : null}

      {s.kind === "list" ? (
        <ul className="p-ul">
          {s.list.map((l, i) => <li key={i}>{rich(l)}</li>)}
        </ul>
      ) : null}

      {s.kind === "skills"
        ? s.skills.map((g) => (
            <div key={g.group} className="p-skill">
              <span className="p-skill-g">{g.group}: </span>
              <span className="p-skill-i">{rich(g.items)}</span>
            </div>
          ))
        : null}

      {s.kind === "entries"
        ? s.entries.map((e, i) => {
            const { head, tail } = splitTitle(e.title);
            return (
              <div key={i} className="p-entry">
                <div className="p-entry-head">
                  <span className="p-title">
                    <strong>{head}</strong>
                    {tail ? <span className="p-title-2"> · {tail}</span> : null}
                    {e.tag ? <span className="p-tag">{e.tag}</span> : null}
                  </span>
                  <span className="p-when">{e.when}</span>
                </div>
                {e.sub ? <div className="p-sub">{e.sub}</div> : null}
                <ul className="p-ul">
                  {e.bullets.map((b, k) => <li key={k}>{rich(b)}</li>)}
                </ul>
                {e.tech ? <div className="p-tech">{e.tech}</div> : null}
              </div>
            );
          })
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
          {/* real anchors, so the exported PDF carries clickable link annotations */}
          <div className="p-contact">
            {identity.location}<span className="sep">|</span>
            <a href={`mailto:${identity.email}`}>{identity.email}</a><span className="sep">|</span>
            <a href={`tel:${identity.phone.replace(/\s/g, "")}`}>{identity.phone}</a>
          </div>
          <div className="p-contact p-contact-2">
            <a href={`https://${identity.linkedin}`}>{identity.linkedin}</a><span className="sep">|</span>
            <a href={`https://${identity.github}`}>{identity.github}</a>
          </div>
          <div className="p-role">{doc.headline}</div>
          <p className="p-summary">{rich(doc.summary)}</p>
          <hr className="p-hr" />

          {doc.sections.map((s, i) => <SectionBlock key={i} s={s} />)}

          {doc.kind === "CV" ? (
            <div className="p-foot">
              {doc.kind} · {doc.track} track · Sources and code at{" "}
              {identity.siteIsLive ? identity.site : identity.github}
            </div>
          ) : null}
        </article>
      </div>
    </div>
  );
}
