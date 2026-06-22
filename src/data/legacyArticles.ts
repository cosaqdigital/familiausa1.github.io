import legacyData from "./legacy-extract/legacy-articles.json";
import { DEFAULT_IMAGE } from "./pilotContent";

export type LegacyFaq = {
  question: string;
  answer: string;
};

type ExtractedLegacyArticle = {
  slug: string;
  title: string | null;
  metaDescription: string | null;
  canonical: string | null;
  h1: string | null;
  category: string | null;
  datePublished: string | null;
  dateModified: string | null;
  readingTime: string | null;
  openGraph?: {
    image?: string | null;
  };
  articleContentHtml: string | null;
  articleContentTextSample: string | null;
  visibleFaqs?: LegacyFaq[];
  internalLinks?: {
    href: string;
    anchor: string;
  }[];
};

export type LegacyGeneratedArticle = {
  slug: string;
  title: string;
  cardTitle: string;
  description: string;
  category: string;
  featured?: boolean;
  featuredOrder?: number;
  featuredLabel?: string;
  datePublished: string;
  dateModified: string;
  readingTime: string;
  image: string;
  excerpt: string;
  content: string;
  faq: LegacyFaq[];
  relatedSlugs: string[];
  canonical: string;
  h1: string;
};

const rawArticles = (legacyData.articles ?? []) as ExtractedLegacyArticle[];
const legacySlugSet = new Set(rawArticles.map((article) => article.slug));

function linkToSlug(href: string) {
  const cleanHref = href.replace(/#.*$/, "").split("/").pop() ?? "";
  return cleanHref.endsWith(".html") ? cleanHref.replace(/\.html$/, "") : null;
}

function toLegacyGeneratedArticle(article: ExtractedLegacyArticle): LegacyGeneratedArticle {
  const title = article.title ?? article.h1 ?? article.slug;
  const description = article.metaDescription ?? article.articleContentTextSample ?? title;
  const h1 = article.h1 ?? title;
  const relatedSlugs = (article.internalLinks ?? [])
    .map((link) => linkToSlug(link.href))
    .filter((slug): slug is string => Boolean(slug && legacySlugSet.has(slug) && slug !== article.slug))
    .slice(0, 3);

  return {
    slug: article.slug,
    title,
    cardTitle: h1,
    description,
    category: article.category ?? "Artigos",
    datePublished: article.datePublished ?? "2026-06-06",
    dateModified: article.dateModified ?? article.datePublished ?? "2026-06-06",
    readingTime: article.readingTime ?? "10 min de leitura",
    image: article.openGraph?.image ?? DEFAULT_IMAGE,
    excerpt: article.articleContentTextSample ?? description,
    content: article.articleContentHtml ?? "",
    faq: article.visibleFaqs ?? [],
    relatedSlugs,
    canonical: article.canonical ?? `https://familiausa1.com/articles/${article.slug}.html`,
    h1
  };
}

export const legacyArticles: LegacyGeneratedArticle[] = rawArticles.map(toLegacyGeneratedArticle);

const articlesBySlug = new Map(legacyArticles.map((article) => [article.slug, article]));

export function getRelatedLegacyArticles(article: LegacyGeneratedArticle) {
  const linked = article.relatedSlugs
    .map((slug) => articlesBySlug.get(slug))
    .filter((post): post is LegacyGeneratedArticle => Boolean(post));

  if (linked.length >= 3) {
    return linked.slice(0, 3);
  }

  const sameCategory = legacyArticles
    .filter((post) => post.slug !== article.slug && post.category === article.category && !linked.some((item) => item.slug === post.slug))
    .slice(0, 3 - linked.length);

  return [...linked, ...sameCategory];
}
