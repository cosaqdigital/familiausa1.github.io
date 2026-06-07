import { SITE_URL } from "./pilotContent";

export type SitePage = {
  path: string;
  title: string;
  description: string;
  lastmod: string;
  priority: string;
};

export const sitePages: SitePage[] = [
  {
    path: "/",
    title: "A realidade dos brasileiros nos Estados Unidos | FamiliaUSA1",
    description: "Guias, alertas e experiencias reais para brasileiros que vivem, chegam ou sonham morar nos Estados Unidos.",
    lastmod: "2026-06-06",
    priority: "1.0"
  },
  {
    path: "/blog.html",
    title: "Artigos sobre brasileiros nos EUA | FamiliaUSA1",
    description: "Todos os artigos do Familia USA 1 sobre imigracao, visto, custo de vida, trabalho, Orlando, Florida e vida nos EUA.",
    lastmod: "2026-06-06",
    priority: "0.9"
  },
  {
    path: "/categorias.html",
    title: "Categorias do Familia USA 1 | Brasileiros nos EUA",
    description: "Explore os principais hubs do blog: imigracao, visto americano, asilo, custo de vida, cidades, Orlando, saude, trabalho e vida real.",
    lastmod: "2026-06-06",
    priority: "0.9"
  },
  {
    path: "/checklist-mudanca-eua.html",
    title: "Checklist da Mudanca para os EUA: PDF gratuito para brasileiros | FamiliaUSA1",
    description: "Baixe gratuitamente o checklist da mudanca para os EUA com documentos, dinheiro, moradia, escola, carro e primeiros passos.",
    lastmod: "2026-06-06",
    priority: "0.8"
  },
  {
    path: "/comece-aqui.html",
    title: "Comece Aqui: guia para brasileiros nos EUA | FamiliaUSA1",
    description: "Encontre os principais caminhos do Familia USA 1 sobre morar nos EUA, imigracao, custo de vida, Florida e vida real.",
    lastmod: "2026-06-06",
    priority: "0.8"
  },
  {
    path: "/sobre.html",
    title: "Sobre o Familia USA 1: brasileiros vivendo nos EUA",
    description: "Conheca a familia por tras do Familia USA 1 e o projeto criado para compartilhar experiencias reais sobre a vida nos EUA.",
    lastmod: "2026-06-06",
    priority: "0.7"
  }
];

export function pageUrl(path: string) {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}
