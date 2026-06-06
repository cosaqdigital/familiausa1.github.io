# Relatorio do lote Astro de 20 artigos legados

Gerado em: `2026-06-06T13:42:24.920Z`
Fonte: `src/data/legacy-extract/legacy-articles.json`
Artigos no lote: **20**

## Resumo

- Arquivos Astro esperados em `dist/articles/*.html`: 20
- FAQPage gerado automaticamente em artigos com FAQ visivel: 20/20
- Links internos preservados no conteudo legado: 336
- Divergencias de title entre legado e dist: 0
- Divergencias de canonical entre legado e dist: 0
- Artigos com riscos vindos da extracao: 2

## Artigos gerados

| # | Slug | Categoria | FAQ visivel | FAQPage no dist | Links internos | Title igual | Canonical igual | Riscos |
| ---: | --- | --- | ---: | --- | ---: | --- | --- | ---: |
| 1 | `custo-de-vida-nos-eua-2026-atualizado` | Custo de vida | 5 | sim | 21 | sim | sim | 0 |
| 2 | `morar-legalmente-nos-eua-caminhos-possiveis-2026` | Imigração e legalização | 4 | sim | 15 | sim | sim | 0 |
| 3 | `asilo-nos-estados-unidos-2026` | Imigração e legalização | 5 | sim | 8 | sim | sim | 0 |
| 4 | `morar-em-boston-2026` | Massachusetts | 4 | sim | 17 | sim | sim | 0 |
| 5 | `cidades-da-florida-com-mais-brasileiros-2026` | Guia pilar | 4 | sim | 32 | sim | sim | 1 |
| 6 | `formas-legais-conseguir-green-card-eua-2026` | Imigração e legalização | 4 | sim | 16 | sim | sim | 0 |
| 7 | `guia-completo-visto-americano-2026` | Visto americano | 6 | sim | 19 | sim | sim | 0 |
| 8 | `quanto-custa-morar-em-orlando-2026` | Cidades da Flórida | 4 | sim | 25 | sim | sim | 0 |
| 9 | `trabalhar-sem-autorizacao-nos-eua-riscos-2026` | Trabalho nos EUA | 4 | sim | 17 | sim | sim | 0 |
| 10 | `morar-em-framingham-massachusetts-2026` | Massachusetts | 5 | sim | 17 | sim | sim | 0 |
| 11 | `asilo-nos-eua-nao-e-atalho-migratorio` | Imigração e legalização | 5 | sim | 8 | sim | sim | 0 |
| 12 | `documentos-para-pedir-asilo-nos-eua` | Imigração e legalização | 5 | sim | 8 | sim | sim | 0 |
| 13 | `visto-f1-estudante-americano-como-funciona-2026` | Visto americano | 4 | sim | 16 | sim | sim | 0 |
| 14 | `seguro-saude-nos-eua-como-funciona-2026` | Custo de vida nos EUA | 4 | sim | 15 | sim | sim | 0 |
| 15 | `quanto-custa-ter-carro-nos-eua-2026` | Custo de vida nos EUA | 4 | sim | 15 | sim | sim | 0 |
| 16 | `morar-em-worcester-massachusetts-2026` | Massachusetts | 5 | sim | 18 | sim | sim | 0 |
| 17 | `morar-em-cambridge-massachusetts-2026` | Massachusetts | 4 | sim | 18 | sim | sim | 0 |
| 18 | `morar-em-providence-rhode-island-2026` | Rhode Island | 5 | sim | 17 | sim | sim | 0 |
| 19 | `morar-em-manchester-new-hampshire-2026` | New Hampshire | 5 | sim | 20 | sim | sim | 0 |
| 20 | `florida-vs-massachusetts-imigrantes` | Onde morar nos EUA | 3 | sim | 14 | sim | sim | 1 |

## FAQPage automatico

- `custo-de-vida-nos-eua-2026-atualizado`: 5 perguntas
- `morar-legalmente-nos-eua-caminhos-possiveis-2026`: 4 perguntas
- `asilo-nos-estados-unidos-2026`: 5 perguntas
- `morar-em-boston-2026`: 4 perguntas
- `cidades-da-florida-com-mais-brasileiros-2026`: 4 perguntas
- `formas-legais-conseguir-green-card-eua-2026`: 4 perguntas
- `guia-completo-visto-americano-2026`: 6 perguntas
- `quanto-custa-morar-em-orlando-2026`: 4 perguntas
- `trabalhar-sem-autorizacao-nos-eua-riscos-2026`: 4 perguntas
- `morar-em-framingham-massachusetts-2026`: 5 perguntas
- `asilo-nos-eua-nao-e-atalho-migratorio`: 5 perguntas
- `documentos-para-pedir-asilo-nos-eua`: 5 perguntas
- `visto-f1-estudante-americano-como-funciona-2026`: 4 perguntas
- `seguro-saude-nos-eua-como-funciona-2026`: 4 perguntas
- `quanto-custa-ter-carro-nos-eua-2026`: 4 perguntas
- `morar-em-worcester-massachusetts-2026`: 5 perguntas
- `morar-em-cambridge-massachusetts-2026`: 4 perguntas
- `morar-em-providence-rhode-island-2026`: 5 perguntas
- `morar-em-manchester-new-hampshire-2026`: 5 perguntas
- `florida-vs-massachusetts-imigrantes`: 3 perguntas

## Comparacao de title e canonical

- Todos os titles e canonicals do lote foram preservados no HTML gerado.

## Riscos detectados

- `cidades-da-florida-com-mais-brasileiros-2026`
  - FAQ visivel sem FAQPage; Astro pode gerar FAQPage automaticamente.
- `florida-vs-massachusetts-imigrantes`
  - Conteudo curto para migracao editorial: 839 palavras.

## Recomendacao

O lote de 20 artigos confirma que a estrategia hibrida e viavel: o Astro consegue renderizar conteudo legado extraido, preservar URLs .html, manter canonical/title, centralizar GA, gerar BlogPosting e criar FAQPage automaticamente a partir das FAQs visiveis.
Antes de ampliar para os 151 artigos, a proxima etapa recomendada e executar uma inspecao visual em desktop/mobile de 5 a 8 paginas do lote e ajustar pequenos detalhes de CSS/conteudo legado, se aparecerem. Depois disso, podemos testar um lote maior ou gerar todos os 151 em uma branch ainda sem merge.
