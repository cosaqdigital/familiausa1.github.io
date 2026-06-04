# Relatorio de Auditoria SEO Profissional - Familia USA 1

Data: 2026-05-24

## 1. Resumo executivo

O site Familia USA 1 esta em uma base tecnica solida para rastreamento e indexacao. A auditoria encontrou 110 artigos em `/articles/`, 110 artigos em `assets/data/articles.json`, 110 artigos no `sitemap.xml` e 132 URLs totais no sitemap. Nao foram encontrados links internos quebrados, JSON-LD invalido, artigos fora do sitemap ou divergencia critica entre `/articles/`, `articles.json`, `blog.html` e `sitemap.xml`.

O ponto mais importante: a arquitetura de clusters esta crescendo corretamente, especialmente em visto americano, Orlando/Disney, custo de vida e cidades da Florida. A proxima fase deve priorizar fortalecimento de paginas pilar antigas e diferenciacao editorial de temas proximos para reduzir risco de canibalizacao.

Correcoes tecnicas seguras aplicadas nesta rodada:

- Reconstruido `assets/data/articles.json` para incluir todos os artigos publicados.
- Regenerado `sitemap.xml` com todas as URLs atuais de artigos e categorias.
- Corrigido link interno quebrado identificado na auditoria.
- Ajustado `scripts/build-article-index.ps1` para nao deixar artigos fora do indice quando faltar `datePublished`, usando a data de geracao como fallback.
- Corrigidos erros pontuais de digitacao em titulos, anchors e textos de artigos antigos.

## 2. Status geral do site

- Status tecnico geral: bom.
- Indexacao/rastreamento: bom.
- Estrutura de artigos: boa.
- Interlinkagem: boa, com alguns ajustes estrategicos recomendados.
- Dados estruturados: validos.
- Risco critico atual: nenhum risco critico encontrado.
- Maior oportunidade: reforcar paginas pilar antigas com FAQ, Breadcrumb Schema, CTA e tabelas.

## 3. Inventario de paginas e artigos

- Total de artigos em `/articles/`: 110
- Total de artigos em `assets/data/articles.json`: 110
- Total de artigos listados no sitemap: 110
- Total de URLs no sitemap: 132
- Total de paginas de categorias: 18
- Total de paginas pilar principais auditadas: 5
- Existe `robots.txt`: sim
- Sitemap declarado no robots: sim
- Divergencia entre `/articles/` e `articles.json`: nao
- Divergencia entre `/articles/` e `sitemap.xml`: nao
- Artigos acessiveis pelo `blog.html`: 96/110

## 4. Status do sitemap

- Sitemap existe: sim
- URLs totais: 132
- URLs duplicadas: 0
- Artigos no sitemap: 110
- Artigos ausentes no sitemap: nenhum
- URLs com espacos/acentos problemáticos em slug de artigo: nenhuma

## 5. Status do articles.json

- Arquivo existe: sim
- Artigos cadastrados: 110
- Artigos em `/articles/` ausentes no JSON: nenhum
- Itens no JSON apontando para arquivo inexistente: nenhum

## 6. Status de categorias

- `categorias/adaptacao-cultural.html`: 8 links para artigos; CollectionPage: sim; FAQPage: nao; BreadcrumbList: nao.
- `categorias/banco-credito.html`: 8 links para artigos; CollectionPage: sim; FAQPage: nao; BreadcrumbList: nao.
- `categorias/cidades-da-florida.html`: 40 links para artigos; CollectionPage: sim; FAQPage: sim; BreadcrumbList: sim.
- `categorias/compras-nos-eua.html`: 8 links para artigos; CollectionPage: sim; FAQPage: nao; BreadcrumbList: nao.
- `categorias/custo-de-vida.html`: 38 links para artigos; CollectionPage: sim; FAQPage: nao; BreadcrumbList: nao.
- `categorias/familia-filhos.html`: 4 links para artigos; CollectionPage: sim; FAQPage: nao; BreadcrumbList: nao.
- `categorias/imigracao-e-bancos.html`: 2 links para artigos; CollectionPage: sim; FAQPage: nao; BreadcrumbList: nao.
- `categorias/imigracao-legalizacao.html`: 40 links para artigos; CollectionPage: sim; FAQPage: nao; BreadcrumbList: nao.
- `categorias/moradia-nos-eua.html`: 8 links para artigos; CollectionPage: sim; FAQPage: nao; BreadcrumbList: nao.
- `categorias/noticias-eua.html`: 14 links para artigos; CollectionPage: sim; FAQPage: nao; BreadcrumbList: nao.
- `categorias/orlando-disney.html`: 14 links para artigos; CollectionPage: sim; FAQPage: nao; BreadcrumbList: nao.
- `categorias/orlando-e-viagem.html`: 16 links para artigos; CollectionPage: sim; FAQPage: nao; BreadcrumbList: nao.
- `categorias/planejamento.html`: 8 links para artigos; CollectionPage: sim; FAQPage: nao; BreadcrumbList: nao.
- `categorias/primeiros-passos.html`: 10 links para artigos; CollectionPage: sim; FAQPage: nao; BreadcrumbList: nao.
- `categorias/saude-nos-eua.html`: 6 links para artigos; CollectionPage: sim; FAQPage: nao; BreadcrumbList: nao.
- `categorias/trabalho-renda.html`: 12 links para artigos; CollectionPage: sim; FAQPage: nao; BreadcrumbList: nao.
- `categorias/vida-real-nos-eua.html`: 70 links para artigos; CollectionPage: sim; FAQPage: nao; BreadcrumbList: nao.
- `categorias/visto-americano.html`: 26 links para artigos; CollectionPage: sim; FAQPage: nao; BreadcrumbList: nao.

## 7. Auditoria de SEO on-page

