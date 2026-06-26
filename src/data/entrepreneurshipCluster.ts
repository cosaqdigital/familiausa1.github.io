import { SITE_URL } from "./pilotContent";

export const ENTREPRENEURSHIP_HUB_PATH = "/empreendedorismo-nos-estados-unidos.html";
export const ENTREPRENEURSHIP_PILLAR_PATH = "/empreender-nos-estados-unidos-guia-completo.html";
export const ENTREPRENEURSHIP_HUB_URL = `${SITE_URL}${ENTREPRENEURSHIP_HUB_PATH}`;
export const ENTREPRENEURSHIP_PILLAR_URL = `${SITE_URL}${ENTREPRENEURSHIP_PILLAR_PATH}`;

export const entrepreneurshipArticleSlugs = [
  "abrir-empresa-nos-eua-legaliza-minha-situacao",
  "preciso-de-ssn-para-abrir-llc-nos-eua",
  "sunbiz-nao-e-licenca-erro-brasileiros-florida",
  "como-emitir-invoice-nos-eua-guia-brasileiros",
  "google-business-profile-prestadores-servico-eua"
];

export type GuideLinkStatus = "published" | "soon";

export type GuideJourneyStep = {
  step: number;
  label: string;
  title: string;
  summary: string;
  href?: string;
  slug?: string;
  status: GuideLinkStatus;
  estimatedTime: string;
  difficulty: string;
  tools: string[];
};

export const entrepreneurshipJourney: GuideJourneyStep[] = [
  {
    step: 1,
    label: "Abrir empresa",
    title: "Abrir empresa nos EUA sem confundir empresa com status migratorio",
    summary: "Entenda o que uma LLC ou corporation pode organizar no negocio e por que isso nao legaliza a situacao migratoria por si so.",
    href: "/articles/abrir-empresa-nos-eua-legaliza-minha-situacao.html",
    slug: "abrir-empresa-nos-eua-legaliza-minha-situacao",
    status: "published",
    estimatedTime: "1 a 7 dias para organizar a decisao inicial",
    difficulty: "Media",
    tools: ["SBA", "Sunbiz ou estado correspondente", "advogado/CPA quando necessario"]
  },
  {
    step: 2,
    label: "LLC, EIN, SSN e ITIN",
    title: "Entender identificacao fiscal antes de abrir conta ou contratar",
    summary: "Separe SSN, ITIN e EIN para nao misturar identificacao pessoal, fiscal e empresarial na hora de estruturar o negocio.",
    href: "/articles/preciso-de-ssn-para-abrir-llc-nos-eua.html",
    slug: "preciso-de-ssn-para-abrir-llc-nos-eua",
    status: "published",
    estimatedTime: "Alguns dias a algumas semanas, conforme o caso",
    difficulty: "Media",
    tools: ["IRS", "Form SS-4", "ITIN/SSN quando aplicavel"]
  },
  {
    step: 3,
    label: "Sunbiz e licencas",
    title: "Registrar empresa nao e o mesmo que ter licenca para trabalhar",
    summary: "Na Florida, Sunbiz registra a entidade ou nome ficticio. Licencas, permissoes e regras profissionais podem depender de outros orgaos.",
    href: "/articles/sunbiz-nao-e-licenca-erro-brasileiros-florida.html",
    slug: "sunbiz-nao-e-licenca-erro-brasileiros-florida",
    status: "published",
    estimatedTime: "1 dia para checar; prazo varia por licenca",
    difficulty: "Media a alta",
    tools: ["Sunbiz", "Florida DBPR", "cidade/condado"]
  },
  {
    step: 4,
    label: "Invoice e cobranca",
    title: "Emitir invoice com clareza, registro e profissionalismo",
    summary: "Aprenda o que uma invoice precisa mostrar, como organizar comprovantes e por que isso ajuda no controle financeiro do pequeno negocio.",
    href: "/articles/como-emitir-invoice-nos-eua-guia-brasileiros.html",
    slug: "como-emitir-invoice-nos-eua-guia-brasileiros",
    status: "published",
    estimatedTime: "1 a 2 horas para criar um modelo simples",
    difficulty: "Baixa a media",
    tools: ["QuickBooks", "Stripe", "Square", "PayPal Business"]
  },
  {
    step: 5,
    label: "Google Business",
    title: "Aparecer no Google sem prometer o que nao pode entregar",
    summary: "Organize perfil, categoria, area atendida, fotos e avaliacoes para prestadores de servico serem encontrados com mais confianca.",
    href: "/articles/google-business-profile-prestadores-servico-eua.html",
    slug: "google-business-profile-prestadores-servico-eua",
    status: "published",
    estimatedTime: "1 a 3 dias, dependendo da verificacao",
    difficulty: "Media",
    tools: ["Google Business Profile", "fotos reais", "politicas do Google"]
  },
  {
    step: 6,
    label: "Clientes e crescimento",
    title: "Transformar servico em negocio com processo, seguro e recorrencia",
    summary: "A fase de crescimento envolve precificacao, indicacoes, contratos simples, seguro, bookkeeping e rotina de atendimento.",
    status: "soon",
    estimatedTime: "Continuo",
    difficulty: "Alta",
    tools: ["bookkeeping", "seguro", "contratos", "CRM simples"]
  }
];

