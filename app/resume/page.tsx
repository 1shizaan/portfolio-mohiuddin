import type { Metadata } from "next";
import ResumeView from "@/components/ResumeView";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Resume and CV",
  description:
    "Four documents. An engineering resume and CV for product and startup roles, a research resume and CV for lab placements. Read here or download as PDF.",
};

export default function ResumePage() {
  return (
    <section className="shell" style={{ paddingTop: 68, paddingBottom: 80 }}>
      <Reveal>
        <span className="eyebrow">// documents</span>
        <h1 className="d1 mt20" style={{ maxWidth: "12ch", fontSize: "clamp(42px, 7vw, 92px)" }}>
          Four documents, <em>two</em> audiences.
        </h1>
        <p className="prose lead mt40">
          A lab reads for method and wants the CGPA. A startup reads for shipping evidence and
          does not. So there are two tracks, each with a one page resume and a longer CV, and
          nothing in either is padded to fill a page.
        </p>
      </Reveal>

      <div className="mt56">
        <ResumeView />
      </div>
    </section>
  );
}