| Arquivo | Title | H1 | Categoria | Palavras | Links internos | Canonical | Meta | BlogPosting | FAQ | FAQPage | Risco SEO | Prioridade |
| --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- | --- |
| articles/10-palavras-ingles-viajar-orlando-2026.html | 10 palavras em inglês para viajar para Orlando em 2026 | 10 palavras em inglês que você precisa saber antes de viajar para Orlando | Orlando e viagem | 1093 | 19 | sim | sim | sim | sim | sim | poucos links recebidos | media |
| articles/5-erros-que-brasileiros-cometem-ao-chegar-nos-eua.html | 5 erros que brasileiros cometem ao chegar nos EUA \| FamiliaUSA1 | 5 erros que brasileiros cometem ao chegar nos EUA | Erros para evitar | 958 | 16 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/5-habitos-comuns-no-brasil-problemas-eua.html | 5 hábitos comuns no Brasil que dão problema nos EUA | 5 hábitos comuns no Brasil que podem trazer problemas graves nos Estados Unidos | Adaptação cultural | 1443 | 21 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/7-erros-trabalho-brasileiros-eua.html | Trabalhar nos EUA: 7 erros para brasileiros | Trabalhar nos EUA sendo brasileiro: 7 erros que podem fazer você perder dinheiro | Trabalho nos EUA | 1283 | 21 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/7-sinais-de-golpe-na-imigracao-dos-eua.html | 7 sinais de golpe na imigração dos EUA \| FamiliaUSA1 | 7 sinais de golpe na imigração dos EUA (e como evitar) | Fraude imigração | 912 | 17 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/a-verdade-sobre-morar-nos-eua.html | A verdade sobre morar nos EUA: custo, rotina e adaptação \| FamiliaUSA1 | A verdade sobre morar nos EUA | Vida real nos EUA | 912 | 16 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/adjustment-of-status-eua-brasileiros-2026.html | O que é adjustment of status nos EUA? Entenda em linguagem simples | O que é adjustment of status nos EUA? Entenda em linguagem simples | Imigração nos EUA | 1140 | 18 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/adjustment-of-status-ou-processo-consular-green-card-2026.html | Green card sem sair dos EUA ou processo consular: qual a diferença? | Green card sem sair dos EUA ou processo consular: qual a diferença? | Imigração nos EUA | 1151 | 18 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/agendamento-visto-americano-2026.html | Agendamento do visto americano em 2026: como marcar e remarcar | Agendamento do visto americano em 2026: como marcar, alterar e escolher o melhor local | Visto americano | 943 | 22 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/aluguel-carro-orlando-2026.html | Aluguel de carro em Orlando em 2026 | Aluguel de carro em Orlando em 2026: vale a pena? Custos, pedágios e cuidados | Orlando e viagem | 962 | 19 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/ano-escolar-nos-eua-guia-pais-brasileiros.html | Ano escolar nos EUA: guia para pais brasileiros | Ano escolar nos EUA: como funciona para filhos de brasileiros | Família e filhos | 923 | 17 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/brasil-x-eua-diferencas-que-pesam-na-rotina.html | Brasil x EUA: diferenças que pesam na rotina \| FamiliaUSA1 | Brasil x EUA: diferenças que pesam na rotina | Vida real nos EUA | 920 | 16 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/brasileiros-comprando-casas-nos-eua-2026.html | Brasileiros estão comprando casas nos EUA em 2026? | Brasileiros estão comprando casas nos EUA? O que está por trás desse movimento | Morar nos EUA | 1318 | 18 | sim | sim | sim | sim | sim | poucos links recebidos | media |
| articles/coisas-comuns-no-brasil-que-dao-problema-nos-eua.html | Coisas comuns no Brasil que dão problema nos EUA | Coisas comuns no Brasil que dão problema nos EUA | Adaptação cultural | 1613 | 20 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/como-abrir-conta-em-banco-nos-eua.html | Como abrir conta em banco nos EUA sendo brasileiro | Como abrir conta em banco nos EUA sendo brasileiro | Banco nos EUA | 1065 | 18 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/como-alugar-casa-nos-eua-sendo-brasileiro-sem-historico-de-credito.html | Como alugar casa nos EUA sendo brasileiro em 2026 \| FamiliaUSA1 | Como alugar casa nos EUA sendo brasileiro (sem histórico de crédito) | Moradia nos EUA | 967 | 16 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/como-conseguir-trabalho-nos-eua-sendo-brasileiro-guia-2026.html | Como conseguir trabalho nos EUA sendo brasileiro em 2026 \| FamiliaUSA1 | Como conseguir trabalho nos EUA sendo brasileiro (Guia 2026) | Trabalho nos EUA | 991 | 16 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/como-e-trabalhar-nos-eua-rotina-salario-diferencas-2026.html | Como é trabalhar nos EUA em 2026: rotina, salário e diferenças | Como é trabalhar nos EUA em 2026: rotina, salário e diferenças com o Brasil | Trabalho nos EUA | 1294 | 19 | sim | sim | sim | sim | sim | poucos links recebidos | media |
| articles/como-economizar-em-orlando-sem-passar-vontade-2026.html | Como economizar em Orlando sem passar vontade em 2026 | Como economizar em Orlando sem passar vontade em 2026 | Vida nos EUA | 223 | 2 | sim | sim | nao | nao | nao | sem BlogPosting; poucos links internos; poucos links recebidos; conteudo curto; sem posts relacionados | alta |
| articles/como-escolher-uma-cidade-para-morar-nos-eua.html | Como escolher uma cidade para morar nos EUA \| FamiliaUSA1 | Como escolher uma cidade para morar nos EUA | Planejamento | 942 | 16 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/como-funciona-o-credito-nos-eua.html | Como funciona o crédito nos EUA para brasileiros | Como funciona o crédito nos EUA para brasileiros | Crédito nos EUA | 980 | 19 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/como-matricular-filho-na-escola-nos-eua.html | Como matricular filho na escola nos EUA | Como matricular filho na escola nos EUA: guia para brasileiros | Família e filhos | 1072 | 17 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/como-preencher-ds-160-passo-a-passo-2026.html | Como preencher o DS-160 passo a passo em 2026 | Como preencher o DS-160 passo a passo em 2026 sem errar | Visto americano | 1358 | 22 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/como-renovar-visto-americano-2026.html | Como renovar o visto americano em 2026 | Como renovar o visto americano em 2026: passo a passo, documentos e quem pode fazer sem entrevista | Visto americano | 940 | 21 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/como-saber-se-um-advogado-de-imigracao-e-confiavel-nos-eua.html | Advogado de imigração confiável nos EUA | Como saber se um advogado de imigração é confiável nos EUA | Advogado imigração | 915 | 17 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/como-tirar-carteira-de-motorista-nos-eua-passo-a-passo.html | Como tirar carteira de motorista nos EUA em 2026 \| FamiliaUSA1 | Como tirar carteira de motorista nos EUA (passo a passo) | Documentos nos EUA | 949 | 16 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/cruzeiro-ainda-e-seguro-em-2026.html | Cruzeiro ainda é seguro em 2026? | Cruzeiro ainda é seguro em 2026? | Viagem e saúde | 966 | 16 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/custo-de-vida-na-florida-2026-quanto-sobra.html | Custo de vida na Flórida 2026: quanto sobra? | Custo de vida na Flórida em 2026: quanto realmente sobra no final do mês? | Custo de vida | 1447 | 17 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/custo-de-vida-nos-eua-2026-atualizado.html | Custo de vida nos EUA 2026: guia atualizado | Custo de vida nos EUA 2026: guia atualizado | Custo de vida | 922 | 18 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/disney-orlando-2026-guia-brasileiros.html | Disney Orlando 2026: guia para brasileiros de primeira viagem | Disney Orlando 2026: guia para brasileiros que vão pela primeira vez | Orlando e Disney | 982 | 20 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/documentos-entrevista-visto-americano-2026.html | Documentos para entrevista do visto americano em 2026 | Documentos para entrevista do visto americano em 2026: checklist para brasileiros | Visto americano | 1193 | 23 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/documentos-para-imigrar-para-os-eua.html | Documentos para imigrar para os EUA: checklist 2026 | Documentos para imigrar para os EUA: checklist completo 2026 | Imigração para brasileiros | 1480 | 19 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/e-facil-se-legalizar-nos-eua.html | É fácil se legalizar nos EUA? Entenda em 2026 | É fácil se legalizar nos Estados Unidos? Entenda a realidade em 2026 | Imigração e legalização | 1334 | 19 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/e-perigoso-morar-nos-eua.html | É perigoso morar nos EUA? Veja a realidade | É perigoso morar nos EUA? Veja a realidade | Segurança nos EUA | 976 | 18 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/emergencia-medica-nos-eua-er-urgent-care.html | Emergência médica nos EUA: ER e urgent care | Emergência médica nos EUA: quando ir ao ER, urgent care e como evitar sustos | Saúde nos EUA | 963 | 18 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/emigrar-para-os-eua-em-2026.html | 10 Coisas Antes de Emigrar Para os EUA em 2026 \| FamiliaUSA1 | 10 Coisas Que Você Precisa Saber Antes de Emigrar Para os EUA em 2026 | Imigração consciente | 1115 | 18 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/entrevista-visto-americano-perguntas-erros-comuns-2026.html | Entrevista do visto americano: perguntas e erros comuns | Entrevista do visto americano: perguntas comuns e erros que brasileiros devem evitar | Visto americano | 1355 | 24 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/erros-financeiros-culturais-imigrantes-eua.html | Maiores erros financeiros e culturais de imigrantes | Os maiores erros financeiros e culturais de imigrantes nos EUA | Planejamento financeiro | 1513 | 21 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/filas-disney-orlando-2026-familias-brasileiras.html | Filas da Disney Orlando em 2026: estão piores? | Filas da Disney Orlando em 2026: estão piores? | Orlando e Disney | 1481 | 17 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/florida-vs-massachusetts-imigrantes.html | Flórida x Massachusetts: melhor para imigrante? | Flórida x Massachusetts: qual o melhor estado para imigrante? | Onde morar nos EUA | 920 | 15 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/formas-legais-conseguir-green-card-eua-2026.html | Green Card: formas legais de conseguir morar nos EUA | Green Card: formas legais de conseguir morar nos EUA | Imigração e legalização | 1549 | 21 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/fraude-migratoria-eua-brasileiros-presos-florida.html | Fraude migratória nos EUA na Flórida \| FamiliaUSA1 | Fraude migratória nos EUA na Flórida: brasileiros presos após esquema com work permit e asilo | Fraude migratória EUA | 1165 | 18 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/green-card-nova-regra-uscis-brasileiros-sair-dos-eua-2026.html | Green card nos EUA: nova regra do USCIS pode obrigar brasileiros a sair? | Green card nos EUA: nova regra do USCIS pode obrigar brasileiros a sair do país? | Imigração nos EUA | 1453 | 22 | sim | sim | sim | sim | sim | title longo | media |
| articles/guia-completo-disney-orlando-2026-brasileiros.html | Guia completo da Disney Orlando 2026 para brasileiros | Guia completo da Disney Orlando 2026 para brasileiros | Orlando e Disney | 1449 | 18 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/guia-completo-orlando-2026-brasileiros.html | Guia completo de Orlando em 2026 para brasileiros | Guia completo de Orlando em 2026 para brasileiros: viagem, parques, compras e custos | Orlando e Disney | 981 | 20 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/guia-completo-visto-americano-2026.html | Guia completo do visto americano em 2026 | Guia completo do visto americano em 2026: tudo que brasileiros precisam saber | Visto americano | 1594 | 24 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/imigrar-para-os-eua-depois-dos-50-anos.html | Imigrar para os EUA depois dos 50 anos vale a pena? | Imigrar para os EUA depois dos 50 anos vale a pena? | Vida real nos EUA | 1456 | 21 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/iphone-nos-eua-vale-a-pena-2026.html | iPhone nos EUA ainda vale a pena em 2026? | iPhone nos EUA ainda vale a pena para brasileiros em 2026? | Compras nos EUA | 1389 | 20 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/itin-ssn-conta-bancaria-nos-eua.html | ITIN, SSN e conta bancária nos EUA | ITIN, SSN e conta bancária nos EUA: o que brasileiros precisam saber | Banco e crédito | 903 | 18 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/legalizar-pela-fronteira-eua.html | É possível se legalizar entrando pela fronteira? | É possível se legalizar entrando pela fronteira dos EUA? | Imigração e fronteira | 990 | 16 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/leis-estranhas-dos-estados-unidos-brasileiros-2026.html | Leis estranhas dos Estados Unidos que brasileiros precisam conhecer | Leis estranhas dos Estados Unidos que brasileiros precisam conhecer | Choque cultural | 1747 | 20 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/lula-nos-eua-trump-impactos-brasileiros-2026.html | Lula nos EUA: o que a reunião com Trump pode mudar | Lula nos EUA: o que a reunião com Trump pode mudar para brasileiros | Relação Brasil-EUA | 1199 | 18 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/maior-dificuldade-imigrante-eua.html | Maior Dificuldade do Imigrante nos EUA \| Moradia e Realidade | A Maior Dificuldade do Imigrante nos EUA em 2026 (E Quase Ninguém Fala Disso) | Vida real nos EUA | 1021 | 18 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/melhores-outlets-orlando-2026.html | Melhores outlets de Orlando em 2026 | Melhores outlets de Orlando em 2026: onde comprar mais barato e o que vale a pena | Orlando e compras | 963 | 20 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/morar-legalmente-nos-eua-caminhos-possiveis-2026.html | Morar legalmente nos EUA: principais caminhos possíveis | Morar legalmente nos EUA: principais caminhos possíveis | Imigração e legalização | 1358 | 24 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/novo-virus-em-cruzeiros-o-que-e-verdade.html | Novo vírus em cruzeiros? O que é verdade | Novo vírus em cruzeiros? O que é verdade | Saúde em viagem | 927 | 16 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/o-que-fazer-se-ficar-doente-em-cruzeiro.html | O que fazer se ficar doente em um cruzeiro | O que fazer se ficar doente em um cruzeiro | Saúde em cruzeiro | 957 | 15 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/o-que-fazer-se-passar-mal-nos-eua-viagem-2026.html | O que fazer se passar mal nos EUA durante uma viagem? | O que fazer se passar mal nos EUA durante uma viagem? | Saúde e viagem | 1482 | 21 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/o-que-mais-sentimos-falta-do-brasil-nos-eua-2026.html | O que mais sentimos falta do Brasil morando nos EUA | O que mais sentimos falta do Brasil morando nos Estados Unidos | Vida real nos EUA | 880 | 16 | sim | sim | sim | sim | sim | poucos links recebidos; conteudo curto | alta |
| articles/o-que-nao-comprar-nos-eua-2026.html | O que não comprar nos EUA em 2026 mesmo parecendo barato | O que não comprar nos EUA em 2026 mesmo parecendo barato | Compras nos EUA | 1436 | 18 | sim | sim | sim | sim | sim | poucos links recebidos | media |
| articles/o-que-pode-mudar-na-imigracao-dos-eua-em-2026.html | Imigração EUA 2026: o que pode mudar? | O que pode mudar na imigra&ccedil;&atilde;o dos EUA em 2026? | Imigra&ccedil;&atilde;o EUA | 1183 | 17 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/o-que-reprova-no-visto-americano.html | O que reprova no visto americano? 12 erros para evitar | O que reprova no visto americano? 12 erros que brasileiros devem evitar | Visto americano | 907 | 21 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/oms-monitora-casos-em-navio.html | OMS monitora casos em navio: entenda o alerta | OMS monitora casos em navio: entenda o alerta | OMS e saúde | 961 | 15 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/orlando-alem-da-disney-lugares-2026.html | Orlando além da Disney: lugares que valem a pena conhecer | Orlando além da Disney: lugares que valem muito a pena conhecer | Orlando e viagem | 1599 | 20 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/por-que-brasileiros-querem-morar-nos-eua-2026.html | Por que tantos brasileiros querem morar nos EUA? | Por que tantos brasileiros querem morar nos EUA? | Vida real nos EUA | 1442 | 23 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/por-que-imigrar-para-os-eua.html | Por que imigrar para os EUA e não outro país? | Por que imigrar para os EUA e não para outro país? | Morar fora | 983 | 17 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/por-que-pessoas-entram-nos-eua-pela-fronteira.html | Por que tantos entram nos EUA pela fronteira? | Por que tantas pessoas entram nos EUA pela fronteira? | Fronteira e imigração | 951 | 16 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/precos-eua-2026-mercado-aluguel-gasolina-contas.html | Preços nos EUA em 2026: mercado, aluguel, gasolina e contas | Preços nos EUA em 2026: mercado, aluguel, gasolina e contas | Custo de vida nos EUA | 1773 | 20 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/primeiros-30-dias-nos-eua.html | Primeiros 30 dias nos EUA: checklist completo | Primeiros 30 dias nos EUA: checklist completo | Primeiros passos | 957 | 20 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/primeiros-passos-para-quem-chega-nos-eua.html | Primeiros passos para quem chega nos EUA \| FamiliaUSA1 | Primeiros passos para quem chega nos EUA | Recém-chegados | 948 | 16 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/quanto-custa-alugar-casa-nos-eua-2026.html | Quanto custa alugar casa nos EUA em 2026? | Quanto custa alugar casa nos EUA em 2026? | Moradia nos EUA | 910 | 20 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/quanto-custa-morar-em-boca-raton-2026.html | Quanto custa morar em Boca Raton em 2026? \| FamiliaUSA1 | Quanto custa morar em Boca Raton em 2026? | Cidades da Florida | 1606 | 27 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/quanto-custa-morar-em-fort-lauderdale-2026.html | Quanto custa morar em Fort Lauderdale em 2026? \| FamiliaUSA1 | Quanto custa morar em Fort Lauderdale em 2026? | Cidades da Florida | 1593 | 27 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/quanto-custa-morar-em-jacksonville-2026.html | Quanto custa morar em Jacksonville em 2026? \| FamiliaUSA1 | Quanto custa morar em Jacksonville em 2026? | Cidades da Florida | 1583 | 27 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/quanto-custa-morar-em-kissimmee-2026.html | Quanto custa morar em Kissimmee em 2026? \| FamiliaUSA1 | Quanto custa morar em Kissimmee em 2026? | Cidades da Florida | 1587 | 27 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/quanto-custa-morar-em-lakeland-2026.html | Quanto custa morar em Lakeland em 2026? \| FamiliaUSA1 | Quanto custa morar em Lakeland em 2026? | Cidades da Florida | 1585 | 27 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/quanto-custa-morar-em-miami-2026.html | Quanto custa morar em Miami em 2026? \| FamiliaUSA1 | Quanto custa morar em Miami em 2026? | Cidades da Florida | 1578 | 27 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/quanto-custa-morar-em-naples-2026.html | Quanto custa morar em Naples em 2026? \| FamiliaUSA1 | Quanto custa morar em Naples em 2026? | Cidades da Florida | 1582 | 27 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/quanto-custa-morar-em-orlando-2026.html | Quanto custa morar em Orlando em 2026? \| FamiliaUSA1 | Quanto custa morar em Orlando em 2026? | Cidades da Florida | 1580 | 27 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/quanto-custa-morar-em-sarasota-2026.html | Quanto custa morar em Sarasota em 2026? \| FamiliaUSA1 | Quanto custa morar em Sarasota em 2026? | Cidades da Florida | 1575 | 27 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/quanto-custa-morar-em-tampa-2026.html | Quanto custa morar em Tampa em 2026? \| FamiliaUSA1 | Quanto custa morar em Tampa em 2026? | Cidades da Florida | 1584 | 27 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/quanto-custa-ter-carro-nos-eua-2026.html | Quanto custa ter carro nos Estados Unidos em 2026? | Quanto custa ter carro nos Estados Unidos em 2026? | Custo de vida nos EUA | 1736 | 20 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/quanto-custa-tirar-visto-americano-2026.html | Quanto custa tirar o visto americano em 2026? | Quanto custa tirar o visto americano em 2026? Taxas, gastos extras e onde fazer no Brasil | Visto americano | 1691 | 25 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/quanto-custa-viajar-orlando-2026.html | Quanto custa viajar para Orlando em 2026? | Quanto custa viajar para Orlando em 2026? Passagem, hotel, parques, carro e alimentação | Orlando e Disney | 984 | 20 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/quanto-custa-viver-nos-eua.html | Quanto custa viver nos EUA em 2026? \| FamiliaUSA1 | Quanto custa viver nos EUA em 2026? | Custo de vida | 959 | 16 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/quanto-dinheiro-levar-para-os-eua-2026-experiencia-real.html | Quanto dinheiro levar para os EUA em 2026? Veja a conta real | Quanto dinheiro levar para os EUA em 2026? A conta real segundo a experiência da Família USA 1 | Planejamento financeiro | 1745 | 22 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/quanto-dinheiro-preciso-para-ir-para-os-eua-2026.html | Quanto dinheiro levar para os EUA em 2026? | Quanto dinheiro preciso para ir para os EUA em 2026? | Planejamento financeiro | 1162 | 19 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/quanto-ganha-um-brasileiro-nos-eua-2026.html | Quanto ganha um brasileiro nos EUA em 2026? | Quanto ganha um brasileiro nos EUA em 2026? | Trabalho e renda | 954 | 20 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/quanto-tempo-demora-visto-americano-2026.html | Quanto tempo demora para tirar o visto americano em 2026? | Quanto tempo demora para tirar o visto americano em 2026? Prazos, filas e como acompanhar | Visto americano | 1428 | 27 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/sair-dos-eua-para-green-card-riscos-2026.html | Sair dos EUA para tentar green card pode ser arriscado? | Sair dos EUA para tentar green card pode ser arriscado? Entenda antes de decidir | Imigração nos EUA | 1142 | 18 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/salario-minimo-nos-eua-quanto-da-para-ganhar-em-2026.html | Salário mínimo nos EUA: quanto dá para ganhar em 2026 \| FamiliaUSA1 | Salário mínimo nos EUA: quanto dá para ganhar em 2026 | Custo de vida | 972 | 16 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/se-legalizar-nos-eua-com-visto-de-turista-2026.html | É possível se legalizar nos EUA com visto de turista? | É possível se legalizar nos EUA com visto de turista? | Imigração e legalização | 1608 | 19 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/seguro-saude-nos-eua-como-funciona-2026.html | Seguro saúde nos EUA: como funciona e quanto custa | Seguro saúde nos EUA: como funciona e por que assusta brasileiros | Custo de vida nos EUA | 1523 | 21 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/seguro-saude-nos-eua-para-brasileiros.html | Seguro saúde nos EUA para brasileiros | Seguro saúde nos EUA para brasileiros: guia completo | Saúde nos EUA | 1074 | 17 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/situacoes-causar-deportacao-problemas-legais-eua.html | Situações que podem causar deportação nos EUA | Situações que podem causar deportação ou problemas legais nos EUA | Imigração e legalização | 1534 | 19 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/solidao-de-morar-nos-eua.html | Solidão de morar nos EUA: realidade dos brasileiros | A solidão de morar nos EUA: o lado que quase ninguém mostra | Vida real nos EUA | 1391 | 21 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/tiros-evento-trump-white-house-correspondents-dinner-2026.html | Tiros em evento com Trump em Washington: o que se sabe \| FamiliaUSA1 | Tiros em evento com Trump: o que aconteceu e o que se sabe até agora | Notícias dos EUA | 1113 | 16 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/trabalhar-sem-autorizacao-nos-eua-riscos-2026.html | Trabalhar sem autorização nos EUA: riscos para brasileiros | Trabalhar sem autorização nos EUA: riscos para brasileiros | Trabalho nos EUA | 1149 | 23 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/trabalho-nos-eua-para-brasileiros-2026.html | Trabalho nos EUA para brasileiros em 2026 | Como conseguir trabalho nos EUA sendo brasileiro em 2026 | Trabalho nos EUA | 994 | 19 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/trump-bancos-imigrantes-conta-eua-2026.html | Trump, bancos e imigrantes nos EUA: ITIN pode ser afetado? | Trump, bancos e imigrantes nos EUA: quem usa ITIN pode ser afetado? | Imigração e bancos | 2000 | 21 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/vale-a-pena-fazer-compras-nos-eua-2026.html | Vale a pena fazer compras nos EUA em 2026? | Vale a pena fazer compras nos EUA em 2026? | Compras nos EUA | 1490 | 21 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/vale-a-pena-morar-em-orlando-ou-tampa-2026.html | Vale a pena morar em Orlando ou Tampa em 2026? | Vale a pena morar em Orlando ou Tampa em 2026? | Vida nos EUA | 186 | 2 | sim | sim | nao | nao | nao | sem BlogPosting; poucos links internos; poucos links recebidos; conteudo curto; sem posts relacionados | alta |
| articles/vale-a-pena-morar-nos-eua-2026.html | Vale a pena morar nos EUA em 2026? | Vale a pena morar nos EUA em 2026? | Vida real nos EUA | 906 | 19 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/vale-a-pena-morar-nos-eua-em-2026-a-verdade-sem-filtro.html | Vale a pena morar nos EUA em 2026? A verdade sem filtro \| FamiliaUSA1 | Vale a pena morar nos EUA em 2026? A verdade sem filtro | Vida real nos EUA | 961 | 16 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/vale-a-pena-pedir-asilo-nos-eua-em-2026.html | Vale a pena pedir asilo nos EUA em 2026? \| FamiliaUSA1 | Vale a pena pedir asilo nos EUA em 2026? A verdade sem filtro | Asilo Estados Unidos | 913 | 17 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/visto-americano-crianca-familia-2026.html | Visto americano para criança em 2026 | Visto americano para criança em 2026: documentos, entrevista e cuidados para famílias | Visto americano | 923 | 23 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/visto-americano-negado-motivos-o-que-fazer-2026.html | Visto americano negado: motivos e o que fazer em 2026 | Visto americano negado: principais motivos e o que fazer depois da negativa | Visto americano | 1512 | 28 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/visto-f1-estudante-americano-como-funciona-2026.html | Visto F1: como funciona o visto de estudante americano | Visto F1: como funciona o visto de estudante americano | Visto americano | 1390 | 22 | sim | sim | sim | sim | sim | baixo | baixa |
| articles/visto-temporario-nos-eua-ainda-posso-tentar-green-card-2026.html | Estou nos EUA com visto temporário: ainda posso tentar green card? | Estou nos EUA com visto temporário: ainda posso tentar green card? | Imigração nos EUA | 1237 | 21 | sim | sim | sim | sim | sim | poucos links recebidos | media |
| articles/walmart-target-orlando-compras-brasileiros.html | Walmart e Target em Orlando: guia de compras | Walmart e Target em Orlando: guia de compras para brasileiros | Orlando e Disney | 925 | 18 | sim | sim | sim | sim | sim | baixo | baixa |

