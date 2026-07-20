# Diretrizes editoriais de afiliados

## Objetivo

O sistema de afiliados deve ajudar o leitor a encontrar um produto relevante sem transformar o conteúdo editorial em vitrine. A utilidade da recomendação vem antes da possibilidade de comissão.

O catálogo central está em `src/data/affiliateProducts.ts` e foi derivado da base interna `docs/affiliates/links-afiliados-brasil-e-usa.md`. URLs de afiliado devem ser consumidas pelo ID estável do produto, nunca copiadas para vários artigos.

## Regras obrigatórias

1. Recomendar apenas produtos relevantes para o problema tratado no artigo.
2. Usar de 3 a 5 produtos no máximo por artigo.
3. Exibir o disclosure antes do primeiro link de afiliado.
4. Diferenciar claramente Amazon EUA e Amazon Brasil.
5. Nunca informar preço fixo sem consulta atualizada.
6. Não inventar experiência pessoal, teste ou uso do produto.
7. Não afirmar que versões diferentes são idênticas.
8. Não usar urgência falsa, escassez artificial ou promessa de economia garantida.
9. Revisar links, produto, modelo e mercado periodicamente.
10. Desativar produtos no catálogo sem apagar o histórico editorial.
11. Não usar imagens da Amazon sem autorização adequada.
12. Não inserir links de afiliado em conteúdos sem relevância comercial.

## Padrão técnico

- Use `AffiliateDisclosure` antes do primeiro card ou link comercial.
- Use `AffiliateProductCard` com `productId`; não escreva a URL diretamente na página.
- Use `AffiliateMarketComparison` somente quando a comparação entre mercados ajudar a decisão.
- Todos os links devem abrir em nova aba e usar `rel="sponsored nofollow noopener"`.
- Cards não exibem preço, avaliação, estoque ou contagem regressiva.
- Produtos sem imagem usam o placeholder editorial do componente; não faça hotlink de imagem da Amazon.
- Um ID ausente não pode derrubar o build. O componente deixa de renderizar e registra aviso em desenvolvimento.

## Integração piloto e limitação atual

Os artigos novos usam Markdown padrão (`.md`), não MDX. Esse formato não executa componentes Astro importados no corpo do artigo. Por segurança, a Fase 1 não altera o renderizador nem injeta HTML comercial manual no artigo `iphone-dos-eua-ou-do-brasil-diferencas.md`.

A fixture `src/components/affiliate/__fixtures__/AffiliateComponentsPreview.astro` demonstra o piloto com:

- `usb-c-charger-kit-us`;
- `power-bank-15000mah-us`;
- `dexnor-iphone-case-us`.

A integração editorial no artigo deve acontecer em uma fase posterior, após escolher entre MDX ou um campo estruturado de IDs no frontmatter. Até essa decisão, não copie o HTML dos componentes para Markdown.

## Exemplo Astro

```astro
---
import AffiliateDisclosure from "../components/affiliate/AffiliateDisclosure.astro";
import AffiliateProductCard from "../components/affiliate/AffiliateProductCard.astro";
---

<AffiliateDisclosure />
<AffiliateProductCard productId="power-bank-15000mah-us" />
```

## Revisão periódica

Ao revisar um produto, confirme que o link ainda corresponde ao nome, modelo e mercado cadastrados. Atualize `lastVerified` quando houver verificação humana. Se houver dúvida, marque `active: false`; não substitua silenciosamente o destino por outro produto.
