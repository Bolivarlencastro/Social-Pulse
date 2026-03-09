import { Story, StoryMapData } from './types';

const createStory = (id: string, title: string, details: string[]): Story => ({
  id,
  title,
  details: details.map((text, index) => ({
    text,
    checked: true,
    link: undefined,
  })),
});

export const PRODUCT_REQUIREMENTS_DATA: StoryMapData = {
  title: 'Documento de Requisitos de Produto (PRD) - Módulo Social "Pulses"',
  activities: [
    { id: 'visao-geral', title: 'Visão Geral', subtitle: 'Objetivo e posicionamento do módulo social' },
    { id: 'perfis', title: 'Perfis de Usuário', subtitle: 'Permissões por papel no produto' },
    { id: 'feed-social', title: 'Feed Social', subtitle: 'Timeline, grid e carregamento contínuo' },
    { id: 'descoberta', title: 'Descoberta e Navegação', subtitle: 'Canais, descoberta lateral e filtros' },
    { id: 'interacao', title: 'Interação com o Pulse', subtitle: 'Consumo, comentários, favoritos e avaliação' },
    { id: 'mobile', title: 'Experiência Mobile', subtitle: 'Fluxo simplificado para dispositivos móveis' },
    { id: 'gestao', title: 'Gestão', subtitle: 'Escala administrativa e gestão de conteúdo' },
  ],
  releases: [
    { id: 'base', title: 'Base' },
    { id: 'funcional', title: 'Requisitos Funcionais' },
    { id: 'ajustes', title: 'Ajustes do Protótipo' },
  ],
  stories: {
    base: {
      'visao-geral': [
        createStory('prd-visao-geral-objetivo', 'Objetivo do módulo', [
          'Transformar a distribuição de conteúdo em uma experiência social semelhante a uma rede social corporativa ou de comunidade.',
          'Aumentar o consumo de conteúdo, promover interação entre usuários e centralizar a comunicação em canais temáticos.',
          'Substituir feeds estáticos por uma timeline dinâmica e interativa.',
        ]),
      ],
      perfis: [
        createStory('prd-perfis-consumidor', 'Usuário padrão (consumidor)', [
          'Pode visualizar o feed, filtrar conteúdo, inscrever-se e cancelar inscrição em canais.',
          'Pode avaliar, comentar, favoritar pulses e visualizar perfis de outros usuários.',
          'Não pode criar canais ou pulses, exceto quando for proprietário de um canal.',
        ]),
        createStory('prd-perfis-admin', 'Administrador / proprietário do canal', [
          'Possui todas as permissões do usuário padrão.',
          'Pode criar e gerenciar canais.',
          'Pode criar, editar e excluir pulses dentro dos canais que gerencia.',
          'Tem acesso à área administrativa para gerenciar conteúdo em escala.',
        ]),
      ],
    },
    funcional: {
      'feed-social': [
        createStory('prd-feed-agregado', 'Feed principal agregado', [
          'Exibir pulses de todos os canais em que o usuário está inscrito e de canais abertos.',
        ]),
        createStory('prd-feed-modos', 'Alternância de visualização', [
          'Permitir alternância entre layout Timeline (detalhado) e Grid (compacto).',
        ]),
        createStory('prd-feed-scroll', 'Infinite scroll', [
          'Carregar mais conteúdo automaticamente à medida que o usuário rola a página.',
        ]),
      ],
      descoberta: [
        createStory('prd-descoberta-canais', 'Navegação por canais', [
          'Exibir "Criados por Mim" e "Inscritos" na barra lateral esquerda para acesso rápido.',
          'Ao clicar em um canal, filtrar o feed central para mostrar apenas pulses daquele canal.',
          'Disponibilizar uma página de "Canais" com todos os canais da plataforma e ação de inscrição.',
        ]),
        createStory('prd-descoberta-widgets', 'Descoberta lateral', [
          'Mostrar widgets fixos na coluna da direita, como "Pulses em Destaque" e "Pulses Favoritos".',
        ]),
        createStory('prd-descoberta-filtros', 'Filtragem de conteúdo', [
          'Permitir filtros por Geral, Idioma, Tipo de Mídia e Categoria.',
          'Aplicar filtros imediatamente no feed com indicação visual clara do estado ativo.',
        ]),
      ],
      interacao: [
        createStory('prd-interacao-lightbox', 'Lightbox de consumo', [
          'Abrir qualquer pulse do feed em uma visualização de lightbox para consumo focado.',
          'Permitir visualizar mídia, descrição completa, comentários e navegação entre pulses.',
        ]),
        createStory('prd-interacao-acoes', 'Ações dentro do pulse', [
          'Adicionar comentário, avaliar em até 5 estrelas e favoritar/salvar para leitura posterior.',
          'Compartilhar o pulse e navegar para o anterior ou seguinte no contexto do feed.',
        ]),
        createStory('prd-interacao-comentar', 'Atalho para comentário', [
          'O clique no ícone de comentário do card deve abrir o lightbox com o campo de comentário em foco.',
        ]),
      ],
      mobile: [
        createStory('prd-mobile-feed', 'Interface mobile simplificada', [
          'Priorizar o feed como interface principal.',
          'Permitir alternância entre Feed e Canais por abas.',
          'Permitir alternância entre Timeline e Grid no mobile.',
        ]),
        createStory('prd-mobile-lightbox', 'Consumo em tela cheia', [
          'Abrir pulses em tela cheia otimizada para dispositivos móveis.',
          'Manter interações de comentar, avaliar e navegar no fluxo mobile.',
        ]),
      ],
      gestao: [
        createStory('prd-gestao-canais', 'Lista administrativa de canais', [
          'Exibir tabela com categoria, criador, número de pulses e inscritos.',
        ]),
        createStory('prd-gestao-acoes', 'Ações administrativas', [
          'Permitir Visualizar, Editar, Inativar e Excluir canais a partir da lista.',
        ]),
        createStory('prd-gestao-pulses', 'Detalhe do canal na gestão', [
          'Ao clicar em um canal, exibir lista detalhada dos pulses com formato, autor, rating e data de publicação.',
          'Na lista de pulses, o clique na linha deve abrir o pulse em lightbox para inspeção rápida.',
          'O menu de ações do pulse deve incluir a opção de Visualizar pulse além das ações de gestão.',
        ]),
      ],
    },
    ajustes: {
      descoberta: [
        createStory('prd-ajustes-filtro', 'Correção de filtros', [
          'Garantir atualização imediata do feed quando qualquer filtro da barra lateral for alterado.',
          'Destacar visualmente o filtro aplicado com chip ou estado ativo equivalente.',
        ]),
      ],
    },
  },
};