export type GuideSection = {
  title: string;
  summary: string;
  href?: string;
  status: GuideLinkStatus;
};

export const pillarSections: GuideSection[] = [
  {
    title: "Quem pode empreender",
    summary: "A primeira decisao e separar vontade de empreender, permissao para trabalhar, estrutura fiscal e objetivo migratorio.",
    status: "soon"
  },
  {
    title: "Abrir empresa",
    summary: "Abrir empresa pode organizar o negocio, mas nao cria autorizacao de trabalho nem regulariza status migratorio.",
    href: "/articles/abrir-empresa-nos-eua-legaliza-minha-situacao.html",
    status: "published"
  },
  {
    title: "LLC",
    summary: "A LLC costuma ser uma estrutura simples para pequenos negocios, mas precisa ser entendida com responsabilidade fiscal.",
    href: "/articles/preciso-de-ssn-para-abrir-llc-nos-eua.html",
    status: "published"
  },
  {
    title: "Corporation",
    summary: "Corporations podem fazer sentido em negocios maiores, socios, investidores ou cenarios especificos de impostos.",
    status: "soon"
  },
  {
    title: "EIN",
    summary: "O EIN identifica a empresa para fins fiscais e pode ser necessario para banco, folha, formularios e operacao formal.",
    href: "/articles/preciso-de-ssn-para-abrir-llc-nos-eua.html",
    status: "published"
  },
  {
    title: "SSN e ITIN",
    summary: "SSN, ITIN e EIN nao sao a mesma coisa. Confundir esses numeros pode gerar erro fiscal, bancario e documental.",
    href: "/articles/preciso-de-ssn-para-abrir-llc-nos-eua.html",
    status: "published"
  },
  {
    title: "Invoice",
    summary: "Invoice bem feita ajuda a cobrar, registrar, provar servico, organizar impostos e transmitir confianca.",
    href: "/articles/como-emitir-invoice-nos-eua-guia-brasileiros.html",
    status: "published"
  },
  {
    title: "Conta bancaria",
    summary: "Conta empresarial separa dinheiro pessoal do negocio e ajuda a evitar bagunca em imposto, credito e caixa.",
    href: "/articles/como-abrir-conta-banco-nos-eua-2026.html",
    status: "published"
  },
  {
    title: "Google Business Profile",
    summary: "Perfil no Google ajuda prestadores de servico a aparecer em buscas locais, Maps e avaliacoes.",
    href: "/articles/google-business-profile-prestadores-servico-eua.html",
    status: "published"
  },
  {
    title: "Licencas",
    summary: "Registro no Sunbiz nao substitui licenca profissional, permissao local, regra de cidade ou exigencia estadual.",
    href: "/articles/sunbiz-nao-e-licenca-erro-brasileiros-florida.html",
    status: "published"
  },
  {
    title: "Sales tax",
    summary: "Alguns produtos e servicos podem exigir registro, cobranca e repasse de sales tax conforme estado, cidade e atividade.",
    status: "soon"
  },
  {
    title: "Impostos e bookkeeping",
    summary: "Empreender exige guardar recibos, separar contas, entender receita, despesa, 1099, W-9 e relatorios.",
    status: "soon"
  },
  {
    title: "Marketing e primeiros clientes",
    summary: "Google, Nextdoor, Thumbtack, Yelp, indicacoes e fotos reais podem acelerar a primeira base de clientes.",
    href: "/articles/google-business-profile-prestadores-servico-eua.html",
    status: "published"
  },
  {
    title: "Seguros",
    summary: "General liability, commercial auto, workers compensation e outros seguros podem proteger o negocio e abrir portas.",
    status: "soon"
  },
  {
    title: "Ferramentas",
    summary: "QuickBooks, Stripe, Square, PayPal Business, Wise e planilhas simples ajudam o pequeno negocio a nao operar no escuro.",
    href: "/articles/como-emitir-invoice-nos-eua-guia-brasileiros.html",
    status: "published"
  }
];

