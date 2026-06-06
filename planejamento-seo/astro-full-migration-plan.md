# Plano técnico da migração completa para Astro

Branch: `astro-migration`  
PR: `#4 — POC Astro preservando URLs e SEO`  
Status: planejamento técnico da Fase 2. Não executar migração completa nesta etapa.

## 1. Objetivo

Migrar o Família USA 1 de HTML estático manual para Astro, preservando 100% das URLs atuais, SEO técnico, canonicals, sitemap, Google Analytics, schema.org, links internos, assets e experiência editorial.

O objetivo estratégico é permitir que o blog cresça de 151 artigos para 1.000+ artigos com menos erro manual, mantendo qualidade editorial, autoridade temática e segurança de indexação no Google.

## 2. Escopo desta fase

Esta fase é somente planejamento. Ela define como migrar o acervo e como validar a migração antes de qualquer merge em `main`.

Fora do escopo desta fase:

- Não converter os 151 artigos agora.
- Não remover HTML legado.
- Não alterar `main`.
- Não fazer deploy.
- Não publicar em GitHub Pages.
- Não abrir PR de merge pronto para produção.

## 3. Auditoria da POC Astro atual

### Estrutura criada

A POC atual contém:

- `astro.config.mjs`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `src/components/`
- `src/layouts/`
- `src/data/pilotContent.ts`
- `src/pages/`
- `scripts/copy-static-assets.mjs`
- `scripts/validate-astro-poc.mjs`
- `.github/workflows/astro-poc-validation.yml`

### Componentes

- `Header.astro`: navegação principal com links atuais.
- `Footer.astro`: bloco institucional e links de rodapé.
- `SeoHead.astro`: title, meta description, canonical, OG, Twitter Card, stylesheet e Google Analytics.
- `ArticleCard.astro`: card de artigo reutilizável.
- `ChecklistCTA.astro`: CTA do checklist gratuito.
- `RelatedPosts.astro`: posts relacionados.

### Layouts

- `BaseLayout.astro`: head, header, footer e slot principal.
- `ArticleLayout.astro`: artigo com `BlogPosting`, FAQ visível e `FAQPage` automático.
- `CategoryLayout.astro`: página de categoria com `CollectionPage`.

### Rotas piloto

Páginas principais:

- `src/pages/index.astro` -> `dist/index.html`
- `src/pages/blog.astro` -> `dist/blog.html`
- `src/pages/categorias.astro` -> `dist/categorias.html`
- `src/pages/comece-aqui.astro` -> `dist/comece-aqui.html`
- `src/pages/sobre.astro` -> `dist/sobre.html`
- `src/pages/checklist-mudanca-eua.astro` -> `dist/checklist-mudanca-eua.html`

Artigos:

- `src/pages/articles/[slug].astro` -> `dist/articles/{slug}.html`

Categorias:

- `src/pages/categorias/[slug].astro` -> `dist/categorias/{slug}.html`

### Compatibilidade com URLs `.html`

A POC corrigida usa:

```js
build: {
  format: "file"
}
```

Com isso, as rotas Astro sem `.html` no nome do arquivo geram saída final com `.html`. Exemplo:

- `src/pages/blog.astro` gera `/blog.html`
- `src/pages/articles/[slug].astro` gera `/articles/slug.html`

Essa é a abordagem correta para preservar as URLs atuais do domínio próprio `familiausa1.com`.

### Build e validação

A POC tem workflow:

- `.github/workflows/astro-poc-validation.yml`

Ele roda:

- `npm ci` quando há `package-lock.json`.
- `npm run build`.
- `npm run validate:poc`.

O validador atual confere:

- Arquivos `.html` esperados no `dist`.
- Google Analytics `G-5RND6F4L8G`.
- Canonical no domínio `familiausa1.com`.
- `BlogPosting` nos artigos piloto.
- `CollectionPage` nas categorias piloto.
- Ausência de `PLACEHOLDER`.
- Links internos entre páginas piloto e assets.

### Pontos fortes da POC

- Preserva `.html`.
- Centraliza SEO em componente.
- Centraliza schema em layout.
- Reutiliza CSS existente.
- Mantém CTA do checklist.
- Gera categorias e artigos por dados piloto.
- Tem GitHub Actions de validação sem deploy.

### Pontos frágeis da POC