## 8. Auditoria de paginas pilar

- OK - `categorias/custo-de-vida.html` (Custo de vida nos EUA): score 5/8; palavras: 781; problemas: sem FAQPage; sem BreadcrumbList; CTA fraco ou ausente.
- OK - `categorias/imigracao-legalizacao.html` (Imigracao e legalizacao nos EUA): score 5/8; palavras: 856; problemas: sem FAQPage; sem BreadcrumbList; CTA fraco ou ausente.
- OK - `categorias/orlando-e-viagem.html` (Orlando e viagem): score 4/8; palavras: 327; problemas: sem FAQPage; sem BreadcrumbList; CTA fraco ou ausente; pagina fina.
- OK - `categorias/compras-nos-eua.html` (Compras nos EUA): score 4/8; palavras: 199; problemas: sem FAQPage; sem BreadcrumbList; CTA fraco ou ausente; pagina fina.
- OK - `categorias/cidades-da-florida.html` (Cidades da Florida para brasileiros): score 8/8; palavras: 1503; problemas: nenhum relevante.

Paginas pilar fortes:
- Cidades da Florida para brasileiros (`categorias/cidades-da-florida.html`)

Paginas pilar que precisam de reforco:
- Custo de vida nos EUA (`categorias/custo-de-vida.html`): sem FAQPage; sem BreadcrumbList; CTA fraco ou ausente
- Imigracao e legalizacao nos EUA (`categorias/imigracao-legalizacao.html`): sem FAQPage; sem BreadcrumbList; CTA fraco ou ausente
- Orlando e viagem (`categorias/orlando-e-viagem.html`): sem FAQPage; sem BreadcrumbList; CTA fraco ou ausente; pagina fina
- Compras nos EUA (`categorias/compras-nos-eua.html`): sem FAQPage; sem BreadcrumbList; CTA fraco ou ausente; pagina fina

