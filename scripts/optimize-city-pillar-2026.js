const fs = require("node:fs");

const SITE = "https://familiausa1.com";
const PAGE_URL = `${SITE}/categorias/cidades-da-florida.html`;
const SHARE_IMAGE = `${SITE}/assets/images/familiausa1-share.svg`;

const cities = [
  {
    name: "Tampa",
    url: "../articles/quanto-custa-morar-em-tampa-2026.html",
    cost: "US$ 6,500 a US$ 9,800",
    rent: "US$ 2,700 a US$ 4,200",
    work: "construcao, saude, logistica, restaurantes e servicos",
    profile: "familias que querem emprego, aeroporto forte e boa estrutura urbana",
    description: "Tampa costuma ser uma das escolhas mais equilibradas para brasileiros: tem trabalho, aeroporto, bairros familiares e acesso a praias, mas exige carro e planejamento com aluguel.",
  },
  {
    name: "Orlando",
    url: "../articles/quanto-custa-morar-em-orlando-2026.html",
    cost: "US$ 6,500 a US$ 9,500",
    rent: "US$ 2,500 a US$ 3,800",
    work: "turismo, parques, hotelaria, limpeza, restaurantes e construcao",
    profile: "quem quer comunidade brasileira forte e oportunidades ligadas a turismo",
    description: "Orlando e muito procurada por brasileiros porque combina comunidade, parques, compras e aeroporto. O ponto de atencao e depender demais de renda sazonal e de carro.",
  },
  {
    name: "Kissimmee",
    url: "../articles/quanto-custa-morar-em-kissimmee-2026.html",
    cost: "US$ 6,000 a US$ 8,800",
    rent: "US$ 2,300 a US$ 3,500",
    work: "Airbnb, limpeza, turismo, manutencao, restaurantes e servicos",
    profile: "familias que querem ficar perto de Orlando e Disney gastando menos",
    description: "Kissimmee pode fazer sentido para quem trabalha perto dos parques ou em servicos ligados ao turismo. E uma cidade pratica, mas com transito e muita rotatividade em algumas areas.",
  },
  {
    name: "Lakeland",
    url: "../articles/quanto-custa-morar-em-lakeland-2026.html",
    cost: "US$ 5,200 a US$ 7,600",
    rent: "US$ 2,000 a US$ 3,200",
    work: "logistica, armazens, varejo, construcao e saude",
    profile: "quem aceita morar entre Tampa e Orlando para pagar menos",
    description: "Lakeland e uma alternativa para quem busca custo menor e mais espaco. Funciona melhor para quem trabalha remoto, hibrido ou aceita deslocamentos maiores.",
  },
  {
    name: "Jacksonville",
    url: "../articles/quanto-custa-morar-em-jacksonville-2026.html",
    cost: "US$ 5,600 a US$ 8,200",
    rent: "US$ 2,200 a US$ 3,600",
    work: "porto, logistica, saude, transporte, construcao e servicos",
    profile: "quem quer cidade grande com custo menor que o sul da Florida",
    description: "Jacksonville oferece tamanho, mercado e custo mais acessivel que Miami ou Boca. A atencao precisa estar nos bairros, porque a cidade e grande e bem espalhada.",
  },
  {
    name: "Miami",
    url: "../articles/quanto-custa-morar-em-miami-2026.html",
    cost: "US$ 8,800 a US$ 13,500",
    rent: "US$ 4,300 a US$ 7,500",
    work: "turismo, estetica, comercio, imoveis, restaurantes e servicos",
    profile: "quem chega com renda melhor, trabalho definido ou negocio",
    description: "Miami tem oportunidades, comunidade latina enorme e conexao internacional. Mas e uma das escolhas mais caras da Florida para quem chega sem renda definida.",
  },
  {
    name: "Fort Lauderdale",
    url: "../articles/quanto-custa-morar-em-fort-lauderdale-2026.html",
    cost: "US$ 8,200 a US$ 12,000",
    rent: "US$ 4,000 a US$ 6,800",
    work: "turismo, marinas, construcao, saude, restaurantes e servicos",
    profile: "quem quer sul da Florida com praia e acesso a Miami",
    description: "Fort Lauderdale pode ser uma alternativa a Miami para quem quer praia, aeroporto e mercado de servicos. Ainda assim, aluguel e seguro de carro pesam bastante.",
  },
  {
    name: "Boca Raton",
    url: "../articles/quanto-custa-morar-em-boca-raton-2026.html",
    cost: "US$ 9,000 a US$ 14,000",
    rent: "US$ 4,500 a US$ 8,000",
    work: "servicos premium, saude, estetica, restaurantes, imoveis e tecnologia",
    profile: "familias com renda estavel que priorizam escolas e estrutura",
    description: "Boca Raton tem perfil familiar e organizado, mas exige renda mais forte. E melhor para quem ja chega com trabalho, reserva ou servico voltado a publico de maior renda.",
  },
  {
    name: "Sarasota",
    url: "../articles/quanto-custa-morar-em-sarasota-2026.html",
    cost: "US$ 7,400 a US$ 11,200",
    rent: "US$ 3,500 a US$ 6,500",
    work: "turismo, saude, construcao, limpeza, manutencao e servicos",
    profile: "quem busca praia, rotina mais calma e qualidade de vida",
    description: "Sarasota atrai quem quer vida mais tranquila e praias valorizadas. O desafio e que custo de moradia pode ser alto e o mercado de trabalho e menor que Tampa ou Orlando.",
  },
  {
    name: "Naples",
    url: "../articles/quanto-custa-morar-em-naples-2026.html",
    cost: "US$ 9,200 a US$ 14,500",
    rent: "US$ 5,000 a US$ 9,000",
    work: "servicos residenciais, construcao, jardinagem, hotelaria e manutencao",
    profile: "quem trabalha com servicos premium ou busca cidade costeira mais exclusiva",
    description: "Naples tem qualidade visual forte e mercado de servicos de alto padrao, mas nao e a cidade mais facil para recem-chegados sem reserva e renda bem planejada.",
  },
];

