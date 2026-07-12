# Sistema Editorial - Familia USA1

Este diretorio e a fonte oficial de organizacao editorial do portal.

## Arquivos

- `EDITORIAL_MASTER_PLAN.md`: documento mestre de estrategia.
- `CONTENT_INVENTORY.csv`: inventario completo de artigos, hubs, pilares e paginas.
- `CONTENT_GAPS.md`: lacunas priorizadas.
- `CLUSTER_MAP.md`: mapa de clusters e cobertura.
- `PUBLISHING_ROADMAP_90_DAYS.md`: cronograma editorial recomendado.
- `OPTIMIZATION_HISTORY.md`: historico de otimizacoes e publicacoes relevantes.
- `EDITORIAL_RULES.md`: regras obrigatorias para futuras tarefas.
- `SEARCH_CONSOLE_TRACKING.md`: estrutura de acompanhamento de GSC.

## Como regenerar

```bash
node scripts/editorial/generate-editorial-system.mjs
```

## Estado atual

| Metrica | Valor |
| --- | --- |
| Artigos totais | 169 |
| Artigos legados | 151 |
| Artigos Markdown | 18 |
| Paginas de categoria/hub | 20 |
| Paginas principais/institucionais | 12 |
| Total inventariado | 201 |
| Clusters oficiais | 13 |
| Possiveis duplicacoes | 0 |
| Possiveis canibalizacoes | 36 |
| Artigos orfaos por grafo editorial | 23 |
