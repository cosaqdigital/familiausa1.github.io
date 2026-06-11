# Plano de deploy seguro Astro - FamiliaUSA1

Data: 2026-06-11  
Branch de preparacao: `astro-migration`  
PR: `#4 - POC Astro preservando URLs e SEO`

## Objetivo

Preparar a migracao do FamiliaUSA1 para Astro com publicacao segura no GitHub Pages, preservando:

- dominio `familiausa1.com`;
- URLs atuais com `.html`;
- canonical tags;
- Google Analytics `G-5RND6F4L8G`;
- sitemap com 177 URLs;
- `robots.txt`;
- assets em `/assets/`;
- schemas `BlogPosting`, `FAQPage`, `CollectionPage` e `BreadcrumbList`;
- conteudo legado enquanto a migracao ainda nao for mesclada.

## Configuracao atual

O site atual e HTML estatico no GitHub Pages.

Estado observado nesta branch:

- `CNAME` existe na raiz com `familiausa1.com`.
- `robots.txt` existe na raiz e aponta para `https://familiausa1.com/sitemap.xml`.
- `sitemap.xml` atual existe na raiz com 177 URLs.
- `assets/` contem CSS, imagens, PDFs e dados publicos.
- Existem workflows legados:
  - `.github/workflows/atualizar-sitemap.yml`
  - `.github/workflows/relatorio-diario.yml`
- Existe workflow de validacao Astro:
  - `.github/workflows/astro-poc-validation.yml`

O modelo atual provavelmente publica a partir de `main`/root do repositorio. Depois da migracao, a recomendacao e publicar o conteudo gerado em `dist/` via GitHub Actions.

## Configuracao recomendada

Usar GitHub Pages com source configurado como **GitHub Actions** e workflow dedicado:

`.github/workflows/deploy-astro-pages.yml`

O workflow deve:

1. Rodar apenas em `main`.
2. Instalar dependencias com `npm ci` quando houver `package-lock.json`.
3. Executar `npm run build`.
4. Rodar validacoes antes do deploy.
5. Publicar somente a pasta `dist/`.
6. Nunca publicar `src/`, `scripts/`, `planejamento-seo/`, `node_modules/` ou arquivos internos.

## Por que GitHub Pages via Actions e a melhor opcao

Publicar `dist/` via Actions reduz risco manual porque:

- o build Astro sempre gera as paginas antes da publicacao;
- as validacoes bloqueiam deploy se houver erro de URL, schema, sitemap ou link interno;
- arquivos internos nao sao publicados por acidente;
- `CNAME`, `robots.txt`, `assets/` e `sitemap.xml` podem ser verificados no artefato final;
- o rollback pode ser feito revertendo o merge ou o commit de deploy.

## Como preservar `familiausa1.com`

O arquivo `CNAME` precisa existir em `dist/CNAME` no momento do upload do artefato Pages.

O script `scripts/copy-static-assets.mjs` deve copiar:

- `CNAME`;
- `robots.txt`;
- assets publicos;
- favicon/manifest se existirem no futuro.

Antes do merge, conferir:

```bash
npm run build
test -f dist/CNAME
cat dist/CNAME
```

Conteudo esperado:

```text
familiausa1.com
```

## Como garantir `robots.txt`

O arquivo `robots.txt` deve ser copiado para `dist/robots.txt`.

Conteudo esperado:

```text
User-agent: *
Allow: /

Sitemap: https://familiausa1.com/sitemap.xml
```

## Como garantir `sitemap.xml`

O Astro gera `dist/sitemap.xml` por meio de:

`src/pages/sitemap.xml.ts`

O sitemap gerado deve conter:

- 151 artigos legados;
- 20 categorias;
- 6 paginas principais;
- 177 URLs totais enquanto nao houver novos artigos Markdown publicados.

O script `validate:site-structure` compara o sitemap Astro com o sitemap atual e deve passar antes do merge.

## Como garantir assets

O build executa:

```bash
astro build && node scripts/copy-static-assets.mjs
```

Esse script copia:

- `assets/` para `dist/assets/`;
- `CNAME` para `dist/CNAME`;
- `robots.txt` para `dist/robots.txt`;
- arquivos publicos opcionais de favicon/manifest, se existirem.

## Arquivos que precisam estar no `dist` para producao

Obrigatorios:

