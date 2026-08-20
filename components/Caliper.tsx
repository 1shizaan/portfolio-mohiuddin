"use client";

import { useEffect, useState } from "react";

export type Mark = { id: string; label: string };

export default function Caliper({ marks }: { marks: Mark[] }) {
  const [active, setActive] = useState(marks[0]?.id ?? "");

  useEffect(() => {
    const els = marks
      .map((m) => document.getElementById(m.id))
      .filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const onScroll = () => {
      const probe = window.innerHeight * 0.34;
      let current = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= probe) current = el.id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [marks]);

  return (
    <aside className="caliper" aria-hidden="true">
      <div className="caliper-inner">
        {marks.map((m) => (
          <a
            key={m.id}
            href={`#${m.id}`}
            className="cal-row"
            data-on={active === m.id ? "1" : "0"}
          >
            <span className="cal-tick" />
            <span className="cal-label">{m.label}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}
