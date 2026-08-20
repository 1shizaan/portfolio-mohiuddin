"use client";

import dynamic from "next/dynamic";

const Loading = () => (
  <div className="demo">
    <div className="demo-bar"><span>loading</span></div>
    <div className="demo-body">
      <span className="mono muted" style={{ fontSize: 12 }}>preparing the runtime…</span>
    </div>
  </div>
);

const MatchLedgerDemo = dynamic(() => import("./MatchLedgerDemo"), { loading: Loading, ssr: false });
const SecAuditDemo = dynamic(() => import("./SecAuditDemo"), { loading: Loading, ssr: false });
const TracerDemo = dynamic(() => import("./TracerDemo"), { loading: Loading, ssr: false });
const SpectrumDemo = dynamic(() => import("./SpectrumDemo"), { loading: Loading, ssr: false });
const FusionDemo = dynamic(() => import("./FusionDemo"), { loading: Loading, ssr: false });

export default function DemoSlot({ id }: { id: string }) {
  switch (id) {
    case "matchledger": return <MatchLedgerDemo />;
    case "secaudit": return <SecAuditDemo />;
    case "tracer": return <TracerDemo />;
    case "spectrum": return <SpectrumDemo />;
    case "fusion": return <FusionDemo />;
    default: return null;
  }
}
