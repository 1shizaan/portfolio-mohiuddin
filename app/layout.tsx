import type { Metadata } from "next";
import { Instrument_Serif, Sora, JetBrains_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const ui = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-ui",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.short} — systems, models, and hardware under constraint`,
    template: `%s — ${site.short}`,
  },
  description:
    "Fourteen projects across AI systems, computer vision, embedded hardware and developer tooling. Every claim carries a provenance tag saying how the number was obtained.",
  openGraph: {
    title: `${site.short} — systems, models, and hardware under constraint`,
    description:
      "Fourteen projects. Every number says how it was obtained: measured, derived, estimated, or paper.",
    type: "website",
    url: site.url,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${ui.variable} ${mono.variable}`}>
      <body>
        <div className="grid-field" aria-hidden="true" />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