- `dist/index.html`
- `dist/blog.html`
- `dist/categorias.html`
- `dist/checklist-mudanca-eua.html`
- `dist/comece-aqui.html`
- `dist/sobre.html`
- `dist/sitemap.xml`
- `dist/robots.txt`
- `dist/CNAME`
- `dist/assets/`
- `dist/articles/*.html`
- `dist/categorias/*.html`

Nao devem ser publicados:

- `src/`
- `scripts/`
- `planejamento-seo/`
- `node_modules/`
- `.github/`
- `dados/`
- relatorios internos que nao fazem parte do site publicado.

## Checklist antes do merge

- [ ] PR ainda esta em Draft ate revisao final.
- [ ] `npm run build` passou.
- [ ] `npm run validate:poc` passou.
- [ ] `npm run validate:batch` passou.
- [ ] `npm run qa:batch` passou.
- [ ] `npm run validate:all-articles` passou.
- [ ] `npm run validate:site-structure` passou.
- [ ] `npm run validate:new-article` passou.
- [ ] `dist/CNAME` existe e contem `familiausa1.com`.
- [ ] `dist/robots.txt` existe e aponta para o sitemap correto.
- [ ] `dist/sitemap.xml` tem 177 URLs enquanto nao houver novos artigos.
- [ ] `dist/assets/` existe.
- [ ] Nenhum arquivo interno sensivel esta no artefato publicado.
- [ ] Inspecao visual manual de home, blog, categorias, artigo e checklist.

## Checklist depois do merge

- [ ] Conferir se GitHub Pages esta configurado para **GitHub Actions**.
- [ ] Aguardar workflow `Deploy Astro to GitHub Pages`.
- [ ] Confirmar deploy bem-sucedido.
- [ ] Abrir `https://familiausa1.com/`.
- [ ] Abrir `https://familiausa1.com/blog.html`.
- [ ] Abrir uma pagina de categoria.
- [ ] Abrir um artigo antigo.
- [ ] Abrir `https://familiausa1.com/sitemap.xml`.
- [ ] Abrir `https://familiausa1.com/robots.txt`.
- [ ] Validar Search Console: sitemap, cobertura, paginas indexaveis.
- [ ] Validar Google Analytics em tempo real.

## Plano de rollback

Se houver erro apos o merge:

1. Nao apagar conteudo manualmente.
2. Reverter o merge commit na `main`.
3. Confirmar novo deploy pelo workflow.
4. Verificar se as paginas HTML legadas voltaram a ser servidas.
5. Registrar o erro no PR antes de tentar novo merge.

Se o erro for apenas de conteudo em uma pagina:

1. Corrigir na branch `astro-migration` ou branch de hotfix.
2. Rodar build e validacoes.
3. Abrir PR curto.
4. Fazer merge somente apos checks passarem.

## Riscos SEO

- Canonical incorreto pode causar perda de indexacao.
- Sitemap divergente pode atrasar rastreamento.
- Falta de `CNAME` pode quebrar dominio customizado.
- Falta de `robots.txt` pode gerar sinal ruim no Search Console.
- Remocao acidental de `.html` quebraria URLs indexadas.
- Mudanca visual brusca pode afetar retencao e comportamento do usuario.

## Riscos tecnicos

- GitHub Pages precisa estar configurado para Actions.
- Workflows antigos de sitemap podem ficar redundantes apos Astro.
- Conteudo Markdown futuro precisa respeitar frontmatter obrigatorio.
- Novos artigos devem passar por validacao antes de merge.

## Search Console e Analytics apos publicacao

Depois do deploy:

1. Enviar novamente `https://familiausa1.com/sitemap.xml` no Search Console.
2. Verificar se nao surgiram novas paginas `noindex`.
3. Usar inspeção de URL em uma home, uma categoria e um artigo.
4. Conferir em Analytics se pageviews aparecem em tempo real.
5. Monitorar por 7 dias:
   - paginas descobertas;
   - paginas rastreadas;
   - erros 404;
   - dados estruturados;
   - Core Web Vitals.

## Recomendacao

A estrutura Astro esta tecnicamente pronta para preparar merge futuro, desde que:

- o workflow de deploy seja revisado;
- a configuracao de GitHub Pages seja ajustada para Actions somente na hora certa;
- uma inspeção visual final seja feita no artefato `dist`;
- a PR continue sem deploy ate a decisao final.
