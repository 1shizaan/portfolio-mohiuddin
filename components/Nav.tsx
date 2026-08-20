"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/site";

export default function Nav() {
  const path = usePathname();
  return (
    <header className="nav">
      <div className="nav-in">
        <Link href="/" className="brand" aria-label={`${site.short}, home`}>
          <span className="brand-dot" />
          <span className="brand-txt">
            Mohi Uddin <span>/ bench</span>
          </span>
        </Link>
        <nav className="nav-links">
          {nav.map((n) => {
            const on = n.href === "/" ? path === "/" : path.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className="nav-link"
                data-on={on ? "1" : "0"}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
