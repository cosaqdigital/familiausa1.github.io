# AdSense Sprint 2 - triagem URL por URL

Data da triagem: 2026-09-17

Objetivo: reduzir sinais de conteudo de baixo valor, sobreposicao e ruido editorial sem apagar trafego organico util nem quebrar URLs.

## Regra desta sprint

Esta etapa e diagnostica. Nenhuma URL sera removida, redirecionada ou marcada como `noindex` antes de uma decisao explicita.

A ausencia de uma URL no arquivo `docs/editorial/SEARCH_CONSOLE_TRACKING.md` nao significa zero trafego. O arquivo esta atualizado ate 2026-08-27 e registra apenas paginas para as quais dados foram fornecidos/documentados. Antes de qualquer acao destrutiva, conferir dados atuais da URL no Google Search Console quando disponiveis.

## Evidencias usadas

- relatorio legado: 151 artigos processados; 50 abaixo de 900 palavras; 62 com possivel risco de migracao;
- auditoria SEO antiga ja identificava sobreposicao em trabalho, morar nos EUA e custo de vida;
- conteudo atual dos artigos no repositorio;
- `CLUSTER_MAP.md` para riscos de sobreposicao e orfandade;
- `SEARCH_CONSOLE_TRACKING.md` para proteger paginas com desempenho documentado;
- mudancas da Sprint 1, que removeram do render os blocos SEO genericos e corrigiram erros recorrentes.

## Grupo A - consolidacao forte, mas executar somente apos conferir GSC atual

### 1. Morar nos EUA em 2026

**Manter como principal:**
`/articles/vale-a-pena-morar-nos-eua-em-2026-a-verdade-sem-filtro.html`

**Candidato a consolidar/redirecionar:**
`/articles/vale-a-pena-morar-nos-eua-2026.html`

Motivo:
- as duas URLs respondem praticamente a mesma pergunta;
- a auditoria SEO de maio ja marcou o par como sobreposicao;
- a versao Markdown principal foi reescrita em 2026-09-04, tem 14 min de leitura e aborda status, renda, cidade, filhos, saude, transporte, rede de apoio e cenarios;
- o artigo legado tinha cerca de 815 palavras na extracao antiga e atacava a mesma intencao.

Acao recomendada se a URL legada nao tiver sinal organico relevante proprio:
- incorporar qualquer trecho exclusivo util na pagina principal;
- redirecionar a URL curta para a pagina principal;
- atualizar links internos para apontarem apenas para a pagina principal.

Risco: **alto de canibalizacao**.

### 2. Custo de vida nacional

**Manter como pilar nacional:**
`/articles/custo-de-vida-nos-eua-2026-atualizado.html`

**Manter como regional:**
`/articles/custo-de-vida-na-florida-2026-quanto-sobra.html`

**Candidato a consolidar/redirecionar:**
`/articles/quanto-custa-viver-nos-eua.html`

Motivo:
- a auditoria SEO ja definiu `custo-de-vida-nos-eua-2026-atualizado` como pilar nacional;
- Florida possui intencao regional propria;
- `quanto-custa-viver-nos-eua` tem intencao nacional muito proxima do pilar e tinha cerca de 881 palavras no relatorio legado.

Acao recomendada se nao houver sinal organico proprio relevante:
- fundir informacao exclusiva no pilar;
- redirecionar a URL antiga para o pilar nacional.

Risco: **alto de canibalizacao nacional**.

### 3. Primeiros passos de quem chega

**Candidato principal:**
`/articles/primeiros-30-dias-nos-eua.html`

**Candidato a consolidar:**
`/articles/primeiros-passos-para-quem-chega-nos-eua.html`

Motivo:
- ambos atacam a mesma fase da jornada do imigrante recem-chegado;
- `primeiros-30-dias-nos-eua` tem estrutura cronologica clara por semanas e checklist;
- os dois tinham aproximadamente 871 palavras na extracao antiga;
- a duplicacao de intencao reduz a necessidade de duas paginas genericas.

Acao recomendada:
- manter a pagina de 30 dias como guia cronologico;
- incorporar nela pontos exclusivos do artigo de primeiros passos;
- redirecionar a segunda URL se o GSC nao justificar mante-la separada.

Risco: **alto de sobreposicao de intencao**.

### 4. Habitos/costumes do Brasil que causam problema nos EUA

