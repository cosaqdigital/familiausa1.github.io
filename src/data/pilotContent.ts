export const SITE_URL = "https://familiausa1.com";
export const DEFAULT_IMAGE = `${SITE_URL}/assets/images/familiausa1-share.svg`;

export type FAQItem = {
  question: string;
  answer: string;
};

export type PilotArticle = {
  slug: string;
  title: string;
  cardTitle?: string;
  description: string;
  category: string;
  datePublished: string;
  dateModified: string;
  readingTime: string;
  image?: string;
  excerpt: string;
  content: string;
  faq?: FAQItem[];
  relatedSlugs?: string[];
};

export type PilotCategory = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  articleSlugs: string[];
};

export const pilotArticles: PilotArticle[] = [
  {
    slug: "custo-de-vida-nos-eua-2026-atualizado",
    title: "Custo de vida nos EUA em 2026: aluguel, mercado, carro e contas",
    cardTitle: "Custo de vida nos EUA em 2026",
    description: "Veja os principais custos para brasileiros nos Estados Unidos em 2026: aluguel, mercado, carro, escola, saúde e planejamento familiar.",
    category: "Custo de vida",
    datePublished: "2026-05-19",
    dateModified: "2026-06-05",
    readingTime: "12 min de leitura",
    image: DEFAULT_IMAGE,
    excerpt: "Um guia piloto para validar layout, SEO e links internos do cluster de custo de vida antes da migração completa para Astro.",
    relatedSlugs: [
      "cidades-da-florida-com-mais-brasileiros-2026",
      "morar-legalmente-nos-eua-caminhos-possiveis-2026",
      "morar-em-boston-2026"
    ],
    content: `
      <p>O custo de vida nos EUA em 2026 depende muito da cidade, do tamanho da família, da necessidade de carro, do tipo de moradia e do padrão de consumo. Para brasileiros, a maior diferença costuma aparecer no aluguel, seguro, saúde, alimentação e transporte.</p>
      <p>Esta versão piloto em Astro não substitui o artigo completo atual. Ela existe para validar se o novo sistema consegue preservar URL, canonical, schema, links internos, CTA e leitura em formato de blog.</p>
      <h2>Principais custos para brasileiros</h2>
      <ul>
        <li>Aluguel e depósito inicial.</li>
        <li>Mercado, produtos de limpeza e itens básicos da casa.</li>
        <li>Carro, seguro, gasolina e manutenção.</li>
        <li>Saúde, consultas, emergência e seguro.</li>
        <li>Escola, uniforme, material e rotina com filhos.</li>
      </ul>
      <h2>Como usar este guia no planejamento</h2>
      <p>Antes de escolher uma cidade, compare renda possível, aluguel, transporte, escola, segurança percebida e rede de apoio. O erro mais caro é calcular apenas passagem e primeiro aluguel.</p>
      <p>Continue também pelo guia de <a href="/categorias/cidades-da-florida.html">cidades da Flórida</a> e pelo conteúdo sobre <a href="/articles/morar-legalmente-nos-eua-caminhos-possiveis-2026.html">morar legalmente nos EUA</a>.</p>
    `,
    faq: [
      {
        question: "Qual é o maior custo para brasileiros nos EUA?",
        answer: "Em muitos casos, o aluguel é o maior custo fixo, seguido por carro, seguro, mercado e saúde."
      },
      {
        question: "O custo de vida nos EUA é igual em todos os estados?",
        answer: "Não. Estados, cidades e bairros podem ter diferenças grandes de aluguel, salário, imposto, seguro e transporte."
      }
    ]
  },
  {
    slug: "morar-legalmente-nos-eua-caminhos-possiveis-2026",
    title: "Morar legalmente nos EUA em 2026: caminhos possíveis para brasileiros",
    cardTitle: "Morar legalmente nos EUA",
    description: "Entenda caminhos possíveis para morar legalmente nos EUA em 2026, com vistos, estudo, trabalho, família, green card e cuidados importantes.",
    category: "Imigração e legalização",
    datePublished: "2026-05-24",
    dateModified: "2026-06-05",
    readingTime: "13 min de leitura",
    image: DEFAULT_IMAGE,
    excerpt: "Conteúdo piloto para testar o cluster de imigração e legalização com aviso responsável e links internos fortes.",
    relatedSlugs: [
      "asilo-nos-estados-unidos-2026",
      "custo-de-vida-nos-eua-2026-atualizado",
      "morar-em-boston-2026"
    ],
    content: `
      <div class="article-note">Conteúdo informativo. Não substitui orientação de advogado de imigração licenciado nos Estados Unidos.</div>
      <p>Morar legalmente nos EUA exige entender o objetivo da mudança, o tipo de visto, os prazos, os documentos e os limites de cada status. Não existe um caminho único para todos os brasileiros.</p>
      <h2>Caminhos comuns de entrada e permanência</h2>
      <p>Entre as possibilidades mais pesquisadas estão vistos de turismo, estudo, trabalho, família, investimento, categorias profissionais, green card e processos humanitários. Cada caminho tem requisitos próprios.</p>
      <h2>O que este protótipo valida</h2>
      <p>Esta página piloto valida se o Astro consegue gerar automaticamente BlogPosting, canonical, metadados sociais, FAQ e links internos sem mudar a URL atual.</p>
      <p>Para comparar custo e cidade antes da mudança, veja também o guia de <a href="/articles/custo-de-vida-nos-eua-2026-atualizado.html">custo de vida nos EUA</a>.</p>
    `,
    faq: [
      {
        question: "Existe uma forma fácil de morar legalmente nos EUA?",
        answer: "Não existe caminho garantido ou igual para todos. Cada pessoa precisa avaliar perfil, documentos, objetivo e elegibilidade."
      },
      {
        question: "Posso trabalhar nos EUA com visto de turista?",
        answer: "Em regra, o visto de turista não autoriza trabalho nos Estados Unidos. É importante respeitar os limites do status migratório."
      }
    ]
  },
  {
    slug: "asilo-nos-estados-unidos-2026",
    title: "Asilo nos Estados Unidos em 2026: o que brasileiros precisam entender",
    cardTitle: "Asilo nos EUA em 2026",
    description: "Entenda, de forma informativa, pontos importantes sobre asilo nos Estados Unidos em 2026, riscos, documentos e cuidados para brasileiros.",
    category: "Imigração e legalização",
    datePublished: "2026-05-19",
    dateModified: "2026-06-05",
    readingTime: "12 min de leitura",
    image: DEFAULT_IMAGE,
    excerpt: "Página piloto do cluster de imigração para validar avisos, FAQ e links de apoio em tema sensível.",
    relatedSlugs: [
      "morar-legalmente-nos-eua-caminhos-possiveis-2026",
      "custo-de-vida-nos-eua-2026-atualizado"
    ],
    content: `
      <div class="article-note">Este conteúdo é informativo e não substitui avaliação jurídica individual.</div>
      <p>Asilo nos Estados Unidos é um tema sério. Não deve ser tratado como atalho migratório, promessa de documentação rápida ou solução genérica para todos os brasileiros.</p>
      <h2>Por que o tema exige cuidado</h2>
      <p>Um pedido de asilo envolve fatos, provas, prazos, entrevistas, corte de imigração em alguns casos e consequências reais para a vida da pessoa e da família.</p>
      <h2>Como a POC trata temas sensíveis</h2>
      <p>No Astro, artigos de imigração devem manter aviso informativo, linguagem responsável, fontes confiáveis quando houver dados oficiais e links para guias complementares.</p>
      <p>Leia também sobre <a href="/articles/morar-legalmente-nos-eua-caminhos-possiveis-2026.html">caminhos possíveis para morar legalmente nos EUA</a>.</p>
    `,
    faq: [
      {
        question: "Asilo é garantia de permanência nos EUA?",
        answer: "Não. Cada caso depende de fatos, documentos, elegibilidade, análise das autoridades e, em muitos casos, orientação jurídica."
      },
      {
        question: "Todo brasileiro pode pedir asilo?",
        answer: "Qualquer pessoa pode buscar informação, mas elegibilidade depende do caso concreto e dos critérios legais aplicáveis."
      }
    ]
  },
  {
    slug: "morar-em-boston-2026",
    title: "Morar em Boston em 2026: custo de vida, trabalho, estudo e inverno",
    cardTitle: "Morar em Boston",
    description: "Veja pontos essenciais sobre morar em Boston em 2026: aluguel, trabalho, estudo, transporte, inverno, comunidade brasileira e custo de vida.",
    category: "Cidades do Norte e Massachusetts",
    datePublished: "2026-06-02",
    dateModified: "2026-06-05",
    readingTime: "13 min de leitura",
    image: DEFAULT_IMAGE,
    excerpt: "Guia piloto de cidade para validar o novo cluster Norte e Massachusetts dentro do Astro.",
    relatedSlugs: [
      "custo-de-vida-nos-eua-2026-atualizado",
      "morar-legalmente-nos-eua-caminhos-possiveis-2026"
    ],
    content: `
      <p>Morar em Boston pode fazer sentido para brasileiros que buscam estudo, trabalho qualificado, transporte público melhor que a média americana e acesso a universidades, hospitais e empresas fortes.</p>
      <p>Ao mesmo tempo, Boston exige planejamento: aluguel alto, inverno rigoroso, custo de vida elevado e competição profissional fazem parte da realidade.</p>
      <h2>O que comparar antes de escolher Boston</h2>
      <ul>
        <li>Aluguel e distância do trabalho.</li>
        <li>Transporte público versus necessidade de carro.</li>
        <li>Frio, neve e adaptação familiar.</li>
        <li>Escolas, universidades e oportunidades profissionais.</li>
      </ul>
      <p>Compare também a página pilar de <a href="/categorias/cidades-do-norte-e-massachusetts.html">cidades do Norte e Massachusetts</a>.</p>
    `,
    faq: [
      {
        question: "Boston é uma cidade barata para brasileiros?",
        answer: "Não costuma ser barata. O aluguel e o custo de vida podem ser altos, especialmente perto das áreas mais centrais."
      },
      {
        question: "Dá para morar em Boston sem carro?",
        answer: "Em alguns bairros e rotinas, sim. O transporte público ajuda mais do que em muitas cidades americanas, mas depende do trabalho e da moradia."
      }
    ]
  },
  {
    slug: "cidades-da-florida-com-mais-brasileiros-2026",
    title: "Cidades da Flórida com mais brasileiros em 2026: onde morar e comparar",
    cardTitle: "Cidades da Flórida com mais brasileiros",
    description: "Compare cidades da Flórida procuradas por brasileiros em 2026, com custo de vida, trabalho, escola, carro, comunidade e qualidade de vida.",
    category: "Cidades da Flórida",
    datePublished: "2026-05-30",
    dateModified: "2026-06-05",
    readingTime: "14 min de leitura",
    image: DEFAULT_IMAGE,
    excerpt: "Página piloto para validar artigo pilar com links para cluster de cidades da Flórida.",
    relatedSlugs: [
      "custo-de-vida-nos-eua-2026-atualizado",
      "morar-em-boston-2026"
    ],
    content: `
      <p>A Flórida continua sendo uma das regiões mais pesquisadas por brasileiros por causa do clima, comunidade, turismo, oportunidades de serviço, aeroportos e vida familiar.</p>
      <h2>Não escolha apenas pela fama</h2>
      <p>Orlando, Miami, Tampa, Fort Lauderdale, Boca Raton, Kissimmee e outras cidades têm perfis muito diferentes. O ideal é comparar custo, trabalho, escola, carro, seguro, distância e rede de apoio.</p>
      <h2>Como esta POC ajuda a migração</h2>
      <p>Este artigo pilar piloto valida que conteúdos grandes poderão ser renderizados por layout, com schema, cards relacionados e CTA sem cópia manual de HTML em cada novo artigo.</p>
      <p>Veja também a categoria <a href="/categorias/cidades-da-florida.html">Cidades da Flórida</a>.</p>
    `,
    faq: [
      {
        question: "Qual cidade da Flórida tem mais brasileiros?",
        answer: "A presença brasileira varia por região. Orlando, Miami, Broward, Boca Raton, Deerfield Beach, Tampa e Kissimmee aparecem com frequência nas buscas."
      },
      {
        question: "A Flórida é sempre mais barata que Massachusetts?",
        answer: "Não necessariamente. Alguns custos podem ser menores, mas seguro, carro, aluguel e salários precisam ser comparados por cidade."
      }
    ]
  }
];