## 9. Auditoria de links internos

- Total de links internos locais analisados: 3083
- Links quebrados encontrados: 0
- Links quebrados: nenhum
- Paginas orfas entre artigos: articles/10-palavras-ingles-viajar-orlando-2026.html, articles/brasileiros-comprando-casas-nos-eua-2026.html, articles/como-e-trabalhar-nos-eua-rotina-salario-diferencas-2026.html, articles/como-economizar-em-orlando-sem-passar-vontade-2026.html, articles/o-que-mais-sentimos-falta-do-brasil-nos-eua-2026.html, articles/o-que-nao-comprar-nos-eua-2026.html, articles/vale-a-pena-morar-em-orlando-ou-tampa-2026.html
- Artigos com menos de 3 links internos de saida: articles/como-economizar-em-orlando-sem-passar-vontade-2026.html, articles/vale-a-pena-morar-em-orlando-ou-tampa-2026.html
- Artigos importantes que devem receber mais links internos: articles/10-palavras-ingles-viajar-orlando-2026.html, articles/brasileiros-comprando-casas-nos-eua-2026.html, articles/como-e-trabalhar-nos-eua-rotina-salario-diferencas-2026.html, articles/como-economizar-em-orlando-sem-passar-vontade-2026.html, articles/o-que-mais-sentimos-falta-do-brasil-nos-eua-2026.html, articles/o-que-nao-comprar-nos-eua-2026.html, articles/vale-a-pena-morar-em-orlando-ou-tampa-2026.html, articles/visto-temporario-nos-eua-ainda-posso-tentar-green-card-2026.html