export const DESIGN_REQUIREMENTS_DATA: StoryMapData = {
  title: 'Documento de Requisitos de Design (DRD) - Módulo Social "Pulses"',
  activities: [
    { id: 'layout-desktop', title: 'Layout Desktop', subtitle: 'Arquitetura em 3 colunas' },
    { id: 'layout-mobile', title: 'Layout Mobile', subtitle: 'Feed como foco primário' },
    { id: 'pulse-timeline', title: 'Card de Pulse / Timeline', subtitle: 'Cabeçalho, conteúdo e ações' },
    { id: 'pulse-grid', title: 'Card de Pulse / Grid', subtitle: 'Versão compacta orientada a visual' },
    { id: 'card-canal', title: 'Card de Canal', subtitle: 'Capa 1:1, metadados e CTA' },
    { id: 'lightbox', title: 'Lightbox', subtitle: 'Consumo focado em desktop e mobile' },
    { id: 'ux', title: 'Interação e UX', subtitle: 'Feedback, animações e consistência' },
    { id: 'edge-cases', title: 'Edge Cases', subtitle: 'Estados vazios e fallbacks visuais' },
  ],
  releases: [
    { id: 'estrutura', title: 'Estrutura' },
    { id: 'componentes', title: 'Componentes' },
    { id: 'comportamento', title: 'Comportamento' },
  ],
  stories: {
    estrutura: {
      'layout-desktop': [
        createStory('drd-layout-desktop-colunas', 'Layout de 3 colunas', [
          'Coluna esquerda fixa com navegação principal, canais do usuário e painel de filtros.',
          'Coluna central para feed de pulses ou lista de canais.',
          'Coluna direita para widgets de descoberta como "Pulses em Destaque" e "Pulses Favoritos".',
        ]),
      ],
      'layout-mobile': [
        createStory('drd-layout-mobile-base', 'Layout mobile de aba única', [
          'Feed como interface principal.',
          'Abas superiores para alternar entre Feed e Canais.',
          'Filtros acessíveis por ícone com painel ou modal.',
        ]),
      ],
      lightbox: [
        createStory('drd-lightbox-layout', 'Estrutura do lightbox', [
          'Desktop em duas colunas: mídia à esquerda e painel de informações/comentários à direita.',
          'Mobile em tela cheia com mídia na parte superior e detalhes abaixo em área rolável.',
        ]),
      ],
    },
    componentes: {
      'pulse-timeline': [
        createStory('drd-pulse-timeline-header', 'Estrutura do card em timeline', [
          'Cabeçalho com avatar, nome do autor, nome do canal e data/hora.',
          'Conteúdo com preview da mídia e ícone de play central pulsante para vídeos e áudios.',
          'Corpo com título do pulse e prévia truncada da descrição com "Ver mais".',
          'Rodapé com ações de avaliar, comentar, compartilhar e salvar/favoritar.',
        ]),
      ],
      'pulse-grid': [
        createStory('drd-pulse-grid-compacto', 'Estrutura do card em grid', [
          'Versão compacta e visualmente focada na capa.',
          'Overlay gradiente inferior com título truncado e ícones de metadados como tipo e duração.',
        ]),
      ],
      'card-canal': [
        createStory('drd-card-canal-estrutura', 'Estrutura do card de canal', [
          'Imagem de capa em aspect ratio 1:1.',
          'Exibir título, categoria, número de pulses, número de inscritos e botão de inscrição.',
        ]),
      ],
      lightbox: [
        createStory('drd-lightbox-controles', 'Controles do lightbox', [
          'Permitir recolher o painel direito para foco na mídia.',
          'Exibir navegação clara para pulse anterior e seguinte.',
        ]),
      ],
    },
    comportamento: {
      'layout-mobile': [
        createStory('drd-layout-mobile-toggles', 'Controles mobile', [
          'Manter alternância entre Timeline e Grid disponível também no mobile.',
        ]),
      ],
      ux: [
        createStory('drd-ux-feedback', 'Feedback visual', [
          'Estados hover claros em todos os elementos clicáveis.',
          'Estado ativo distinto para filtros selecionados.',
          'Feedback instantâneo para ações como favoritar e inscrever-se.',
        ]),
        createStory('drd-ux-animacoes', 'Animações e transições', [
          'Ícone de play com animação pulsante sutil em vídeo/áudio.',
          'Abertura suave do lightbox com fade-in ou scale-up.',
          'Transição animada entre Timeline e Grid.',
        ]),
        createStory('drd-ux-correcoes', 'Correções e melhorias', [
          'Garantir que filtros atualizem o feed imediatamente.',
          'Padronizar comentários para ocorrerem dentro do lightbox.',
          'Validar truncamento elegante de títulos e descrições longos sem quebrar o layout.',
        ]),
        createStory('drd-ux-gestao-acoes', 'Gestão com atalhos de visualização', [
          'O dropdown de ações na lista de canais deve incluir "Visualizar canal" como atalho coerente com o clique da linha.',
          'O dropdown de ações na lista de pulses deve incluir "Visualizar pulse" como atalho para a lightbox.',
          'A linha de pulse na gestão deve manter affordance de clique para abrir a visualização detalhada.',
        ]),
      ],
      'edge-cases': [
        createStory('drd-edge-cases-vazios', 'Estados vazios e fallback', [
          'Feed vazio deve orientar o usuário a descobrir canais com mensagem amigável e ícone.',
          'Canal sem pulses deve exibir empty state na aba "Pulses".',
          'Conteúdo sem capa deve usar fallback visual padrão com consistência de layout.',
        ]),
      ],
    },
  },
};
