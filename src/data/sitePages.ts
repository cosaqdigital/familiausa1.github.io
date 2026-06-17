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
    description: "Guias, alertas e experiências reais para brasileiros que vivem, chegam ou sonham morar nos Estados Unidos.",
    lastmod: "2026-06-06",
    priority: "1.0"
  },
  {
    path: "/blog.html",
    title: "Artigos sobre brasileiros nos EUA | FamiliaUSA1",
    description: "Todos os artigos do Família USA 1 sobre imigração, visto, custo de vida, trabalho, Orlando, Flórida e vida nos EUA.",
    lastmod: "2026-06-06",
    priority: "0.9"
  },
  {
    path: "/categorias.html",
    title: "Categorias do Família USA 1 | Brasileiros nos EUA",
    description: "Explore os principais hubs do blog: imigração, visto americano, asilo, custo de vida, cidades, Orlando, saúde, trabalho e vida real.",
    lastmod: "2026-06-06",
    priority: "0.9"
  },
  {
    path: "/checklist-mudanca-eua.html",
    title: "Checklist da Mudança para os EUA: PDF gratuito para brasileiros | FamiliaUSA1",
    description: "Baixe gratuitamente o checklist da mudança para os EUA com documentos, dinheiro, moradia, escola, carro e primeiros passos.",
    lastmod: "2026-06-06",
    priority: "0.8"
  },
  {
    path: "/comece-aqui.html",
    title: "Comece Aqui: guia para brasileiros nos EUA | FamiliaUSA1",
    description: "Encontre os principais caminhos do Família USA 1 sobre morar nos EUA, imigração, custo de vida, Flórida e vida real.",
    lastmod: "2026-06-06",
    priority: "0.8"
  },
  {
    path: "/sobre.html",
    title: "Sobre o Família USA 1: brasileiros vivendo nos EUA",
    description: "Conheça a família por trás do Família USA 1 e o projeto criado para compartilhar experiências reais sobre a vida nos EUA.",
    lastmod: "2026-06-17",
    priority: "0.7"
  },
  {
    path: "/contato.html",
    title: "Contato | Família USA 1",
    description: "Entre em contato com o Família USA 1 para sugestões, dúvidas editoriais, parcerias e mensagens sobre o blog.",
    lastmod: "2026-06-17",
    priority: "0.5"
  },
  {
    path: "/politica-de-privacidade.html",
    title: "Política de Privacidade | Família USA 1",
    description: "Entenda como o Família USA 1 trata dados, cookies, Google Analytics, links externos e anúncios no blog.",
    lastmod: "2026-06-17",
    priority: "0.4"
  },
  {
    path: "/politica-de-cookies.html",
    title: "Política de Cookies | Família USA 1",
    description: "Saiba como o Família USA 1 usa cookies essenciais, analíticos e de publicidade, e como você pode gerenciar cookies.",
    lastmod: "2026-06-17",
    priority: "0.4"
  },
  {
    path: "/termos-de-uso.html",
    title: "Termos de Uso | Família USA 1",
    description: "Leia os termos de uso do Família USA 1, blog informativo para brasileiros sobre vida nos Estados Unidos.",
    lastmod: "2026-06-17",
    priority: "0.4"
  }
];

export function pageUrl(path: string) {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}
