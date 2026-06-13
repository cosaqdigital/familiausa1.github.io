import batchData from "./legacy-extract/migration-batch-20.json";
import { DEFAULT_IMAGE } from "./pilotContent";

export type LegacyFaq = {
  question: string;
  answer: string;
};

type LegacyArticle = {
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

export type MigrationBatchArticle = {
  slug: string;
  title: string;
  cardTitle: string;
  description: string;
  category: string;
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

const rawArticles = (batchData.articles ?? []) as LegacyArticle[];
const batchSlugSet = new Set(rawArticles.map((article) => article.slug));

function linkToSlug(href: string) {
  const cleanHref = href.replace(/#.*$/, "").split("/").pop() ?? "";
  return cleanHref.endsWith(".html") ? cleanHref.replace(/\.html$/, "") : null;
}

function toMigrationArticle(article: LegacyArticle): MigrationBatchArticle {
  const title = article.title ?? article.h1 ?? article.slug;
  const description = article.metaDescription ?? article.articleContentTextSample ?? title;
  const h1 = article.h1 ?? title;
  const relatedSlugs = (article.internalLinks ?? [])
    .map((link) => linkToSlug(link.href))
    .filter((slug): slug is string => Boolean(slug && batchSlugSet.has(slug) && slug !== article.slug))
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

export const migrationBatchArticles: MigrationBatchArticle[] = rawArticles.map(toMigrationArticle);

const articlesBySlug = new Map(migrationBatchArticles.map((article) => [article.slug, article]));

export function getRelatedMigrationArticles(article: MigrationBatchArticle) {
  const linked = article.relatedSlugs
    .map((slug) => articlesBySlug.get(slug))
    .filter((post): post is MigrationBatchArticle => Boolean(post));

  if (linked.length >= 3) {
    return linked.slice(0, 3);
  }

  const sameCategory = migrationBatchArticles
    .filter((post) => post.slug !== article.slug && post.category === article.category && !linked.some((item) => item.slug === post.slug))
    .slice(0, 3 - linked.length);

  return [...linked, ...sameCategory];
}