## 10. Auditoria de schema

- Total de blocos JSON-LD analisados: 293
- JSON-LD invalidos: 0
- Tipos encontrados: WebSite, VideoObject, Blog, CollectionPage, BreadcrumbList, FAQPage, BlogPosting, Article, NewsArticle
- Paginas sem schema importante entre artigos: articles/como-economizar-em-orlando-sem-passar-vontade-2026.html, articles/vale-a-pena-morar-em-orlando-ou-tampa-2026.html
- FAQPage sem FAQ visivel: nenhum caso encontrado
- FAQ visivel sem FAQPage: nenhum caso encontrado

## 11. Riscos de canibalizacao

### Se legalizar nos EUA / morar legalmente

- Principal recomendado: `articles/morar-legalmente-nos-eua-caminhos-possiveis-2026.html`
- Artigos envolvidos: `articles/e-facil-se-legalizar-nos-eua.html`, `articles/formas-legais-conseguir-green-card-eua-2026.html`, `articles/legalizar-pela-fronteira-eua.html`, `articles/se-legalizar-nos-eua-com-visto-de-turista-2026.html`
- Intencao: manter o principal como guia amplo e usar os demais como satelites de perguntas especificas.
- Recomendacao: Manter articles/morar-legalmente-nos-eua-caminhos-possiveis-2026.html como principal e usar os demais como satelites com links contextuais apontando para ele.

