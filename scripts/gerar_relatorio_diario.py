from datetime import datetime
from pathlib import Path
from urllib.parse import quote_plus, urlparse, parse_qs, unquote
import html
import re
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


def limpar_texto(texto):
    texto = html.unescape(texto or "")
    texto = re.sub(r"\s+", " ", texto).strip()
    return texto


def criar_chave_titulo(titulo):
    titulo = titulo.lower()
    titulo = re.sub(r"[^a-z0-9áàâãéèêíóôõúçñ ]", "", titulo)
    titulo = re.sub(r"\s+", " ", titulo).strip()
    palavras = [p for p in titulo.split() if len(p) > 3]
    return " ".join(palavras[:10])


def limpar_link_google_news(link):
    if not link:
        return ""

    try:
        parsed = urlparse(link)
        params = parse_qs(parsed.query)

        for chave in ["url", "q"]:
            if chave in params and params[chave]:
                return unquote(params[chave][0])
    except Exception:
        pass

    return link


def buscar_google_news(termo, limite=3):
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
        itens = raiz.findall("./channel/item")

        for item in itens:
            titulo_original = limpar_texto(item.findtext("title", default="Sem título"))
            link = limpar_link_google_news(item.findtext("link", default=""))
            data = limpar_texto(item.findtext("pubDate", default=""))
            fonte = ""
            titulo = titulo_original

            if " - " in titulo_original:
                partes = titulo_original.rsplit(" - ", 1)
                titulo = partes[0].strip()
                fonte = partes[1].strip()

            noticias.append({
                "termo": termo,
                "titulo": titulo,
                "fonte": fonte or "Fonte não identificada",
                "link": link,
                "data": data,
                "chave": criar_chave_titulo(titulo),
            })

            if len(noticias) >= limite:
                break

    except Exception as erro:
        noticias.append({
            "termo": termo,
            "titulo": f"Erro ao buscar notícias para: {termo}",
            "fonte": "Sistema",
            "link": "",
            "data": str(erro),
            "chave": f"erro-{termo}",
        })

    return noticias


def coletar_noticias():
    todas = []
    chaves_vistas = set()

    for termo in TERMOS_MONITORADOS:
        for noticia in buscar_google_news(termo, limite=4):
            chave = noticia["chave"]
            if chave in chaves_vistas:
                continue
            chaves_vistas.add(chave)
            todas.append(noticia)

    return todas


def formatar_principais_assuntos(noticias):
    assuntos = noticias[:5]
    if not assuntos:
        return "Nenhum assunto encontrado hoje."

    linhas = []
    for indice, noticia in enumerate(assuntos, start=1):
        linhas.append(f"{indice}. **{noticia['titulo']}**")
        linhas.append(f"   - Fonte: {noticia['fonte']}")
        linhas.append(f"   - Termo monitorado: {noticia['termo']}")
        if noticia["link"]:
            linhas.append(f"   - Link: {noticia['link']}")
        linhas.append("")

    return "\n".join(linhas)


def formatar_noticias_por_tema(noticias):
    blocos = []

    for termo in TERMOS_MONITORADOS:
        noticias_do_termo = [n for n in noticias if n["termo"] == termo][:2]
        if not noticias_do_termo:
            continue

        blocos.append(f"### {termo}\n")
        for noticia in noticias_do_termo:
            blocos.append(f"- **{noticia['titulo']}**")
            blocos.append(f"  - Fonte: {noticia['fonte']}")
            if noticia["link"]:
                blocos.append(f"  - Link: {noticia['link']}")
        blocos.append("")

    return "\n".join(blocos) if blocos else "Nenhuma notícia organizada por tema."


def gerar_ideias_de_artigos():
    return """1. O que brasileiros nos EUA precisam saber sobre as notícias de imigração de hoje
2. Green card e USCIS: principais atualizações que podem afetar brasileiros
3. Visto americano: mudanças, alertas e notícias importantes da semana
4. Asilo, deportação e imigração: o que acompanhar antes de tomar decisões
5. Resumo semanal de imigração para brasileiros que querem morar nos EUA"""


def gerar_relatorio():
    hoje = datetime.now().strftime("%Y-%m-%d")
    caminho = Path("relatorios-diarios") / f"{hoje}-tendencias-imigracao.md"
    caminho.parent.mkdir(parents=True, exist_ok=True)

    noticias = coletar_noticias()
    principais_assuntos = formatar_principais_assuntos(noticias)
    noticias_por_tema = formatar_noticias_por_tema(noticias)

    conteudo = f"""# Relatório diário — Imigração e brasileiros nos EUA

Data: {hoje}

## Objetivo

Este relatório serve como base para criação de artigos atualizados para o blog Família USA 1.

## Principais assuntos do dia

{principais_assuntos}

## Sugestões de artigos para publicar

{gerar_ideias_de_artigos()}

## Notícias de apoio por tema

{noticias_por_tema}

## Termos monitorados

{chr(10).join(f"- {termo}" for termo in TERMOS_MONITORADOS)}

## Palavras-chave sugeridas

{chr(10).join(f"- {palavra}" for palavra in PALAVRAS_CHAVE)}

## Como usar este relatório no ChatGPT

Peça: "Leia o relatório de hoje e crie 3 artigos para o blog Família USA 1 com base nos principais assuntos do dia."

## Observação

Esta versão remove duplicações, prioriza os principais assuntos e organiza notícias de apoio por tema para facilitar a criação de artigos.
"""

    caminho.write_text(conteudo, encoding="utf-8")
    print(f"Relatório criado em: {caminho}")


if __name__ == "__main__":
    gerar_relatorio()
