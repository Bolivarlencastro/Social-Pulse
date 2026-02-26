
// Fix: Add missing constants USERS, CHANNELS, and CHANNELS_MAP with mock data.
import { User, Channel, Course, Post } from './types';

export const KONQUEST_DEFAULT_COVER_IMAGE = 'https://assets.keepsdev.com/images/placeholders/v2/pulse.png';

export const USERS: { [key: string]: User } = {
  'user-1': {
    id: 'user-1',
    name: 'Alice Johnson',
    avatarUrl: 'https://i.pravatar.cc/40?u=user-1',
    title: 'Desenvolvedora Frontend',
  },
  'user-2': {
    id: 'user-2',
    name: 'Bob Williams',
    avatarUrl: 'https://i.pravatar.cc/40?u=user-2',
    title: 'Designer de Produto',
  },
  'user-3': {
    id: 'user-3',
    name: 'Charlie Brown',
    avatarUrl: 'https://i.pravatar.cc/40?u=user-3',
    title: 'Gerente de Produto',
  },
  'user-4': { // The current user in some components
    id: 'user-4',
    name: 'Maria Fernanda',
    avatarUrl: 'https://i.pravatar.cc/40?u=leader',
    title: 'Líder de Vendas',
  },
};

export const CHANNELS: Channel[] = [
  {
    id: 'channel-1',
    name: 'Desenvolvimento Frontend',
    category: 'Tecnologia',
    description: 'Um canal para discutir as últimas tecnologias e frameworks do mundo frontend. React, Vue, Svelte e mais!',
    imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=400&auto=format&fit=crop',
    isSubscribed: true,
    ownerId: 'user-4',
  },
  {
    id: 'channel-2',
    name: 'Design de UI/UX',
    category: 'Design',
    description: 'Compartilhe suas criações, peça feedback e discuta as melhores práticas de design de interface e experiência do usuário.',
    imageUrl: '',
    isSubscribed: false,
    ownerId: 'user-2',
  },
  {
    id: 'channel-3',
    name: 'Gestão de Produtos',
    category: 'Gestão',
    description: 'Tudo sobre roadmaps, priorização, métricas e o dia a dia de um gerente de produtos. Junte-se à conversa!',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=400&auto=format&fit=crop',
    isSubscribed: true,
    ownerId: 'user-3',
  },
    {
    id: 'channel-4',
    name: 'Fotografia Amadora',
    category: 'Criatividade',
    description: 'Um espaço para entusiastas da fotografia compartilharem suas melhores fotos, dicas de equipamento e técnicas de edição.',
    imageUrl: 'https://images.unsplash.com/photo-1510127034890-ba27e08285ff?q=80&w=400&auto=format&fit=crop',
    isSubscribed: false,
    ownerId: 'user-4',
  },
  {
    id: 'channel-5',
    name: 'Receitas Rápidas',
    category: 'Lifestyle',
    description: 'Cansado de cozinhar? Aqui compartilhamos receitas deliciosas e fáceis para o dia a dia. Bom apetite!',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17025?q=80&w=400&auto=format&fit=crop',
    isSubscribed: true,
    ownerId: 'user-1',
  },
   {
    id: 'channel-6',
    name: 'Dicas de Viagem',
    category: 'Lifestyle',
    description: 'Planejando sua próxima aventura? Encontre roteiros, dicas de economia e histórias inspiradoras de viajantes.',
    imageUrl: 'https://invalid.localhost/broken-channel-cover.jpg',
    isSubscribed: false,
    ownerId: 'user-4',
  },
];

export const CHANNELS_MAP: { [key: string]: Channel } = CHANNELS.reduce((acc, channel) => {
  acc[channel.id] = channel;
  return acc;
}, {} as { [key: string]: Channel });

