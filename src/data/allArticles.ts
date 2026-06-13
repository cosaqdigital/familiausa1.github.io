import { legacyArticles, type LegacyGeneratedArticle } from "./legacyArticles";
import { newMarkdownArticles, type NewMarkdownArticle } from "./newMarkdownArticles";

export type SiteArticle = (LegacyGeneratedArticle & { source?: "legacy" }) | NewMarkdownArticle;

export const allArticles: SiteArticle[] = [
  ...legacyArticles.map((article) => ({ ...article, source: "legacy" as const })),
  ...newMarkdownArticles
].sort((left, right) => (right.dateModified || right.datePublished).localeCompare(left.dateModified || left.datePublished));

const articlesBySlug = new Map(allArticles.map((article) => [article.slug, article]));

export function getArticleBySlug(slug: string) {
  return articlesBySlug.get(slug);
}

export function getRelatedArticles(article: SiteArticle) {
  const linked = article.relatedSlugs
    .map((slug) => articlesBySlug.get(slug))
    .filter((post): post is SiteArticle => Boolean(post && post.slug !== article.slug));

  if (linked.length >= 3) {
    return linked.slice(0, 3);
  }

  const sameCategory = allArticles
    .filter((post) => post.slug !== article.slug && post.category === article.category && !linked.some((item) => item.slug === post.slug))
    .slice(0, 3 - linked.length);

  return [...linked, ...sameCategory];
}
