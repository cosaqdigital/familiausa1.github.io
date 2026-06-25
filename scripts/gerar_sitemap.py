from datetime import UTC, datetime
from pathlib import Path
import re

BASE_URL = "https://familiausa1.com"
IGNORAR_DIRETORIOS = {
    ".astro",
    ".git",
    "dist",
    "node_modules",
    "public",
}
IGNORAR = {
    "404.html",
    "article.html",
    "teste.html",
    "template-artigo-html.html",
}

PRIORIDADES = {
    "index.html": "1.0",
    "blog.html": "0.9",
    "categorias.html": "0.8",
    "sobre.html": "0.6",
}


def calcular_prioridade(caminho):
    nome = caminho.name
    if nome in PRIORIDADES:
        return PRIORIDADES[nome]
    if caminho.parts and caminho.parts[0] == "articles":
        return "0.8"
    return "0.6"


def calcular_frequencia(caminho):
    if caminho.name in ["index.html", "blog.html"]:
        return "daily"
    if caminho.parts and caminho.parts[0] == "articles":
        return "weekly"
    return "monthly"


def url_para_arquivo(caminho):
    caminho_url = caminho.as_posix()
    if caminho_url == "index.html":
        return BASE_URL + "/"
    return BASE_URL + "/" + caminho_url


def url_para_path(path):
    return BASE_URL + "/" if path == "/" else BASE_URL + path


def deve_indexar(caminho):
    html = caminho.read_text(encoding="utf-8", errors="ignore").lower()
    return 'name="robots"' not in html or "noindex" not in html


def adicionar_entrada(entradas, loc, lastmod, changefreq, priority):
    entradas[loc] = {
        "loc": loc,
        "lastmod": lastmod,
        "changefreq": changefreq,
        "priority": priority,
    }


def extrair_frontmatter(texto):
    match = re.match(r"^---\s*\n(.*?)\n---", texto, re.DOTALL)
    if not match:
        return {}

    dados = {}
    for linha in match.group(1).splitlines():
        if ":" not in linha:
            continue
        chave, valor = linha.split(":", 1)
        dados[chave.strip()] = valor.strip().strip('"').strip("'")
    return dados


def adicionar_paginas_site_pages(entradas):
    arquivo = Path("src/data/sitePages.ts")
    if not arquivo.exists():
        return

    conteudo = arquivo.read_text(encoding="utf-8", errors="ignore")
    for bloco in re.findall(r"\{(.*?)\}", conteudo, re.DOTALL):
        path_match = re.search(r'path:\s*"([^"]+)"', bloco)
        if not path_match:
            continue

        path = path_match.group(1)
        lastmod_match = re.search(r'lastmod:\s*"([^"]+)"', bloco)
        priority_match = re.search(r'priority:\s*"([^"]+)"', bloco)
        changefreq = "daily" if path in {"/", "/blog.html"} else "monthly"

        adicionar_entrada(
            entradas,
            url_para_path(path),
            lastmod_match.group(1) if lastmod_match else datetime.now(UTC).strftime("%Y-%m-%d"),
            changefreq,
            priority_match.group(1) if priority_match else "0.6",
        )


def adicionar_artigos_markdown(entradas):
    pasta = Path("src/content/articles")
    if not pasta.exists():
        return

    for arquivo in sorted(pasta.glob("*.md")):
        if arquivo.name.startswith("_"):
            continue

        texto = arquivo.read_text(encoding="utf-8", errors="ignore")
        frontmatter = extrair_frontmatter(texto)
        if frontmatter.get("draft", "").lower() == "true":
            continue

        slug = frontmatter.get("slug") or arquivo.stem
        lastmod = (
            frontmatter.get("dateModified")
            or frontmatter.get("datePublished")
            or datetime.now(UTC).strftime("%Y-%m-%d")
        )

        adicionar_entrada(
            entradas,
            f"{BASE_URL}/articles/{slug}.html",
            lastmod,
            "weekly",
            "0.8",
        )


def gerar_sitemap():
    raiz = Path(".")
    arquivos_html = sorted(
        p for p in raiz.rglob("*.html")
        if not any(parte in IGNORAR_DIRETORIOS for parte in p.parts)
        and p.name not in IGNORAR
        and deve_indexar(p)
    )

    hoje = datetime.now(UTC).strftime("%Y-%m-%d")
    entradas = {}

    for arquivo in arquivos_html:
        caminho = arquivo.relative_to(raiz)
        adicionar_entrada(
            entradas,
            url_para_arquivo(caminho),
            hoje,
            calcular_frequencia(caminho),
            calcular_prioridade(caminho),
        )

    adicionar_paginas_site_pages(entradas)
    adicionar_artigos_markdown(entradas)

    linhas = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]

    for entrada in sorted(entradas.values(), key=lambda item: item["loc"]):
        linhas.extend([
            "  <url>",
            f"    <loc>{entrada['loc']}</loc>",
            f"    <lastmod>{entrada['lastmod']}</lastmod>",
            f"    <changefreq>{entrada['changefreq']}</changefreq>",
            f"    <priority>{entrada['priority']}</priority>",
            "  </url>",
        ])

    linhas.append("</urlset>")

    Path("sitemap.xml").write_text("\n".join(linhas) + "\n", encoding="utf-8")
    print(f"Sitemap gerado com {len(entradas)} URLs.")


if __name__ == "__main__":
    gerar_sitemap()