const internalLinks = [
  ["Custo de vida nos EUA 2026", "../articles/custo-de-vida-nos-eua-2026-atualizado.html"],
  ["Quanto custa alugar casa nos EUA", "../articles/quanto-custa-alugar-casa-nos-eua-2026.html"],
  ["Quanto custa ter carro nos EUA", "../articles/quanto-custa-ter-carro-nos-eua-2026.html"],
  ["Seguro saude nos EUA", "../articles/seguro-saude-nos-eua-como-funciona-2026.html"],
  ["Trabalho nos EUA para brasileiros", "../articles/trabalho-nos-eua-para-brasileiros-2026.html"],
  ["Morar legalmente nos EUA", "../articles/morar-legalmente-nos-eua-caminhos-possiveis-2026.html"],
];

const sources = [
  ["U.S. Census Bureau QuickFacts", "https://www.census.gov/quickfacts/"],
  ["HUD FY 2026 Fair Market Rents", "https://www.huduser.gov/portal/datasets/fmr.html"],
  ["RentCafe Market Trends / Yardi Matrix", "https://www.rentcafe.com/average-rent-market-trends/us/fl/"],
  ["Realtor.com Florida housing and rental market trends", "https://www.realtor.com/local/market/florida"],
  ["AAA Gas Prices", "https://gasprices.aaa.com/"],
  ["Investing.com USD/BRL historical data", "https://www.investing.com/currencies/usd-brl-historical-data"],
];

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Melhores cidades da Florida para brasileiros morarem em 2026",
  description: "Compare as melhores cidades da Florida para brasileiros morarem em 2026, com custo de vida, aluguel, trabalho, escolas, carro, seguranca e comunidade brasileira.",
  url: PAGE_URL,
  inLanguage: "pt-BR",
  publisher: { "@type": "Organization", name: "FamiliaUSA1" },
  mainEntity: cities.map((city) => ({
    "@type": "BlogPosting",
    headline: `Quanto custa morar em ${city.name} em 2026?`,
    url: `${SITE}/${city.url.replace("../", "")}`,
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE}/` },
    { "@type": "ListItem", position: 2, name: "Categorias", item: `${SITE}/categorias.html` },
    { "@type": "ListItem", position: 3, name: "Cidades da Florida", item: PAGE_URL },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Qual a melhor cidade da Florida para brasileiros morarem em 2026?",
      acceptedAnswer: { "@type": "Answer", text: "Depende do perfil. Orlando e Kissimmee costumam ajudar quem busca comunidade brasileira e turismo; Tampa equilibra trabalho e custo; Lakeland pode ser mais barata; Miami, Boca, Fort Lauderdale, Sarasota e Naples exigem renda maior." },
    },
    {
      "@type": "Question",
      name: "Qual cidade da Florida tem custo de vida mais baixo?",
      acceptedAnswer: { "@type": "Answer", text: "Entre as cidades comparadas, Lakeland, Jacksonville e Kissimmee tendem a ter faixas mais acessiveis, mas aluguel, carro, seguro, escola e distancia do trabalho podem mudar a conta." },
    },
    {
      "@type": "Question",
      name: "Brasileiro precisa de carro para morar na Florida?",
      acceptedAnswer: { "@type": "Answer", text: "Na maioria dos casos, sim. A rotina na Florida costuma depender de carro para trabalho, escola, mercado, medico e igreja. Por isso, o custo de carro deve entrar na decisao da cidade." },
    },
    {
      "@type": "Question",
      name: "E seguro morar na Florida?",
      acceptedAnswer: { "@type": "Answer", text: "Seguranca varia por bairro, rua, horario e rotina. Nenhuma cidade deve ser tratada como totalmente segura. Antes de alugar, pesquise crime maps, escolas, iluminacao, comercio e converse com moradores." },
    },
    {
      "@type": "Question",
      name: "Qual cidade da Florida e melhor para familia com filhos?",
      acceptedAnswer: { "@type": "Answer", text: "Familias devem priorizar escola, aluguel, distancia do trabalho, seguro de carro, comunidade e acesso a saude. Tampa, Orlando, Lakeland, Boca Raton e Sarasota podem funcionar para perfis diferentes." },
    },
  ],
};

const cityRows = cities.map((city) => `
          <tr>
            <td><a href="${city.url}">${city.name}</a></td>
            <td>${city.cost}</td>
            <td>${city.rent}</td>
            <td>${city.work}</td>
            <td>${city.profile}</td>
          </tr>`).join("");

const cityCards = cities.map((city) => `
          <article class="card post-card">
            <div class="post-category">Cidades da Florida</div>
            <h2><a href="${city.url}">${city.name}: custo de vida e realidade para brasileiros</a></h2>
            <p>${city.description}</p>
            <div class="post-meta"><span>13 min de leitura</span><a class="read-more" href="${city.url}">Ler guia -></a></div>
          </article>`).join("");

const internalList = internalLinks.map(([label, url]) => `<li><a href="${url}">${label}</a></li>`).join("");
const sourceList = sources.map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${label}</a></li>`).join("");

const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-5RND6F4L8G"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-5RND6F4L8G');</script>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Melhores cidades da Florida para brasileiros em 2026</title>
    <meta name="description" content="Compare as melhores cidades da Florida para brasileiros: custo de vida, aluguel, trabalho, escolas, carro e comunidade em 2026." />
    <meta name="author" content="FamiliaUSA1" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${PAGE_URL}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Melhores cidades da Florida para brasileiros em 2026" />
    <meta property="og:description" content="Compare custo de vida, aluguel, trabalho, escolas, carro e comunidade brasileira nas principais cidades da Florida." />
    <meta property="og:url" content="${PAGE_URL}" />
    <meta property="og:image" content="${SHARE_IMAGE}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Melhores cidades da Florida para brasileiros em 2026" />
    <meta name="twitter:description" content="Guia pilar com comparativo de cidades da Florida para brasileiros que querem morar nos EUA." />
    <meta name="twitter:image" content="${SHARE_IMAGE}" />
    <link rel="stylesheet" href="../assets/css/styles.css" />
    <script type="application/ld+json">${JSON.stringify(collectionSchema, null, 2)}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumbSchema, null, 2)}</script>
    <script type="application/ld+json">${JSON.stringify(faqSchema, null, 2)}</script>
  </head>
  <body>
    <header class="site-header"><div class="container header-inner"><a href="../index.html" aria-label="FamiliaUSA1 - pagina inicial"><div class="brand">FamiliaUSA1</div><div class="tagline">Vida real de brasileiros nos Estados Unidos</div></a><nav class="nav" aria-label="Navegacao principal"><a href="../index.html">Inicio</a><a href="../blog.html">Artigos</a><a href="../categorias.html">Categorias</a><a href="../sobre.html">Sobre</a></nav></div></header>
    <main>
      <section class="container page-title">
        <nav class="breadcrumb" aria-label="Breadcrumb"><a href="../index.html">Inicio</a><span><a href="../categorias.html">Categorias</a></span><span>Cidades da Florida</span></nav>
        <div class="eyebrow">Pagina pilar</div>
        <h1>Melhores cidades da Florida para brasileiros morarem em 2026</h1>
        <p>Compare Tampa, Orlando, Kissimmee, Lakeland, Jacksonville, Miami, Fort Lauderdale, Boca Raton, Sarasota e Naples antes de escolher onde morar nos Estados Unidos.</p>
      </section>

      <section class="narrow-container article-content">
        <h2>Qual cidade da Florida combina com sua realidade?</h2>
        <p>Brasileiro que pesquisa onde morar na Florida geralmente quer uma resposta simples: qual cidade e melhor? A verdade e que a melhor cidade depende do seu trabalho, documentacao, renda, filhos, reserva financeira, ingles, carro e rede de apoio.</p>
        <p>Este guia foi criado como uma pagina pilar para organizar essa decisao. Aqui voce compara custo de vida, aluguel, setores de trabalho, perfil familiar e pontos de atencao das principais cidades da Florida para brasileiros em 2026.</p>
        <p>Importante: os valores sao faixas de planejamento. Aluguel, seguro, escola e seguranca mudam por bairro, condominio, rua e momento do mercado. Use a tabela para filtrar possibilidades e depois leia o guia completo da cidade que mais combina com sua familia.</p>

        <div class="final-article-cta">
          <h2>Comece pela conta principal: custo de vida</h2>
          <p>Antes de escolher cidade, entenda quanto custa viver nos Estados Unidos com aluguel, carro, mercado, saude, escola e imprevistos.</p>
          <div class="actions"><a class="button primary" href="../articles/custo-de-vida-nos-eua-2026-atualizado.html">Ver custo de vida nos EUA</a><a class="button secondary" href="../articles/quanto-custa-alugar-casa-nos-eua-2026.html">Ver aluguel nos EUA</a></div>
        </div>

        <h2>Tabela comparativa das cidades da Florida</h2>
        <p>A tabela abaixo resume o custo mensal estimado para uma familia, aluguel de moradia familiar, setores de trabalho e melhor perfil de morador. Para detalhes de solteiro, casal, escolas, seguranca e transporte, abra o artigo completo de cada cidade.</p>
        <table>
          <thead><tr><th>Cidade</th><th>Custo familia/mês</th><th>Aluguel familiar</th><th>Trabalho comum</th><th>Melhor perfil</th></tr></thead>
          <tbody>${cityRows}
          </tbody>
        </table>

        <h2>Resumo das 10 cidades para brasileiros</h2>
        <p>As descricoes abaixo ajudam a entender rapidamente o papel de cada cidade dentro do cluster. Clique no guia completo para ver custo por solteiro, casal e familia, aluguel por tipo de moradia, pontos positivos, pontos negativos, escolas, carro, aeroportos e comparacao em reais.</p>
        <div class="article-grid">${cityCards}
        </div>

        <h2>Como decidir onde morar na Florida</h2>
        <p>Para brasileiros, a decisao costuma ficar mais clara quando a familia responde cinco perguntas: onde vou trabalhar, quanto posso pagar de aluguel, meus filhos precisam de qual escola, vou depender de dois carros e tenho reserva para pelo menos os primeiros meses?</p>
        <p>Quem chega com pouca reserva pode sofrer em cidades caras como Miami, Boca Raton e Naples. Quem precisa de comunidade brasileira pode se sentir mais acolhido em Orlando, Kissimmee, Tampa e partes do sul da Florida. Quem quer baixar custo pode olhar Lakeland ou Jacksonville, mas precisa aceitar distancia e dependencia de carro.</p>
        <p>Tambem nao escolha cidade apenas por seguranca percebida. Pesquise bairros, crime maps, escolas, rota ate o trabalho, iluminacao, comercio, transporte e custo do seguro de carro no endereco provavel.</p>

        <div class="final-article-cta">
          <h2>Vai morar nos EUA? Planeje tambem a parte legal</h2>
          <p>Escolher cidade e importante, mas morar nos Estados Unidos exige documentacao, estrategia e cuidado com promessas faceis.</p>
          <div class="actions"><a class="button primary" href="../articles/morar-legalmente-nos-eua-caminhos-possiveis-2026.html">Ver caminhos para morar legalmente</a><a class="button secondary" href="../articles/e-facil-se-legalizar-nos-eua.html">Entender legalizacao nos EUA</a></div>
        </div>

        <h2>Leituras fundamentais antes de escolher cidade</h2>
        <ul>${internalList}</ul>

        <section class="faq-section">
          <h2>Perguntas frequentes</h2>
          <h3>Qual a melhor cidade da Florida para brasileiros morarem em 2026?</h3>
          <p>Depende do perfil. Orlando e Kissimmee ajudam quem busca comunidade brasileira e turismo; Tampa equilibra trabalho e estrutura; Lakeland e Jacksonville podem ter custo menor; Miami, Boca, Fort Lauderdale, Sarasota e Naples exigem renda maior.</p>
          <h3>Qual cidade da Florida tem custo de vida mais baixo?</h3>
          <p>Entre as cidades comparadas, Lakeland, Jacksonville e Kissimmee tendem a ter faixas mais acessiveis. Mesmo assim, aluguel, carro, seguro, escola e distancia do trabalho podem mudar completamente a conta.</p>
          <h3>Brasileiro precisa de carro para morar na Florida?</h3>
          <p>Na maioria dos casos, sim. A rotina na Florida costuma depender de carro para trabalho, escola, mercado, medico, igreja e lazer. Por isso, carro, seguro, gasolina e pedagio precisam entrar na escolha da cidade.</p>
          <h3>E seguro morar na Florida?</h3>
          <p>Seguranca varia por bairro, rua, horario e rotina. Nenhuma cidade deve ser tratada como totalmente segura. Antes de alugar, pesquise crime maps, escolas, iluminacao, comercio e converse com moradores.</p>
          <h3>Qual cidade da Florida e melhor para familia com filhos?</h3>
          <p>Familias devem priorizar escola, aluguel, distancia do trabalho, seguro de carro, comunidade e acesso a saude. Tampa, Orlando, Lakeland, Boca Raton e Sarasota podem funcionar para perfis diferentes.</p>
        </section>

        <h2>Fontes de referencia</h2>
        <ul>${sourceList}</ul>
      </section>
    </main>
    <footer class="site-footer"><div class="container footer-inner"><div>© 2026 FamiliaUSA1. Blog para brasileiros nos Estados Unidos.</div><div class="footer-links"><a href="../index.html">Inicio</a><a href="../blog.html">Artigos</a><a href="../categorias.html">Categorias</a><a href="../sobre.html">Sobre</a></div></div></footer>
  </body>
</html>
`;

fs.writeFileSync("categorias/cidades-da-florida.html", html, "utf8");
console.log("Pagina pilar de cidades otimizada.");
