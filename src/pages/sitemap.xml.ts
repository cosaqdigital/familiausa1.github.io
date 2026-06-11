import { allArticles } from "../data/allArticles";
import { siteCategories } from "../data/categories";
import { pageUrl, sitePages } from "../data/sitePages";

type SitemapEntry = {
  loc: string;
  lastmod: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: string;
};

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function uniqueEntries(entries: SitemapEntry[]) {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.loc)) {
      return false;
    }
    seen.add(entry.loc);
    return true;
  });
}

function toXml(entries: SitemapEntry[]) {
  const urls = entries
    .map((entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function GET() {
  const articleEntries: SitemapEntry[] = allArticles.map((article) => ({
    loc: article.canonical,
    lastmod: article.dateModified || article.datePublished || "2026-06-06",
    changefreq: "weekly",
    priority: "0.8"
  }));

  const categoryEntries: SitemapEntry[] = siteCategories.map((category) => ({
    loc: category.canonical,
    lastmod: "2026-06-06",
    changefreq: "monthly",
    priority: "0.6"
  }));

  const pageEntries: SitemapEntry[] = sitePages.map((page) => ({
    loc: pageUrl(page.path),
    lastmod: page.lastmod,
    changefreq: page.path === "/" || page.path === "/blog.html" ? "daily" : "monthly",
    priority: page.priority
  }));

  const entries = uniqueEntries([...articleEntries, ...categoryEntries, ...pageEntries]);

  return new Response(toXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
}
