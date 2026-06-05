# Plano de migração segura para Astro

Repositório: `cosaqdigital/familiausa1.github.io`
Branch de planejamento: `astro-migration`
Objetivo: preparar uma migração futura para Astro preservando 100% das URLs, SEO técnico, sitemap, canonical, schema, Google Analytics, artigos, categorias e links internos atuais.

> Esta etapa é somente planejamento. Não houve instalação do Astro, migração de páginas, remoção de HTML legado ou alteração da branch `main`.

## 1. Diagnóstico da arquitetura atual

O site atual é um blog estático em HTML puro hospedado no GitHub Pages.

### Inventário auditado

- Artigos em `/articles/`: `151` arquivos `.html`.
- Artigos em `assets/data/articles.json`: `151` itens.
- URLs totais em `sitemap.xml`: `177`.
- URLs de artigos no sitemap: `151`.
- URLs de categorias no sitemap: `20`.
- URLs duplicadas no sitemap: `0`.
- Páginas de categoria em `/categorias/`: `20`.
- Páginas raiz HTML: `article.html`, `blog.html`, `categorias.html`, `checklist-mudanca-eua.html`, `comece-aqui.html`, `index.html`, `sobre.html`, `teste.html`.
- `robots.txt`: existe e declara `Sitemap: https://familiausa1.com/sitemap.xml`.
- Assets principais: `assets/css/styles.css`, `assets/js/recent-posts.js`, `assets/data/articles.json`, `assets/images/`, `assets/pdfs/`.
- Scripts versionados existentes: `build-article-index.ps1`, `create-city-cluster-2026.js`, `ensure-video-schema.ps1`, `generate-sitemap.js`, `gerar_relatorio_diario.py`, `gerar_sitemap.py`, `optimize-city-pillar-2026.js`, `professional-seo-audit-2026-05-24.js`, `seo-maintenance-2026-05-21.js`.

Arquivos locais não rastreados em `dados/` e `scripts/` foram ignorados nesta etapa para não misturar auditorias anteriores com o plano de migração.

### Status técnico dos artigos

- Artigos sem `<title>`: `0`.
- Artigos sem meta description: `0`.
- Artigos sem canonical: `0`.
- Artigos com H1 diferente de 1: `0`.
- JSON-LD inválido no projeto: `0`.
- Schemas duplicados `BlogPosting`/`FAQPage`: `0` no momento da auditoria.
- Artigos com `VideoObject`: `2`.
- Artigos sem `BlogPosting`: `5`.
- Artigos sem Google Analytics: `5`.

Arquivos que precisam de padronização antes ou durante a migração:

- `articles/pedido-green-card-dentro-ou-fora-dos-eua-riscos.html`
- `articles/portugal-endurece-cidadania-comparacao-eua-brasileiros.html`
- `articles/quem-pode-ser-afetado-novas-medidas-imigracao-eua.html`
- `articles/trump-imigracao-eua-impacto-brasileiros-2026.html`
- `articles/uscis-2026-atualizacoes-green-card-brasileiros.html`

### Páginas técnicas

- `article.html`: está com `noindex, follow`.
- `teste.html`: está com `noindex, nofollow`.
- O sitemap atual não inclui `teste.html` nem `planejamento-seo/template-artigo-html.html`.

## 2. Riscos principais de SEO e URL

### Risco 1: preservar URLs com `.html`

O site atual ranqueia e é indexado com URLs como:

- `/blog.html`
- `/categorias/cidades-da-florida.html`
- `/articles/quanto-custa-morar-em-orlando-2026.html`

No Astro, a implementação precisa gerar exatamente esses caminhos. Não podemos trocar para `/blog/`, `/articles/slug/` ou remover `.html`.

### Risco 2: canonicals divergentes

Cada página precisa manter canonical absoluto igual ao URL publicado atual. Um erro de canonical pode criar conflito entre versão antiga e nova.

### Risco 3: schema gerado em duplicidade

Hoje o site já teve histórico de schema duplicado. Em Astro, schema deve ser gerado por componentes únicos, não copiado manualmente por artigo.

### Risco 4: links internos relativos

Muitos artigos usam links relativos dentro de `/articles/`, como `href="guia-completo-visto-americano-2026.html"`. A migração precisa preservar esses links ou normalizá-los com validação automática.

### Risco 5: dados editoriais duplicados

Hoje parte da informação vive em HTML e parte em `assets/data/articles.json`. Em uma arquitetura Astro, o ideal é uma fonte editorial única para gerar:

- Artigo HTML.
- Cards de blog.
- Categorias.
- Posts recentes.
- Sitemap.
- JSON-LD.

