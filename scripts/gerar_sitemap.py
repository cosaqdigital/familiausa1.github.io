from datetime import datetime
from pathlib import Path

BASE_URL = "https://familiausa1.com"
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


def deve_indexar(caminho):
    html = caminho.read_text(encoding="utf-8", errors="ignore").lower()
    return 'name="robots"' not in html or "noindex" not in html


def gerar_sitemap():
    raiz = Path(".")
    arquivos_html = sorted(
        p for p in raiz.rglob("*.html")
        if ".git" not in p.parts and p.name not in IGNORAR and deve_indexar(p)
    )

    hoje = datetime.utcnow().strftime("%Y-%m-%d")

    linhas = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]

    for arquivo in arquivos_html:
        caminho = arquivo.relative_to(raiz)
        url = url_para_arquivo(caminho)
        frequencia = calcular_frequencia(caminho)
        prioridade = calcular_prioridade(caminho)

        linhas.extend([
            "  <url>",
            f"    <loc>{url}</loc>",
            f"    <lastmod>{hoje}</lastmod>",
            f"    <changefreq>{frequencia}</changefreq>",
            f"    <priority>{prioridade}</priority>",
            "  </url>",
        ])

    linhas.append("</urlset>")

    Path("sitemap.xml").write_text("\n".join(linhas) + "\n", encoding="utf-8")
    print(f"Sitemap gerado com {len(arquivos_html)} URLs.")


if __name__ == "__main__":
    gerar_sitemap()