### Visto de turista, DS-160 e entrevista

- Principal recomendado: `articles/guia-completo-visto-americano-2026.html`
- Artigos envolvidos: `articles/agendamento-visto-americano-2026.html`, `articles/como-preencher-ds-160-passo-a-passo-2026.html`, `articles/como-renovar-visto-americano-2026.html`, `articles/documentos-entrevista-visto-americano-2026.html`, `articles/entrevista-visto-americano-perguntas-erros-comuns-2026.html`, `articles/guia-completo-visto-americano-2026.html`, `articles/o-que-reprova-no-visto-americano.html`, `articles/quanto-custa-tirar-visto-americano-2026.html`, `articles/quanto-tempo-demora-visto-americano-2026.html`, `articles/visto-americano-crianca-familia-2026.html`, `articles/visto-americano-negado-motivos-o-que-fazer-2026.html`
- Intencao: manter o principal como guia amplo e usar os demais como satelites de perguntas especificas.
- Recomendacao: Manter articles/guia-completo-visto-americano-2026.html como principal e usar os demais como satelites com links contextuais apontando para ele.

### Custo de vida nos EUA

- Principal recomendado: `articles/custo-de-vida-nos-eua-2026-atualizado.html`
- Artigos envolvidos: `articles/custo-de-vida-na-florida-2026-quanto-sobra.html`, `articles/custo-de-vida-nos-eua-2026-atualizado.html`, `articles/precos-eua-2026-mercado-aluguel-gasolina-contas.html`, `articles/quanto-custa-morar-em-boca-raton-2026.html`, `articles/quanto-custa-morar-em-fort-lauderdale-2026.html`, `articles/quanto-custa-morar-em-jacksonville-2026.html`, `articles/quanto-custa-morar-em-kissimmee-2026.html`, `articles/quanto-custa-morar-em-lakeland-2026.html`, `articles/quanto-custa-morar-em-miami-2026.html`, `articles/quanto-custa-morar-em-naples-2026.html`, `articles/quanto-custa-morar-em-orlando-2026.html`, `articles/quanto-custa-morar-em-sarasota-2026.html`, `articles/quanto-custa-morar-em-tampa-2026.html`, `articles/quanto-custa-viver-nos-eua.html`, `articles/quanto-dinheiro-levar-para-os-eua-2026-experiencia-real.html`, `articles/quanto-dinheiro-preciso-para-ir-para-os-eua-2026.html`
- Intencao: manter o principal como guia amplo e usar os demais como satelites de perguntas especificas.
- Recomendacao: Manter articles/custo-de-vida-nos-eua-2026-atualizado.html como principal e usar os demais como satelites com links contextuais apontando para ele.

