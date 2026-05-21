(function () {
  const featuredGrid = document.querySelector("[data-recent-posts-grid]");
  const latestList = document.querySelector("[data-latest-posts-list]");

  if (!featuredGrid && !latestList) {
    return;
  }

  const escapeHtml = (value) =>
    String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const editorial = {
    "articles/como-renovar-visto-americano-2026.html": {
      image: "assets/images/articles/renovar-visto-americano-2026.png",
      alt: "Brasileiro renovando visto americano em 2026 com passaporte e documentos",
      badge: "🔄 RENOVAR",
      badgeClass: "badge-new",
    },
    "articles/visto-americano-crianca-familia-2026.html": {
      image: "assets/images/articles/visto-americano-crianca-familia-2026.png",
      alt: "Família brasileira preparando visto americano para criança em 2026",
      badge: "👨‍👩‍👧 FAMÍLIA",
      badgeClass: "badge-new",
    },
    "articles/melhores-outlets-orlando-2026.html": {
      image: "assets/images/articles/melhores-outlets-orlando-2026.png",
      alt: "Brasileiros fazendo compras nos melhores outlets de Orlando em 2026",
      badge: "🛍️ COMPRAS",
      badgeClass: "badge-hot",
    },
    "articles/aluguel-carro-orlando-2026.html": {
      image: "assets/images/articles/aluguel-carro-orlando-2026.png",
      alt: "Família brasileira avaliando aluguel de carro em Orlando em 2026",
      badge: "🚗 ORLANDO",
      badgeClass: "badge-new",
    },
    "articles/quanto-tempo-demora-visto-americano-2026.html": {
      image: "assets/images/articles/quanto-tempo-visto-americano-2026.png",
      alt: "Brasileiro olhando calendário e prazo do visto americano em 2026",
      badge: "⏱️ PRAZO",
      badgeClass: "badge-alert",
    },
    "articles/agendamento-visto-americano-2026.html": {
      image: "assets/images/articles/agendamento-visto-americano-2026.png",
      alt: "Brasileiro agendando visto americano em 2026 pelo computador",
      badge: "📅 AGENDAR",
      badgeClass: "badge-new",
    },
    "articles/o-que-reprova-no-visto-americano.html": {
      image: "assets/images/articles/o-que-reprova-visto-americano.png",
      alt: "Brasileiro preocupado com erros que reprovam no visto americano",
      badge: "🚨 ALERTA",
      badgeClass: "badge-alert",
    },
    "articles/guia-completo-orlando-2026-brasileiros.html": {
      image: "assets/images/articles/guia-orlando-2026-brasileiros.png",
      alt: "Família brasileira planejando viagem para Orlando em 2026",
      badge: "📘 GUIA",
      badgeClass: "badge-hot",
    },
    "articles/quanto-custa-viajar-orlando-2026.html": {
      image: "assets/images/articles/quanto-custa-orlando-2026.png",
      alt: "Família brasileira calculando quanto custa viajar para Orlando em 2026",
      badge: "💵 CUSTOS",
      badgeClass: "badge-hot",
    },
    "articles/disney-orlando-2026-guia-brasileiros.html": {
      image: "assets/images/articles/disney-orlando-2026-brasileiros.png",
      alt: "Família brasileira planejando primeira viagem para Disney Orlando em 2026",
      badge: "🏰 DISNEY",
      badgeClass: "badge-hot",
    },
    "articles/guia-completo-visto-americano-2026.html": {
      image: "assets/images/articles/visto-americano-2026-guia-completo.png",
      alt: "Brasileiro analisando DS-160 e documentos para visto americano 2026",
      badge: "📘 GUIA",
      badgeClass: "badge-hot",
    },
    "articles/como-preencher-ds-160-passo-a-passo-2026.html": {
      image: "assets/images/articles/ds-160-passo-a-passo-2026.png",
      alt: "Brasileiro preenchendo o formulário DS-160 sem errar em 2026",
      badge: "📝 DS-160",
      badgeClass: "badge-new",
    },
    "articles/entrevista-visto-americano-perguntas-erros-comuns-2026.html": {
      image: "assets/images/articles/entrevista-visto-americano-2026.png",
      alt: "Brasileiro se preparando para entrevista do visto americano em 2026",
      badge: "🎙️ ENTREVISTA",
      badgeClass: "badge-new",
    },
    "articles/documentos-entrevista-visto-americano-2026.html": {
      image: "assets/images/articles/documentos-visto-americano-2026.png",
      alt: "Documentos e checklist para entrevista do visto americano em 2026",
      badge: "✅ CHECKLIST",
      badgeClass: "badge-new",
    },
    "articles/quanto-custa-tirar-visto-americano-2026.html": {
      image: "assets/images/articles/quanto-custa-visto-americano-2026.png",
      alt: "Brasileiro calculando quanto custa tirar o visto americano em 2026",
      badge: "💵 CUSTOS",
      badgeClass: "badge-hot",
    },
    "articles/visto-americano-negado-motivos-o-que-fazer-2026.html": {
      image: "assets/images/articles/visto-americano-negado-2026.png",
      alt: "Brasileiro preocupado com visto americano negado em 2026",
      badge: "🚨 ALERTA",
      badgeClass: "badge-alert",
    },
    "articles/quanto-dinheiro-levar-para-os-eua-2026-experiencia-real.html": {
      title: "Dá para começar a vida nos EUA com pouco dinheiro?",
      image: "assets/images/articles/custo-de-vida-eua.webp",
      alt: "Família brasileira planejando dinheiro para começar a vida nos Estados Unidos",
      badge: "🔥 NOVO",
      badgeClass: "badge-hot",
    },
    "articles/7-erros-trabalho-brasileiros-eua.html": {
      title: "7 erros no trabalho que podem fazer brasileiro perder dinheiro nos EUA",
      image: "assets/images/articles/erros-financeiros-imigrantes-eua.webp",
      alt: "Brasileiro conferindo pagamento e horas de trabalho nos Estados Unidos",
      badge: "🚨 ALERTA",
      badgeClass: "badge-alert",
    },
    "articles/solidao-de-morar-nos-eua.html": {
      title: "A parte mais difícil de morar nos EUA não é o dinheiro",
      image: "assets/images/articles/vida-real-nos-eua.webp",
      alt: "Brasileiro refletindo sobre saudade e solidão morando nos Estados Unidos",
      badge: "🆕 NOVO",
      badgeClass: "badge-new",
    },
    "articles/erros-financeiros-culturais-imigrantes-eua.html": {
      title: "Por que muitos brasileiros quebram nos EUA mesmo ganhando em dólar",
      image: "assets/images/articles/erros-financeiros-imigrantes-eua.webp",
      alt: "Brasileiros nos EUA organizando dinheiro para evitar erros financeiros",
      badge: "🔥 MAIS LIDO",
      badgeClass: "badge-hot",
    },
    "articles/5-habitos-comuns-no-brasil-problemas-eua.html": {
      title: "Coisas normais no Brasil que podem trazer problemas graves nos EUA",
      image: "assets/images/articles/habitos-brasil-problemas-eua.webp",
      alt: "Brasileiros aprendendo costumes que podem gerar problemas nos Estados Unidos",
      badge: "🚨 ALERTA",
      badgeClass: "badge-alert",
    },
    "articles/como-abrir-conta-em-banco-nos-eua.html": {
      title: "O que muitos brasileiros erram ao abrir conta bancária nos EUA",
      image: "assets/images/articles/custo-de-vida-eua.webp",
      alt: "Brasileiro abrindo conta bancária nos Estados Unidos",
      badge: "🆕 NOVO",
      badgeClass: "badge-new",
    },
    "articles/situacoes-causar-deportacao-problemas-legais-eua.html": {
      title: "O que pode colocar muitos brasileiros em risco nos EUA",
      image: "assets/images/articles/deportacao-problemas-legais-eua.webp",
      alt: "Imigrante brasileiro lendo documentos legais nos Estados Unidos",
      badge: "🚨 ALERTA",
      badgeClass: "badge-alert",
    },
    "articles/como-matricular-filho-na-escola-nos-eua.html": {
      image: "assets/images/articles/matricular-filho-escola-eua.webp",
      alt: "Família brasileira preparando matrícula de filho na escola dos Estados Unidos",
      badge: "🆕 NOVO",
      badgeClass: "badge-new",
    },
    "articles/custo-de-vida-nos-eua-2026-atualizado.html": {
      image: "assets/images/articles/custo-de-vida-eua.webp",
      alt: "Custos reais de brasileiros vivendo nos Estados Unidos",
      badge: "🔥 MAIS LIDO",
      badgeClass: "badge-hot",
    },
  };

  const renderCard = (post) => {
    const override = editorial[post.url] || {};
    const title = override.title || post.title;
    const media = override.image
      ? `
            <a class="post-thumb" href="${escapeHtml(post.url)}">
              <img src="${escapeHtml(override.image)}" alt="${escapeHtml(override.alt || title)}" loading="lazy" />
              ${override.badge ? `<span class="content-badge ${escapeHtml(override.badgeClass)}">${escapeHtml(override.badge)}</span>` : ""}
            </a>`
      : "";

    return `
          <article class="card post-card">
            ${media}
            <div class="post-category">${escapeHtml(post.category)}</div>
            <h3><a href="${escapeHtml(post.url)}">${escapeHtml(title)}</a></h3>
            <p>${escapeHtml(post.description)}</p>
            <div class="post-meta">
              <span>${escapeHtml(post.readTime)}</span>
              <a class="read-more" href="${escapeHtml(post.url)}">Ler artigo →</a>
            </div>
          </article>`;
  };

  const renderLatest = (post, index) => `
            <article class="latest-item">
              <div class="number">${index + 1}</div>
              <div>
                <a class="latest-title" href="${escapeHtml(post.url)}">${escapeHtml(post.title)}</a>
                <div class="latest-copy">${escapeHtml(post.description)}</div>
              </div>
            </article>`;

  fetch("assets/data/articles.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("Article index unavailable");
      return response.json();
    })
    .then((data) => {
      const posts = Array.isArray(data.articles) ? data.articles : [];
      if (!posts.length) return;

      if (featuredGrid) {
        featuredGrid.innerHTML = posts.slice(0, 9).map(renderCard).join("");
      }

      if (latestList) {
        latestList.innerHTML = posts.slice(0, 3).map(renderLatest).join("");
      }
    })
    .catch(() => {
      // Keep the static fallback content if the generated index is unavailable.
    });
})();
