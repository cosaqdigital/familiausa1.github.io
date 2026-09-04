import { legacyArticles, type LegacyGeneratedArticle } from "./legacyArticles";
import { newMarkdownArticles, type NewMarkdownArticle } from "./newMarkdownArticles";

export type SiteArticle = (LegacyGeneratedArticle & { source?: "legacy" }) | NewMarkdownArticle;

// Quando um artigo legado ganha uma versao editorial nova em Markdown/MDX com
// o mesmo slug, a versao nova substitui a antiga sem alterar a URL publica.
const markdownSlugs = new Set(newMarkdownArticles.map((article) => article.slug));
const activeLegacyArticles = legacyArticles.filter((article) => !markdownSlugs.has(article.slug));

export const allArticles: SiteArticle[] = [
  ...activeLegacyArticles.map((article) => ({ ...article, source: "legacy" as const })),
  ...newMarkdownArticles
].sort((left, right) => (right.dateModified || right.datePublished).localeCompare(left.dateModified || left.datePublished));

const articlesBySlug = new Map(allArticles.map((article) => [article.slug, article]));

export function getArticleBySlug(slug: string) {
  return articlesBySlug.get(slug);
}

export function getFeaturedArticles(limit = 3) {
  return allArticles
    .filter((article) => article.featured)
    .sort((left, right) => {
      const leftOrder = typeof left.featuredOrder === "number" ? left.featuredOrder : Number.POSITIVE_INFINITY;
      const rightOrder = typeof right.featuredOrder === "number" ? right.featuredOrder : Number.POSITIVE_INFINITY;

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return (right.dateModified || right.datePublished).localeCompare(left.dateModified || left.datePublished);
    })
    .slice(0, limit);
}

function getBaseRelatedArticles(article: SiteArticle) {
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

// Garante que todo artigo receba ao menos um link contextual de outro artigo.
// Quando a selecao atual deixa um artigo sem entrada, ele e incluido de forma
// reciproca em uma das paginas que ele proprio ja considera relacionada.
const contextualInbound = new Map(allArticles.map((article) => [article.slug, 0]));
for (const source of allArticles) {
  for (const target of getBaseRelatedArticles(source)) {
    contextualInbound.set(target.slug, (contextualInbound.get(target.slug) || 0) + 1);
  }
}

const reciprocalInjections = new Map<string, SiteArticle[]>();
const injectionLoad = new Map<string, number>();

for (const article of allArticles) {
  if ((contextualInbound.get(article.slug) || 0) > 0) continue;

  const candidates = getBaseRelatedArticles(article)
    .filter((candidate) => candidate.slug !== article.slug)
    .sort((left, right) => {
      const loadDiff = (injectionLoad.get(left.slug) || 0) - (injectionLoad.get(right.slug) || 0);
      if (loadDiff !== 0) return loadDiff;
      return left.slug.localeCompare(right.slug);
    });

  const target = candidates[0];
  if (!target) continue;

  const current = reciprocalInjections.get(target.slug) || [];
  reciprocalInjections.set(target.slug, [...current, article]);
  injectionLoad.set(target.slug, (injectionLoad.get(target.slug) || 0) + 1);
}

export function getRelatedArticles(article: SiteArticle) {
  const base = getBaseRelatedArticles(article);
  const injected = reciprocalInjections.get(article.slug) || [];
  const seen = new Set(base.map((post) => post.slug));

  return [
    ...base,
    ...injected.filter((post) => post.slug !== article.slug && !seen.has(post.slug))
  ];
}
