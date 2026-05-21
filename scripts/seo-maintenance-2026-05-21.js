const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const ARTICLES_DIR = path.join(ROOT, "articles");
const ARTICLES_JSON = path.join(ROOT, "assets", "data", "articles.json");
const BLOG_HTML = path.join(ROOT, "blog.html");
const CATEGORIES_HTML = path.join(ROOT, "categorias.html");
const SITE = "https://familiausa1.com";
const DEFAULT_IMAGE = `${SITE}/assets/images/familiausa1-share.svg`;
const TODAY = "2026-05-21";

const missingVisaArticles = [
  {
    title: "Como preencher o DS-160 passo a passo em 2026",
    description: "Aprenda como preencher o DS-160 em 2026: dados, viagem, trabalho, família, erros comuns e cuidados antes de enviar.",
    category: "Visto americano",
    url: "articles/como-preencher-ds-160-passo-a-passo-2026.html",
    date: "2026-05-19",
    modified: TODAY,
    readTime: "13 min de leitura",
  },
  {
    title: "Documentos para entrevista do visto americano em 2026",
    description: "Veja quais documentos levar para a entrevista do visto americano em 2026: passaporte, DS-160, renda, trabalho, estudo e vínculos.",
    category: "Visto americano",
    url: "articles/documentos-entrevista-visto-americano-2026.html",
    date: "2026-05-19",
    modified: TODAY,
    readTime: "11 min de leitura",
  },
  {
    title: "Entrevista do visto americano: perguntas e erros comuns",
    description: "Veja perguntas comuns na entrevista do visto americano, como responder com clareza e os erros que brasileiros devem evitar.",
    category: "Visto americano",
    url: "articles/entrevista-visto-americano-perguntas-erros-comuns-2026.html",
    date: "2026-05-19",
    modified: TODAY,
    readTime: "12 min de leitura",
  },
  {
    title: "Quanto custa tirar o visto americano em 2026?",
    description: "Veja taxa MRV, gastos extras, documentos, deslocamento e como se planejar antes de solicitar o visto americano.",
    category: "Visto americano",
    url: "articles/quanto-custa-tirar-visto-americano-2026.html",
    date: "2026-05-19",
    modified: TODAY,
    readTime: "13 min de leitura",
  },
  {
    title: "Visto americano negado: motivos e o que fazer em 2026",
    description: "Entenda motivos comuns de negativa, quando tentar de novo, o que revisar e quais promessas evitar após o visto negado.",
    category: "Visto americano",
    url: "articles/visto-americano-negado-motivos-o-que-fazer-2026.html",
    date: "2026-05-19",
    modified: TODAY,
    readTime: "13 min de leitura",
  },
];

const categoryAliases = new Map([
  ["Orlando e compras", "Orlando e Disney"],
  ["Orlando e viagem", "Orlando e Disney"],
  ["Planejamento financeiro", "Planejamento"],
  ["Trabalho nos EUA", "Trabalho e renda"],
  ["Banco nos EUA", "Banco e crédito"],
  ["Crédito nos EUA", "Banco e crédito"],
  ["Recém-chegados", "Primeiros passos"],
  ["Documentos nos EUA", "Primeiros passos"],
  ["Erros para evitar", "Adaptação cultural"],
  ["Onde morar nos EUA", "Vida real nos EUA"],
  ["Morar fora", "Vida real nos EUA"],
  ["Segurança nos EUA", "Vida real nos EUA"],
  ["Imigração para brasileiros", "Imigração e legalização"],
  ["Imigração e fronteira", "Imigração e legalização"],
  ["Fronteira e imigração", "Imigração e legalização"],
  ["Imigração consciente", "Imigração e legalização"],
  ["Imigração EUA", "Imigração e legalização"],
  ["Fraude imigração", "Imigração e legalização"],
  ["Advogado imigração", "Imigração e legalização"],
  ["Fraude migratória EUA", "Imigração e legalização"],
  ["Asilo Estados Unidos", "Imigração e legalização"],
  ["Viagem e saúde", "Notícias dos EUA"],
  ["Saúde em viagem", "Notícias dos EUA"],
  ["OMS e saúde", "Notícias dos EUA"],
  ["Saúde em cruzeiro", "Notícias dos EUA"],
  ["Notícias dos EUA", "Notícias dos EUA"],
  ["Relação Brasil-EUA", "Notícias dos EUA"],
]);

