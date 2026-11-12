# Biblioteca de componentes editoriais

## Objetivo

Esta biblioteca oferece blocos leves e reutilizáveis para melhorar a leitura de artigos MDX do Família USA1. Os componentes complementam o conteúdo editorial; eles não substituem uma estrutura clara de títulos, parágrafos, listas e tabelas.

Os componentes ficam em `src/components/editorial/` e não usam JavaScript no navegador, bibliotecas externas ou dependências adicionais.

## Importação em MDX

Importe apenas os componentes usados pelo artigo, depois do frontmatter:

```mdx
import InfoBox from "../../components/editorial/InfoBox.astro";
import WarningBox from "../../components/editorial/WarningBox.astro";
import TipBox from "../../components/editorial/TipBox.astro";
import Checklist from "../../components/editorial/Checklist.astro";
import ProsCons from "../../components/editorial/ProsCons.astro";
import FAQAccordion from "../../components/editorial/FAQAccordion.astro";
```

## InfoBox

Use para contexto, definições e informações relevantes que não representam alerta.

```mdx
<InfoBox title="Informação importante">
  Confirme os dados em uma fonte oficial antes de tomar uma decisão.
</InfoBox>
```

Props:

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `title` | `string` | Não | Rótulo opcional do bloco. |

Não use para riscos, publicidade ou chamadas comerciais. O conteúdo é recebido pelo slot padrão.

## WarningBox

Use para riscos, limitações e cuidados que merecem atenção. Como o aviso faz parte de um artigo já carregado, o componente não usa `role="alert"`; esse papel seria inadequado para conteúdo estático.

```mdx
<WarningBox title="Atenção">
  Regras migratórias podem mudar. Consulte fontes oficiais e orientação qualificada para o seu caso.
</WarningBox>
```

Props:

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `title` | `string` | Não | Rótulo opcional do aviso. |

Não use para criar urgência artificial, medo ou promessa de resultado.

## TipBox

Use para dicas práticas, recomendações e boas práticas editoriais.

```mdx
<TipBox title="Dica prática">
  Guarde uma cópia digital dos documentos importantes em local seguro.
</TipBox>
```

Props:

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `title` | `string` | Não | Rótulo opcional da dica. |

Não use como publicidade disfarçada nem para destacar links de afiliado.

## Checklist

Use para uma sequência objetiva de verificações. O componente renderiza uma lista semântica e não produz saída quando `items` está vazio.

```mdx
<Checklist
  title="Checklist antes da compra"
  items={[
    "Confirmar compatibilidade",
    "Verificar garantia",
    "Guardar comprovantes"
  ]}
/>
```

Props:

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `title` | `string` | Não | Rótulo opcional da lista. |
| `items` | `string[]` | Não | Itens da verificação; o padrão é um array vazio. |

Não use para parágrafos extensos ou etapas que exigem explicação detalhada.

## ProsCons

Use para comparar vantagens e pontos de atenção de forma equilibrada. Em telas amplas, as listas aparecem em duas colunas; em telas estreitas, elas são empilhadas. Se uma das listas estiver vazia, apenas a outra será exibida. Se ambas estiverem vazias, o componente não produzirá saída.

```mdx
<ProsCons
  pros={[
    "Maior variedade",
    "Possibilidade de economia"
  ]}
  cons={[
    "Garantia pode variar",
    "Impostos precisam ser considerados"
  ]}
/>
```

Props:

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `pros` | `string[]` | Não | Lista de vantagens. |
| `cons` | `string[]` | Não | Lista de pontos de atenção. |
| `prosTitle` | `string` | Não | Título da primeira lista; padrão `Vantagens`. |
| `consTitle` | `string` | Não | Título da segunda lista; padrão `Pontos de atenção`. |

Não use para induzir uma compra ou esconder limitações relevantes.

## FAQAccordion

Use para perguntas frequentes visíveis que se beneficiam de expansão sob demanda. O componente usa `details` e `summary` nativos, funciona por teclado e permite manter mais de uma resposta aberta.

```mdx
<FAQAccordion
  items={[
    {
      question: "O iPhone dos EUA funciona no Brasil?",
      answer: "Depende do modelo, da operadora e da compatibilidade."
    },
    {
      question: "A garantia vale no Brasil?",
      answer: "A cobertura pode variar conforme o modelo e o mercado."
    }
  ]}
/>
```

Props:

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `items` | `{ question: string; answer: string }[]` | Não | Perguntas e respostas em texto; o padrão é um array vazio. |

O `FAQAccordion` **não cria FAQ Schema**. Quando o artigo precisar de `FAQPage`, as perguntas visíveis e os dados do frontmatter devem permanecer equivalentes para evitar schema inconsistente ou duplicado.

Não use o accordion para esconder conteúdo essencial, inserir respostas promocionais ou repetir perguntas já respondidas de forma suficiente no texto.

## Regras editoriais

- Use um bloco somente quando ele melhorar a compreensão ou a escaneabilidade.
- Evite repetir o mesmo componente várias vezes em sequência.
- Não transforme todos os parágrafos importantes em caixas visuais.
- Mantenha linguagem informativa, humana e proporcional ao risco do tema.
- Não use componentes editoriais para publicidade disfarçada.
- Separe recomendações editoriais de blocos de afiliados já identificados pelo site.
- Prefira headings normais do artigo para organizar seções; os rótulos das caixas não substituem H2 ou H3.

## Acessibilidade

- Os componentes herdam a tipografia do site e usam contraste de texto adequado.
- Informação não é diferenciada apenas por cor: rótulos, símbolos e estrutura também comunicam a finalidade.
- Listas usam elementos `ul` e `li`.
- `ProsCons` usa H3, nunca H1.
- `FAQAccordion` usa controles nativos, foco visível e não depende de mouse ou JavaScript.
- Textos longos podem quebrar linha sem provocar overflow horizontal.
- A disposição responsiva continua legível com zoom de navegador de 200%.

## Limitações

- Os componentes aceitam texto e conteúdo MDX, mas não substituem validação jurídica, migratória, médica ou financeira.
- `Checklist`, `ProsCons` e `FAQAccordion` tratam arrays vazios sem exibir um bloco vazio.
- As respostas de `FAQAccordion` são strings. Conteúdo rico deve permanecer no corpo do artigo.
- Nenhum componente cria schema, analytics, rotas, scripts ou estilos globais.
- A biblioteca não deve ser usada para criar banners, anúncios ou urgência comercial.