**Candidatos:**
- `/articles/5-habitos-comuns-no-brasil-problemas-eua.html`
- `/articles/coisas-comuns-no-brasil-que-dao-problema-nos-eua.html`

Motivo:
- titulos e promessa editorial sao quase equivalentes;
- o `CLUSTER_MAP.md` marca ambas as paginas como risco de sobreposicao;
- uma das paginas inclusive referencia a outra dentro do mesmo tema.

Acao recomendada:
- escolher a pagina com melhor cobertura/metricas como principal;
- transformar o conteudo em um unico guia mais forte de adaptacao cultural e riscos legais/cotidianos;
- redirecionar a URL secundaria.

Risco: **alto de canibalizacao**.

## Grupo B - manter duas URLs, mas diferenciar de verdade

### 5. Trabalho nos EUA para brasileiros

URLs:
- `/articles/trabalho-nos-eua-para-brasileiros-2026.html`
- `/articles/como-conseguir-trabalho-nos-eua-sendo-brasileiro-guia-2026.html`

Diagnostico:
- a auditoria antiga marcou sobreposicao;
- os corpos ainda repetem temas como construcao, cleaning, delivery, restaurantes, ingles e indicacao;
- a camada atual ja mudou a apresentacao de `trabalho-nos-eua-para-brasileiros-2026` para uma visao de mercado, mas o corpo ainda se parece com um guia de como conseguir emprego.

Recomendacao:
- **nao redirecionar ainda**;
- transformar `trabalho-nos-eua-para-brasileiros-2026` em pilar de mercado: setores, autorizacao, empregado x autonomo, salario, direitos basicos, riscos e evolucao profissional;
- deixar `como-conseguir-trabalho...` focado exclusivamente em busca de vaga: curriculo, networking, plataformas, mensagem inicial, entrevista, ingles funcional e primeiros contatos.

Risco atual: **medio/alto**, mas ha duas intencoes editoriais defensaveis.

## Grupo C - paginas muito curtas que precisam de decisao editorial

### 6. Pedido de green card dentro ou fora dos EUA

URL:
`/articles/pedido-green-card-dentro-ou-fora-dos-eua-riscos.html`

Sinal:
- apenas **499 palavras** no relatorio legado.

Recomendacao:
- nao manter como pagina superficial;
- ou reescrever como comparacao robusta entre adjustment of status e processamento consular, ou consolidar com o guia dedicado que ja cobre esse contraste;
- verificar primeiro possivel sobreposicao com `adjustment-of-status-ou-processo-consular-green-card-2026`.

Risco: **alto de conteudo fino + possivel duplicacao**.

### 7. Atualizacoes USCIS 2026 / green card

URL:
`/articles/uscis-2026-atualizacoes-green-card-brasileiros.html`

Sinal:
- apenas **257 palavras** no relatorio legado, o menor artigo identificado na extracao;
- tema e altamente sensivel a atualizacao.

Recomendacao:
- prioridade alta para revisar;
- se a noticia nao tiver valor permanente ou trafego, retirar do indice/consolidar em guia atualizado;
- se houver demanda organica, reescrever com fontes oficiais e escopo claro.

Risco: **muito alto de conteudo fino e desatualizacao**.

### 8. Portugal endurece cidadania / comparacao com EUA

URL:
`/articles/portugal-endurece-cidadania-comparacao-eua-brasileiros.html`

Sinal:
- cerca de **660 palavras** no relatorio legado;
- tema foge do nucleo principal do FamiliaUSA1, que e vida e imigracao nos Estados Unidos.

Recomendacao:
- conferir GSC;
- se nao houver tracao, forte candidato a `noindex`/arquivo editorial, em vez de investir tempo para amplia-lo;
- manter indexado somente se houver uma razao clara de busca e conexao util com o publico do site.

Risco: **medio/alto por baixa aderencia topical**.

## Grupo D - noticias temporais de saude/cruzeiro

### 9. OMS monitora casos em navio

URL:
`/articles/oms-monitora-casos-em-navio.html`

Diagnostico:
- e uma `NewsArticle` publicada em 2026-05-07 sobre um evento especifico do MV Hondius;
- o texto se ancora em numeros e situacao daquela data;
- tinha cerca de 862 palavras na extracao antiga.

### 10. Novo virus em cruzeiros

URL:
`/articles/novo-virus-em-cruzeiros-o-que-e-verdade.html`

Diagnostico:
- conteudo temporal ligado ao mesmo cluster de alerta sanitario;
- cerca de 828 palavras na extracao antiga.

