import { ENTREPRENEURSHIP_HUB_PATH } from "./entrepreneurshipCluster";

export type PortalGuideCard = {
  icon: string;
  title: string;
  description: string;
  href?: string;
  label?: string;
};

export const portalGuideCards: PortalGuideCard[] = [
  {
    icon: "🇺🇸",
    title: "Empreender nos EUA",
    description: "Empresa, LLC, EIN, invoice, licencas, Google Business e primeiros clientes.",
    href: ENTREPRENEURSHIP_HUB_PATH,
    label: "Explorar guia"
  },
  {
    icon: "🛒",
    title: "Comprar nos EUA",
    description: "iPhone, outlets, Walmart, Target, impostos, garantia e custo-beneficio real.",
    href: "/categorias/compras-nos-eua.html",
    label: "Ver compras"
  },
  {
    icon: "🛂",
    title: "Imigracao",
    description: "Caminhos legais, vistos, green card, asilo, documentos, riscos e fontes oficiais.",
    href: "/categorias/imigracao-legalizacao.html",
    label: "Ver imigracao"
  },
  {
    icon: "🏠",
    title: "Morar nos EUA",
    description: "Moradia, aluguel, cidade, custo, rotina e planejamento antes de mudar.",
    href: "/categorias/moradia-nos-eua.html",
    label: "Ver moradia"
  },
  {
    icon: "💼",
    title: "Trabalhar nos EUA",
    description: "Trabalho, renda, autorizacao, rotina, salario e preparo profissional.",
    href: "/categorias/trabalho-renda.html",
    label: "Ver trabalho"
  },
  {
    icon: "✈️",
    title: "Primeira viagem",
    description: "Orlando, parques, custos, carro, compras e planejamento para brasileiros.",
    href: "/categorias/orlando-e-viagem.html",
    label: "Planejar viagem"
  },
  {
    icon: "👨‍👩‍👧",
    title: "Familia",
    description: "Escola, filhos, adaptacao, rotina familiar e decisoes que afetam a casa toda.",
    href: "/categorias/familia-filhos.html",
    label: "Ver familia"
  },
  {
    icon: "🏥",
    title: "Saude",
    description: "Seguro saude, emergencia, urgent care, viagem e cuidados medicos nos EUA.",
    href: "/categorias/saude-nos-eua.html",
    label: "Ver saude"
  }
];

