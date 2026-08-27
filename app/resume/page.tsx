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
          A lab wants to know how I think, and would like to see the CGPA. A startup wants to
          know what I have shipped and does not care about the CGPA at all. I got tired of
          sending the same document to both, so there are two tracks now, each with a one page
          resume and a longer CV behind it.
        </p>
      </Reveal>

      <div className="mt56">
        <ResumeView />
      </div>
    </section>
  );
}