- Conteúdo piloto ainda está em `src/data/pilotContent.ts`, não em uma fonte editorial final.
- Ainda não há extração real dos 151 artigos.
- Ainda não há geração completa de `sitemap.xml`.
- Ainda não há geração completa de `assets/data/articles.json`.
- Ainda não há conversão de FAQs reais.
- Ainda não há preservação automática de `VideoObject`.
- Ainda não há comparação automática de sitemap antigo x novo.
- Ainda não há validação visual.
- A branch `origin/main` avançou após a POC; antes de qualquer migração real, `astro-migration` deve ser atualizada novamente com `origin/main`.

## 4. Auditoria do conteúdo atual

### Inventário atual

- Artigos HTML em `/articles/`: `151`.
- Categorias HTML em `/categorias/`: `20`.
- URLs totais no `sitemap.xml`: `177`.
- URLs de artigos no sitemap: `151`.
- URLs de categorias no sitemap: `20`.
- Duplicatas no sitemap: `0`.
- Artigos em `assets/data/articles.json`: `151`.
- Campos atuais do `articles.json`: `title`, `description`, `category`, `url`, `date`, `modified`, `readTime`.
- `robots.txt`: permite rastreamento e declara `https://familiausa1.com/sitemap.xml`.

### Páginas principais

- `index.html`
- `blog.html`
- `categorias.html`
- `comece-aqui.html`
- `sobre.html`
- `checklist-mudanca-eua.html`
- `article.html` com `noindex, follow`
- `teste.html` com `noindex, nofollow`

### Categorias existentes

- `adaptacao-cultural.html`
- `asilo-nos-eua.html`
- `banco-credito.html`
- `cidades-da-florida.html`
- `cidades-do-norte-e-massachusetts.html`
- `compras-nos-eua.html`
- `custo-de-vida.html`
- `familia-filhos.html`
- `imigracao-e-bancos.html`
- `imigracao-legalizacao.html`
- `moradia-nos-eua.html`
- `noticias-eua.html`
- `orlando-disney.html`
- `orlando-e-viagem.html`
- `planejamento.html`
- `primeiros-passos.html`
- `saude-nos-eua.html`
- `trabalho-renda.html`
- `vida-real-nos-eua.html`
- `visto-americano.html`

### Assets

- `assets/css/styles.css`: 1 arquivo CSS global.
- `assets/js/recent-posts.js`: 1 script principal de listagem.
- `assets/images/`: 66 arquivos.
- `assets/images/articles/`: 62 arquivos.
- `assets/images/familiausa1/`: 1 imagem institucional.
- `assets/pdfs/`: 1 PDF de checklist.

Extensões de imagem:

- `.webp`: 30.
- `.png`: 29.
- `.svg`: 6.
- `.keep`: 1.

### SEO e schema atual dos artigos

No acervo atual:

- Artigos sem Google Analytics: `0`.
- Artigos sem `BlogPosting`: `0`.
- Artigos com H1 diferente de 1: `0`.
- Páginas com `FAQPage`: `129`.
- Páginas com FAQ visível ou `<details>`: `143`.
- Páginas com `VideoObject`: `2`.
- Blocos JSON-LD em artigos: `300`.
- Artigos sem `og:image`: `0`.
- Artigos usando imagem OG padrão `familiausa1-share.svg`: `139`.

### Riscos observados no conteúdo atual

- Muitas imagens OG ainda usam padrão genérico.
- Alguns labels de categoria visíveis têm variações ou encoding/mojibake, como `Cidades da FlÃ³rida`, `ImigraÃ§Ã£o`, `SaÃºde`.
- Há categorias editoriais duplicadas por variação de nome, por exemplo `Cidades da Flórida`, `Cidades da Florida`, `Imigracao e legalizacao`, `Imigração e legalização`.
- `articles.json` está sincronizado com artigos, mas `generatedAt` está antigo em relação a publicações posteriores.
- O site tem scripts paralelos de sitemap (`generate-sitemap.js` e `gerar_sitemap.py`), o que pode gerar divergência futura.
- `recent-posts.js` ainda depende de mapeamentos e lógica do legado.

## 5. Estratégias possíveis de conteúdo em Astro

### Opção A: converter artigos HTML para Markdown/MDX com frontmatter

