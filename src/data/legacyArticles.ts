import legacyData from "./legacy-extract/legacy-articles.json";
import retiredData from "./retired-articles.json";
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

type LegacyPresentationOverride = {
  title?: string;
  h1?: string;
  dateModified?: string;
};

const LEGACY_PRESENTATION_OVERRIDES: Record<string, LegacyPresentationOverride> = {
  "morar-em-pompano-beach-2026": {
    title: "Pompano Beach em 2026: praia, Broward, deslocamento e perfil de moradia",
    h1: "Pompano Beach em 2026: como e a rotina para quem pensa em morar na regiao",
    dateModified: "2026-09-05"
  },
  "quanto-custa-morar-em-miami-2026": {
    title: "Viver em Miami em 2026: aluguel, transporte e orcamento mensal",
    h1: "Viver em Miami em 2026: quanto pesa aluguel, transporte e rotina",
    dateModified: "2026-09-05"
  },
  "trabalho-nos-eua-para-brasileiros-2026": {
    title: "Mercado de trabalho americano em 2026: setores, jornada e realidade para brasileiros",
    h1: "Mercado de trabalho nos EUA em 2026: o que brasileiros encontram na pratica",
    dateModified: "2026-09-05"
  },
  "davenport-ou-orlando-onde-morar-2026": {
    title: "Davenport ou Orlando em 2026: qual cidade combina com seu deslocamento e familia?",
    h1: "Davenport ou Orlando em 2026: compare rotina, deslocamento e perfil familiar",
    dateModified: "2026-09-05"
  }
};

const rawArticles = (legacyData.articles ?? []) as ExtractedLegacyArticle[];
const legacySlugSet = new Set(rawArticles.map((article) => article.slug));
const retiredRedirects = new Map(
  (retiredData.redirects ?? []).map((item) => [item.slug as string, item.targetSlug as string])
);

function linkToSlug(href: string) {
  const cleanHref = href.replace(/#.*$/, "").split("/").pop() ?? "";
  return cleanHref.endsWith(".html") ? cleanHref.replace(/\.html$/, "") : null;
}

function cleanLegacyText(value: string) {
  return value
    .replace(/difífacil/gi, (match) => match[0] === "D" ? "Difícil" : "difícil")
    .replace(/\bcomnao\b/gi, (match) => match[0] === "C" ? "Como" : "como");
}

function rewriteRetiredArticleLinks(content: string) {
  let rewritten = content;
  for (const [slug, targetSlug] of retiredRedirects) {
    const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    rewritten = rewritten.replace(
      new RegExp(`href=(["'])(?:\\.\\./)?articles/${escapedSlug}\\.html([^"']*)\\1`, "gi"),
      (_match, quote, suffix) => `href=${quote}/articles/${targetSlug}.html${suffix}${quote}`
    );
    rewritten = rewritten.replace(
      new RegExp(`href=(["'])${escapedSlug}\\.html([^"']*)\\1`, "gi"),
      (_match, quote, suffix) => `href=${quote}/articles/${targetSlug}.html${suffix}${quote}`
    );
  }
  return rewritten;
}

function cleanLegacyContent(content: string) {
  let cleaned = content;

  cleaned = cleaned.replace(
    /<!--\s*Reforco editorial SEO 2026-05-22\s*-->[\s\S]*?(?=<section\b[^>]*class=["'][^"']*seo-strengthening-block[^"']*["'][^>]*>|<!--\s*Posts relacionados SEO 2026-05-22\s*-->)/gi,
    ""
  );

  cleaned = cleaned.replace(
    /<section\b[^>]*class=["'][^"']*seo-strengthening-block[^"']*["'][^>]*>[\s\S]*?<\/section>\s*/gi,
    ""
  );

  return cleanLegacyText(rewriteRetiredArticleLinks(cleaned)).trim();
}

function toLegacyGeneratedArticle(article: ExtractedLegacyArticle): LegacyGeneratedArticle {
  const override = LEGACY_PRESENTATION_OVERRIDES[article.slug];
  const rawTitle = override?.title ?? article.title ?? article.h1 ?? article.slug;
  const rawDescription = article.metaDescription ?? article.articleContentTextSample ?? rawTitle;
  const rawH1 = override?.h1 ?? article.h1 ?? rawTitle;
  const title = cleanLegacyText(rawTitle);
  const description = cleanLegacyText(rawDescription);
  const h1 = cleanLegacyText(rawH1);
  const relatedSlugs = (article.internalLinks ?? [])
    .map((link) => linkToSlug(link.href))
    .map((slug) => (slug ? retiredRedirects.get(slug) ?? slug : null))
    .filter((slug): slug is string => Boolean(slug && slug !== article.slug))
    .slice(0, 3);

  return {
    slug: article.slug,
    title,
    cardTitle: h1,
    description,
    category: cleanLegacyText(article.category ?? "Artigos"),
    datePublished: article.datePublished ?? "2026-06-06",
    dateModified: override?.dateModified ?? article.dateModified ?? article.datePublished ?? "2026-06-06",
    readingTime: article.readingTime ?? "10 min de leitura",
    image: article.openGraph?.image ?? DEFAULT_IMAGE,
    excerpt: cleanLegacyText(article.articleContentTextSample ?? description),
    content: cleanLegacyContent(article.articleContentHtml ?? ""),
    faq: (article.visibleFaqs ?? []).map((item) => ({
      question: cleanLegacyText(item.question),
      answer: cleanLegacyText(item.answer)
    })),
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