### Risco 6: taxonomia inconsistente

Há variações de categorias e labels editoriais ao longo do acervo. Antes de escalar para 1.000 artigos, é recomendável normalizar categorias oficiais e aliases.

## 3. Arquitetura proposta em Astro

### Princípio central

Astro deve ser usado como gerador estático, mantendo o site final como HTML estático para GitHub Pages.

Configuração esperada:

```js
// astro.config.mjs
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://familiausa1.com",
  output: "static"
});
```

### Estrutura de pastas recomendada

```text
src/
  components/
    BaseHead.astro
    SiteHeader.astro
    SiteFooter.astro
    ArticleCard.astro
    ChecklistCTA.astro
    RelatedPosts.astro
    JsonLd.astro
  content/
    articles/
      quanto-custa-morar-em-orlando-2026.md
      ...
  data/
    categories.ts
    site.ts
  layouts/
    BaseLayout.astro
    ArticleLayout.astro
    CategoryLayout.astro
  lib/
    canonical.ts
    dates.ts
    links.ts
    schema.ts
    sitemap.ts
  pages/
    index.astro
    blog.html.astro
    categorias.html.astro
    comece-aqui.html.astro
    sobre.html.astro
    checklist-mudanca-eua.html.astro
    articles/
      [slug].html.astro
    categorias/
      [slug].html.astro
    sitemap.xml.ts
public/
  assets/
    css/
    js/
    images/
    pdfs/
```

Observação importante: antes da migração total, criar um protótipo mínimo para confirmar que `blog.html.astro`, `articles/[slug].html.astro` e `categorias/[slug].html.astro` geram exatamente os arquivos esperados no `dist/`.

## 4. Como preservar URLs com `.html`

### Páginas raiz

Criar arquivos Astro com o `.html` no nome da rota:

- `src/pages/blog.html.astro` gera `/blog.html`.
- `src/pages/categorias.html.astro` gera `/categorias.html`.
- `src/pages/comece-aqui.html.astro` gera `/comece-aqui.html`.
- `src/pages/sobre.html.astro` gera `/sobre.html`.
- `src/pages/checklist-mudanca-eua.html.astro` gera `/checklist-mudanca-eua.html`.

### Artigos

Usar rota dinâmica com extensão preservada:

```text
src/pages/articles/[slug].html.astro
```

Cada artigo deve expor `slug` sem `.html` na fonte editorial, mas gerar URL final:

```text
/articles/{slug}.html
```

### Categorias

Usar:

```text
src/pages/categorias/[slug].html.astro
```

Cada categoria gera:

```text
/categorias/{slug}.html
```

## 5. Fonte editorial recomendada

Para escalar até 1.000 artigos, a fonte principal deve ser conteúdo estruturado, não HTML manual.

Formato recomendado para artigos:

```md
---
title: "Quanto custa morar em Orlando em 2026?"
metaTitle: "Quanto custa morar em Orlando em 2026?"
description: "Veja aluguel, mercado, carro, escola, trabalho e custo mensal para brasileiros que pensam em morar em Orlando."
slug: "quanto-custa-morar-em-orlando-2026"
category: "Cidades da Flórida"
datePublished: "2026-05-30"
dateModified: "2026-05-30"
readTime: "13 min de leitura"
image: "https://familiausa1.com/assets/images/familiausa1-share.svg"
author: "FamiliaUSA1"
faq:
  - question: "Quanto custa morar em Orlando em 2026?"
    answer: "Depende do bairro, moradia e tamanho da família..."
related:
  - "cidades-da-florida-com-mais-brasileiros-2026"
  - "quanto-custa-morar-em-miami-2026"
  - "vale-a-pena-morar-em-orlando-ou-tampa-2026"
---
```

O HTML final deve ser gerado pelo `ArticleLayout.astro`.

## 6. Geração de `assets/data/articles.json`

Hoje `assets/data/articles.json` é fonte para listagens e scripts.

Na arquitetura Astro, há duas opções:

### Opção recomendada

Gerar `assets/data/articles.json` automaticamente a partir dos arquivos de conteúdo durante o build.

Vantagens:

- Remove erro manual.
- Mantém cards e sitemap sincronizados.
- Evita artigo publicado fora do índice.
- Facilita escala para 1.000 artigos.

### Opção transitória

Manter `assets/data/articles.json` como fonte temporária na primeira fase e migrar conteúdo depois.

Vantagem: menor risco inicial.

Desvantagem: continua existindo duplicidade entre HTML e JSON.

## 7. Geração de categorias

Cada categoria deve ter um registro único em `src/data/categories.ts`:

