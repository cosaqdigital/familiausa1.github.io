# Auditoria de URLs 404 no Google Search Console

Data: 2026-06-20  
Site: https://familiausa1.com

## Resumo executivo

A auditoria analisou os padrões informados pelo Google Search Console e comparou com a estrutura Astro atual, `dist/`, `sitemap.xml`, templates e links internos.

Resultado principal:

- A maioria dos 404 listados parece ser heranca antiga do WordPress ou tentativa automatizada de acessar arquivos WordPress.
- Nao foram encontrados links internos ativos no `dist/` para `/wp-content/*`, `/wp-content/uploads/*`, `/wp-*.php`, `/feed/`, `/comments/feed/`, `/recursos/` ou `/trabalho-e-renda-nos-eua`.
- `/blog/` e `/sobre/` possuem equivalentes claros no Astro: `/blog.html` e `/sobre.html`.
- `/trabalho-e-renda-nos-eua` possui equivalente editorial claro: `/categorias/trabalho-renda.html`.
- `/articles/SLUG-DO-ARTIGO.html` nao existe no build atual, mas o placeholder ainda aparecia em `planejamento-seo/template-artigo-html.html`; o template foi ajustado para nao conter mais uma URL real de placeholder.

Observacao importante: GitHub Pages estatico nao oferece redirects 301 por rota dentro do Astro sem uma camada externa, como Cloudflare, Netlify, servidor proprio ou regras no provedor. Para reduzir 404 no GitHub Pages, a correcao segura implementada foi criar paginas estaticas de redirecionamento com `meta refresh`, `window.location.replace()` e canonical apontando para o destino correto. Para transferencia SEO ideal, recomenda-se configurar 301 reais em uma camada de CDN quando disponivel.

## Classificacao das URLs

| URL ou padrao | Classificacao | Equivalente atual | Acao recomendada |
| --- | --- | --- | --- |
| `/wp-content/*` | URL antiga/probe WordPress | Nenhum equivalente unico | Ignorar. Nao criar redirect wildcard. |
| `/wp-content/uploads/*` | URL antiga de midia WordPress | Depende do arquivo exato | Ignorar por padrao. Criar redirect apenas se houver filename especifico com imagem equivalente atual. |
| `/wp-*.php` | Probe WordPress/admin/login | Nenhum equivalente editorial | Ignorar. Nao redirecionar para Home. |
| `/comments/feed/` | Feed antigo de comentarios WordPress | Nenhum equivalente atual | Ignorar. Nao ha comentarios/feed no Astro. |
| `/feed/` | RSS/feed antigo | Nenhum feed atual confirmado | Ignorar por enquanto. Se o blog criar RSS no futuro, pode mapear para `/feed.xml`. |
| `/blog/` | URL antiga com equivalente claro | `/blog.html` | Criar redirecionamento seguro para `/blog.html`. |
| `/sobre/` | URL antiga com equivalente claro | `/sobre.html` | Criar redirecionamento seguro para `/sobre.html`. |
| `/recursos/` | Possivel pagina antiga de recursos | Incerto: talvez `/comece-aqui.html` ou checklist | Nao redirecionar sem confirmar a pagina antiga. Risco de mapeamento amplo demais. |
| `/trabalho-e-renda-nos-eua` | URL antiga/categoria antiga com equivalente claro | `/categorias/trabalho-renda.html` | Criar redirecionamento seguro para `/categorias/trabalho-renda.html`. |
| `/articles/SLUG-DO-ARTIGO.html` | Placeholder de template | Nenhum artigo real | Nao redirecionar. Corrigir template para evitar vazamento futuro. |

## URLs que podem ser ignoradas

- `/wp-content/*`
- `/wp-content/uploads/*`, salvo filenames especificos de imagens importantes.
- `/wp-*.php`
- `/comments/feed/`
- `/feed/`, enquanto nao existir RSS atual.
- `/recursos/`, ate existir confirmacao da pagina antiga.
- `/articles/SLUG-DO-ARTIGO.html`

Essas URLs nao devem receber redirects genericos para a Home, porque isso pode gerar soft 404, confundir o Google e desperdiçar sinais internos.

## URLs com equivalente atual no Astro