const categoryFaqs = {
  "Visto americano": [
    ["Artigos sobre visto americano garantem aprovação?", "Não. O conteúdo ajuda na organização e no entendimento do processo, mas a decisão final é sempre do consulado americano."],
    ["As regras do visto americano podem mudar?", "Sim. Taxas, prazos, critérios de entrevista e disponibilidade de agendamento podem mudar. Sempre confirme nos canais oficiais."],
    ["Vale a pena consultar fontes oficiais antes de agir?", "Sim. Para visto americano, fontes como Embaixada dos EUA, Travel.State.Gov e o sistema oficial de agendamento devem ser consultadas."],
  ],
  "Imigração e legalização": [
    ["Este conteúdo substitui advogado de imigração?", "Não. O conteúdo é informativo e não substitui orientação jurídica individualizada."],
    ["Cada caso migratório é diferente?", "Sim. Histórico, entrada, documentos, família, processos anteriores e leis aplicáveis podem mudar completamente a análise."],
    ["Onde buscar informação oficial sobre imigração?", "USCIS, ICE, CBP, tribunais migratórios e páginas oficiais do governo americano são as referências mais seguras."],
  ],
  "Vida real nos EUA": [
    ["Morar nos EUA é igual para todos os brasileiros?", "Não. Estado, cidade, documentação, profissão, idioma, família e rede de apoio mudam bastante a experiência."],
    ["O começo nos Estados Unidos costuma ser difícil?", "Para muitos brasileiros, sim. Adaptação, moradia, trabalho, transporte e saudade pesam bastante nos primeiros meses."],
    ["Vale a pena comparar experiências?", "Vale, mas com cuidado. A experiência de outra família ajuda, mas não deve substituir planejamento para a sua realidade."],
  ],
  "Custo de vida": [
    ["Os valores de custo de vida mudam muito?", "Sim. Aluguel, seguro, mercado, energia e transporte variam por cidade, estado e momento econômico."],
    ["Ganhar em dólar significa sobrar dinheiro?", "Não necessariamente. O que sobra depende do custo fixo, quantidade de pessoas na casa, trabalho e disciplina financeira."],
    ["Como usar artigos de custo de vida?", "Use como ponto de partida e sempre atualize valores antes de tomar decisões como mudança, aluguel ou compra de carro."],
  ],
  "Orlando e Disney": [
    ["Orlando exige planejamento com antecedência?", "Sim. Visto, passagem, hotel, carro, parques, seguro e alimentação podem pesar bastante no orçamento familiar."],
    ["Compras em Orlando sempre valem a pena?", "Nem sempre. É preciso comparar preço, imposto, câmbio, bagagem e limite de compras antes de decidir."],
    ["Quem vai para Disney precisa de visto?", "Brasileiros normalmente precisam de visto americano válido para entrar nos Estados Unidos como turistas."],
  ],
  "Trabalho e renda": [
    ["É fácil conseguir trabalho nos EUA sendo brasileiro?", "Depende da cidade, idioma, experiência, documentação, rede de contatos e disposição para recomeçar."],
    ["Trabalho informal pode trazer riscos?", "Pode. Relação de trabalho, pagamento, impostos e documentação precisam ser entendidos com cuidado."],
    ["Como se proteger ao aceitar trabalho?", "Combine valor, função, horário e forma de pagamento por escrito, guarde registros e busque orientação confiável quando necessário."],
  ],
  "Primeiros passos": [
    ["O que fazer primeiro ao chegar nos EUA?", "Organizar moradia, telefone, transporte, documentos, escola dos filhos, banco e uma rotina básica costuma ser prioridade."],
    ["Preciso resolver tudo na primeira semana?", "Não. O ideal é priorizar o essencial e evitar decisões caras por pressa ou falta de informação."],
    ["Rede de apoio ajuda recém-chegados?", "Ajuda muito, mas cada informação deve ser conferida e adaptada ao seu caso."],
  ],
  "Banco e crédito": [
    ["Crédito nos EUA é importante?", "Sim. Histórico de crédito pode influenciar aluguel, financiamento, cartão, seguro e outras decisões financeiras."],
    ["Conta bancária e crédito são a mesma coisa?", "Não. Conta bancária ajuda na rotina financeira, mas histórico de crédito envolve pagamentos, limites, tempo e comportamento."],
    ["Recém-chegado consegue construir crédito?", "Muitos conseguem, mas normalmente é um processo gradual que exige disciplina e pagamentos em dia."],
  ],
  "Adaptação cultural": [
    ["Costumes brasileiros podem causar problema nos EUA?", "Alguns podem, dependendo do contexto. Escola, polícia, trânsito, redes sociais e comportamento público exigem cuidado."],
    ["Choque cultural é normal?", "Sim. Regras, comunicação, trabalho, escola e convivência podem funcionar de forma diferente do Brasil."],
    ["Como evitar problemas culturais?", "Observe, pergunte, leia regras locais e evite justificar atitudes apenas com 'no Brasil é normal'."],
  ],
  "Notícias dos EUA": [
    ["Notícias dos EUA afetam brasileiros?", "Algumas sim, especialmente quando envolvem imigração, saúde, segurança, economia, viagens ou relações Brasil-EUA."],
    ["Devo tomar decisão só com base em notícia?", "Não. Notícias ajudam a entender o cenário, mas decisões práticas devem considerar fontes oficiais e orientação adequada."],
    ["Por que verificar fontes?", "Porque boatos sobre EUA e imigração circulam rápido. Fontes oficiais reduzem risco de desinformação."],
  ],
};

