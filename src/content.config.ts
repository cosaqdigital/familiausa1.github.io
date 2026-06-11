import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articles = defineCollection({
  loader: glob({
    pattern: ["*.md", "!_*.md"],
    base: "./src/content/articles"
  }),
  schema: z.object({
    draft: z.boolean().default(false),
    slug: z.string(),
    title: z.string(),
    h1: z.string().optional(),
    description: z.string(),
    category: z.string(),
    datePublished: z.string(),
    dateModified: z.string(),
    readingTime: z.string().default("10 min de leitura"),
    image: z.string().url(),
    excerpt: z.string().optional(),
    relatedSlugs: z.array(z.string()).optional(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string()
    })).optional(),
    affiliate: z.object({
      enabled: z.boolean().default(false),
      label: z.string().optional(),
      url: z.string().optional(),
      rel: z.string().default("sponsored nofollow")
    }).optional()
  })
});

export const collections = { articles };
