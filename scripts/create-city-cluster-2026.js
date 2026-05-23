const fs = require("node:fs");
const path = require("node:path");

const SITE = "https://familiausa1.com";
const DATE = "2026-05-23";
const USD_BRL = 5.02;
const SHARE_IMAGE = `${SITE}/assets/images/familiausa1-share.svg`;

const sources = [
  ["U.S. Census Bureau QuickFacts", "https://www.census.gov/quickfacts/"],
  ["HUD FY 2026 Fair Market Rents", "https://www.huduser.gov/portal/datasets/fmr.html"],
  ["RentCafe Market Trends / Yardi Matrix", "https://www.rentcafe.com/average-rent-market-trends/us/fl/"],
  ["Realtor.com Florida housing and rental market trends", "https://www.realtor.com/local/market/florida"],
  ["AAA Gas Prices", "https://gasprices.aaa.com/"],
  ["Investing.com USD/BRL historical data", "https://www.investing.com/currencies/usd-brl-historical-data"],
];

const cities = [
  {
    name: "Tampa",
    slug: "quanto-custa-morar-em-tampa-2026.html",
    county: "Hillsborough County",
    title: "Quanto custa morar em Tampa em 2026?",
    description: "Veja custo de vida em Tampa para brasileiros: aluguel, trabalho, escolas, carro, seguranca, bairros e comparacao em dolar e reais.",
    solo: [3200, 4800],
    casal: [4800, 7000],
    familia: [6500, 9800],
    rent: ["1.700 a 2.400", "2.100 a 3.200", "2.700 a 4.200"],
    work: "construcao civil, limpeza, restaurantes, saude, logistica, atendimento, tecnologia e servicos ligados ao porto e ao aeroporto",
    profile: "familias que querem estrutura urbana, aeroporto forte, empregos variados e acesso a praias sem viver no preco de Miami",
    positives: ["Mercado de trabalho diversificado", "Aeroporto internacional forte", "Comunidade brasileira crescente", "Boas opcoes ao redor como Brandon, Riverview e Wesley Chapel", "Praias a uma distancia razoavel"],
    negatives: ["Transito pesado em horarios de pico", "Aluguel subiu em varias areas", "Carro costuma ser necessario", "Seguro de carro pode pesar", "Bairros mudam muito de uma rua para outra"],
    airport: "Tampa International Airport fica dentro da propria regiao metropolitana; Orlando e praias do Golfo ficam em distancia viavel de carro.",
  },
  {
    name: "Orlando",
    slug: "quanto-custa-morar-em-orlando-2026.html",
    county: "Orange County",
    title: "Quanto custa morar em Orlando em 2026?",
    description: "Orlando em 2026 para brasileiros: custo mensal, aluguel, trabalho, escolas, carro, turismo, comunidade brasileira e pontos negativos.",
    solo: [3000, 4600],
    casal: [4600, 6800],
    familia: [6500, 9500],
    rent: ["1.600 a 2.300", "1.900 a 2.800", "2.500 a 3.800"],
    work: "turismo, hotelaria, restaurantes, limpeza, construcao, delivery, comercio, parques, manutencao e servicos para familias",
    profile: "quem quer comunidade brasileira forte, oportunidades em turismo e servicos, e acesso a parques, compras e aeroporto",
    positives: ["Comunidade brasileira muito forte", "Muitas oportunidades em turismo e servicos", "Aeroporto internacional movimentado", "Grande oferta de compras, escolas e servicos", "Boa cidade para quem vive de conteudo, turismo ou atendimento"],
    negatives: ["Transito e areas turisticas cansam", "Salarios de turismo podem variar por temporada", "Aluguel subiu em bairros procurados", "Dependencia de carro", "Calor e rotina intensa no verao"],
    airport: "Orlando International Airport e um dos principais aeroportos da Florida; Tampa, praias e Miami exigem planejamento de carro.",
  },
  {
    name: "Kissimmee",
    slug: "quanto-custa-morar-em-kissimmee-2026.html",
    county: "Osceola County",
    title: "Quanto custa morar em Kissimmee em 2026?",
    description: "Kissimmee para brasileiros em 2026: aluguel, custo de vida, trabalho perto de Orlando, escolas, carro e vida com filhos.",
    solo: [2800, 4300],
    casal: [4200, 6200],
    familia: [6000, 8800],
    rent: ["1.500 a 2.100", "1.800 a 2.600", "2.300 a 3.500"],
    work: "turismo, Airbnb, limpeza, restaurantes, manutencao, construcao, servicos domesticos, comercio e trabalhos ligados aos parques",
    profile: "familias que querem ficar perto de Orlando e Disney, com custo um pouco mais controlado que areas centrais de Orlando",
    positives: ["Muito proxima dos parques", "Comunidade latina e brasileira presente", "Boa para quem trabalha com turismo e limpeza", "Muitas casas e townhomes para familias", "Acesso a Orlando sem morar no centro"],
    negatives: ["Transito forte em rotas turisticas", "Algumas areas tem muita rotatividade de aluguel", "Renda pode depender de turismo", "Seguro de carro e deslocamento pesam", "E preciso pesquisar bem bairro e escola"],
    airport: "Fica proxima de Orlando International Airport e de rotas para Disney, Universal e regiao central de Orlando.",
  },
  {
    name: "Lakeland",
    slug: "quanto-custa-morar-em-lakeland-2026.html",
    county: "Polk County",
    title: "Quanto custa morar em Lakeland em 2026?",
    description: "Lakeland em 2026 para brasileiros: custo mais baixo, aluguel, trabalho, escolas, distancia de Tampa e Orlando, carro e qualidade de vida.",
    solo: [2400, 3700],
    casal: [3600, 5400],
    familia: [5200, 7600],
    rent: ["1.300 a 1.900", "1.600 a 2.300", "2.000 a 3.200"],
    work: "logistica, armazens, construcao, saude, varejo, servicos gerais, limpeza e deslocamento para Tampa ou Orlando",
    profile: "quem busca custo menor e aceita depender de carro, com possibilidade de trabalhar em cidades proximas ou remotamente",
    positives: ["Custo geralmente menor que Tampa e Orlando", "Localizacao estrategica entre duas regioes grandes", "Mais espaco por menos aluguel", "Boa para familias que querem rotina mais calma", "Pode funcionar bem para trabalho remoto"],
    negatives: ["Menos opcoes de trabalho que grandes centros", "Deslocamento pode ficar longo", "Carro e praticamente obrigatorio", "Menos vida noturna e servicos especializados", "Alguns salarios acompanham o mercado local menor"],
    airport: "Fica entre Tampa e Orlando; aeroportos maiores exigem deslocamento, mas a posicao central ajuda em viagens regionais.",
  },
  {
    name: "Jacksonville",
    slug: "quanto-custa-morar-em-jacksonville-2026.html",
    county: "Duval County",
    title: "Quanto custa morar em Jacksonville em 2026?",
    description: "Jacksonville em 2026 para brasileiros: aluguel, custo de vida, trabalho, bairros, praias, escolas, carro e comparacao com outras cidades.",
    solo: [2600, 4000],
    casal: [3900, 5900],
    familia: [5600, 8200],
    rent: ["1.400 a 2.100", "1.700 a 2.500", "2.200 a 3.600"],
    work: "logistica, porto, construcao, saude, servicos, restaurantes, varejo, transporte e trabalhos ligados a empresas maiores",
    profile: "quem quer cidade grande, custo mais baixo que o sul da Florida e mercado de trabalho mais amplo no norte do estado",
    positives: ["Custo mais acessivel que Miami e Boca", "Cidade grande com mercado variado", "Praias proximas", "Setores de logistica e saude fortes", "Mais espaco em muitos bairros"],
    negatives: ["Cidade espalhada e dependente de carro", "Bairros variam muito em perfil e seguranca", "Menos comunidade brasileira que Orlando/Miami", "Transporte publico limitado para rotina familiar", "Distante dos parques de Orlando"],
    airport: "Jacksonville International Airport atende a regiao; Orlando e sul da Florida ficam a varias horas de carro.",
  },
  {
    name: "Miami",
    slug: "quanto-custa-morar-em-miami-2026.html",
    county: "Miami-Dade County",
    title: "Quanto custa morar em Miami em 2026?",
    description: "Miami em 2026 para brasileiros: custo de vida alto, aluguel, trabalho, escolas, carro, comunidade brasileira, seguranca e perfil ideal.",
    solo: [4300, 6800],
    casal: [6500, 9500],
    familia: [8800, 13500],
    rent: ["2.300 a 3.500", "3.000 a 4.800", "4.300 a 7.500"],
    work: "servicos, turismo, restaurantes, construcao, limpeza, estetica, comercio internacional, logistica, imoveis e negocios voltados a latinos",
    profile: "quem ja chega com renda melhor, trabalho definido ou negocio, e quer viver em ambiente internacional, latino e muito urbano",
    positives: ["Comunidade brasileira e latina enorme", "Muitas oportunidades de servicos e negocios", "Aeroporto internacional forte", "Clima e vida urbana intensa", "Mercado bom para quem trabalha com turismo, estetica e imoveis"],
    negatives: ["Aluguel muito alto", "Transito pesado", "Seguro de carro caro", "Competicao grande por moradia e trabalho", "Custo de vida pode assustar recem-chegados"],
    airport: "Miami International Airport e um dos maiores hubs dos EUA; Fort Lauderdale tambem pode ser alternativa proxima.",
  },
  {
    name: "Fort Lauderdale",
    slug: "quanto-custa-morar-em-fort-lauderdale-2026.html",
    county: "Broward County",
    title: "Quanto custa morar em Fort Lauderdale em 2026?",
    description: "Fort Lauderdale em 2026: custo de vida, aluguel, trabalho, praias, comunidade brasileira, transporte, escolas e comparacao com Miami.",
    solo: [4000, 6300],
    casal: [6000, 9000],
    familia: [8200, 12000],
    rent: ["2.200 a 3.300", "2.800 a 4.400", "4.000 a 6.800"],
    work: "turismo, marinas, servicos, construcao, limpeza, saude, restaurantes, comercio, imoveis e deslocamento para Miami ou Boca",
    profile: "quem quer sul da Florida, praia e acesso a Miami, mas prefere uma rotina menos intensa que morar no centro de Miami",
    positives: ["Praias e qualidade visual forte", "Aeroporto proprio e proximidade de Miami", "Boa presenca brasileira em Broward", "Mercado de servicos e turismo", "Pode equilibrar trabalho entre Miami e Palm Beach"],
    negatives: ["Custo alto", "Transito na regiao metropolitana", "Seguro de carro pesa", "Aluguel competitivo", "Alguns bairros exigem pesquisa cuidadosa"],
    airport: "Fort Lauderdale-Hollywood International Airport e muito conveniente; Miami fica relativamente perto, dependendo do transito.",
  },
  {
    name: "Boca Raton",
    slug: "quanto-custa-morar-em-boca-raton-2026.html",
    county: "Palm Beach County",
    title: "Quanto custa morar em Boca Raton em 2026?",
    description: "Boca Raton em 2026 para brasileiros: custo alto, aluguel, escolas, trabalho, seguranca, comunidade brasileira e perfil de morador.",
    solo: [4300, 7000],
    casal: [6500, 9800],
    familia: [9000, 14000],
    rent: ["2.400 a 3.700", "3.200 a 5.000", "4.500 a 8.000"],
    work: "servicos profissionais, saude, comercio, estetica, construcao, restaurantes, imoveis, tecnologia e trabalhos em cidades proximas",
    profile: "familias com renda mais estavel que priorizam escolas, aparencia urbana, servicos, condominios e vida no sul da Florida",
    positives: ["Perfil familiar e organizado", "Boa oferta de servicos e escolas bem avaliadas em varias areas", "Comunidade brasileira relevante", "Perto de praias e de outros mercados do sul da Florida", "Boa para quem trabalha com servicos premium"],
    negatives: ["Custo de moradia alto", "Nao e ideal para chegar sem reserva", "Transito regional pode pesar", "Muitas areas exigem carro", "Competicao em servicos pode ser forte"],
    airport: "Palm Beach, Fort Lauderdale e Miami podem servir a regiao, dependendo do destino e preco da passagem.",
  },
  {
    name: "Sarasota",
    slug: "quanto-custa-morar-em-sarasota-2026.html",
    county: "Sarasota County",
    title: "Quanto custa morar em Sarasota em 2026?",
    description: "Sarasota em 2026 para brasileiros: custo de vida, aluguel, praias, trabalho, escolas, carro, pontos positivos e negativos.",
    solo: [3600, 5600],
    casal: [5200, 8000],
    familia: [7400, 11200],
    rent: ["2.000 a 3.200", "2.600 a 4.100", "3.500 a 6.500"],
    work: "turismo, saude, construcao, restaurantes, servicos, limpeza, manutencao, varejo e trabalhos ligados ao mercado residencial",
    profile: "quem busca praia, rotina mais tranquila e qualidade de vida, mas ja entende que o custo pode ser alto",
    positives: ["Praias muito valorizadas", "Rotina mais tranquila que Miami/Orlando", "Boa para familias e aposentados ativos", "Mercado residencial e de servicos forte", "Acesso a Tampa em viagens regionais"],
    negatives: ["Custo de moradia elevado", "Menos oportunidades que grandes centros", "Temporada turistica mexe com transito e precos", "Carro e necessario", "Pode ser dificil para quem chega sem renda definida"],
    airport: "Sarasota-Bradenton International Airport atende a regiao; Tampa e alternativa para mais voos.",
  },
  {
    name: "Naples",
    slug: "quanto-custa-morar-em-naples-2026.html",
    county: "Collier County",
    title: "Quanto custa morar em Naples em 2026?",
    description: "Naples em 2026 para brasileiros: custo alto, aluguel, trabalho, praias, seguranca, escolas, comunidade e perfil de morador.",
    solo: [4500, 7300],
    casal: [6800, 10300],
    familia: [9200, 14500],
    rent: ["2.600 a 4.200", "3.500 a 5.800", "5.000 a 9.000"],
    work: "servicos residenciais, construcao, limpeza, jardinagem, saude, restaurantes, hotelaria, manutencao e trabalhos para publico de alta renda",
    profile: "quem tem renda forte, trabalha com servicos premium ou busca cidade costeira mais exclusiva e organizada",
    positives: ["Alta qualidade visual e praias bonitas", "Mercado de servicos premium", "Perfil familiar e mais tranquilo", "Boa para negocios ligados a casa, manutencao e luxo", "Menos caos urbano que Miami"],
    negatives: ["Custo muito alto", "Menos opcoes para recem-chegados sem reserva", "Mercado pode ser mais sazonal", "Aluguel e seguro pesam", "Distante de Orlando e Miami para bate-volta simples"],
    airport: "Southwest Florida International Airport em Fort Myers costuma ser a referencia mais pratica; Miami e Tampa ficam mais longe.",
  },
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function usd(value) {
  return `US$ ${Number(value).toLocaleString("en-US")}`;
}

function brl(value) {
  return `R$ ${Math.round(Number(value) * USD_BRL).toLocaleString("pt-BR")}`;
}

function range(values) {
  return `${usd(values[0])} a ${usd(values[1])}`;
}

function rangeBrl(values) {
  return `${brl(values[0])} a ${brl(values[1])}`;
}

function rentToBrl(text) {
  const nums = text.match(/\d+\.\d+|\d+/g).map((value) => Number(value.replace(".", "")));
  return `aprox. ${brl(nums[0])} a ${brl(nums[1])}`;
}

function googleTag(prefix = "..") {
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=G-5RND6F4L8G"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-5RND6F4L8G');</script>`;
}

function siteHeader(prefix = "..") {
  return `<header class="site-header"><div class="container header-inner"><a href="${prefix}/index.html" aria-label="FamiliaUSA1 - pagina inicial"><div class="brand">FamiliaUSA1</div><div class="tagline">Vida real de brasileiros nos Estados Unidos</div></a><nav class="nav" aria-label="Navegacao principal"><a href="${prefix}/index.html">Inicio</a><a href="${prefix}/blog.html">Artigos</a><a href="${prefix}/categorias.html">Categorias</a><a href="${prefix}/sobre.html">Sobre</a></nav></div></header>`;
}

function siteFooter(prefix = "..") {
  return `<footer class="site-footer"><div class="container footer-inner"><div>© 2026 FamiliaUSA1. Blog para brasileiros nos Estados Unidos.</div><div class="footer-links"><a href="${prefix}/index.html">Inicio</a><a href="${prefix}/blog.html">Artigos</a><a href="${prefix}/categorias.html">Categorias</a><a href="${prefix}/sobre.html">Sobre</a></div></div></footer>`;
}

function faqSchema(city) {
  const items = [
    [`Quanto custa morar em ${city.name} em 2026?`, `Como faixa de planejamento, uma pessoa sozinha pode gastar ${range(city.solo)} por mes; um casal, ${range(city.casal)}; e uma familia, ${range(city.familia)}, dependendo de aluguel, carro, saude e estilo de vida.`],
    [`${city.name} e boa para brasileiros?`, `${city.name} pode ser boa para brasileiros com o perfil certo, mas a decisao depende de trabalho, escola, orcamento, distancia e rede de apoio.`],
    [`Precisa de carro para morar em ${city.name}?`, `Na pratica, carro costuma ser muito importante em ${city.name} e na maior parte da Florida, principalmente para trabalho, escola, mercado e consultas.`],
    [`O aluguel em ${city.name} e caro?`, `O aluguel varia por bairro e tipo de imovel. Neste guia, usamos faixas de US$ ${city.rent[0]} para 1 quarto, US$ ${city.rent[1]} para 2 quartos e US$ ${city.rent[2]} para casa familiar.`],
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(([name, text]) => ({
      "@type": "Question",
      name,
      acceptedAnswer: { "@type": "Answer", text },
    })),
  };
}

function articleHtml(city) {
  const canonical = `${SITE}/articles/${city.slug}`;
  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: city.title,
    description: city.description,
    url: canonical,
    datePublished: DATE,
    dateModified: DATE,
    inLanguage: "pt-BR",
    author: { "@type": "Organization", name: "FamiliaUSA1" },
    publisher: { "@type": "Organization", name: "FamiliaUSA1" },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    image: SHARE_IMAGE,
  };

  const positives = city.positives.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const negatives = city.negatives.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const sourceList = sources.map(([name, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${name}</a></li>`).join("\n");

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    ${googleTag()}
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(city.title)} | FamiliaUSA1</title>
    <meta name="description" content="${escapeHtml(city.description)}" />
    <meta name="author" content="FamiliaUSA1" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(city.title)} | FamiliaUSA1" />
    <meta property="og:description" content="${escapeHtml(city.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SHARE_IMAGE}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(city.title)} | FamiliaUSA1" />
    <meta name="twitter:description" content="${escapeHtml(city.description)}" />
    <meta name="twitter:image" content="${SHARE_IMAGE}" />
    <link rel="stylesheet" href="../assets/css/styles.css" />
    <script type="application/ld+json">${JSON.stringify(blogPosting, null, 2)}</script>
    <script type="application/ld+json">${JSON.stringify(faqSchema(city), null, 2)}</script>
  </head>
  <body>
    ${siteHeader()}
    <main>
      <header class="narrow-container article-header">
        <nav class="breadcrumb" aria-label="Breadcrumb"><a href="../index.html">Inicio</a><span><a href="../blog.html">Artigos</a></span><span>Cidades da Florida</span></nav>
        <div class="eyebrow">Cidades da Florida</div>
        <h1>${escapeHtml(city.title)}</h1>
        <p class="lead">Pensando em morar em ${escapeHtml(city.name)}? Este guia compara custo de vida, aluguel, trabalho, seguranca, escolas, comunidade brasileira, carro e o perfil de brasileiro que tende a se adaptar melhor nessa regiao da Florida.</p>
        <div class="article-meta"><span>Por FamiliaUSA1</span><span>Atualizado em 23 de maio de 2026</span><span>13 min de leitura</span></div>
      </header>

      <section class="narrow-container article-content">
        <p>${escapeHtml(city.name)} aparece cada vez mais nas pesquisas de brasileiros que querem morar nos Estados Unidos. Mas escolher cidade na Florida nao pode ser uma decisao baseada so em video bonito, praia ou comentario de rede social. A conta precisa incluir aluguel, carro, seguro, escola, trabalho, distancia e reserva de emergencia.</p>
        <p>Para facilitar o planejamento, usamos faixas realistas em dolar e uma conversao aproximada com <strong>US$ 1 = R$ ${USD_BRL.toFixed(2).replace(".", ",")}</strong>, referencia proxima da cotacao de maio de 2026. Os valores mudam por bairro, contrato, score, epoca do ano e perfil da familia. Use como ponto de partida, nao como promessa de preco.</p>

        <h2>Custo de vida mensal em ${escapeHtml(city.name)} em 2026</h2>
        <table><thead><tr><th>Perfil</th><th>Estimativa em dolar</th><th>Estimativa em reais</th><th>Comentario</th></tr></thead><tbody>
          <tr><td>Solteiro</td><td>${range(city.solo)}</td><td>${rangeBrl(city.solo)}</td><td>Moradia simples, um carro ou rotina controlada.</td></tr>
          <tr><td>Casal</td><td>${range(city.casal)}</td><td>${rangeBrl(city.casal)}</td><td>Dois adultos, aluguel maior e mais gastos fixos.</td></tr>
          <tr><td>Familia com filhos</td><td>${range(city.familia)}</td><td>${rangeBrl(city.familia)}</td><td>Inclui escola, saude, carro, mercado e imprevistos.</td></tr>
        </tbody></table>
        <p>O maior erro e converter tudo para real e se assustar sem olhar a renda local. Ao mesmo tempo, ganhar em dolar nao resolve se o aluguel, o carro e o seguro consomem quase tudo. Antes de mudar, leia tambem nosso guia sobre <a href="custo-de-vida-nos-eua-2026-atualizado.html">custo de vida nos EUA em 2026</a>.</p>

        <h2>Aluguel em ${escapeHtml(city.name)} por tipo de moradia</h2>
        <table><thead><tr><th>Tipo de moradia</th><th>Faixa mensal estimada</th><th>Para quem faz sentido</th></tr></thead><tbody>
          <tr><td>Apartamento 1 quarto</td><td>US$ ${city.rent[0]}</td><td>Solteiro, casal sem filhos ou comeco mais enxuto.</td></tr>
          <tr><td>Apartamento 2 quartos</td><td>US$ ${city.rent[1]}</td><td>Casal, roommates ou familia pequena.</td></tr>
          <tr><td>Casa ou townhouse familiar</td><td>US$ ${city.rent[2]}</td><td>Familia com filhos, necessidade de garagem e mais espaco.</td></tr>
        </tbody></table>
        <p>Em reais, essas faixas ficam aproximadamente entre ${rentToBrl(city.rent[0])} para 1 quarto e ${rentToBrl(city.rent[2])} para casa familiar. Alem do aluguel, recem-chegados podem enfrentar deposito de seguranca, primeiro aluguel, ultimo aluguel, taxa de aplicacao, exigencia de renda e verificacao de credito. Se voce ainda nao entende esse processo, veja o artigo sobre <a href="quanto-custa-alugar-casa-nos-eua-2026.html">quanto custa alugar casa nos EUA</a>.</p>

        <h2>Trabalho e setores mais comuns</h2>
        <p>Em ${escapeHtml(city.name)}, brasileiros costumam encontrar oportunidades em ${escapeHtml(city.work)}. Isso nao significa emprego garantido. Significa que esses setores aparecem com frequencia para quem esta comecando, especialmente quando a pessoa tem disposicao, indicacao, ingles basico e documentacao organizada.</p>
        <p>Para quem chega sem rede de apoio, o comeco pode envolver bicos, trabalho fisico e adaptacao. O importante e combinar pagamento, anotar horas e entender a diferenca entre employee, contractor, 1099, W-2 e cash job. Reforce isso no nosso guia sobre <a href="trabalho-nos-eua-para-brasileiros-2026.html">trabalho nos EUA para brasileiros</a>.</p>

        <h2>Seguranca e perfil dos bairros</h2>
        <p>Nenhuma cidade deve ser vendida como totalmente segura. Seguranca nos EUA muda por bairro, rua, escola, horario e tipo de rotina. Em ${escapeHtml(city.name)}, o ideal e pesquisar crime maps, conversar com moradores, visitar a regiao de dia e de noite, observar iluminacao, movimento, comercio e distancia ate trabalho e escola.</p>
        <p>Evite escolher casa so pelo aluguel mais barato. As vezes a economia desaparece em seguro de carro, distancia, estresse ou falta de estrutura. Tambem vale ler nosso artigo sobre <a href="e-perigoso-morar-nos-eua.html">se e perigoso morar nos EUA</a>.</p>

        <h2>Escolas e vida com filhos</h2>
        <p>Familias brasileiras precisam avaliar escola antes de fechar contrato. Nos EUA, o endereco geralmente influencia a escola publica disponivel. Isso torna o aluguel uma decisao educacional tambem. Pesquise o distrito, calendario escolar, transporte, programas para alunos que estao aprendendo ingles e documentos exigidos.</p>
        <p>Criancas costumam se adaptar mais rapido que adultos, mas isso nao significa que o processo seja simples. Mudanca de idioma, saudade, rotina nova e pressao emocional pedem acompanhamento dos pais. Veja tambem: <a href="como-matricular-filho-na-escola-nos-eua.html">como matricular filho na escola nos EUA</a>.</p>

        <h2>Comunidade brasileira em ${escapeHtml(city.name)}</h2>
        <p>A comunidade brasileira pode ajudar muito no comeco: indicacao de trabalho, moveis usados, igreja, escola, mercado, servicos e orientacao basica. Mas ela nao substitui planejamento. Use grupos e contatos com sabedoria, confirme informacao em fonte oficial e desconfie de promessa facil.</p>
        <p>Em cidades com comunidade maior, fica mais facil achar comida brasileira, igreja em portugues, salao, mecanico e servicos conhecidos. Em cidades menores, pode haver mais tranquilidade e custo menor, mas menos rede de apoio imediata.</p>

        <h2>Transporte, carro, gasolina e pedagio</h2>
        <p>Na pratica, morar em ${escapeHtml(city.name)} geralmente exige carro. Transporte publico pode existir, mas raramente resolve toda a vida de uma familia brasileira com trabalho, escola, mercado e consultas. O carro pesa em financiamento, seguro, gasolina, manutencao, tags de pedagio e estacionamento.</p>
        <p>Em 2026, gasolina ficou mais sensivel nos EUA, com medias acima de US$ 4 por galao em varios momentos. Por isso, morar mais longe para pagar menos aluguel so vale se a conta completa fechar. Leia tambem: <a href="quanto-custa-ter-carro-nos-eua-2026.html">quanto custa ter carro nos EUA</a>.</p>

        <h2>Distancia de aeroportos, praias e cidades importantes</h2>
        <p>${escapeHtml(city.airport)}</p>
        <p>Para brasileiros, aeroporto pesa muito: chegada de familia, viagem ao Brasil, mudanca, trabalho e lazer. Praia tambem influencia, mas nao deve ser o unico criterio. As vezes morar perto da praia custa caro e fica longe do emprego real.</p>

        <h2>Pontos positivos de morar em ${escapeHtml(city.name)}</h2>
        <ul class="scan-list">${positives}</ul>

        <h2>Pontos negativos de morar em ${escapeHtml(city.name)}</h2>
        <ul class="scan-list">${negatives}</ul>

        <h2>Melhor perfil de morador</h2>
        <p>${escapeHtml(city.name)} tende a funcionar melhor para ${escapeHtml(city.profile)}. Se a pessoa chega sem reserva, sem carro, sem trabalho definido e sem rede, precisa ir com ainda mais cautela.</p>
        <p>Para quem esta planejando a mudanca, o caminho mais seguro e comparar ${escapeHtml(city.name)} com outras cidades da Florida e cruzar tres perguntas: onde vou trabalhar, quanto consigo pagar de aluguel e como sera a rotina da minha familia?</p>

        <h2>Comparacao em dolar e reais</h2>
        <table><thead><tr><th>Despesa</th><th>Faixa em dolar</th><th>Faixa em reais</th></tr></thead><tbody>
          <tr><td>Aluguel 1 quarto</td><td>US$ ${city.rent[0]}</td><td>${rentToBrl(city.rent[0])}</td></tr>
          <tr><td>Custo solteiro</td><td>${range(city.solo)}</td><td>${rangeBrl(city.solo)}</td></tr>
          <tr><td>Custo casal</td><td>${range(city.casal)}</td><td>${rangeBrl(city.casal)}</td></tr>
          <tr><td>Custo familia</td><td>${range(city.familia)}</td><td>${rangeBrl(city.familia)}</td></tr>
        </tbody></table>
        <p>Essa comparacao em reais ajuda quem ainda esta no Brasil, mas a decisao precisa ser feita com logica americana: renda local, custo local, historico de credito e reserva em dolar.</p>

        <h2>Vale a pena morar em ${escapeHtml(city.name)}?</h2>
        <p>Vale a pena se a cidade combina com seu trabalho, orcamento e rotina familiar. Nao vale a pena se a escolha for feita so por fama, praia, video bonito ou comparacao superficial com o Brasil. Morar nos EUA exige planejamento, documentacao, renda e adaptacao.</p>
        <p>Antes de decidir, leia tambem <a href="morar-legalmente-nos-eua-caminhos-possiveis-2026.html">caminhos para morar legalmente nos EUA</a>, <a href="seguro-saude-nos-eua-como-funciona-2026.html">seguro saude nos EUA</a> e <a href="como-escolher-uma-cidade-para-morar-nos-eua.html">como escolher uma cidade para morar nos EUA</a>.</p>

        <section class="related-posts"><h2>Posts relacionados</h2><p>Continue comparando cidades, custos e decisoes importantes antes de mudar para a Florida.</p><ul><li><a href="custo-de-vida-nos-eua-2026-atualizado.html">Custo de vida nos EUA 2026: guia atualizado</a></li><li><a href="quanto-custa-alugar-casa-nos-eua-2026.html">Quanto custa alugar casa nos EUA em 2026?</a></li><li><a href="quanto-custa-ter-carro-nos-eua-2026.html">Quanto custa ter carro nos Estados Unidos em 2026?</a></li><li><a href="trabalho-nos-eua-para-brasileiros-2026.html">Trabalho nos EUA para brasileiros em 2026</a></li><li><a href="morar-legalmente-nos-eua-caminhos-possiveis-2026.html">Morar legalmente nos EUA: principais caminhos possiveis</a></li></ul></section>

        <section class="faq-section"><h2>Perguntas frequentes</h2><h3>Quanto custa morar em ${escapeHtml(city.name)} em 2026?</h3><p>Uma pessoa sozinha pode gastar ${range(city.solo)} por mes; um casal, ${range(city.casal)}; e uma familia, ${range(city.familia)}, dependendo de aluguel, carro, saude e rotina.</p><h3>${escapeHtml(city.name)} e boa para brasileiros?</h3><p>Pode ser, desde que combine com seu perfil de trabalho, orcamento, escola, transporte e rede de apoio.</p><h3>Precisa de carro para morar em ${escapeHtml(city.name)}?</h3><p>Na maioria dos casos, sim. Carro costuma ser essencial para trabalho, escola, mercado e consultas na Florida.</p><h3>Como escolher bairro em ${escapeHtml(city.name)}?</h3><p>Compare escola, distancia ate o trabalho, transito, aluguel, seguro, crime maps, iluminacao, comercio e opiniao de moradores locais.</p></section>

        <h2>Conclusao</h2>
        <p>${escapeHtml(city.name)} pode ser uma boa escolha para brasileiros, mas nao existe cidade perfeita. Existe cidade que combina melhor com sua renda, sua profissao, sua familia e seu momento de vida.</p>
        <p>O conselho do Familia USA 1 e simples: nao escolha cidade so pelo sonho. Escolha com conta, mapa, escola, trabalho, carro e reserva de emergencia. Isso evita muita dor de cabeca nos primeiros meses.</p>
        <div class="final-article-cta"><h2>Continue acompanhando o Familia USA 1</h2><p>Se este guia ajudou, compartilhe com outra familia brasileira e continue lendo nossos comparativos sobre vida real nos Estados Unidos.</p><div class="actions"><a class="button primary" href="../categorias/cidades-da-florida.html">Ver guia de cidades da Florida</a><a class="button secondary" href="../blog.html">Ver todos os artigos</a></div></div>
        <h2>Fontes</h2><ul>${sourceList}</ul>
      </section>
    </main>
    ${siteFooter()}
  </body>
</html>
`;
}

function card(post, prefix = "") {
  return `          <article class="card post-card">
            <div class="post-category">${escapeHtml(post.category)}</div>
            <h2><a href="${prefix}${escapeHtml(post.url)}">${escapeHtml(post.title)}</a></h2>
            <p>${escapeHtml(post.description)}</p>
            <div class="post-meta"><span>${escapeHtml(post.readTime)}</span><a class="read-more" href="${prefix}${escapeHtml(post.url)}">Ler artigo -></a></div>
          </article>`;
}

function blogPage(posts) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Artigos FamiliaUSA1",
    url: `${SITE}/blog.html`,
    inLanguage: "pt-BR",
    description: "Artigos sobre morar nos EUA, custo de vida, adaptacao e rotina de brasileiros nos Estados Unidos.",
    publisher: { "@type": "Organization", name: "FamiliaUSA1" },
  };

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    ${googleTag(".")}
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Artigos para brasileiros nos EUA: noticias, trabalho e imigracao | FamiliaUSA1</title>
    <meta name="description" content="Leia artigos para brasileiros nos EUA sobre cidades da Florida, noticias, trabalho, salario, aluguel, custo de vida, imigracao e adaptacao." />
    <meta name="author" content="FamiliaUSA1" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${SITE}/blog.html" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Artigos para brasileiros nos EUA | FamiliaUSA1" />
    <meta property="og:description" content="Guias sobre vida real nos EUA, cidades da Florida, custo de vida, trabalho, imigracao e adaptacao." />
    <meta property="og:url" content="${SITE}/blog.html" />
    <meta property="og:image" content="${SHARE_IMAGE}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="stylesheet" href="./assets/css/styles.css" />
    <script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>
  </head>
  <body>
    ${siteHeader(".")}
    <main>
      <section class="container page-title"><div class="eyebrow">Blog FamiliaUSA1</div><h1>Artigos para brasileiros nos EUA: cidades, custo de vida, imigracao e adaptacao</h1><p>Guias e reflexoes para brasileiros que vivem, estao chegando ou sonham construir uma vida nos Estados Unidos.</p></section>
      <section class="container article-list"><div class="article-grid">
${posts.map((post) => card(post)).join("\n")}
        </div></section>
    </main>
    <footer class="site-footer"><div class="container footer-inner"><div>© 2026 FamiliaUSA1. Blog para brasileiros nos Estados Unidos.</div><div class="footer-links"><a href="index.html">Inicio</a><a href="categorias.html">Categorias</a><a href="sobre.html">Sobre</a></div></div></footer>
  </body>
</html>
`;
}

function pillarPage(cityItems) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Melhores cidades da Florida para brasileiros morarem em 2026",
    description: "Comparativo de cidades da Florida para brasileiros: custo de vida, aluguel, trabalho, escolas, carro, seguranca e comunidade brasileira.",
    url: `${SITE}/categorias/cidades-da-florida.html`,
    inLanguage: "pt-BR",
    publisher: { "@type": "Organization", name: "FamiliaUSA1" },
    mainEntity: cityItems.map((article) => ({
      "@type": "BlogPosting",
      headline: article.title,
      url: `${SITE}/${article.url}`,
    })),
  };

  const rows = cities.map((city) => `<tr><td><a href="../articles/${city.slug}">${city.name}</a></td><td>${range(city.solo)}</td><td>${range(city.casal)}</td><td>${range(city.familia)}</td><td>${escapeHtml(city.profile)}</td></tr>`).join("\n");
  const sourceList = sources.map(([name, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${name}</a></li>`).join("");

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    ${googleTag()}
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Melhores cidades da Florida para brasileiros em 2026 | FamiliaUSA1</title>
    <meta name="description" content="Compare Tampa, Orlando, Miami, Kissimmee, Lakeland, Jacksonville, Boca Raton, Sarasota, Naples e Fort Lauderdale para brasileiros." />
    <meta name="author" content="FamiliaUSA1" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${SITE}/categorias/cidades-da-florida.html" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Melhores cidades da Florida para brasileiros em 2026" />
    <meta property="og:description" content="Comparativo local de custo de vida, aluguel, trabalho, escolas e comunidade brasileira na Florida." />
    <meta property="og:url" content="${SITE}/categorias/cidades-da-florida.html" />
    <meta property="og:image" content="${SHARE_IMAGE}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="stylesheet" href="../assets/css/styles.css" />
    <script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>
  </head>
  <body>
    ${siteHeader()}
    <main>
      <section class="container page-title"><div class="eyebrow">Pagina pilar</div><h1>Melhores cidades da Florida para brasileiros morarem em 2026</h1><p>Um comparativo local para brasileiros que pesquisam onde morar nos Estados Unidos, comecando pela Florida: custo de vida, aluguel, trabalho, escolas, comunidade, carro e qualidade de rotina.</p></section>
      <section class="narrow-container article-content">
        <h2>Como usar este guia</h2>
        <p>Nao existe cidade perfeita para todo brasileiro. Existe a cidade que combina melhor com seu trabalho, documentacao, reserva financeira, filhos, rotina e tolerancia a custo de vida. Por isso, este hub organiza comparativos locais e leva voce para guias completos de cada cidade.</p>
        <p>Os valores sao faixas de planejamento para 2026 e devem ser confirmados antes de fechar aluguel ou mudanca. Seguranca, escola e custo mudam por bairro, rua e contrato.</p>
        <h2>Comparativo rapido das cidades</h2>
        <table><thead><tr><th>Cidade</th><th>Solteiro</th><th>Casal</th><th>Familia</th><th>Melhor perfil</th></tr></thead><tbody>${rows}</tbody></table>
        <h2>Artigos satelites do cluster</h2>
        <div class="article-grid">${cityItems.map((post) => card(post, "../")).join("\n")}</div>
        <h2>Leituras fundamentais antes de escolher cidade</h2>
        <ul><li><a href="../articles/custo-de-vida-nos-eua-2026-atualizado.html">Custo de vida nos EUA 2026</a></li><li><a href="../articles/quanto-custa-alugar-casa-nos-eua-2026.html">Quanto custa alugar casa nos EUA</a></li><li><a href="../articles/quanto-custa-ter-carro-nos-eua-2026.html">Quanto custa ter carro nos EUA</a></li><li><a href="../articles/seguro-saude-nos-eua-como-funciona-2026.html">Seguro saude nos EUA</a></li><li><a href="../articles/trabalho-nos-eua-para-brasileiros-2026.html">Trabalho nos EUA para brasileiros</a></li><li><a href="../articles/morar-legalmente-nos-eua-caminhos-possiveis-2026.html">Morar legalmente nos EUA</a></li></ul>
        <h2>Fontes de referencia</h2><ul>${sourceList}</ul>
      </section>
    </main>
    ${siteFooter()}
  </body>
</html>
`;
}

for (const city of cities) {
  fs.writeFileSync(path.join("articles", city.slug), articleHtml(city), "utf8");
}

const indexPath = path.join("assets", "data", "articles.json");
const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
const cityUrls = new Set(cities.map((city) => `articles/${city.slug}`));
const existing = index.articles.filter((article) => !cityUrls.has(article.url));
const cityItems = cities.map((city) => ({
  title: city.title,
  description: city.description,
  category: "Cidades da Florida",
  url: `articles/${city.slug}`,
  date: DATE,
  modified: DATE,
  readTime: "13 min de leitura",
}));

index.generatedAt = DATE;
index.articles = [...cityItems, ...existing];
fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
fs.writeFileSync("blog.html", blogPage(index.articles), "utf8");
fs.writeFileSync(path.join("categorias", "cidades-da-florida.html"), pillarPage(cityItems), "utf8");

console.log(`Cluster de cidades da Florida gerado: ${cities.length} artigos.`);
