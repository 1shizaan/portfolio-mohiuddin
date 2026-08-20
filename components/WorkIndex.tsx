"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { StatusStamp } from "@/components/Stamp";
import type { Project } from "@/lib/types";

const DOMAINS: { id: string; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "systems", label: "Systems" },
  { id: "ml", label: "Machine learning" },
  { id: "vision", label: "Vision" },
  { id: "hardware", label: "Hardware" },
  { id: "product", label: "Product" },
  { id: "security", label: "Security" },
  { id: "graphics", label: "Graphics" },
  { id: "media", label: "Media" },
  { id: "research", label: "Research" },
  { id: "tooling", label: "Tooling" },
];

export default function WorkIndex({ projects }: { projects: Project[] }) {
  const [domain, setDomain] = useState("all");
  const [order, setOrder] = useState<"time" | "az">("time");

  const present = useMemo(() => {
    const set = new Set(projects.map((p) => p.domain as string));
    return DOMAINS.filter((d) => d.id === "all" || set.has(d.id));
  }, [projects]);

  const rows = useMemo(() => {
    const filtered =
      domain === "all" ? projects : projects.filter((p) => p.domain === domain);
    return [...filtered].sort((a, b) =>
      order === "az" ? a.name.localeCompare(b.name) : b.sortKey - a.sortKey
    );
  }, [projects, domain, order]);

  return (
    <>
      <div className="row wrap g8 center" style={{ marginBottom: 26 }}>
        {present.map((d) => (
          <button
            key={d.id}
            className="chip"
            onClick={() => setDomain(d.id)}
            style={{
              cursor: "pointer",
              color: domain === d.id ? "#0A0B0D" : "var(--text-2)",
              background: domain === d.id ? "var(--amber)" : "var(--panel)",
              borderColor: domain === d.id ? "var(--amber)" : "var(--rule-2)",
              padding: "6px 10px",
              fontSize: 11,
            }}
          >
            {d.label}
          </button>
        ))}
        <span className="fill" />
        <button
          className="chip"
          onClick={() => setOrder(order === "time" ? "az" : "time")}
          style={{ cursor: "pointer", padding: "6px 10px", fontSize: 11 }}
        >
          {order === "time" ? "newest first" : "a to z"} ⇅
        </button>
      </div>

      <div className="idx">
        {rows.map((p) => (
          <Link key={p.slug} href={`/work/${p.slug}`} className="idx-row">
            <span className="idx-n">{p.n}</span>
            <span>
              <span className="idx-name">{p.name}</span>
              <span className="idx-kick">{p.kicker}</span>
            </span>
            <span className="idx-sum">{p.summary}</span>
            <span className="idx-meta">{p.years}</span>
            <span className="end row"><StatusStamp s={p.status} /></span>
          </Link>
        ))}
      </div>

      <p className="mono muted" style={{ fontSize: 11, marginTop: 20 }}>
        {rows.length} of {projects.length} shown
      </p>
    </>
  );
}
