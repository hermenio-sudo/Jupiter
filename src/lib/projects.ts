export type Project = {
  id: string;
  name: string;
  category: string;
  description: string;
  focus: string;
  reward: number;
};

// Projects are grouped in batches of 4.
// After completing a batch, the user waits 15 days for the next one.
export const PROJECT_BATCHES: Project[][] = [
  // ── Batch 1 ─────────────────────────────────────────────────────────────
  [
    {
      id: "taskflow-ai",
      name: "TaskFlow AI — Gerenciador de Tarefas",
      category: "Produtividade & Software",
      description:
        "Aplicativo de organização do dia a dia voltado para freelancers e estudantes. A proposta é usar IA para sugerir prioridades, lembrar de pausas e ajudar a não deixar prazo escapar — sem precisar configurar nada na mão.",
      focus:
        "Se o painel principal faz sentido na primeira vez que você abre, e se o assistente de IA parece útil de verdade ou só enche linguiça.",
      reward: 1.0,
    },
    {
      id: "automarket-hub",
      name: "AutoMarket Hub — Compra e Venda de Veículos",
      category: "E-commerce & Automotivo",
      description:
        "Marketplace focado em carros e motos com simulador de financiamento, histórico de manutenção do veículo e visualização de peças em 3D. O objetivo é deixar a negociação mais transparente para quem compra e quem vende.",
      focus:
        "Se o catálogo de veículos é fácil de navegar, se as informações de preço são claras, e se o formulário de proposta não dá trabalho.",
      reward: 1.1,
    },
    {
      id: "ecobyte",
      name: "EcoByte — Pegada de Carbono e Reciclagem",
      category: "Sustentabilidade & Comunidade",
      description:
        "App onde você registra hábitos do dia a dia — o que comprou, como se deslocou, o que jogou fora — e vê o impacto ambiental disso. Tem uma parte de comunidade para trocar dicas e um sistema de pontos trocáveis por cupons.",
      focus:
        "Se o design das telas convida a usar ou cansa, e se a parte de gamificação (pontos, conquistas) dá vontade de voltar todo dia.",
      reward: 0.95,
    },
    {
      id: "apexmatch",
      name: "ApexMatch — Torneios de eSports & Futsal",
      category: "Jogos & Esportes",
      description:
        "Portal para organizar campeonatos comunitários, sejam online ou presenciais. Tem tabela de classificação em tempo real, perfil de jogador com estatísticas e um fluxo para agendar partidas entre times.",
      focus:
        "Se a tabela de classificação é fácil de ler, se o perfil do jogador passa as informações certas, e se inscrever em um torneio é simples.",
      reward: 0.95,
    },
  ],

  // ── Batch 2 ─────────────────────────────────────────────────────────────
  [
    {
      id: "b2-fintrek",
      name: "FinTrek — Controle Financeiro Pessoal",
      category: "Finanças & Produtividade",
      description:
        "App de finanças pessoais que conecta às contas bancárias e categoriza gastos automaticamente. Gera relatórios semanais e dá alertas quando o utilizador está a gastar mais do que o habitual em alguma categoria.",
      focus:
        "Se os gráficos são fáceis de entender e se os alertas parecem úteis ou intrusivos no dia a dia.",
      reward: 1.05,
    },
    {
      id: "b2-mediq",
      name: "MediQ — Fila de Consultas Online",
      category: "Saúde & Serviços",
      description:
        "Plataforma que permite marcar consultas médicas online ou presenciais, ver a fila de espera em tempo real e receber notificações quando a vez está a chegar. Voltada para clínicas de bairro.",
      focus:
        "Se o fluxo de marcação é intuitivo e se a visualização da fila transmite confiança ao utilizador.",
      reward: 1.0,
    },
    {
      id: "b2-learntube",
      name: "LearnTube — Cursos em Vídeo Curto",
      category: "Educação & Tecnologia",
      description:
        "Plataforma de aprendizado baseada em vídeos de até 5 minutos, com quizzes rápidos no final de cada lição. Foca em habilidades técnicas para quem tem pouco tempo livre.",
      focus:
        "Se o ritmo dos vídeos prende a atenção e se os quizzes reforçam o que foi visto ou parecem só um obstáculo.",
      reward: 1.0,
    },
    {
      id: "b2-homeclean",
      name: "HomeClean — Serviços de Limpeza Doméstica",
      category: "Serviços & Marketplace",
      description:
        "App que conecta utilizadores a profissionais de limpeza verificados na sua área. Permite agendar, avaliar e repetir serviços, com perfis detalhados dos profissionais e histórico de visitas.",
      focus:
        "Se o processo de agendamento é rápido e se os perfis dos profissionais passam credibilidade suficiente para confiar.",
      reward: 0.9,
    },
  ],

  // ── Batch 3 ─────────────────────────────────────────────────────────────
  [
    {
      id: "b3-petcare",
      name: "PetCare — Agenda para Donos de Animais",
      category: "Estilo de Vida & Animais",
      description:
        "App para donos de cães e gatos que centraliza vacinas, consultas veterinárias, alimentação e passeios. Envia lembretes automáticos e tem uma rede para partilhar dicas entre donos.",
      focus:
        "Se os lembretes parecem úteis no dia a dia e se a rede de donos tem potencial para criar comunidade real.",
      reward: 0.95,
    },
    {
      id: "b3-buildlog",
      name: "BuildLog — Diário de Treino para Atletas",
      category: "Desporto & Saúde",
      description:
        "App de registo de treinos para levantadores de peso e atletas de crossfit. Guarda séries, cargas e tempo de descanso, gera progressão automática e sugere ajustes com base no histórico.",
      focus:
        "Se o registo de uma sessão é rápido durante o treino e se os gráficos de progressão motivam a continuar.",
      reward: 1.0,
    },
    {
      id: "b3-rentwise",
      name: "RentWise — Gestão de Imóveis para Senhorios",
      category: "Imobiliário & Finanças",
      description:
        "Plataforma para senhorios que gerem vários imóveis. Controla contratos, recibos de renda, manutenções e comunicação com inquilinos, tudo num só lugar.",
      focus:
        "Se o painel central dá uma visão clara de todos os imóveis e se o fluxo de comunicação com inquilinos é prático.",
      reward: 1.1,
    },
    {
      id: "b3-cookdaily",
      name: "CookDaily — Planeador de Refeições Semanais",
      category: "Alimentação & Estilo de Vida",
      description:
        "App que sugere um plano de refeições semanal com base em preferências alimentares, gera a lista de compras automaticamente e calcula os valores nutricionais de cada refeição.",
      focus:
        "Se as sugestões de refeições parecem variadas e apetecíveis, e se a lista de compras gerada é realmente utilizável.",
      reward: 0.95,
    },
  ],

  // ── Batch 4 ─────────────────────────────────────────────────────────────
  [
    {
      id: "b4-evently",
      name: "Evently — Organização de Eventos Locais",
      category: "Eventos & Comunidade",
      description:
        "Plataforma para criar, divulgar e gerir eventos locais — desde festas de bairro a workshops profissionais. Tem venda de bilhetes integrada, lista de convidados e check-in digital.",
      focus:
        "Se criar um evento do zero é simples e se a página pública do evento convence as pessoas a inscreverem-se.",
      reward: 1.0,
    },
    {
      id: "b4-studymate",
      name: "StudyMate — Grupos de Estudo Online",
      category: "Educação & Colaboração",
      description:
        "App para formar grupos de estudo online em tempo real, com sala de vídeo, quadro branco partilhado e temporizador Pomodoro. Focado em universitários a preparar exames.",
      focus:
        "Se entrar numa sessão de estudo é rápido e sem fricção, e se as ferramentas colaborativas ajudam ou distraem.",
      reward: 1.05,
    },
    {
      id: "b4-freelink",
      name: "FreeLink — Portfólio para Freelancers",
      category: "Trabalho & Criatividade",
      description:
        "Plataforma que gera um portfólio profissional para freelancers em minutos, com página personalizável, integração com redes sociais e formulário de contacto direto com clientes.",
      focus:
        "Se o resultado final parece profissional o suficiente para ser enviado a um cliente e se o processo de criação é mesmo rápido.",
      reward: 1.0,
    },
    {
      id: "b4-mapride",
      name: "MapRide — Carpooling para o Trabalho",
      category: "Mobilidade & Sustentabilidade",
      description:
        "App de boleia para percursos diários ao trabalho. Liga colegas da mesma empresa ou bairro que fazem rotas parecidas, com divisão automática do custo da viagem.",
      focus:
        "Se encontrar uma boleia disponível parece fácil e seguro, e se a divisão de custos é transparente e justa.",
      reward: 0.9,
    },
  ],
];

// Flat list for backwards compatibility (landing page uses this)
export const PROJECTS: Project[] = PROJECT_BATCHES[0];

export const DAYS_BETWEEN_BATCHES = 15;
