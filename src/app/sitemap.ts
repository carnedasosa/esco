import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/eventi", "/prenota"].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === "/eventi" ? "weekly" : "monthly",
  }));
}