### Orlando, Disney e viagem

- Principal recomendado: `articles/guia-completo-orlando-2026-brasileiros.html`
- Artigos envolvidos: `articles/10-palavras-ingles-viajar-orlando-2026.html`, `articles/aluguel-carro-orlando-2026.html`, `articles/como-economizar-em-orlando-sem-passar-vontade-2026.html`, `articles/disney-orlando-2026-guia-brasileiros.html`, `articles/filas-disney-orlando-2026-familias-brasileiras.html`, `articles/guia-completo-disney-orlando-2026-brasileiros.html`, `articles/guia-completo-orlando-2026-brasileiros.html`, `articles/melhores-outlets-orlando-2026.html`, `articles/orlando-alem-da-disney-lugares-2026.html`, `articles/quanto-custa-morar-em-orlando-2026.html`, `articles/quanto-custa-viajar-orlando-2026.html`, `articles/vale-a-pena-morar-em-orlando-ou-tampa-2026.html`, `articles/walmart-target-orlando-compras-brasileiros.html`
- Intencao: manter o principal como guia amplo e usar os demais como satelites de perguntas especificas.
- Recomendacao: Manter articles/guia-completo-orlando-2026-brasileiros.html como principal e usar os demais como satelites com links contextuais apontando para ele.

### Cidades da Florida

- Principal recomendado: `categorias/cidades-da-florida.html`
- Artigos envolvidos: `articles/quanto-custa-morar-em-kissimmee-2026.html`, `articles/quanto-custa-morar-em-miami-2026.html`, `articles/quanto-custa-morar-em-orlando-2026.html`, `articles/quanto-custa-morar-em-tampa-2026.html`
- Intencao: manter o principal como guia amplo e usar os demais como satelites de perguntas especificas.
- Recomendacao: Manter categorias/cidades-da-florida.html como principal e usar os demais como satelites com links contextuais apontando para ele.


## 12. Paginas orfas ou fracas