### 11. Cruzeiro ainda e seguro em 2026

URL:
`/articles/cruzeiro-ainda-e-seguro-em-2026.html`

Diagnostico:
- pode funcionar como pagina evergreen/semi-evergreen se reescrita para explicar como avaliar alertas, saude a bordo, CDC, seguro e cuidados;
- cerca de 877 palavras na extracao antiga.

Recomendacao para o cluster:
- manter apenas **uma pagina forte e atualizavel** sobre seguranca e saude em cruzeiros;
- incorporar contexto util das duas noticias;
- depois de checar GSC, redirecionar ou noindexar as noticias sem demanda propria.

Risco: **alto de envelhecimento do conteudo temporal**.

## Grupo E - noticias politicas/eventos que envelhecem rapido

### 12. Tiros em evento ligado a Trump / White House Correspondents Dinner 2026

URL:
`/articles/tiros-evento-trump-white-house-correspondents-dinner-2026.html`

Diagnostico:
- pagina de evento/noticia especifica;
- o relatorio legado registra cerca de 1.012 palavras, portanto o problema nao e apenas tamanho;
- precisa ser avaliada por utilidade historica e trafego, nao por quantidade de texto.

Recomendacao:
- conferir GSC e backlinks;
- se nao houver demanda persistente, candidato a noindex/arquivo, pois nao fortalece diretamente os clusters principais de vida nos EUA, vistos e imigracao.

### 13. Lula nos EUA / Trump / impactos

URL candidata do cluster de noticias politicas antigas (confirmar slug exato antes de qualquer acao).

Recomendacao:
- nao misturar com o novo cluster eleitoral 2026;
- manter somente se possuir trafego ou valor historico claro;
- caso contrario, noindex/arquivo e preferivel a deixar noticia envelhecida competir com guias atuais.

Observacao: qualquer atualizacao factual politica deve ser pesquisada novamente antes de publicar.

## Grupo F - pagina de Trump e imigracao

### 14. Trump e imigracao EUA / impacto brasileiros 2026

URL:
`/articles/trump-imigracao-eua-impacto-brasileiros-2026.html`

Sinal:
- cerca de **509 palavras** na extracao antiga;
- tema permanece conectado ao nucleo de imigracao, mas e altamente temporal;
- hoje existe um cluster eleitoral novo e artigos migratorios mais robustos.

Recomendacao:
- **nao noindexar automaticamente**;
- revisar com fontes atuais antes de manter como guia;
- diferenciar de `eleicoes-eua-2026-podem-mudar-imigracao-brasileiros`: um deve tratar de medidas/acoes documentadas da administracao; o outro explica mecanismos eleitorais e Congresso.

Risco: **alto de desatualizacao, mas relevancia topical alta**.

## Paginas protegidas nesta sprint

Nao alterar por motivo de AdSense as paginas atualmente documentadas em acompanhamento de Search Console, incluindo:

- `iphone-dos-eua-ou-do-brasil-diferencas`;
- `cidades-da-florida-com-mais-brasileiros-2026`;
- `iphone-nos-eua-vale-a-pena-2026`;
- `pode-trazer-iphone-dos-eua-para-o-brasil`;
- `iphone-comprado-nos-eua-funciona-no-brasil`;
- `morar-em-boston-2026` e demais paginas explicitamente em observacao no tracking.

## Ordem recomendada para Sprint 2B

1. Conferir GSC atual das URLs do Grupo A.
2. Se nao houver sinais relevantes proprios, consolidar os quatro pares fortes um por vez.
3. Diferenciar o par de trabalho sem trocar URLs.
4. Resolver os dois artigos muito curtos de green card/USCIS.
5. Consolidar o cluster de saude em cruzeiros em uma pagina evergreen.
6. Revisar paginas temporais/politicas individualmente antes de noindex.
7. Rodar nova auditoria de qualidade e so depois decidir a data de nova revisao do AdSense.

## Criterio de seguranca antes de redirect/noindex

Antes de qualquer acao em uma URL:

- verificar cliques e impressoes recentes no GSC quando disponiveis;
- verificar se recebe links internos importantes;
- preservar conteudo unico no destino;
- evitar redirecionar assuntos diferentes apenas para diminuir quantidade de paginas;
- atualizar sitemap e links internos apos a decisao;
- nao usar `noindex` como substituto de uma consolidacao quando existe uma pagina destino equivalente e melhor.
