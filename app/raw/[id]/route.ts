import { DOCS, docById, identity } from "@/lib/resume";

export const dynamic = "force-static";

export function generateStaticParams() {
  return DOCS.map((d) => ({ id: d.id }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const doc = docById(id);
  if (!doc) return new Response("Not found", { status: 404 });

  const L: string[] = [];
  L.push(`# ${identity.name}`);
  L.push("");
  L.push(
    `${identity.location} · ${identity.email} · ${identity.phone} · ${identity.linkedin} · ${identity.github}`
  );
  L.push("");
  L.push(`**${doc.headline}**`);
  L.push("");
  L.push(doc.summary);
  L.push("");

  for (const s of doc.sections) {
    L.push(`## ${s.title}`);
    L.push("");
    if (s.kind === "text") {
      L.push(s.text);
      L.push("");
    } else if (s.kind === "list") {
      for (const item of s.list) L.push(`- ${item}`);
      L.push("");
    } else if (s.kind === "skills") {
      for (const g of s.skills) L.push(`- **${g.group}** · ${g.items}`);
      L.push("");
    } else {
      for (const e of s.entries) {
        L.push(`### ${e.title}${e.tag ? ` (${e.tag})` : ""}`);
        L.push("");
        L.push(`*${e.when}${e.sub ? ` · ${e.sub}` : ""}*`);
        L.push("");
        for (const b of e.bullets) L.push(`- ${b}`);
        if (e.tech) {
          L.push("");
          L.push(`\`${e.tech}\``);
        }
        L.push("");
      }
    }
  }

  L.push("---");
  L.push("");
  L.push(
    `${doc.kind}, ${doc.track} track. Full case studies with sources at ${identity.site}.`
  );
  L.push("");

  return new Response(L.join("\n"), {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