export const pilotCategories: PilotCategory[] = [
  {
    slug: "imigracao-legalizacao",
    title: "Imigração e legalização nos EUA",
    description: "Guias responsáveis sobre caminhos legais, asilo, green card, vistos e cuidados para brasileiros nos Estados Unidos.",
    intro: "Comece pelos conteúdos que explicam imigração com cuidado, sem promessas falsas e com foco em planejamento real.",
    articleSlugs: [
      "morar-legalmente-nos-eua-caminhos-possiveis-2026",
      "asilo-nos-estados-unidos-2026"
    ]
  },
  {
    slug: "custo-de-vida",
    title: "Custo de vida nos EUA",
    description: "Conteúdos sobre aluguel, mercado, carro, saúde, escola e planejamento financeiro para brasileiros nos EUA.",
    intro: "Compare custos antes de tomar decisões grandes. O planejamento financeiro é uma das bases para recomeçar com menos risco.",
    articleSlugs: ["custo-de-vida-nos-eua-2026-atualizado"]
  },
  {
    slug: "cidades-da-florida",
    title: "Cidades da Flórida para brasileiros",
    description: "Guias e comparativos para escolher onde morar na Flórida em 2026.",
    intro: "A Flórida não é uma cidade só. Compare regiões, custo, trabalho, escola, carro e comunidade antes de decidir.",
    articleSlugs: ["cidades-da-florida-com-mais-brasileiros-2026"]
  },
  {
    slug: "cidades-do-norte-e-massachusetts",
    title: "Cidades do Norte dos EUA e Massachusetts",
    description: "Compare Boston, Massachusetts, Rhode Island e New Hampshire por custo, trabalho, estudo, inverno e comunidade brasileira.",
    intro: "Para quem considera sair da Flórida ou pesquisar cidades frias, o Norte dos EUA exige uma comparação diferente: aluguel, inverno, transporte e carreira pesam bastante.",
    articleSlugs: ["morar-em-boston-2026"]
  }
];

export function articleUrl(slug: string) {
  return `/articles/${slug}.html`;
}

export function categoryUrl(slug: string) {
  return `/categorias/${slug}.html`;
}

export function canonicalUrl(path: string) {
  return `${SITE_URL}${path}`;
}

export function getArticleBySlug(slug: string) {
  return pilotArticles.find((article) => article.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return pilotCategories.find((category) => category.slug === slug);
}

export function getRelatedArticles(article: PilotArticle) {
  return (article.relatedSlugs || [])
    .map((slug) => getArticleBySlug(slug))
    .filter((post): post is PilotArticle => Boolean(post));
}

export function getArticlesByCategory(category: PilotCategory) {
  return category.articleSlugs
    .map((slug) => getArticleBySlug(slug))
    .filter((post): post is PilotArticle => Boolean(post));
}