| URL antiga | URL atual |
| --- | --- |
| `/blog/` | `/blog.html` |
| `/sobre/` | `/sobre.html` |
| `/trabalho-e-renda-nos-eua` | `/categorias/trabalho-renda.html` |

## URLs que deveriam receber 301 real na camada de hospedagem/CDN

Se houver Cloudflare ou outra camada capaz de aplicar 301, usar regras exatas:

```text
/blog/ -> https://familiausa1.com/blog.html
/sobre/ -> https://familiausa1.com/sobre.html
/trabalho-e-renda-nos-eua -> https://familiausa1.com/categorias/trabalho-renda.html
/trabalho-e-renda-nos-eua/ -> https://familiausa1.com/categorias/trabalho-renda.html
```

Nao criar regras como `/wp-content/* -> /` ou `/* -> /blog.html`.

## URLs que ainda aparecem em links internos, sitemap ou templates

### Build Astro (`dist/`) antes da correcao

Na auditoria inicial, antes de criar os fallbacks estaticos, nao foram encontradas ocorrencias em `dist/` para:

- `/blog/`
- `/sobre/`
- `/recursos/`
- `/feed/`
- `/comments/feed/`
- `trabalho-e-renda-nos-eua`
- `SLUG-DO-ARTIGO`
- `wp-content`
- `wp-`

Depois da correcao, as unicas ocorrencias esperadas desses caminhos sao os proprios fallbacks estaticos criados em `public/` e copiados para `dist/`:

- `dist/blog/index.html`
- `dist/sobre/index.html`
- `dist/trabalho-e-renda-nos-eua/index.html`
- `dist/trabalho-e-renda-nos-eua.html`

### Sitemap

O sitemap gerado inclui:

- `https://familiausa1.com/blog.html`
- `https://familiausa1.com/sobre.html`
- `https://familiausa1.com/categorias/trabalho-renda.html`

Nao inclui:

- `/blog/`
- `/sobre/`
- `/recursos/`
- `/feed/`
- `/comments/feed/`
- `/trabalho-e-renda-nos-eua`
- `/articles/SLUG-DO-ARTIGO.html`
- WordPress paths.

### Templates

O placeholder `/articles/SLUG-DO-ARTIGO.html` aparecia em:

- `planejamento-seo/template-artigo-html.html`

Acao aplicada:

- Substituido por `CANONICAL_URL_DO_ARTIGO`, evitando que um slug ficticio pareca uma URL real se o template for copiado ou rastreado em algum contexto futuro.

## Alteracoes implementadas nesta branch

Foram criadas paginas estaticas de redirecionamento seguro em `public/` para equivalentes claros. Elas nao entram no sitemap e nao alteram as rotas oficiais `.html` geradas pelo Astro:

- `/blog/` aponta para `/blog.html`.
- `/sobre/` aponta para `/sobre.html`.
- `/trabalho-e-renda-nos-eua/` aponta para `/categorias/trabalho-renda.html`.
- `/trabalho-e-renda-nos-eua.html` tambem aponta para `/categorias/trabalho-renda.html`, como fallback para ambientes que resolvam a URL antiga sem barra para arquivo `.html`.

Arquivos criados:

- `public/blog/index.html`
- `public/sobre/index.html`
- `public/trabalho-e-renda-nos-eua/index.html`
- `public/trabalho-e-renda-nos-eua.html`

Arquivo ajustado:

- `planejamento-seo/template-artigo-html.html`

## Proximos passos recomendados

1. Monitorar o relatorio de 404 no Search Console por 2 a 4 semanas apos deploy.
2. Se aparecerem filenames especificos de `/wp-content/uploads/`, mapear somente os que tiverem imagem equivalente clara em `assets/images/`.
3. Se o site usar Cloudflare no futuro, criar redirects 301 reais para as tres URLs claras listadas acima.
4. Se houver demanda por RSS, criar `/feed.xml` e depois redirecionar `/feed/` para esse endpoint.
5. Nao redirecionar probes WordPress para Home.

## Conclusao

Ha beneficio real em tratar apenas os equivalentes claros. A solucao proposta reduz 404 de navegacao antiga sem criar redirecionamentos amplos, preserva o padrao `.html` do Astro e evita que placeholders tecnicos voltem a aparecer como URLs rastreaveis.