```ts
export const categories = [
  {
    slug: "cidades-da-florida",
    title: "Cidades da Flórida para brasileiros",
    description: "Guias e comparativos para brasileiros escolherem onde morar na Flórida.",
    pillar: true
  }
];
```

O `CategoryLayout.astro` deve:

- Gerar `<title>`.
- Gerar meta description.
- Gerar canonical.
- Listar artigos filtrados por categoria.
- Exibir hubs e clusters.
- Gerar `BreadcrumbList`.
- Gerar `CollectionPage`, quando fizer sentido.

## 8. Geração de `blog.html`

`blog.html` deve ser uma página Astro estática que consome a mesma fonte editorial dos artigos.

Requisitos:

- Mostrar artigos recentes.
- Manter navegação por categorias como links reais, não filtros confusos.
- Preservar busca local se ela continuar útil.
- Não depender de cards manuais.
- Garantir que novos artigos apareçam sem editar HTML manualmente.

## 9. Geração de `sitemap.xml`

Criar `src/pages/sitemap.xml.ts` ou script pós-build que gere sitemap a partir da fonte editorial única.

Regras:

- Home com `lastmod` igual à data mais recente entre artigos.
- Artigos com `lastmod` vindo de `dateModified`.
- Categorias com `lastmod` igual à data mais recente dos artigos relacionados.
- Páginas raiz importantes incluídas.
- Páginas técnicas/noindex excluídas.
- Sem URLs duplicadas.
- URLs absolutas em `https://familiausa1.com`.

O sitemap novo deve ser comparado contra o sitemap atual antes de qualquer merge.

## 10. Canonicals

Criar helper único:

```ts
export function canonical(path: string) {
  return new URL(path, "https://familiausa1.com").toString();
}
```

Exemplos obrigatórios:

- `/` -> `https://familiausa1.com/`
- `/blog.html` -> `https://familiausa1.com/blog.html`
- `/articles/slug.html` -> `https://familiausa1.com/articles/slug.html`
- `/categorias/slug.html` -> `https://familiausa1.com/categorias/slug.html`

## 11. Google Analytics

Criar componente único em `BaseHead.astro`:

```astro
---
const GA_ID = "G-5RND6F4L8G";
---
<script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
<script is:inline>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-5RND6F4L8G');
</script>
```

Isso evita artigos sem Analytics.

## 12. Schema padronizado

### BlogPosting

Gerar uma única vez por artigo via helper `schema.ts`.

Campos obrigatórios:

- `@context`
- `@type: BlogPosting`
- `headline`
- `description`
- `image`
- `datePublished`
- `dateModified`
- `author`
- `publisher`
- `mainEntityOfPage`
- `inLanguage: pt-BR`

### FAQPage

Gerar somente quando:

- O artigo tiver FAQ visível na página.
- A lista `faq` existir no frontmatter.

Nunca gerar FAQPage sem FAQ visível.

### VideoObject

Gerar somente quando o artigo tiver vídeo.

Campos obrigatórios:

- `@context`
- `@type: VideoObject`
- `name`
- `description`
- `thumbnailUrl`
- `uploadDate` em ISO 8601 completo com fuso horário
- `embedUrl`
- `contentUrl`
- `publisher`

## 13. CTA do checklist

Criar componente compartilhado:

```text
src/components/ChecklistCTA.astro
```

Usar em:

- Home.
- `blog.html`.
- Hubs de categorias.
- Artigos de cidades.
- Artigos de custo de vida.
- Artigos de primeiros passos.

O link deve continuar:

```text
/checklist-mudanca-eua.html
```

O PDF deve continuar:

```text
/assets/pdfs/checklist-mudanca-eua-familiausa1.pdf
```

## 14. Validação de links internos

Antes do merge, criar script de validação que rode no build:

```text
scripts/validate-build-links.mjs
```

O script deve:

- Ler todos os HTML gerados em `dist/`.
- Extrair `href`.
- Ignorar externos, `mailto`, `tel` e âncoras puras.
- Confirmar que links internos existem no `dist/`.
- Confirmar que todo artigo em conteúdo aparece no sitemap.
- Confirmar que todo artigo em sitemap aparece no conteúdo.
- Confirmar que não há links para `teste.html` ou templates.

## 15. Comparação antes/depois

Antes de qualquer merge na `main`, gerar relatórios de paridade:

### URLs

- Exportar URLs do sitemap atual.
- Exportar URLs do sitemap Astro.
- Comparar:
  - URLs removidas.
  - URLs adicionadas.
  - URLs alteradas.
  - URLs duplicadas.

### SEO por página

