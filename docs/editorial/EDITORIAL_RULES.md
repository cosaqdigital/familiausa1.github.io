# Editorial Rules - Familia USA1

Atualizado em: 2026-07-11

Estas regras sao obrigatorias para qualquer trabalho futuro do Codex, editor ou desenvolvedor no portal.

## Antes de criar artigo novo

1. Pesquisar todo o repositorio.
2. Consultar `docs/editorial/CONTENT_INVENTORY.csv`.
3. Consultar `docs/editorial/CONTENT_GAPS.md`.
4. Consultar `docs/editorial/CLUSTER_MAP.md`.
5. Consultar `docs/editorial/PUBLISHING_ROADMAP_90_DAYS.md`.
6. Verificar slug, titulo, intencao e cluster.
7. Verificar canibalizacao.
8. Verificar se o tema deveria ser atualizacao de artigo existente.
9. Definir macrocluster, subcluster, hub e pilar.
10. Nao criar artigo sem hub ou pilar relacionado.
11. Nao publicar artigo orfao.
12. Nao criar conteudo duplicado.

## Antes de atualizar artigo existente

1. Verificar se a pagina esta em observacao no `OPTIMIZATION_HISTORY.md`.
2. Nao alterar pagina em observacao sem erro factual, tecnico ou nova evidencia forte.
3. Preservar URL e canonical.
4. Nao alterar title/meta/H1 sem motivo claro.
5. Registrar toda otimizacao no historico.

## Regras tecnicas

1. Preservar URLs existentes.
2. Nao alterar AdSense sem tarefa especifica.
3. Nao alterar `global.css` parcialmente.
4. Rodar build e validacoes antes de publicar.
5. Atualizar docs editoriais depois de cada lote.
6. Registrar toda publicacao no inventario.
7. Validar sitemap e canonicals.

## Fontes oficiais obrigatorias

- Imigracao, visto, asilo, green card: USCIS, State Department, CBP, ICE, Federal Register ou fonte oficial equivalente.
- Impostos, empresa, banco: IRS, SBA, FinCEN, estado, cidade/condado, banco ou fonte oficial.
- Saude: CDC, HHS, Healthcare.gov, hospitais/sistemas oficiais ou fontes medicas reconhecidas.
- Valores: usar faixas, mes/ano e linguagem de estimativa.

## Linguagem

- Sem promessa de aprovacao migratoria.
- Sem incentivo a trabalho irregular.
- Sem aconselhamento juridico, fiscal, medico ou financeiro individual.
- Sem clickbait em tema sensivel.
- Sem texto generico que poderia estar em qualquer blog.

## Links internos

Cada artigo deve ter, quando fizer sentido:

- 1 link para hub.
- 1 link para pilar.
- 2 links para artigos irmaos.
- 1 link para cluster complementar.

## Checklist de fechamento

- Build passou.
- Validacoes passaram.
- URL preservada.
- Canonical correto.
- BlogPosting/FAQPage quando aplicavel.
- Sitemap atualizado pelo fluxo Astro.
- Inventario e historico atualizados.
