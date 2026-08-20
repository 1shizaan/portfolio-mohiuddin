"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  ...rest
}: {
  children: React.ReactNode;
  delay?: number;
  as?: React.ElementType;
  className?: string;
  [k: string]: unknown;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const t = window.setTimeout(() => setOn(true), delay);
            io.disconnect();
            return () => window.clearTimeout(t);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <Tag
      ref={ref as never}
      className={`rv ${className}`}
      data-in={on ? "1" : "0"}
      {...rest}
    >
      {children}
    </Tag>
  );
}