Comparar para cada URL:

- `<title>`.
- meta description.
- canonical.
- H1.
- `robots`.
- Open Graph.
- Twitter Card.
- JSON-LD.

### Conteúdo

Comparar amostras visuais e HTML de:

- Home.
- Blog.
- Uma categoria pilar.
- Um artigo de visto.
- Um artigo de cidade.
- Um artigo com FAQ.
- Um artigo com VideoObject.

## 16. Plano de rollback

Como a `main` atual já é HTML estático funcional, o rollback é simples:

1. Nunca fazer merge da migração sem validação completa.
2. Manter a versão HTML atual intacta até a aprovação final.
3. Fazer PR da branch `astro-migration` para `main`, nunca commit direto.
4. Se algo falhar após merge, reverter o commit/merge da migração.
5. Como as URLs devem ser idênticas, não criar redirects como fallback primário.

## 17. Etapas recomendadas de execução

### Fase 0: limpeza pré-migração

- Padronizar os 5 artigos sem BlogPosting e Google Analytics.
- Normalizar categorias oficiais e aliases.
- Garantir que `generatedAt` de `articles.json` seja atualizado automaticamente.
- Documentar lista de URLs canônicas atuais.

### Fase 1: prova de conceito Astro

- Instalar Astro somente na branch `astro-migration`.
- Criar layout base.
- Gerar 3 páginas raiz:
  - `index.html`
  - `blog.html`
  - `checklist-mudanca-eua.html`
- Gerar 3 artigos de teste:
  - um artigo comum.
  - um artigo com FAQ.
  - um artigo com VideoObject.
- Gerar 1 categoria.
- Validar URLs `.html` no `dist/`.

### Fase 2: migração automatizada do conteúdo

- Criar extrator para transformar HTML legado em frontmatter + corpo.
- Revisar manualmente amostras por cluster.
- Preservar imagens, links internos e CTAs.
- Gerar `articles.json` a partir do conteúdo.

### Fase 3: migração dos hubs

- Migrar páginas de categoria para `CategoryLayout`.
- Garantir links para artigos satélites.
- Validar hubs de:
  - Visto americano.
  - Imigração e legalização.
  - Custo de vida.
  - Cidades da Flórida.
  - Cidades do Norte e Massachusetts.
  - Orlando e viagem.
  - Trabalho e renda.

### Fase 4: validação de paridade

- Comparar sitemap atual x sitemap Astro.
- Validar links internos.
- Validar JSON-LD.
- Validar H1/title/meta/canonical.
- Rodar Lighthouse local em páginas críticas.
- Revisar mobile.

### Fase 5: PR controlado

- Abrir PR da `astro-migration` para `main`.
- Não fazer merge até validação final.
- Se aprovado, merge único.
- Monitorar GitHub Pages e Google Search Console.

## 18. Recomendação técnica

Astro é uma boa escolha para o Família USA 1, principalmente porque o projeto pretende escalar para 1.000 artigos. A migração deve reduzir:

- Erros manuais de sitemap.
- Artigos fora do `articles.json`.
- Schemas duplicados.
- Datas de `uploadDate` inválidas.
- Inconsistência de cards.
- Categorias soltas.
- Falhas de canonical.

Mas a recomendação é não migrar tudo de uma vez. O caminho mais seguro é fazer uma prova de conceito com paridade de URL e SEO antes de converter os 151 artigos atuais.

## 19. Critérios de sucesso

A migração só deve avançar para a `main` quando:

- `dist/` tiver todas as URLs atuais.
- Nenhuma URL atual importante for removida.
- Todos os canonicals forem idênticos aos atuais.
- O sitemap novo tiver todos os artigos e categorias.
- `robots.txt` continuar permitindo indexação.
- Páginas técnicas continuarem fora do sitemap.
- Todos os artigos tiverem `BlogPosting`.
- FAQPage existir apenas quando houver FAQ visível.
- VideoObject tiver `thumbnailUrl` e `uploadDate` com fuso horário.
- Google Analytics estiver em todas as páginas indexáveis.
- Links internos quebrados forem `0`.
- Home, blog, categorias e artigos críticos passarem em revisão visual.

## 20. Conclusão

O site está em condição adequada para planejar uma migração para Astro, mas a migração deve ser feita como engenharia de paridade, não como redesign. O maior valor do Astro aqui não é visual: é governança editorial, geração automática de SEO técnico e redução de erros conforme o blog cresce.

Próximo passo recomendado: executar a Fase 0 de limpeza e, em seguida, criar uma prova de conceito Astro mínima na branch `astro-migration`, sem mexer na `main`.
