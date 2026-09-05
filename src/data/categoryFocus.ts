import type { SiteArticle } from "./allArticles";
import { siteCategories, type SiteCategory } from "./categories";

function normalize(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Algumas categorias editoriais historicas aparecem em mais de um hub.
// Nestes casos, definimos um unico hub principal para evitar duplicacao
// excessiva e paginas de categoria com intencoes misturadas.
const PRIMARY_OWNER_OVERRIDES: Record<string, string> = {
  "seguranca nos eua": "vida-real-nos-eua",
  "planejamento financeiro": "planejamento",
  "saude e viagem": "saude-nos-eua",
  "saude em viagem": "saude-nos-eua",
  "viagem e saude": "saude-nos-eua"
};

function getExactCategoryOwners(article: SiteArticle) {
  const normalizedArticleCategory = normalize(article.category);

  return siteCategories.filter((candidate) =>
    candidate.matchCategories.some((categoryName) => normalize(categoryName) === normalizedArticleCategory)
  );
}

export function focusCategoryPosts(category: SiteCategory, posts: SiteArticle[]) {
  return posts.filter((article) => {
    const owners = getExactCategoryOwners(article);

    // Categorias antigas ainda nao reconhecidas continuam usando o fallback
    // por palavras-chave existente, para nao perder cobertura durante a migracao.
    if (owners.length === 0) {
      return true;
    }

    const normalizedArticleCategory = normalize(article.category);
    const primaryOwner = PRIMARY_OWNER_OVERRIDES[normalizedArticleCategory] ?? owners[0].slug;
    return category.slug === primaryOwner;
  });
}
