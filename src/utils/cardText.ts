type CardLikeArticle = {
  slug?: string;
  title?: string;
  cardTitle?: string;
  category?: string;
  excerpt?: string;
  description?: string;
};

function normalizeText(value = "") {
  return value
    .replace(/\s+/g, " ")
    .replace(/&nbsp;/g, " ")
    .trim();
}

export function truncateText(text = "", maxLength = 110) {
  const clean = normalizeText(text);
  if (clean.length <= maxLength) {
    return clean;
  }

  const sliced = clean.slice(0, maxLength + 1);
  const lastSpace = sliced.lastIndexOf(" ");
  const end = lastSpace > Math.floor(maxLength * 0.58) ? lastSpace : maxLength;

  return `${clean.slice(0, end).replace(/[,.!?;:]$/, "")}...`;
}

export function articleMicrocopy(article: CardLikeArticle, maxLength = 110) {
  return truncateText(article.excerpt || article.description || "", maxLength);
}

export function articleCardTitle(article: CardLikeArticle) {
  return article.cardTitle || article.title || "Artigo do Familia USA 1";
}

export function articleCta(article: CardLikeArticle) {
  const haystack = `${article.slug || ""} ${article.category || ""} ${article.title || ""}`.toLowerCase();
  const isCityGuide =
    haystack.includes("cidade") ||
    haystack.includes("florida") ||
    haystack.includes("massachusetts") ||
    haystack.includes("onde-morar") ||
    haystack.includes("morar-em") ||
    haystack.includes("quanto-custa-morar");

  return isCityGuide ? "Ver guia" : "Ler artigo";
}
