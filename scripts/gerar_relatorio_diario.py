from datetime import datetime
from pathlib import Path
from urllib.parse import quote_plus
import html
import urllib.request
import xml.etree.ElementTree as ET

TERMOS_MONITORADOS = [
    "imigração EUA",
    "USCIS",
    "green card",
    "visto americano",
    "brasileiros nos Estados Unidos",
    "asilo nos EUA",
    "ICE immigration",
]

PALAVRAS_CHAVE = [
    "imigração EUA",
    "USCIS",
    "green card",
    "visto americano",
    "brasileiros nos EUA",
    "morar nos Estados Unidos",
    "asilo nos EUA",
]


def buscar_google_news(termo, limite=5):
    query = quote_plus(termo)
    url = f"https://news.google.com/rss/search?q={query}&hl=pt-BR&gl=BR&ceid=BR:pt-419"
    noticias = []

    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0"},
        )
        with urllib.request.urlopen(req, timeout=20) as response:
            dados = response.read()

        raiz = ET.fromstring(dados)
        itens = raiz.findall("./channel/item")[:limite]

        for item in itens:
            titulo = html.unescape(item.findtext("title", default="Sem título"))
            link = item.findtext("link", default="")
            data = item.findtext("pubDate", default="")
            noticias.append({"titulo": titulo, "link": link, "data": data})

    except Exception as erro:
        noticias.append({
            "titulo": f"Erro ao buscar notícias para: {termo}",
            "link": "",
            "data": str(erro),
        })

    return noticias


def formatar_noticias():
    blocos = []

    for termo in TERMOS_MONITORADOS:
        noticias = buscar_google_news(termo)
        blocos.append(f"### {termo}\n")

        if not noticias:
            blocos.append("Nenhuma notícia encontrada.\n")
            continue

        for noticia in noticias:
            titulo = noticia["titulo"]
            link = noticia["link"]
            data = noticia["data"]

            if link:
                blocos.append(f"- [{titulo}]({link})")
            else:
                blocos.append(f"- {titulo}")

            if data:
                blocos.append(f"  - Data/Fonte: {data}")

        blocos.append("")

    return "\n".join(blocos)


def gerar_relatorio():
    hoje = datetime.now().strftime("%Y-%m-%d")
    caminho = Path("relatorios-diarios") / f"{hoje}-tendencias-imigracao.md"
    caminho.parent.mkdir(parents=True, exist_ok=True)

    noticias_do_dia = formatar_noticias()

    conteudo = f"""# Relatório diário — Imigração e brasileiros nos EUA

Data: {hoje}

## Objetivo

Este relatório serve como base para criação de artigos atualizados para o blog Família USA 1.

## Termos monitorados

{chr(10).join(f"- {termo}" for termo in TERMOS_MONITORADOS)}

## Notícias encontradas hoje

{noticias_do_dia}

## Ideias iniciais de artigos

1. O que mudou na imigração dos EUA hoje?
2. Principais notícias sobre USCIS para brasileiros
3. O que brasileiros nos EUA precisam acompanhar esta semana
4. Atualizações sobre vistos, green card e processos imigratórios
5. Como as notícias de hoje podem afetar brasileiros que querem morar nos EUA

## Palavras-chave sugeridas

{chr(10).join(f"- {palavra}" for palavra in PALAVRAS_CHAVE)}

## Próxima ação recomendada

Peça ao ChatGPT: "Leia o relatório de hoje e crie ideias de artigos com base nas notícias encontradas."

## Observação

Esta versão busca notícias reais via RSS do Google News. O próximo passo será adicionar IA para resumir automaticamente os principais temas e sugerir pautas mais fortes para SEO.
"""

    caminho.write_text(conteudo, encoding="utf-8")
    print(f"Relatório criado em: {caminho}")


if __name__ == "__main__":
    gerar_relatorio()
