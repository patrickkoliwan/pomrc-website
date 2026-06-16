import type { MetadataRoute } from "next";

const siteUrl = "https://pomrc.com";

const routes = [
  "",
  "/about",
  "/facilities",
  "/events",
  "/junior-programs",
  "/membership",
  "/venue-hire",
  "/club-committee",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
