# Astro Home production visual match

Data: 2026-06-12

## Objetivo

Recriar a Home Astro usando a Home atual de producao como referencia editorial e visual, preservando URLs, SEO tecnico, schemas, Google Analytics, artigos, categorias, sitemap e validacoes existentes.

## Secoes da Home atual recriadas

- Hero escuro de impacto com o titulo "A realidade dos brasileiros nos Estados Unidos".
- Cards laterais do hero com foco em vida real, alertas e erros que brasileiros precisam evitar.
- Secao institucional "Conheca o Familia USA 1" com foto real da familia.
- Bloco "Video em destaque da semana" com embed seguro do YouTube via youtube-nocookie.
- Card/noticia em destaque sobre EUA, CV e PCC.
- Secao "O que brasileiros mais precisam entender nos EUA".
- CTA "Vai mudar para os EUA?" usando o componente global do checklist.
- Secao "Onde morar no Norte dos EUA e em Massachusetts em 2026".
- Secao "Onde morar na Florida em 2026".
- Secao "Ultimos artigos".
- Secao "Visto americano".
- Secao "Orlando e Disney".
- Secao "Vida financeira e recomeco nos EUA".
- Secao "Alertas, imigracao e problemas legais".
- Bloco escuro "A vida nos EUA nao e como mostram na internet".
- Bloco "Assuntos que brasileiros estao acompanhando".
- Bloco "Novos temas no blog".
- Footer global preservado pelo BaseLayout.

## Secoes dinamicas

- Ultimos artigos: alimentado por `allArticles`.
- Visto americano: alimentado por `getArticlesForCategory("visto-americano")`.
- Orlando e Disney: combina categorias `orlando-e-viagem`, `orlando-disney` e `compras-nos-eua`.
- Vida financeira e recomeco: combina `custo-de-vida`, `banco-credito`, `trabalho-renda` e `planejamento`.
- Alertas, imigracao e problemas legais: combina `imigracao-legalizacao`, `asilo-nos-eua`, `noticias-eua` e `vida-real-nos-eua`.
- Cidades do Norte/Massachusetts e Florida: usam slugs editoriais prioritarios que existem na base legada estruturada.
- Novos temas no blog: usa categorias reais de `siteCategories`.

## Componentes criados

- `src/components/home/HomeHero.astro`
- `src/components/home/HomeSection.astro`
- `src/components/home/HomeFeatureCard.astro`
- `src/components/home/HomeVideoHighlight.astro`
- `src/components/home/HomeArticleGrid.astro`
- `src/components/home/HomeTopicList.astro`

## Refinamento do HomeArticleGrid

- `HomeArticleGrid.astro` agora usa fallback protegido para titulo, descricao e tempo de leitura.
- Imagens padrao (`familiausa1-share.svg`) continuam ocultas nos cards com mídia para evitar repetição visual generica.
- Alt text das thumbnails usa o padrão `Imagem do artigo: {titulo}`.
- Categoria e descrição só são renderizadas quando existem dados disponíveis.
- O link "Ler artigo →" fica padronizado em todos os cards da Home.
- `.home-article-grid-media` recebeu regra propria no CSS para thumbnails em proporção editorial 16:9.

## Arquivos alterados

- `src/pages/index.astro`
- `src/styles/global.css`

## SEO preservado

- Canonical da Home preservado como `https://familiausa1.com/`.
- H1 unico confirmado no HTML gerado.
- Google Analytics `G-5RND6F4L8G` aparece uma unica vez na Home gerada.
- Schemas adicionados/preservados na Home: `WebSite`, `Organization` e `VideoObject`.
- Links internos usam URLs publicas reais com `.html`.
- Slugs publicos nao foram alterados.
- Sitemap, categorias, blog e artigos nao tiveram alteracao de URL.

## Header e hero

- O header continua renderizado uma unica vez pelo `BaseLayout`.
- O hero recebeu padding superior especifico em `.home-hero` para evitar sobreposicao com o header sticky.
- Em mobile, o hero usa overlay mais forte sobre a imagem para preservar leitura e reduzir risco de corte ruim.

## Diferencas visuais restantes

- A Home Astro usa componentes e dados estruturados em vez de copiar o HTML legado linha por linha.
- Alguns cards dinamicos aparecem sem thumbnail quando o artigo legado usa a imagem padrao `familiausa1-share.svg`; isso evita imagem generica repetida e preserva integridade visual.
- A revisao visual no navegador interno local nao foi possivel porque o ambiente bloqueou `http://127.0.0.1:4173/index.html` com `ERR_BLOCKED_BY_CLIENT`.
- Recomenda-se baixar o novo artifact do GitHub Actions e revisar visualmente desktop/mobile antes de marcar a PR como Ready for review.

## Validacoes executadas

- `npm run build` equivalente via Node direto: passou.
- `npm run validate:poc`: passou.
- `npm run validate:batch`: passou.
- `npm run qa:batch`: passou.
- `npm run validate:all-articles`: passou.
- `npm run validate:site-structure`: passou.
- `npm run validate:new-article`: passou.

## Resultado

A Home Astro agora esta baseada na estrutura editorial da Home atual de producao, com visual premium, clusters fortes, dados dinamicos e preservacao de SEO tecnico. A etapa esta pronta para gerar novo artifact e passar por revisao visual manual.
