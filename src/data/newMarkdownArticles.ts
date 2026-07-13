import type { LegacyFaq, LegacyGeneratedArticle } from "./legacyArticles";
import { DEFAULT_IMAGE, SITE_URL } from "./pilotContent";

// Astro Markdown imports expose a renderable component. Keep this loose so the
// manual publishing path does not depend on internal Astro types.
type MarkdownContentComponent = any;

type MarkdownModule = {
  frontmatter: {
    draft?: boolean;
    slug?: string;
    title?: string;
    description?: string;
    category?: string;
    featured?: boolean;
    featuredOrder?: number;
    featuredLabel?: string;
    tags?: string[];
    datePublished?: string;
    dateModified?: string;
    readingTime?: string;
    image?: string;
    h1?: string;
    excerpt?: string;
    relatedSlugs?: string[];
    faq?: LegacyFaq[];
  };
  Content: MarkdownContentComponent;
};

export type NewMarkdownArticle = LegacyGeneratedArticle & {
  source: "markdown";
  Content: MarkdownContentComponent;
};

const markdownModules = import.meta.glob("../content/articles/*.md", { eager: true }) as Record<string, MarkdownModule>;

function slugFromPath(filePath: string) {
  return filePath.split("/").pop()?.replace(/\.md$/, "") ?? "";
}

function validSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function normalizeFaq(faq: LegacyFaq[] | undefined) {
  return Array.isArray(faq)
    ? faq.filter((item) => item?.question?.trim() && item?.answer?.trim())
    : [];
}

export const newMarkdownArticles: NewMarkdownArticle[] = Object.entries(markdownModules)
  .filter(([filePath]) => !slugFromPath(filePath).startsWith("_"))
  .filter(([, module]) => !module.frontmatter?.draft)
  .map(([filePath, module]) => {
    const frontmatter = module.frontmatter ?? {};
    const slug = frontmatter.slug?.trim() || slugFromPath(filePath);
    if (!validSlug(slug)) {
      throw new Error(`Slug invalido em artigo Markdown: ${filePath}`);
    }

    const title = frontmatter.title?.trim() || slug;
    const description = frontmatter.description?.trim() || title;
    const h1 = frontmatter.h1?.trim() || title;
    const datePublished = frontmatter.datePublished || "2026-06-11";
    const dateModified = frontmatter.dateModified || datePublished;

    return {
      source: "markdown" as const,
      slug,
      title,
      cardTitle: h1,
      description,
      category: frontmatter.category?.trim() || "Planejamento",
      featured: Boolean(frontmatter.featured),
      featuredOrder: typeof frontmatter.featuredOrder === "number" ? frontmatter.featuredOrder : undefined,
      featuredLabel: frontmatter.featuredLabel?.trim(),
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      datePublished,
      dateModified,
      readingTime: frontmatter.readingTime || "10 min de leitura",
      image: frontmatter.image || DEFAULT_IMAGE,
      excerpt: frontmatter.excerpt || description,
      content: "",
      faq: normalizeFaq(frontmatter.faq),
      relatedSlugs: Array.isArray(frontmatter.relatedSlugs) ? frontmatter.relatedSlugs : [],
      canonical: `${SITE_URL}/articles/${slug}.html`,
      h1,
      Content: module.Content
    };
  });