const priorityExpansions = {
  "primeiros-30-dias-nos-eua.html": `
          <h2>Como transformar os primeiros 30 dias em um plano real</h2>
          <p>
            O maior erro de muitos recém-chegados é tentar resolver tudo ao mesmo tempo. Nos primeiros dias, o ideal é separar o que é urgente do que pode esperar: moradia temporária, telefone, transporte, mercado e documentos básicos vêm antes de compras grandes ou decisões definitivas.
          </p>
          <p>
            Para famílias com filhos, escola e endereço costumam andar juntos. Por isso, antes de fechar aluguel longo, vale entender região, transporte, distância do trabalho e rotina. Se você ainda está organizando documentos, veja também nosso guia sobre <a href="documentos-para-imigrar-para-os-eua.html">documentos para imigrar para os EUA</a>.
          </p>
          <ul>
            <li>Na primeira semana: telefone, endereço temporário, mercado e transporte.</li>
            <li>Nas primeiras duas semanas: banco, escola, rotina de trabalho e documentos.</li>
            <li>No primeiro mês: orçamento real, moradia mais estável e próximos passos da família.</li>
          </ul>
`,
  "trabalho-nos-eua-para-brasileiros-2026.html": `
          <h2>Como começar protegido no mercado de trabalho</h2>
          <p>
            A pressa para ganhar em dólar é compreensível, mas ela não pode fazer o brasileiro aceitar qualquer combinado. Antes de começar, pergunte valor, forma de pagamento, horário, função e se o trabalho será por dia, por hora, por contrato ou por indicação.
          </p>
          <p>
            Também é importante anotar horas, guardar mensagens e evitar acumular muitos dias sem receber. Em áreas como construção, cleaning, restaurantes e delivery, a indicação ajuda muito, mas clareza no combinado ajuda ainda mais. Para entender salários e expectativa real, leia também <a href="quanto-ganha-um-brasileiro-nos-eua-2026.html">quanto ganha um brasileiro nos EUA em 2026</a>.
          </p>
`,
  "quanto-ganha-um-brasileiro-nos-eua-2026.html": `
          <h2>Salário nos EUA precisa ser comparado com custo de vida</h2>
          <p>
            Um valor que parece alto em dólar pode encolher rápido quando entram aluguel, carro, seguro, gasolina, mercado e saúde. Por isso, a pergunta certa não é apenas quanto ganha, mas quanto sobra depois das despesas básicas.
          </p>
          <p>
            O mesmo salário pode funcionar bem para uma pessoa solteira dividindo casa e ser apertado para uma família com filhos, carro financiado e aluguel alto. Antes de decidir mudar de cidade ou aceitar proposta, compare renda com o nosso guia de <a href="custo-de-vida-nos-eua-2026-atualizado.html">custo de vida nos EUA em 2026</a>.
          </p>
`,
  "quanto-custa-alugar-casa-nos-eua-2026.html": `
          <h2>Como reduzir risco antes de fechar aluguel</h2>
          <p>
            Para brasileiros recém-chegados, o aluguel costuma ser uma das decisões mais caras. Antes de entregar depósito, confirme se o anúncio é real, visite o imóvel quando possível, desconfie de pressa exagerada e evite enviar dinheiro sem contrato ou comprovação.
          </p>
          <p>
            Também vale entender se água, internet, lixo, estacionamento ou manutenção estão inclusos. Um aluguel aparentemente barato pode sair caro quando todas as taxas entram na conta. Se você ainda não entende crédito, veja também <a href="como-funciona-o-credito-nos-eua.html">como funciona o crédito nos EUA</a>.
          </p>
`,
  "como-funciona-o-credito-nos-eua.html": `
          <h2>Plano simples para construir crédito com responsabilidade</h2>
          <p>
            Construir crédito nos EUA não é correr atrás de limite alto. É mostrar constância. Para quem está começando, um cartão secured, pagamentos em dia e uso controlado do limite podem ajudar a criar histórico com menos risco.
          </p>
          <p>
            O erro é tratar crédito como renda extra. Crédito é ferramenta, não dinheiro sobrando. Quem usa sem controle pode prejudicar aluguel, financiamento e até o orçamento da família. Esse tema se conecta diretamente com <a href="como-abrir-conta-em-banco-nos-eua.html">abrir conta em banco nos EUA</a> e com decisões de moradia.
          </p>
`,
};

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, value) {
  fs.writeFileSync(file, value, "utf8");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripTags(value) {
  return String(value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function getMeta(html, name) {
  return (html.match(new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']*)["']`, "i")) || [null, ""])[1];
}

function getCanonical(html, fileName) {
  return (html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i) || [null, `${SITE}/articles/${fileName}`])[1];
}

function getTitle(html) {
  return stripTags((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<title>([\s\S]*?)<\/title>/i) || [null, ""])[1]);
}

function getCategory(html, article) {
  return article?.category
    || stripTags((html.match(/<div class=["']eyebrow["']>([\s\S]*?)<\/div>/i) || [null, "Vida real nos EUA"])[1]);
}

function getReadTime(html, article) {
  return article?.readTime || ((html.match(/(\d+\s*min de leitura)/i) || [null, "8 min de leitura"])[1]);
}

function inferDate(html, article) {
  const ldDate = (html.match(/"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})"/) || [null, ""])[1];
  return article?.date || ldDate || "2026-05-21";
}

function makeBlogPosting({ title, description, canonical, date, modified, image }) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url: canonical,
    datePublished: date,
    dateModified: modified,
    inLanguage: "pt-BR",
    author: { "@type": "Organization", name: "FamiliaUSA1" },
    publisher: { "@type": "Organization", name: "FamiliaUSA1" },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    image,
  };
}

function makeFaqPage(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

function scriptTag(obj) {
  return `    <script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n    </script>`;
}

function removeLdJsonBlocks(html, predicate) {
  return html.replace(/    <script type="application\/ld\+json">\n([\s\S]*?)\n    <\/script>\n?/g, (full, json) => {
    try {
      const parsed = JSON.parse(json);
      if (predicate(parsed)) {
        return "";
      }
    } catch {
      return full;
    }
    return full;
  });
}

function hasLdType(html, type) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">\n([\s\S]*?)\n\s*<\/script>/g)];
  return blocks.some(([, json]) => {
    try {
      const parsed = JSON.parse(json);
      return parsed["@type"] === type || parsed["@type"] === "Article" && type === "BlogPosting";
    } catch {
      return false;
    }
  });
}

function ensureBlogPosting(html, fileName, article) {
  const canonical = getCanonical(html, fileName);
  const title = getTitle(html);
  const description = getMeta(html, "description") || article?.description || title;
  const image = (html.match(/<meta property=["']og:image["'] content=["']([^"']*)["']/i) || [null, DEFAULT_IMAGE])[1];
  const date = inferDate(html, article);
  const modified = article?.modified || date;
  html = removeLdJsonBlocks(html, (obj) => obj["@type"] === "Article" || obj["@type"] === "BlogPosting");
  return html.replace(/\s*<\/head>/, `\n${scriptTag(makeBlogPosting({ title, description, canonical, date, modified, image }))}\n  </head>`);
}

function extractVisibleFaq(html) {
  const faqSection = html.match(/<section class=["']faq-section["'][^>]*>([\s\S]*?)<\/section>/i);
  if (!faqSection) return [];
  const pairs = [];
  const regex = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = regex.exec(faqSection[1])) && pairs.length < 6) {
    pairs.push([stripTags(match[1]), stripTags(match[2])]);
  }
  return pairs;
}

function ensureVisibleFaq(html, category) {
  if (/<section class=["']faq-section["']/.test(html)) {
    return html;
  }
  const faqs = categoryFaqs[category] || categoryFaqs["Vida real nos EUA"];
  const section = `
          <section class="faq-section">
            <h2>Perguntas frequentes</h2>
${faqs.map(([question, answer]) => `            <h3>${escapeHtml(question)}</h3>\n            <p>${escapeHtml(answer)}</p>`).join("\n")}
          </section>
`;
  if (html.includes('<section class="source-list">')) {
    return html.replace(/\s*<section class="source-list">/, `\n${section}\n          <section class="source-list">`);
  }
  if (html.includes('<nav class="article-nav"')) {
    return html.replace(/\s*<nav class="article-nav"/, `\n${section}\n          <nav class="article-nav"`);
  }
  return html.replace(/\s*<\/article>/, `\n${section}\n        </article>`);
}

function ensureFaqSchema(html, category) {
  html = removeLdJsonBlocks(html, (obj) => obj["@type"] === "FAQPage");
  const faqs = extractVisibleFaq(html);
  const selectedFaqs = faqs.length ? faqs : (categoryFaqs[category] || categoryFaqs["Vida real nos EUA"]);
  return html.replace(/\s*<\/head>/, `\n${scriptTag(makeFaqPage(selectedFaqs))}\n  </head>`);
}

function maybeExpandPriorityArticle(html, fileName) {
  if (!priorityExpansions[fileName] || html.includes("<!-- SEO expansion 2026-05-21 -->")) {
    return html;
  }
  const block = `\n          <!-- SEO expansion 2026-05-21 -->\n${priorityExpansions[fileName]}`;
  if (html.includes('<section class="related-links">')) {
    return html.replace(/\s*<section class="related-links">/, `${block}\n          <section class="related-links">`);
  }
  if (html.includes('<section class="faq-section">')) {
    return html.replace(/\s*<section class="faq-section">/, `${block}\n          <section class="faq-section">`);
  }
  return html.replace(/\s*<section class="source-list">/, `${block}\n          <section class="source-list">`);
}

function normalizeArticleIndex() {
  const index = JSON.parse(read(ARTICLES_JSON));
  const byUrl = new Map(index.articles.map((article) => [article.url, article]));
  for (const article of missingVisaArticles) {
    byUrl.set(article.url, { ...byUrl.get(article.url), ...article });
  }
  const existing = index.articles.filter((article) => !missingVisaArticles.some((item) => item.url === article.url));
  const insertAfterUrl = "articles/guia-completo-visto-americano-2026.html";
  const normalizedExisting = existing.map((article) => ({
    ...article,
    category: categoryAliases.get(article.category) || article.category,
  }));
  const normalizedMissing = missingVisaArticles.map((article) => ({
    ...article,
    category: categoryAliases.get(article.category) || article.category,
  }));
  const result = [];
  let inserted = false;
  for (const article of normalizedExisting) {
    result.push(article);
    if (article.url === insertAfterUrl) {
      result.push(...normalizedMissing);
      inserted = true;
    }
  }
  if (!inserted) {
    result.unshift(...normalizedMissing);
  }
  const seen = new Set();
  index.articles = result.filter((article) => {
    if (seen.has(article.url)) return false;
    seen.add(article.url);
    return true;
  });
  write(ARTICLES_JSON, `${JSON.stringify(index, null, 2)}\n`);
  return index.articles;
}

function postCard(article) {
  return `          <article class="card post-card">
            <div class="post-category">${escapeHtml(article.category)}</div>
            <h2><a href="${escapeHtml(article.url)}">${escapeHtml(article.title)}</a></h2>
            <p>${escapeHtml(article.description)}</p>
            <div class="post-meta">
              <span>${escapeHtml(article.readTime.replace(" de leitura", ""))}</span>
              <a class="read-more" href="${escapeHtml(article.url)}">Ler artigo →</a>
            </div>
          </article>`;
}

function updateBlogCards(articles) {
  let html = read(BLOG_HTML);
  const urls = missingVisaArticles.map((article) => article.url);
  for (const url of urls) {
    html = html.replace(new RegExp(`\\s*<article class="card post-card">[\\s\\S]*?href="${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?<\\/article>`, "g"), "");
  }
  const cards = articles.filter((article) => urls.includes(article.url)).map(postCard).join("\n");
  const anchor = '          <article class="card post-card">\n            <div class="post-category">Planejamento</div>\n            <h2><a href="articles/quanto-dinheiro-levar-para-os-eua-2026-experiencia-real.html">Dá para começar a vida nos EUA com pouco dinheiro?</a></h2>';
  if (html.includes(anchor)) {
    html = html.replace(anchor, `${cards}\n${anchor}`);
  } else {
    html = html.replace('        <div class="article-grid">', `        <div class="article-grid">\n${cards}`);
  }
  write(BLOG_HTML, html);
}

function updateCategories(articles) {
  let html = read(CATEGORIES_HTML);
  const counts = articles.reduce((acc, article) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
  }, {});
  const replacements = [
    ["Visto americano", "articles/quanto-tempo-demora-visto-americano-2026.html"],
    ["Orlando e Disney", "articles/guia-completo-orlando-2026-brasileiros.html"],
    ["Notícias dos EUA", "articles/novo-virus-em-cruzeiros-o-que-e-verdade.html"],
    ["Vida real nos EUA", "articles/solidao-de-morar-nos-eua.html"],
    ["Trabalho e renda", "articles/7-erros-trabalho-brasileiros-eua.html"],
    ["Primeiros passos", "articles/primeiros-30-dias-nos-eua.html"],
    ["Custo de vida", "articles/custo-de-vida-nos-eua-2026-atualizado.html"],
    ["Moradia nos EUA", "articles/quanto-custa-alugar-casa-nos-eua-2026.html"],
    ["Adaptação cultural", "articles/coisas-comuns-no-brasil-que-dao-problema-nos-eua.html"],
    ["Imigração e legalização", "articles/situacoes-causar-deportacao-problemas-legais-eua.html"],
    ["Planejamento", "articles/quanto-dinheiro-levar-para-os-eua-2026-experiencia-real.html"],
    ["Família e filhos", "articles/como-matricular-filho-na-escola-nos-eua.html"],
    ["Banco e crédito", "articles/como-abrir-conta-em-banco-nos-eua.html"],
    ["Saúde nos EUA", "articles/seguro-saude-nos-eua-para-brasileiros.html"],
  ];
  for (const [category, link] of replacements) {
    const count = counts[category] || 0;
    const label = `${count} ${count === 1 ? "artigo" : "artigos"}`;
    const escapedLink = link.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    html = html.replace(new RegExp(`(<h2 class="category-title"><a href="${escapedLink}">[\\s\\S]*?<div class="post-meta"><span>)([^<]+)(<\\/span>)`), `$1${label}$3`);
  }
  write(CATEGORIES_HTML, html);
}

const articles = normalizeArticleIndex();
const articleByUrl = new Map(articles.map((article) => [article.url, article]));

for (const fileName of fs.readdirSync(ARTICLES_DIR).filter((file) => file.endsWith(".html"))) {
  const filePath = path.join(ARTICLES_DIR, fileName);
  const article = articleByUrl.get(`articles/${fileName}`);
  let html = read(filePath);
  const category = categoryAliases.get(getCategory(html, article)) || getCategory(html, article);

  html = maybeExpandPriorityArticle(html, fileName);
  html = ensureVisibleFaq(html, category);
  html = ensureBlogPosting(html, fileName, article);
  html = ensureFaqSchema(html, category);

  if (article && category !== article.category) {
    html = html.replace(/<div class="eyebrow">[\s\S]*?<\/div>/, `<div class="eyebrow">${escapeHtml(category)}</div>`);
  }

  write(filePath, html);
}

updateBlogCards(articles);
updateCategories(articles);

console.log("SEO maintenance complete: index, schemas, FAQ blocks, priority expansions and category hubs updated.");
