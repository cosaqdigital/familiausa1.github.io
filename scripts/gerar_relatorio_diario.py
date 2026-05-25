from datetime import datetime
from pathlib import Path

TERMOS_MONITORADOS = [
    "imigração EUA",
    "USCIS",
    "green card",
    "visto americano",
    "brasileiros nos Estados Unidos",
    "asilo nos EUA",
    "ICE immigration",
]

FONTES_INICIAIS = [
    "Google News",
    "USCIS",
    "Department of State",
    "Google Trends",
]


def gerar_relatorio():
    hoje = datetime.now().strftime("%Y-%m-%d")
    caminho = Path("relatorios-diarios") / f"{hoje}-tendencias-imigracao.md"
    caminho.parent.mkdir(parents=True, exist_ok=True)

    conteudo = f"""# Relatório diário — Imigração e brasileiros nos EUA

Data: {hoje}

## Objetivo

Este relatório serve como base para criação de artigos atualizados para o blog Família USA 1.

## Termos monitorados

{chr(10).join(f"- {termo}" for termo in TERMOS_MONITORADOS)}

## Assuntos para pesquisar hoje

1. Mudanças recentes no USCIS
2. Atualizações sobre green card
3. Notícias sobre vistos americanos
4. Tendências envolvendo brasileiros nos Estados Unidos
5. Mudanças em regras de imigração, asilo ou trabalho

## Ideias iniciais de artigos

1. O que mudou na imigração dos EUA hoje?
2. Principais notícias sobre USCIS para brasileiros
3. O que brasileiros nos EUA precisam acompanhar esta semana
4. Atualizações sobre vistos, green card e processos imigratórios

## Palavras-chave sugeridas

- imigração EUA
- USCIS
- green card
- visto americano
- brasileiros nos EUA
- morar nos Estados Unidos
- asilo nos EUA

## Fontes planejadas

{chr(10).join(f"- {fonte}" for fonte in FONTES_INICIAIS)}

## Observação

Esta é a primeira versão do gerador. No próximo passo, vamos conectar busca real em fontes de notícias/RSS e depois adicionar IA para resumir os temas automaticamente.
"""

    caminho.write_text(conteudo, encoding="utf-8")
    print(f"Relatório criado em: {caminho}")


if __name__ == "__main__":
    gerar_relatorio()