export const POSTS: Post[] = [
  {
    id: 'post-1',
    userId: 'user-1',
    channelId: 'channel-1',
    contentType: 'IMAGE',
    text: 'Imagem de destaque do canal com boas praticas de frontend. Neste pulse reunimos um passo a passo completo para estruturar componentes reutilizaveis, organizar tokens visuais, padronizar estados de carregamento e erro, e melhorar consistencia entre telas web e mobile. Tambem incluimos exemplos de acessibilidade, performance e governanca de design system para times distribuidos.',
    timestamp: '2 horas atrás',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
    mediaLayout: 'horizontal',
    rating: 4.6,
    ratingVotes: 48,
    userRating: 0,
    likes: 42,
    commentCount: 2,
    isLiked: false,
    isBookmarked: true,
    comments: [
      { id: 'c1', userId: 'user-2', text: 'Excelente conteúdo! Já estou aplicando algumas dicas no meu projeto atual.', timestamp: '1 hora atrás' },
      { id: 'c2', userId: 'user-1', text: 'Que bom que ajudou, Bob!', timestamp: '45 min atrás', parentId: 'c1' }
    ]
  },
  {
    id: 'post-2',
    userId: 'user-3',
    channelId: 'channel-3',
    contentType: 'VIDEO',
    text: 'Video via embed do YouTube com uma visao detalhada sobre estrategia de produto orientada a descoberta continua. O conteudo apresenta tecnicas de entrevistas, mapeamento de dores, metricas de impacto e um framework pratico para priorizacao entre oportunidades de curto e longo prazo.',
    timestamp: '5 horas atrás',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    embed: {
      provider: 'youtube',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    mediaLayout: 'horizontal',
    rating: 4.2,
    ratingVotes: 19,
    userRating: 0,
    likes: 15,
    commentCount: 0,
    isLiked: true,
    comments: []
  },
  {
    id: 'post-3',
    userId: 'user-2',
    channelId: 'channel-2',
    contentType: 'VIDEO',
    text: 'Video via embed do Vimeo mostrando um estudo de caso completo de rebrand em ambiente corporativo. A apresentacao cobre contexto, decisoes de narrativa, criterios visuais, alinhamento entre squads e os aprendizados apos o rollout com monitoramento de percepcao e engajamento.',
    timestamp: 'Ontem',
    imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=800&auto=format&fit=crop',
    embed: {
      provider: 'vimeo',
      embedUrl: 'https://player.vimeo.com/video/76979871',
    },
    rating: 4.8,
    ratingVotes: 132,
    userRating: 0,
    likes: 128,
    commentCount: 5,
    isLiked: false,
    comments: []
  },
  {
    id: 'post-4',
    userId: 'user-4',
    channelId: 'channel-1',
    contentType: 'VIDEO',
    text: 'Video enviado pelo admin (upload) para treinamento operacional de onboarding. O material detalha rituais de acompanhamento, checkpoints de 30/60/90 dias, padroes de feedback e indicadores que ajudam liderancas a reduzir tempo de rampa e aumentar retencao nas primeiras semanas.',
    timestamp: 'Ontem',
    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop',
    mediaUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    mediaLayout: 'vertical',
    rating: 3.9,
    ratingVotes: 10,
    userRating: 0,
    likes: 9,
    commentCount: 1,
    isLiked: false,
    comments: []
  },
  {
    id: 'post-5',
    userId: 'user-1',
    channelId: 'channel-5',
    contentType: 'PODCAST',
    text: 'Episodio em audio para ouvir no feed com uma conversa aprofundada sobre cultura de aprendizagem continua. O episodio aborda como transformar conhecimento tacito em ativos reutilizaveis, como incentivar colaboracao entre areas e como medir resultado real de iniciativas educacionais.',
    timestamp: '2 dias atrás',
    imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800&auto=format&fit=crop',
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    rating: 4.4,
    ratingVotes: 34,
    userRating: 0,
    likes: 31,
    commentCount: 2,
    isLiked: false,
    comments: []
  },
  {
    id: 'post-6',
    userId: 'user-2',
    channelId: 'channel-3',
    contentType: 'PDF',
    text: 'Documento PDF para leitura completa com diretrizes de governanca, papeis e responsabilidades no ciclo de conteudo. O material traz checklist de qualidade editorial, padroes de versionamento, fluxos de aprovacao e recomendacoes para manter rastreabilidade de alteracoes.',
    timestamp: '2 dias atrás',
    imageUrl: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=800&auto=format&fit=crop',
    embed: {
      provider: 'pdf',
      embedUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    rating: 4.1,
    ratingVotes: 21,
    userRating: 0,
    likes: 18,
    commentCount: 0,
    isLiked: false,
    comments: []
  },
  {
    id: 'post-7',
    userId: 'user-3',
    channelId: 'channel-2',
    contentType: 'SPREADSHEET',
    text: 'Planilha compartilhada para acompanhamento de metricas de adocao e engajamento por canal. O arquivo contempla segmentacao por perfil, comparativo por periodo, consolidacao de avaliacoes e um bloco de insights para apoiar tomadas de decisao com base em evidencias.',
    timestamp: '3 dias atrás',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    embed: {
      provider: 'google_sheets',
      embedUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5oWQ7m3s3PjN7iW2CqkqYvXf9QW4VZ0Sy3xM/pubhtml?widget=true&headers=false',
    },
    rating: 3.8,
    ratingVotes: 15,
    userRating: 0,
    likes: 14,
    commentCount: 1,
    isLiked: false,
    comments: []
  },
  {
    id: 'post-8',
    userId: 'user-4',
    channelId: 'channel-3',
    contentType: 'TEXT',
    text: 'Documento de texto (Google Docs) com orientacoes detalhadas do processo ponta a ponta. Inclui objetivo, escopo, premissas, riscos, criterios de aceite e exemplos de comunicacao para facilitar a execucao alinhada entre produto, operacoes e liderancas.',
    timestamp: '3 dias atrás',
    embed: {
      provider: 'google_docs',
      embedUrl: 'https://docs.google.com/document/d/e/2PACX-1vQfC1E9VQ9rYq8w5g0R1xQx7hTnV9O3w/pub?embedded=true',
    },
    rating: 4.0,
    ratingVotes: 12,
    userRating: 0,
    likes: 11,
    commentCount: 0,
    isLiked: false,
    comments: []
  },
  {
    id: 'post-9',
    userId: 'user-1',
    channelId: 'channel-2',
    contentType: 'PRESENTATION',
    text: 'Apresentacao de roadmap (Google Slides) com macrovisao trimestral e detalhamento das frentes prioritarias. O deck explica dependencias, marcos de entrega, capacidade estimada por squad e mecanismos de acompanhamento para reduzir desvios de prazo e escopo.',
    timestamp: '4 dias atrás',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop',
    embed: {
      provider: 'google_slides',
      embedUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vRZ3x7w6u8Qj3B0q3Yk4w/pubembed?start=false&loop=false&delayms=3000',
    },
    rating: 4.7,
    ratingVotes: 29,
    userRating: 0,
    likes: 27,
    commentCount: 3,
    isLiked: true,
    comments: []
  },
  {
    id: 'post-10',
    userId: 'user-2',
    channelId: 'channel-1',
    contentType: 'QUIZ',
    text: 'Questionario rapido para validar entendimento dos conceitos abordados na trilha. As perguntas foram desenhadas para medir compreensao pratica, identificar lacunas e direcionar recomendacoes de conteudo complementar conforme o desempenho individual.',
    timestamp: '4 dias atrás',
    rating: 4.3,
    ratingVotes: 23,
    userRating: 0,
    likes: 22,
    commentCount: 1,
    isLiked: false,
    comments: []
  },
  {
    id: 'post-11',
    userId: 'user-3',
    channelId: 'channel-4',
    contentType: 'H5P',
    text: 'Experiencia interativa em H5P com atividades de exploracao guiada, checkpoints de conhecimento e feedback imediato. O objetivo e aumentar retencao por meio de interacao progressiva, alternando explicacoes curtas com desafios aplicados ao contexto real do time.',
    timestamp: '5 dias atrás',
    embed: {
      provider: 'h5p',
      embedUrl: 'https://h5p.org/h5p/embed/127',
    },
    rating: 3.7,
    ratingVotes: 9,
    userRating: 0,
    likes: 8,
    commentCount: 0,
    isLiked: false,
    comments: []
  },
  {
    id: 'post-12',
    userId: 'user-4',
    channelId: 'channel-6',
    contentType: 'GENIALLY',
    text: 'Conteudo interativo publicado no Genially com narrativa visual para comunicacao de estrategia, indicadores e iniciativas em andamento. A experiencia combina camadas navegaveis, destaques contextuais e trilhas de aprofundamento para diferentes perfis de audiencia.',
    timestamp: '5 dias atrás',
    imageUrl: 'https://invalid.localhost/broken-pulse-cover.jpg',
    embed: {
      provider: 'genially',
      embedUrl: 'https://view.genial.ly/5e7b6f0d2f2d6d0d9b4b8e3d',
    },
    rating: 4.5,
    ratingVotes: 25,
    userRating: 0,
    likes: 19,
    commentCount: 2,
    isLiked: false,
    comments: []
  },
  {
    id: 'post-13',
    userId: 'user-2',
    channelId: 'channel-5',
    contentType: 'IMAGE',
    text: 'Exemplo de pulse de imagem em formato vertical para validar diferentes proporcoes no feed social e testar a leitura visual em telas menores.',
    timestamp: '6 dias atrás',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
    mediaLayout: 'vertical',
    rating: 4.1,
    ratingVotes: 17,
    userRating: 0,
    likes: 13,
    commentCount: 0,
    isLiked: false,
    comments: []
  }
];

const specificCourses: Course[] = [
    { id: '1', thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=40&auto=format&fit=crop', name: 'Teste videos', owner: 'Super Admin', category: 'Design', creationDate: '26/06/2024', duration: '1 h 48 min', enrolled: 45, finished: 18, status: 'Publicado' },
    { id: '2', thumbnailUrl: '', name: 'TESTE 2', owner: 'Super Admin', category: 'Communications', creationDate: '02/07/2025', duration: '10 s', enrolled: 3, finished: 1, status: 'Publicado' },
    { id: '3', thumbnailUrl: '', name: 'new course', owner: 'Admin testerSTAGE', category: 'Communications', creationDate: '09/03/2023', duration: '--.--', enrolled: 0, finished: 0, status: 'Em Criação' },
    { id: '4', thumbnailUrl: '', name: 'course test 200224', owner: 'Admin testerSTAGE', category: 'Development', creationDate: '20/02/2024', duration: '--.--', enrolled: 0, finished: 0, status: 'Em Criação' },
    { id: '5', thumbnailUrl: '', name: 'aasdasd', owner: 'Bolivar', category: 'Communications', creationDate: '03/03/2023', duration: '28 min', enrolled: 0, finished: 0, status: 'Publicado' },
    { id: '6', thumbnailUrl: 'icon', name: 'fdg', owner: 'Super Admin', category: 'Entrepreneurship', creationDate: '12/09/2025', duration: '--.--', enrolled: 0, finished: 0, status: 'Em Criação' },
    { id: '7', thumbnailUrl: '', name: 'Curso conteúdo PDF pesado', owner: 'Super Admin', category: 'Design', creationDate: '03/08/2023', duration: '14 h 12 min', enrolled: 2, finished: 0, status: 'Publicado' },
    { id: '8', thumbnailUrl: '', name: 'teste short youtube', owner: 'Lucas Oliveira', category: 'Communications', creationDate: '28/03/2025', duration: '--.--', enrolled: 0, finished: 0, status: 'Em Criação' },
    { id: '9', thumbnailUrl: '', name: 'dfdgergerger', owner: 'Super Admin', category: 'Communications', creationDate: '13/12/2023', duration: '--.--', enrolled: 0, finished: 0, status: 'Em Criação' },
    { id: '10', thumbnailUrl: 'logo', name: 'Test 888', owner: 'Super Admin', category: 'Entrepreneurship', creationDate: '23/02/2024', duration: '--.--', enrolled: 0, finished: 0, status: 'Em Criação' },
];

const sampleCourseTemplates = [
    { name: 'Introdução ao Marketing Digital', category: 'Marketing', status: 'Publicado' as const },
    { name: 'Gestão de Projetos com Scrum', category: 'Development', status: 'Em Criação' as const },
    { name: 'Design Thinking para Inovação', category: 'Design', status: 'Publicado' as const },
    { name: 'Comunicação Interpessoal', category: 'Communications', status: 'Em Criação' as const },
    { name: 'Fundamentos de Finanças', category: 'Entrepreneurship', status: 'Publicado' as const },
];

const owners = ['Super Admin', 'Admin testerSTAGE', 'Bolivar', 'Lucas Oliveira', 'Maria Fernanda'];

const generatedCourses: Course[] = Array.from({ length: 111 }, (_, i) => {
    const template = sampleCourseTemplates[i % sampleCourseTemplates.length];
    const owner = owners[i % owners.length];
    const creation = new Date(Date.now() - Math.random() * 3e10); // Random date in the last year
    return {
        id: (i + 11).toString(),
        thumbnailUrl: i % 7 === 0 ? `https://picsum.photos/seed/${i}/40/40` : '',
        name: `${template.name} v${Math.floor(i / 5) + 1.0}`,
        owner: owner,
        category: template.category,
        creationDate: creation.toLocaleDateString('pt-BR'),
        duration: `${Math.floor(Math.random() * 3)} h ${Math.floor(Math.random() * 60)} min`,
        enrolled: Math.floor(Math.random() * 200),
        finished: Math.floor(Math.random() * 150),
        status: template.status,
    };
});


export const COURSES: Course[] = [...specificCourses, ...generatedCourses];