export const officialEntrepreneurshipSources = [
  {
    label: "IRS - Business structures",
    href: "https://www.irs.gov/businesses/small-businesses-self-employed/business-structures"
  },
  {
    label: "IRS - Employer Identification Number (EIN)",
    href: "https://www.irs.gov/businesses/employer-identification-number"
  },
  {
    label: "IRS - Recordkeeping",
    href: "https://www.irs.gov/businesses/small-businesses-self-employed/recordkeeping"
  },
  {
    label: "SBA - Choose a business structure",
    href: "https://www.sba.gov/business-guide/launch-your-business/choose-business-structure"
  },
  {
    label: "SBA - Register your business",
    href: "https://www.sba.gov/business-guide/launch-your-business/register-your-business"
  },
  {
    label: "Sunbiz - Florida Division of Corporations",
    href: "https://dos.fl.gov/sunbiz/"
  },
  {
    label: "FinCEN - Beneficial Ownership Information",
    href: "https://www.fincen.gov/boi"
  },
  {
    label: "Google Business Profile",
    href: "https://business.google.com/us/business-profile/"
  },
  {
    label: "Florida DBPR - Services requiring a license",
    href: "https://www2.myfloridalicense.com/services-requiring-a-dbpr-license/"
  },
  {
    label: "USCIS - Working in the United States",
    href: "https://www.uscis.gov/working-in-the-united-states"
  }
];

export const entrepreneurshipFaq = [
  {
    question: "Abrir empresa nos Estados Unidos legaliza minha situacao migratoria?",
    answer: "Nao. Abrir empresa pode organizar a atividade comercial, mas nao cria status migratorio nem autorizacao de trabalho por si so. O caso deve ser analisado com advogado de imigracao licenciado."
  },
  {
    question: "Brasileiro precisa de SSN para abrir LLC nos EUA?",
    answer: "Nem sempre. Alguns processos permitem alternativas, mas banco, EIN, impostos e operacao podem exigir documentos diferentes conforme o caso. E importante confirmar com IRS, estado, banco e profissional qualificado."
  },
  {
    question: "Sunbiz e uma licenca para trabalhar na Florida?",
    answer: "Nao. Sunbiz registra empresas e nomes ficticios na Florida, mas licencas profissionais ou permissoes podem depender de DBPR, cidade, condado ou outro orgao."
  },
  {
    question: "Prestador de servico precisa emitir invoice?",
    answer: "Invoice nao substitui contabilidade, contrato ou imposto, mas ajuda a registrar servico, valor, prazo, metodo de pagamento e historico de cobranca."
  },
  {
    question: "Google Business Profile garante clientes?",
    answer: "Nao garante. Ele aumenta a presenca local quando bem configurado, mas resultado depende de servico, reputacao, fotos, avaliacoes, concorrencia, atendimento e consistencia."
  }
];