- Paginas orfas: articles/10-palavras-ingles-viajar-orlando-2026.html, articles/brasileiros-comprando-casas-nos-eua-2026.html, articles/como-e-trabalhar-nos-eua-rotina-salario-diferencas-2026.html, articles/como-economizar-em-orlando-sem-passar-vontade-2026.html, articles/o-que-mais-sentimos-falta-do-brasil-nos-eua-2026.html, articles/o-que-nao-comprar-nos-eua-2026.html, articles/vale-a-pena-morar-em-orlando-ou-tampa-2026.html
- Artigos abaixo de 900 palavras: articles/como-economizar-em-orlando-sem-passar-vontade-2026.html (223), articles/o-que-mais-sentimos-falta-do-brasil-nos-eua-2026.html (880), articles/vale-a-pena-morar-em-orlando-ou-tampa-2026.html (186)
- Paginas de categoria fracas: categorias/adaptacao-cultural.html, categorias/banco-credito.html, categorias/compras-nos-eua.html, categorias/custo-de-vida.html, categorias/familia-filhos.html, categorias/imigracao-e-bancos.html, categorias/imigracao-legalizacao.html, categorias/moradia-nos-eua.html, categorias/noticias-eua.html, categorias/orlando-disney.html, categorias/orlando-e-viagem.html, categorias/planejamento.html, categorias/primeiros-passos.html, categorias/saude-nos-eua.html, categorias/trabalho-renda.html, categorias/vida-real-nos-eua.html, categorias/visto-americano.html

## 13. Problemas criticos encontrados

- Nenhum problema critico encontrado.

## 14. Problemas medios encontrados

- Algumas paginas pilar ainda podem receber FAQ/Breadcrumb/CTA e texto de apoio mais forte.
- 8 artigos recebem menos de 2 links internos.

## 15. Problemas leves encontrados

- 1 artigos com title acima de 70 caracteres.
- 17 paginas de categoria sem FAQPage.

## 16. Onde paramos no cronograma editorial

O cronograma de 60 dias existe e cobre clusters de visto, Orlando/Disney, morar nos EUA, compras e noticias. Pela comparacao com artigos publicados, os blocos dos dias 1 a 10 estao majoritariamente cobertos, e tambem ja existem artigos de dias posteriores como entrevista do visto, renovacao, visto F1, trabalho nos EUA, custo de vida e credito americano.

- Dias/itens do cronograma mapeados como concluidos: Dia 1 (guia-completo-visto-americano-2026), Dia 2 (como-preencher-ds-160-passo-a-passo-2026), Dia 3 (quanto-custa-viajar-orlando-2026), Dia 4 (formas-legais-conseguir-green-card-eua-2026), Dia 5 (orlando-alem-da-disney-lugares-2026), Dia 6 (seguro-saude-nos-eua-como-funciona-2026), Dia 7 (vale-a-pena-fazer-compras-nos-eua-2026), Dia 8 (disney-orlando-2026-guia-brasileiros), Dia 9 (melhores-outlets-orlando-2026), Dia 10 (aluguel-carro-orlando-2026), Dia 15 (entrevista-visto-americano-perguntas-erros-comuns-2026), Dia 16 (como-renovar-visto-americano-2026), Dia 17 (visto-f1-estudante-americano-como-funciona-2026), Dia 19 (trabalho-nos-eua-para-brasileiros-2026), Dia 20 (custo-de-vida-nos-eua-2026-atualizado), Dia 21 (como-funciona-o-credito-nos-eua)
- Itens mapeados como pendentes nesta amostra: nenhum dos itens mapeados
- Observacao importante: `articles/se-legalizar-nos-eua-com-visto-de-turista-2026.html` ja existe como conteudo espontaneo e nao deve ser duplicado.

## 17. Proximo bloco recomendado

O proximo bloco recomendado nao deve ser publicar artigos aleatorios. A prioridade deve ser:

1. Fortalecer paginas pilar antigas que ainda nao tem FAQPage/Breadcrumb/CTA no mesmo nivel da pagina `cidades-da-florida.html`.
2. Continuar clusters com alto potencial de busca: Orlando/compras, banco/credito, saude e familia/filhos.
3. Criar comparativos futuros somente quando houver intencao distinta clara, evitando duplicar temas ja publicados.

## 18. Lista de arquivos que precisam de correcao

Arquivos com correcao tecnica critica obrigatoria: nenhum.

Arquivos recomendados para melhoria editorial/SEO:
- `categorias/custo-de-vida.html`: sem FAQPage; sem BreadcrumbList; CTA fraco ou ausente
- `categorias/imigracao-legalizacao.html`: sem FAQPage; sem BreadcrumbList; CTA fraco ou ausente
- `categorias/orlando-e-viagem.html`: sem FAQPage; sem BreadcrumbList; CTA fraco ou ausente; pagina fina
- `categorias/compras-nos-eua.html`: sem FAQPage; sem BreadcrumbList; CTA fraco ou ausente; pagina fina

## 19. Plano de acao em ordem de prioridade

1. Manter sitemap e `articles.json` sincronizados a cada nova publicacao.
2. Melhorar paginas pilar antigas com o mesmo padrao da pagina de cidades: FAQ, Breadcrumb, CTAs, tabela/lista comparativa e texto de apoio.
3. Revisar canibalizacao por cluster e reforcar links dos satelites para seus guias principais.
4. Criar thumbnails especificas para os artigos de cidades e hubs mais importantes.
5. Monitorar Google Search Console: descobertas nao indexadas, paginas rastreadas mas nao indexadas, consultas por cidade, CTR e impressões.
6. Seguir o cronograma editorial, mas pulando temas ja publicados para evitar duplicidade.

## 20. Conclusao profissional

O Familia USA 1 esta no caminho certo. A base tecnica esta indexavel, o sitemap esta consistente, os artigos estao conectados ao JSON e ao blog, os schemas sao validos e os clusters principais ja existem. O trabalho agora deve ser menos quantidade bruta e mais consolidacao: fortalecer paginas pilar, diferenciar intencoes proximas, criar links internos estrategicos para os guias principais e monitorar desempenho no Search Console.