Descrição: cada artigo vira um arquivo `.md` ou `.mdx` em `src/content/articles/`, com frontmatter estruturado e corpo em Markdown/MDX.

Vantagens:

- Melhor formato editorial para criar novos artigos.
- Frontmatter facilita schema, cards, sitemap e categorias.
- Bom para escalar para 1.000 artigos.
- Permite padronização forte com Content Collections.
- Facilita revisão editorial e automações futuras.

Desvantagens:

- Conversão de 151 HTML para Markdown/MDX tem risco de perda de marcação.
- Tabelas, embeds, CTAs, HTML customizado e FAQs podem quebrar se a conversão for automática demais.
- Exige script de extração e revisão por amostragem.

Esforço: alto.  
Risco SEO: médio se houver validação forte; alto se feito manualmente sem comparação.  
Risco de perda de conteúdo: médio.  
Facilidade para Codex criar novos artigos: alta.  
Facilidade para 1.000 artigos: alta.  
Schema automático: alta.

### Opção B: manter artigos como HTML bruto importado dentro de layout Astro

Descrição: extrair o miolo atual dos artigos e renderizar dentro de `ArticleLayout`, mantendo corpo HTML como string ou arquivo parcial.

Vantagens:

- Menor risco de perda visual ou conteúdo.
- Preserva tabelas, listas, CTAs, notas, FAQs e marcação existente.
- Migração inicial mais rápida.
- Boa ponte entre legado e Astro.

Desvantagens:

- Conteúdo continua menos limpo editorialmente.
- Manutenção de 1.000 artigos em HTML bruto fica pesada.
- Pode manter inconsistências antigas dentro do corpo.
- Menos elegante que MDX para novos artigos.

Esforço: médio.  
Risco SEO: baixo a médio.  
Risco de perda de conteúdo: baixo.  
Facilidade para Codex criar novos artigos: média.  
Facilidade para 1.000 artigos: média.  
Schema automático: média a alta, se metadata for extraída corretamente.

### Opção C: manter HTML legado por enquanto e usar Astro apenas para páginas novas

Descrição: Astro gera novas páginas e novos artigos, mas os 151 artigos antigos permanecem como HTML estático.

Vantagens:

- Menor risco imediato.
- Permite começar a criar conteúdo novo com Astro.
- Não mexe em artigos já indexados.
- Bom para testar GitHub Pages e pipeline.

Desvantagens:

- Mantém duas arquiteturas.
- Não resolve a governança dos 151 artigos.
- Pode gerar inconsistência de layout/schema.
- Não captura todo o ganho de escala.

Esforço: baixo.  
Risco SEO: baixo no curto prazo.  
Risco de perda de conteúdo: baixo.  
Facilidade para Codex criar novos artigos: alta para novos artigos, baixa para legado.  
Facilidade para 1.000 artigos: média.  
Schema automático: alta para novos, baixa para legado.

### Opção D: pipeline híbrido gradual

Descrição: migrar primeiro metadata e layout para Astro, manter corpo HTML bruto dos artigos legados, e depois converter progressivamente os artigos para MDX/frontmatter.

Fluxo recomendado:

1. Extrair metadata dos 151 HTML.
2. Extrair corpo HTML principal de cada artigo.
3. Gerar arquivos de conteúdo híbrido com frontmatter + corpo HTML.
4. Renderizar tudo via `ArticleLayout`.
5. Validar paridade de URL, title, canonical, H1, schema e links.
6. Depois converter clusters prioritários para MDX conforme necessidade editorial.

Vantagens:

- Baixo risco SEO na primeira migração.
- Preserva conteúdo existente.
- Centraliza schema, GA, header, footer e sitemap.
- Cria caminho para MDX sem exigir conversão total imediata.
- Permite escala com menos trauma.

Desvantagens:

- Requer script de extração cuidadoso.
- Ainda mantém HTML bruto por algum tempo.
- Requer validação forte de paridade.

Esforço: médio a alto.  
Risco SEO: baixo se a validação for rígida.  
Risco de perda de conteúdo: baixo.  
Facilidade para Codex criar novos artigos: alta, se novos já forem MDX/frontmatter.  
Facilidade para 1.000 artigos: alta.  
Schema automático: alta.

### Recomendação final

Recomendo a Opção D: pipeline híbrido gradual.

