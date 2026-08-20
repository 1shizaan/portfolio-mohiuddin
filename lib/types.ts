export type Provenance =
  | "MEASURED"   // a number that came out of running the thing, and was written down
  | "DERIVED"    // computed from the repo, a registry, or a simulator
  | "ESTIMATED"  // a design calculation. no hardware has confirmed it
  | "PAPER"      // exists in documents only. nothing was built
  | "REPORTED";  // someone else's number, quoted with its source

export type Status =
  | "LIVE"       // people who are not me use it
  | "SHIPPED"    // finished and usable, no user base claimed
  | "BETA"       // works, deliberately not open
  | "PAPER"      // designed and documented, not built
  | "PAUSED"     // works, stopped on purpose, reason recorded
  | "RETIRED";   // superseded by something later on this page

export type Domain =
  | "systems"
  | "ml"
  | "vision"
  | "hardware"
  | "product"
  | "security"
  | "graphics"
  | "media"
  | "research"
  | "tooling";

export type Metric = {
  value: string;
  unit?: string;
  label: string;
  provenance: Provenance;
  source: string;
};

export type Project = {
  slug: string;
  n: string;
  name: string;
  kicker: string;
  years: string;
  sortKey: number;
  status: Status;
  domain: Domain;
  role: string;
  stack: string[];
  summary: string;
  problem: string;
  constraint: string;
  approach: { head: string; body: string }[];
  hardPart: { head: string; body: string };
  metrics: Metric[];
  wrong: string[];
  learned: string;
  scale?: { label: string; value: string }[];
  demo?: "matchledger" | "secaudit" | "tracer" | "spectrum" | "fusion";
  links?: { label: string; href: string }[];
  featured?: boolean;
};
