# Fluxo manual para publicar artigo novo no Astro

Este guia foi criado para publicar artigos novos no FamiliaUSA1 depois da migracao para Astro, sem depender do Codex para cada post.

## Antes de comecar

Nunca edite os 151 artigos legados dentro de `articles/` para criar artigo novo.

Artigos novos devem ser criados em:

```text
src/content/articles/
```

Use o template:

```text
src/content/articles/_template.md
```

Copie o template e renomeie o arquivo.

## 1. Escolha o slug

O slug e o nome da URL.

Exemplo:

```text
quanto-custa-morar-em-atlanta-2026.md
```

A URL final sera:

```text
https://familiausa1.com/articles/quanto-custa-morar-em-atlanta-2026.html
```

Regras:

- usar letras minusculas;
- usar hifen entre palavras;
- nao usar acentos;
- nao usar espacos;
- nao usar underline;
- terminar com `.md`;
- evitar slug parecido com artigo que ja existe.

## 2. Preencha o frontmatter

O frontmatter e o bloco entre `---` no inicio do arquivo.

Campos obrigatorios:

```yaml
draft: false
slug: "quanto-custa-morar-em-atlanta-2026"
title: "Quanto custa morar em Atlanta em 2026? Guia para brasileiros"
h1: "Quanto custa morar em Atlanta em 2026?"
description: "Veja custos de aluguel, mercado, carro, trabalho e vida familiar para brasileiros que pensam em morar em Atlanta em 2026."
category: "Custo de vida"
datePublished: "2026-06-11"
dateModified: "2026-06-11"
readingTime: "12 min de leitura"
image: "https://familiausa1.com/assets/images/familiausa1-share.svg"
excerpt: "Resumo curto para aparecer nos cards do blog."
```

Use `draft: true` enquanto estiver escrevendo. Troque para `draft: false` somente quando estiver pronto para publicar.

## 3. Escolha uma categoria valida

Use uma categoria que ja exista no site.

Exemplos:

- `Imigracao e legalizacao`
- `Visto americano`
- `Asilo nos EUA`
- `Custo de vida`
- `Cidades da Florida`
- `Cidades do Norte e Massachusetts`
- `Orlando e viagem`
- `Compras nos EUA`
- `Trabalho e renda`
- `Saude nos EUA`
- `Vida real nos EUA`
- `Primeiros passos`
- `Banco e credito`
- `Familia e filhos`

Se a categoria nao existir, o validador pode falhar.

## 4. Preencha o FAQ

Use perguntas reais que brasileiros pesquisariam no Google.

Exemplo:

```yaml
faq:
  - question: "Quanto custa morar em Atlanta em 2026?"
    answer: "Depende do bairro, aluguel, transporte e tamanho da familia. Use as faixas do artigo como estimativa inicial."
  - question: "Atlanta e boa para brasileiros?"
    answer: "Pode ser uma boa opcao para alguns perfis, mas e preciso comparar trabalho, custo, escola, transporte e documentacao."
```

O FAQ tambem gera `FAQPage` quando o artigo for publicado.

## 5. Escreva o artigo

Use esta estrutura:

```md
## Introducao

Explique o problema do leitor.

## O que voce precisa entender primeiro

Contexto claro e direto.

## Custos principais

Use tabela quando houver comparacao.

## Erros comuns

Liste riscos e cuidados.

## Conclusao

Feche com orientacao pratica.
```

Boas praticas:

- paragrafos curtos;
- subtitulos claros;
- tabelas quando houver comparacao;
- links internos para artigos relacionados;
- tom humano e responsavel;
- sem promessa de visto, green card, emprego ou resultado.

## 6. Inserir links internos

Use links relativos para artigos:

```md
[Custo de vida nos EUA](./custo-de-vida-nos-eua-2026-atualizado.html)
```

Use links absolutos para paginas principais:

```md
[Checklist gratuito](/checklist-mudanca-eua.html)
```

## 7. Inserir link de afiliado

Se houver link de afiliado, seja transparente e use:

```html
<a href="https://exemplo.com" rel="sponsored nofollow">Ver recurso recomendado</a>
```

Nunca esconda link pago como se fosse recomendacao neutra.

## 8. CTA para checklist

Inclua no final:

```html
<div class="checklist-cta">
  <h2>Planejando sua mudanca?</h2>
  <p>Baixe gratuitamente o checklist da mudanca para os EUA e organize documentos, dinheiro, moradia, escola, carro e os primeiros passos.</p>
  <div class="actions">
    <a class="button primary" href="/checklist-mudanca-eua.html">Baixar checklist gratuito</a>
  </div>
</div>
```

## 9. Como salvar e fazer commit pelo GitHub

1. Abra o repositorio no GitHub.
2. Entre em `src/content/articles/`.
3. Clique em **Add file**.
4. Crie o arquivo `.md`.
5. Cole o conteudo.
6. Confira `draft: false`.
7. Clique em **Commit changes**.
8. Escreva uma mensagem clara, por exemplo:

```text
Publica artigo sobre custo de vida em Atlanta
```

9. Prefira criar Pull Request em vez de commit direto na `main`.

## 10. Como verificar GitHub Actions

Depois do commit ou PR:

1. Abra a aba **Actions**.
2. Veja se o workflow passou.
3. Se falhar, abra o erro.
4. Procure mensagens como:
   - slug invalido;
   - title ausente;
   - description ausente;
   - categoria invalida;
   - PLACEHOLDER encontrado;
   - link interno quebrado.

## 11. Como conferir se publicou

A URL final sera:

```text
https://familiausa1.com/articles/slug-do-artigo.html
```

Tambem confira:

- se aparece em `blog.html`;
- se aparece na categoria correta;
- se aparece no `sitemap.xml`;
- se a pagina tem title, description e canonical.

## 12. O que fazer se o Actions falhar

Nao force merge.

Corrija:

- frontmatter incompleto;
- slug errado;
- categoria invalida;
- FAQ mal preenchido;
- link interno quebrado;
- texto com `PLACEHOLDER`.

Depois faça novo commit.

## 13. O que nunca fazer

- Nao apagar artigos antigos.
- Nao mudar URL de artigo publicado.
- Nao remover `.html` das URLs.
- Nao editar `sitemap.xml` manualmente depois do Astro.
- Nao colocar promessas de aprovacao de visto ou green card.
- Nao usar conteudo copiado de outros sites.
- Nao publicar tema legal, medico ou financeiro sem aviso responsavel.
- Nao publicar artigo com `draft: true`.

## Checklist editorial rapido

- [ ] Titulo tem palavra-chave e promessa clara.
- [ ] Description e unica.
- [ ] Categoria e valida.
- [ ] Introducao prende o leitor.
- [ ] Ha 3 a 6 links internos.
- [ ] FAQ tem perguntas reais.
- [ ] CTA do checklist esta no final.
- [ ] Nao ha `PLACEHOLDER`.
- [ ] `draft` esta como `false`.