Motivo: o site já tem 151 artigos indexáveis, muitos com FAQ, schema, CTAs, links internos e HTML específico. Migrar tudo diretamente para MDX aumenta risco de perda ou regressão. Manter tudo legado não resolve escala. O híbrido permite preservar SEO agora e evoluir para MDX depois.

## 6. Arquitetura final recomendada

```text
src/
  components/
    ArticleCard.astro
    Breadcrumbs.astro
    ChecklistCTA.astro
    Footer.astro
    Header.astro
    RelatedPosts.astro
    SeoHead.astro
    VideoEmbed.astro
  content/
    articles/
      *.mdx
      *.html.json
    categories/
      *.json
  data/
    categories.ts
    site.ts
  layouts/
    BaseLayout.astro
    ArticleLayout.astro
    CategoryLayout.astro
    HomeLayout.astro
  lib/
    articles.ts
    canonicals.ts
    dates.ts
    extract.ts
    links.ts
    schema.ts
    sitemap.ts
    taxonomy.ts
  pages/
    index.astro
    blog.astro
    categorias.astro
    comece-aqui.astro
    sobre.astro
    checklist-mudanca-eua.astro
    articles/
      [slug].astro
    categorias/
      [slug].astro
    sitemap.xml.ts
public/
  assets/
```

## 7. Estratégia para artigos existentes

### Fase inicial

Converter cada artigo legado para um arquivo estruturado:

```text
src/content/articles/slug.json
```

Formato sugerido:

```json
{
  "slug": "quanto-custa-morar-em-orlando-2026",
  "url": "/articles/quanto-custa-morar-em-orlando-2026.html",
  "title": "...",
  "metaTitle": "...",
  "description": "...",
  "category": "Cidades da Flórida",
  "datePublished": "2026-05-30",
  "dateModified": "2026-05-30",
  "readTime": "13 min de leitura",
  "image": "https://familiausa1.com/assets/images/...",
  "h1": "...",
  "lead": "...",
  "bodyHtml": "...",
  "faq": [],
  "related": []
}
```

O `bodyHtml` pode preservar HTML do artigo antigo enquanto metadata/schema/header/footer passam para Astro.

### Conversão posterior

Clusters prioritários podem migrar para MDX:

- Visto americano.
- Imigração e legalização.
- Custo de vida.
- Cidades da Flórida.
- Cidades do Norte/Massachusetts.
- Orlando e Disney.

## 8. Estratégia para novos artigos

Novos artigos devem nascer em MDX ou frontmatter estruturado.

Padrão recomendado:

```mdx
---
slug: "novo-artigo"
title: "Título SEO"
description: "Meta description..."
category: "Custo de vida"
datePublished: "2026-06-10"
dateModified: "2026-06-10"
readTime: "12 min de leitura"
image: "https://familiausa1.com/assets/images/familiausa1-share.svg"
faq:
  - question: "Pergunta"
    answer: "Resposta"
related:
  - "slug-relacionado"
---
```

O Codex deve criar novos artigos nesse padrão para evitar HTML manual.

## 9. Estratégia para categorias

Categorias devem ser normalizadas em uma taxonomia única:

```ts
export const categories = [
  {
    slug: "imigracao-legalizacao",
    title: "Imigração e legalização nos EUA",
    aliases: ["Imigracao e legalizacao", "Imigração nos EUA"],
    description: "...",
    pillar: true
  }
];
```

Objetivos:

- Resolver variações de labels.
- Preservar URLs atuais.
- Listar artigos automaticamente.
- Gerar `CollectionPage`.
- Gerar breadcrumb.
- Melhorar hubs.

## 10. Estratégia para `blog.html`

`blog.html` deve ser gerado por Astro com:

- Artigos recentes.
- Navegação real por categorias.
- Busca local, se mantida.
- CTA do checklist.
- Cards gerados por dados.
- Sem listas manuais.

## 11. Estratégia para `sitemap.xml`

Substituir scripts paralelos por uma fonte única de sitemap em Astro.

Regras:

- Home com `lastmod` igual à data mais recente.
- Artigos com `dateModified`.
- Categorias com `lastmod` baseado nos artigos do hub.
- Excluir noindex e páginas técnicas.
- Preservar URLs `.html`.
- Sem duplicatas.

## 12. Estratégia para `assets/data/articles.json`

