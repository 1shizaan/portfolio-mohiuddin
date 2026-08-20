import type { Provenance, Status } from "@/lib/types";

export function ProvStamp({ p }: { p: Provenance }) {
  return (
    <span className="stamp" data-p={p} title={provTitle(p)}>
      {p}
    </span>
  );
}

export function StatusStamp({ s }: { s: Status }) {
  return (
    <span className="stamp" data-s={s}>
      {s === "LIVE" ? <span className="dot-live" /> : null}
      {s}
    </span>
  );
}

export function provTitle(p: Provenance) {
  switch (p) {
    case "MEASURED":
      return "A number that came out of running the thing, and was written down.";
    case "DERIVED":
      return "Computed from the repository, a public registry, or a simulator.";
    case "ESTIMATED":
      return "A design calculation. No hardware has confirmed it.";
    case "PAPER":
      return "Exists in documents only. Nothing was built.";
    case "REPORTED":
      return "Someone else's number, quoted with its source.";
  }
}
