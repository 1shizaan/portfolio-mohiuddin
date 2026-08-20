import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/work", "/thinking", "/resume", "/about"].map((p) => ({
    url: `${site.url}${p}`,
    lastModified: now,
    priority: p === "" ? 1 : 0.8,
  }));
  const work = projects.map((p) => ({
    url: `${site.url}/work/${p.slug}`,
    lastModified: now,
    priority: 0.7,
  }));
  return [...pages, ...work];
}