Gerar `assets/data/articles.json` automaticamente a partir da coleção Astro.

Manter campos atuais para compatibilidade:

- `title`
- `description`
- `category`
- `url`
- `date`
- `modified`
- `readTime`

Adicionar apenas se necessário:

- `image`
- `slug`
- `featured`

## 13. Estratégia para `robots.txt`

Preservar:

```txt
User-agent: *
Allow: /

Sitemap: https://familiausa1.com/sitemap.xml
```

Não bloquear `/articles/`, `/categorias/`, `/assets/`.

## 14. Estratégia para assets e imagens

Manter assets em:

```text
public/assets/
```

Ou manter `assets/` legado e copiá-lo para `dist/assets` no build, como a POC já faz.

Recomendação:

- Curto prazo: manter cópia via `scripts/copy-static-assets.mjs`.
- Médio prazo: mover assets para `public/assets` se isso simplificar o build.

Imagens OG:

- Preservar as 62 imagens atuais em `assets/images/articles/`.
- Continuar usando fallback `familiausa1-share.svg`.
- Criar plano futuro para reduzir dependência de OG genérico, já que 139 artigos usam imagem padrão.

## 15. Preservação de URLs e canonical

Regras obrigatórias:

- `/` deve continuar canonical `https://familiausa1.com/`.
- `/blog.html` deve continuar `https://familiausa1.com/blog.html`.
- `/articles/slug.html` deve continuar exatamente igual.
- `/categorias/slug.html` deve continuar exatamente igual.

Nunca migrar para:

- `/blog/`
- `/articles/slug/`
- `/categorias/slug/`

## 16. Google Analytics

GA deve ficar em `SeoHead.astro`, com:

```text
G-5RND6F4L8G
```

Validação obrigatória:

- Todas as páginas indexáveis geradas devem conter GA.
- Páginas técnicas noindex podem ser exceção, mas devem ser tratadas conscientemente.

## 17. Schema automático

### BlogPosting

Gerar em todo artigo.

Campos mínimos:

- `@context`
- `@type`
- `headline`
- `description`
- `url`
- `datePublished`
- `dateModified`
- `inLanguage`
- `author`
- `publisher`
- `mainEntityOfPage`
- `image`

### FAQPage

Gerar somente quando há FAQ visível.

Extrair perguntas/respostas de:

- JSON-LD legado.
- Bloco HTML visível.
- Frontmatter novo.

### CollectionPage

Gerar em categorias e hubs.

### VideoObject

Preservar nos 2 artigos/páginas com vídeo.

Obrigatório:

- `thumbnailUrl`
- `uploadDate` ISO 8601 com fuso.
- `embedUrl`
- `contentUrl`
- `publisher`

## 18. Validação de links

Criar validador completo:

```text
scripts/validate-full-build.mjs
```

Checar:

- Todos os `href` internos existem no `dist`.
- Ignorar externos, `mailto`, `tel`, âncoras puras.
- Confirmar que todos os artigos em dados estão no sitemap.
- Confirmar que todos os artigos no sitemap existem.
- Confirmar que nenhum artigo aponta para URL antiga quebrada.
- Confirmar que `teste.html` e templates não entram no sitemap.

## 19. Validação de schema

Checar:

- JSON-LD parseável em todas as páginas.
- `BlogPosting` único por artigo.
- `FAQPage` somente com FAQ visível.
- `CollectionPage` nas categorias.
- `VideoObject` com datas válidas.
- `mainEntityOfPage` igual ao canonical.

## 20. Plano de deploy

Antes de merge:

1. Build local.
2. Build em GitHub Actions.
3. Comparação de sitemap antigo x novo.
4. Comparação de canonicals.
5. Validação de links.
6. Validação de schema.
7. Inspeção visual de amostras.
8. Aprovação manual.

Deploy:

- Só depois de PR final separado.
- Nunca usar a PR #4 como merge automático de produção sem nova revisão.
- GitHub Pages deve continuar publicando a partir da `main`.

## 21. Plano de rollback

Rollback simples:

- Reverter o merge da migração Astro em `main`.
- Como URLs devem ser idênticas, não deve haver necessidade de redirects.
- Manter snapshot da versão HTML anterior.
- Salvar sitemap antigo antes do merge.

## 22. Checklist antes do merge

