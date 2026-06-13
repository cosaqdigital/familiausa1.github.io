# Ajuste de espacamento do header na Home Astro

Data: 2026-06-12  
Branch: `astro-migration`  
PR: `#4 - POC Astro preservando URLs e SEO`

## Problema

Na inspeção manual do artifact, o header/menu parecia sobrepor a área hero da Home em algumas larguras, cobrindo parte do título principal.

## Diagnóstico

- `BaseLayout.astro` renderiza o `<Header />` apenas uma vez.
- `dist/index.html` contém `site-header=1`.
- `dist/index.html` contém `hero-cinematic=1`.
- O header não estava duplicado.
- O comportamento vinha do header `sticky` com pouco respiro visual no topo do hero quando o menu ocupa mais altura.

## Ajuste aplicado

Arquivo ajustado:

- `src/styles/global.css`

Mudanças:

- Header `sticky` mantido.
- Fundo do header ficou mais opaco: `rgba(17, 29, 46, 0.98)`.
- Hero recebeu `scroll-margin-top: 120px`.
- Padding superior do hero foi aumentado no desktop:
  - `padding: clamp(82px, 10vw, 140px) 0 clamp(56px, 8vw, 112px);`
- Padding do hero foi reforçado em tablet:
  - `padding: 76px 0 46px;`
- Padding superior do hero foi reforçado em mobile:
  - `padding-top: 88px;`

## Teste responsivo

O navegador interno bloqueou abertura local por `file://`/`localhost`, então a validação visual foi feita por inspeção técnica do HTML/CSS gerado e pela esteira automatizada.

Confirmado no `dist/index.html`:

- CSS global inline presente.
- Header único.
- Hero único.
- Regras de espaçamento desktop presentes.
- Regras de espaçamento tablet presentes.
- Regras de espaçamento mobile presentes.
- Nenhuma alteração em URLs, canonical, sitemap, schemas ou conteúdo.

## Validações

Comandos equivalentes executados com Node direto:

- `npm run build`
- `npm run validate:poc`
- `npm run validate:batch`
- `npm run qa:batch`
- `npm run validate:all-articles`
- `npm run validate:site-structure`
- `npm run validate:new-article`

Resultado:

- Build passou.
- Todos os validadores passaram.
- `dist` continua com `177` HTMLs.
- `dist/articles` continua com `151` artigos.
- `dist/categorias` continua com `20` categorias.
- `CNAME`, `robots.txt`, `sitemap.xml`, `index.html`, `blog.html`, `categorias.html` e `assets` continuam presentes.
- Nenhum arquivo sensível foi encontrado no `dist`.

## Recomendação

Baixar o próximo artifact do GitHub Actions e revisar visualmente a Home em desktop e mobile. Se o título não estiver mais sendo coberto pelo menu, este ajuste pode ser mantido.