- [ ] `astro-migration` atualizada com `origin/main`.
- [ ] 151 artigos gerados em `dist/articles/*.html`.
- [ ] 20 categorias geradas em `dist/categorias/*.html`.
- [ ] Páginas principais geradas.
- [ ] Sitemap novo com 177+ URLs esperadas.
- [ ] URLs antigas preservadas.
- [ ] 0 links internos quebrados.
- [ ] 0 JSON-LD inválidos.
- [ ] 0 artigos sem BlogPosting.
- [ ] FAQPage somente quando houver FAQ visível.
- [ ] VideoObject válido.
- [ ] GA em todas as páginas indexáveis.
- [ ] `robots.txt` preservado.
- [ ] `assets/` preservado.
- [ ] PDF do checklist acessível.
- [ ] Artifacts revisados visualmente.
- [ ] Lighthouse amostral.
- [ ] PR revisada manualmente.

## 23. Checklist depois do merge

- [ ] Confirmar GitHub Pages publicado.
- [ ] Testar home.
- [ ] Testar blog.
- [ ] Testar categorias.
- [ ] Testar 10 artigos críticos.
- [ ] Testar checklist PDF.
- [ ] Abrir `sitemap.xml`.
- [ ] Abrir `robots.txt`.
- [ ] Validar Rich Results em amostras.
- [ ] Monitorar Google Search Console.
- [ ] Solicitar inspeção de URLs críticas, se necessário.

## 24. Riscos SEO

- Mudança acidental de URL.
- Canonical errado.
- Sitemap incompleto.
- Perda de FAQPage.
- FAQPage sem FAQ visível.
- Perda de VideoObject.
- Imagens OG quebradas.
- Links internos relativos quebrados.
- Artigos fora de categorias.
- Conteúdo reduzido durante conversão.
- Encoding/mojibake preservado em labels.
- Uso excessivo de imagem OG padrão.

## 25. Riscos técnicos

- `build.format` mal configurado.
- Geração de rotas em diretórios em vez de `.html`.
- Conflito entre HTML legado e páginas Astro.
- Dependência de script de cópia de assets.
- GitHub Actions de produção misturado com workflow da POC.
- `articles.json` e sitemap divergentes.
- Build lento com 1.000 artigos se não houver estrutura eficiente.

## 26. Cronograma sugerido

### Fase 2.1 — Preparação

- Atualizar `astro-migration` com `origin/main`.
- Criar extrator de metadata.
- Criar relatório de paridade de URLs.
- Normalizar taxonomia.

### Fase 2.2 — Extração piloto real

- Migrar 10 artigos reais para formato híbrido.
- Incluir 2 artigos com FAQ.
- Incluir 1 artigo com VideoObject.
- Incluir 2 categorias reais.
- Comparar HTML antigo x Astro.

### Fase 2.3 — Migração completa em staging

- Converter 151 artigos para formato híbrido.
- Gerar categorias.
- Gerar blog.
- Gerar sitemap.
- Gerar `articles.json`.

### Fase 2.4 — Validação forte

- Links internos.
- Schema.
- Sitemap antigo x novo.
- Canonicals.
- GA.
- Visual.
- Performance.

### Fase 2.5 — Decisão de produção

- Revisar PR.
- Aprovar ou abortar.
- Se aprovado, fazer merge controlado.

## 27. Próxima tarefa prática recomendada

Criar um script de extração piloto:

```text
scripts/extract-legacy-articles.mjs
```

Esse script deve converter 10 artigos HTML reais em dados híbridos, preservando:

- URL.
- Title.
- Meta description.
- Canonical.
- H1.
- Lead.
- Categoria.
- Datas.
- Read time.
- OG image.
- Body HTML.
- FAQ.
- Related posts.

Depois, atualizar `ArticleLayout` para renderizar esses 10 artigos reais e validar paridade.

## 28. Decisão recomendada

Devemos continuar com Astro.

A POC está apta para evoluir porque já validou:

- URLs `.html`.
- Layout centralizado.
- GA.
- BlogPosting.
- FAQPage.
- CollectionPage.
- Build e validação em POC.
- Workflow de validação sem deploy.

A estratégia recomendada é pipeline híbrido gradual: preservar o corpo HTML dos artigos legados primeiro e migrar progressivamente para MDX/frontmatter nos clusters mais importantes.
