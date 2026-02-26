import React, { useMemo, useState } from 'react';
import { Icon } from '../Icon';
import { Pagination } from '../courses/Pagination';
import { CHANNELS, POSTS, USERS, COURSES, KONQUEST_DEFAULT_COVER_IMAGE } from '../../constants';
import { Post } from '../../types';

type ManagementTab = 'pulses' | 'courses' | 'events' | 'trails';

type GenericRow = {
  id: string;
  name: string;
  creator: string;
  category: string;
  typeLabel: string;
  creationDate: string;
  duration: string;
  metric: number;
  status: string;
};

type PulseRow = {
  id: string;
  channelId: string;
  contentType: string;
  title: string;
  authorName: string;
  rating: number;
  commentCount: number;
  timestamp: string;
  isMock?: boolean;
};

type ActionMenuState = {
  kind: 'channel' | 'pulse';
  id: string;
  x: number;
  y: number;
} | null;

const ITEMS_PER_PAGE = 10;
const headerCellClass = 'h-14 px-6 text-left text-sm font-medium text-gray-600 whitespace-nowrap';
const bodyCellClass = 'h-[72px] px-6 text-sm text-gray-700 whitespace-nowrap';
const statusChipClass = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold';
const LEFT_GUTTER = 'pl-6';
const ICON_SLOT = 'w-10 h-10 inline-flex items-center justify-center';
const SUPPORTED_PULSE_TYPES = ['VIDEO', 'IMAGE', 'PDF', 'PODCAST', 'SPREADSHEET', 'TEXT', 'PRESENTATION', 'QUIZ', 'H5P', 'GENIALLY'] as const;

const pulseTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    VIDEO: 'videocam',
    IMAGE: 'image',
    PDF: 'picture_as_pdf',
    PODCAST: 'audiotrack',
    AUDIO: 'audiotrack',
    SPREADSHEET: 'table_view',
    TEXT: 'article',
    PRESENTATION: 'slideshow',
    QUIZ: 'quiz',
    QUESTION: 'quiz',
    H5P: 'extension',
    GENIALLY: 'auto_awesome',
  };
  return icons[type] || 'description';
};

const tabs: Array<{ id: ManagementTab; label: string; icon: string }> = [
  { id: 'courses', label: 'Cursos', icon: 'school' },
  { id: 'events', label: 'Eventos', icon: 'calendar_month' },
  { id: 'trails', label: 'Trilhas', icon: 'conversion_path' },
  { id: 'pulses', label: 'Pulses', icon: 'bolt' },
];

const formatContentType = (type: string): string => {
  const map: Record<string, string> = {
    IMAGE: 'Imagem',
    VIDEO: 'Video',
    PODCAST: 'Audio',
    AUDIO: 'Audio',
    PDF: 'PDF',
    SPREADSHEET: 'Planilha',
    TEXT: 'Texto',
    PRESENTATION: 'Apresentacao',
    QUIZ: 'Quiz',
    QUESTION: 'Quiz',
    H5P: 'H5P',
    GENIALLY: 'Genially',
  };
  return map[type] || type;
};

const pulseTitle = (text: string): string => {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return 'Pulse sem titulo';
  return normalized.length > 72 ? `${normalized.slice(0, 72)}...` : normalized;
};

const buildGenericRows = (tab: Exclude<ManagementTab, 'pulses'>): GenericRow[] =>
  COURSES.map((course) => ({
    id: `${tab}-${course.id}`,
    name: tab === 'courses' ? course.name : tab === 'events' ? `Evento ${course.name}` : `Trilha ${course.name}`,
    creator: course.owner,
    category: course.category,
    typeLabel: tab === 'courses' ? 'Curso' : tab === 'events' ? 'Evento' : 'Trilha',
    creationDate: course.creationDate,
    duration: course.duration,
    metric: tab === 'trails' ? Math.max(1, Math.floor(course.enrolled / 3)) : course.enrolled,
    status: course.status,
  }));

export const ContentManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ManagementTab>('pulses');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const [managedChannels, setManagedChannels] = useState(() => CHANNELS.map((channel) => ({ ...channel, isActive: channel.isActive ?? true })));
  const [managedPosts, setManagedPosts] = useState(() => POSTS.map((post) => ({ ...post, isActive: post.isActive ?? true })));
  const [openActionMenu, setOpenActionMenu] = useState<ActionMenuState>(null);
  const [activePulseId, setActivePulseId] = useState<string | null>(null);
  const [isLightboxSidebarCollapsed, setIsLightboxSidebarCollapsed] = useState(false);
  const [isLightboxDescriptionExpanded, setIsLightboxDescriptionExpanded] = useState(false);
  const [isLightboxRatingMenuOpen, setIsLightboxRatingMenuOpen] = useState(false);
  const [lightboxCommentText, setLightboxCommentText] = useState('');
  const [lightboxActionToastMessage, setLightboxActionToastMessage] = useState<string | null>(null);
  const lightboxRatingMenuRef = React.useRef<HTMLDivElement | null>(null);
  const lightboxCommentInputRef = React.useRef<HTMLInputElement | null>(null);

  const activeChannels = useMemo(
    () => managedChannels,
    [managedChannels]
  );

  const selectedChannel = useMemo(
    () => activeChannels.find((channel) => channel.id === selectedChannelId) ?? null,
    [activeChannels, selectedChannelId]
  );

  const activePulse = useMemo<Post | null>(
    () => managedPosts.find((post) => post.id === activePulseId) ?? null,
    [activePulseId, managedPosts]
  );

  const activeChannelPulses = useMemo(
    () =>
      managedPosts.filter((post) => {
        if (!selectedChannelId) return false;
        return post.channelId === selectedChannelId && post.isActive !== false;
      }),
    [managedPosts, selectedChannelId]
  );

  const activePulseIndex = useMemo(
    () => (activePulseId ? activeChannelPulses.findIndex((post) => post.id === activePulseId) : -1),
    [activeChannelPulses, activePulseId]
  );

  const hasPreviousPulse = activePulseIndex > 0;
  const hasNextPulse = activePulseIndex >= 0 && activePulseIndex < activeChannelPulses.length - 1;

  const genericRows = useMemo(() => {
    if (activeTab === 'pulses') return [];
    const normalized = searchTerm.trim().toLowerCase();
    return buildGenericRows(activeTab).filter((row) => {
      if (!normalized) return true;
      return (
        row.name.toLowerCase().includes(normalized) ||
        row.creator.toLowerCase().includes(normalized) ||
        row.category.toLowerCase().includes(normalized)
      );
    });
  }, [activeTab, searchTerm]);

  const channelsRows = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    return activeChannels
      .map((channel) => {
        const ownerName = channel.ownerId ? USERS[channel.ownerId]?.name || 'Usuario' : 'Usuario';
        const pulseCount = managedPosts.filter((post) => post.channelId === channel.id && post.isActive !== false).length;
        return {
          ...channel,
          ownerName,
          pulseCount,
          subscriberCount: channel.isSubscribed ? 1 : 0,
        };
      })
      .filter((channel) => {
        if (!normalized) return true;
        return (
          channel.name.toLowerCase().includes(normalized) ||
          (channel.category || '').toLowerCase().includes(normalized) ||
          channel.ownerName.toLowerCase().includes(normalized)
        );
      });
  }, [activeChannels, managedPosts, searchTerm]);

  const pulsesRows = useMemo<PulseRow[]>(() => {
    if (!selectedChannelId) return [];
    const normalized = searchTerm.trim().toLowerCase();

    const channelRows: PulseRow[] = managedPosts.filter((post) => post.channelId === selectedChannelId && post.isActive !== false)
      .map((post) => ({
        id: post.id,
        channelId: post.channelId,
        contentType: post.contentType === 'QUESTION' ? 'QUIZ' : post.contentType,
        authorName: USERS[post.userId]?.name || 'Usuario',
        title: pulseTitle(post.text),
        rating: post.rating,
        commentCount: post.commentCount,
        timestamp: post.timestamp,
      }));

    const existingTypes = new Set(channelRows.map((row) => row.contentType));
    const missingTypeRows: PulseRow[] = SUPPORTED_PULSE_TYPES
      .filter((type) => !existingTypes.has(type))
      .map((type) => ({
        id: `mock-${selectedChannelId}-${type}`,
        channelId: selectedChannelId,
        contentType: type,
        title: `Exemplo de pulse ${formatContentType(type)}`,
        authorName: 'Sistema',
        rating: 0,
        commentCount: 0,
        timestamp: 'Agora',
        isMock: true,
      }));

    return [...channelRows, ...missingTypeRows]
      .filter((post) => {
        if (!normalized) return true;
        return (
          post.title.toLowerCase().includes(normalized) ||
          post.authorName.toLowerCase().includes(normalized) ||
          formatContentType(post.contentType).toLowerCase().includes(normalized)
        );
      });
  }, [managedPosts, searchTerm, selectedChannelId]);

  const selectedChannelPublishedPulsesCount = useMemo(() => {
    if (!selectedChannelId) return 0;
    return managedPosts.filter((post) => post.channelId === selectedChannelId && post.isActive !== false).length;
  }, [managedPosts, selectedChannelId]);

  const currentRows =
    activeTab === 'pulses' ? (selectedChannelId ? pulsesRows : channelsRows) : genericRows;
  const isChannelManagementView = activeTab === 'pulses' && !!selectedChannelId;

  const totalPages = Math.max(1, Math.ceil(currentRows.length / itemsPerPage));

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return currentRows.slice(start, start + itemsPerPage);
  }, [currentPage, currentRows, itemsPerPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, selectedChannelId, itemsPerPage]);

  React.useEffect(() => {
    if (activeTab !== 'pulses' && selectedChannelId) {
      setSelectedChannelId(null);
    }
  }, [activeTab, selectedChannelId]);

  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-action-menu]') && !target.closest('[data-action-menu-panel]')) {
        setOpenActionMenu(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  React.useEffect(() => {
    if (!activePulseId) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActivePulseId(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePulseId]);

  React.useEffect(() => {
    const onOutsideClick = (event: MouseEvent) => {
      if (!isLightboxRatingMenuOpen) return;
      const target = event.target as Node;
      if (lightboxRatingMenuRef.current && !lightboxRatingMenuRef.current.contains(target)) {
        setIsLightboxRatingMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutsideClick);
    return () => document.removeEventListener('mousedown', onOutsideClick);
  }, [isLightboxRatingMenuOpen]);

  React.useEffect(() => {
    if (!lightboxActionToastMessage) return;
    const timeout = window.setTimeout(() => setLightboxActionToastMessage(null), 2200);
    return () => window.clearTimeout(timeout);
  }, [lightboxActionToastMessage]);

  React.useEffect(() => {
    if (!activePulseId) return;
    setIsLightboxSidebarCollapsed(false);
    setIsLightboxDescriptionExpanded(false);
    setIsLightboxRatingMenuOpen(false);
    setLightboxCommentText('');
  }, [activePulseId]);

  const handleEditChannel = (channelId: string) => {
    const channel = managedChannels.find((item) => item.id === channelId);
    if (!channel) return;
    const nextName = window.prompt('Editar canal', channel.name);
    if (!nextName || !nextName.trim()) return;
    setManagedChannels((prev) => prev.map((item) => (item.id === channelId ? { ...item, name: nextName.trim() } : item)));
    setOpenActionMenu(null);
  };

  const handleDeleteChannel = (channelId: string) => {
    const confirmed = window.confirm('Deseja realmente excluir este canal?');
    if (!confirmed) return;
    setManagedChannels((prev) => prev.filter((item) => item.id !== channelId));
    setManagedPosts((prev) => prev.filter((post) => post.channelId !== channelId));
    if (selectedChannelId === channelId) {
      setSelectedChannelId(null);
    }
    setOpenActionMenu(null);
  };

  const handleDeactivateChannel = (channelId: string) => {
    const confirmed = window.confirm('Deseja inativar este canal?');
    if (!confirmed) return;
    setManagedChannels((prev) => prev.map((item) => (item.id === channelId ? { ...item, isActive: false } : item)));
    setOpenActionMenu(null);
  };

  const handleChannelContributors = (channelId: string) => {
    const channel = managedChannels.find((item) => item.id === channelId);
    if (!channel) return;
    window.alert(`Abrir gestão de contribuidores do canal "${channel.name}" (simulação).`);
    setOpenActionMenu(null);
  };

  const handleChannelTransfer = (channelId: string) => {
    const channel = managedChannels.find((item) => item.id === channelId);
    if (!channel) return;
    window.alert(`Abrir fluxo de transferência do canal "${channel.name}" (simulação).`);
    setOpenActionMenu(null);
  };

  const handleChannelLinkGroup = (channelId: string) => {
    const channel = managedChannels.find((item) => item.id === channelId);
    if (!channel) return;
    window.alert(`Abrir vínculo de grupos para o canal "${channel.name}" (simulação).`);
    setOpenActionMenu(null);
  };

  const handleEditPulse = (pulseId: string) => {
    const pulse = managedPosts.find((item) => item.id === pulseId);
    if (!pulse) return;
    const nextText = window.prompt('Editar pulse', pulse.text);
    if (!nextText || !nextText.trim()) return;
    setManagedPosts((prev) =>
      prev.map((item) => (item.id === pulseId ? { ...item, text: nextText.trim(), timestamp: 'Editado agora' } : item))
    );
    setOpenActionMenu(null);
  };

  const handleDeletePulse = (pulseId: string) => {
    const confirmed = window.confirm('Deseja realmente excluir este pulse?');
    if (!confirmed) return;
    setManagedPosts((prev) => prev.filter((item) => item.id !== pulseId));
    setOpenActionMenu(null);
  };

  const handleDeactivatePulse = (pulseId: string) => {
    const confirmed = window.confirm('Deseja inativar este pulse?');
    if (!confirmed) return;
    setManagedPosts((prev) => prev.map((item) => (item.id === pulseId ? { ...item, isActive: false } : item)));
    setOpenActionMenu(null);
  };

  const handleTransferPulse = (pulseId: string) => {
    const pulse = managedPosts.find((item) => item.id === pulseId);
    if (!pulse) return;
    window.alert(`Abrir fluxo de transferência do pulse "${pulseTitle(pulse.text)}" (simulação).`);
    setOpenActionMenu(null);
  };

  const handleLinkPulseGroup = (pulseId: string) => {
    const pulse = managedPosts.find((item) => item.id === pulseId);
    if (!pulse) return;
    window.alert(`Abrir vínculo de grupos para o pulse "${pulseTitle(pulse.text)}" (simulação).`);
    setOpenActionMenu(null);
  };

  const openPreviousPulse = () => {
    if (!hasPreviousPulse) return;
    setActivePulseId(activeChannelPulses[activePulseIndex - 1].id);
  };

  const openNextPulse = () => {
    if (!hasNextPulse) return;
    setActivePulseId(activeChannelPulses[activePulseIndex + 1].id);
  };

  const handleRatePulse = (pulseId: string, ratingValue: number) => {
    setManagedPosts((prev) =>
      prev.map((post) => {
        if (post.id !== pulseId) return post;
        const previousUserRating = post.userRating ?? 0;
        const previousVotes = post.ratingVotes ?? 0;
        const previousTotal = (post.rating ?? 0) * previousVotes;
        const nextVotes = previousUserRating > 0 ? previousVotes : previousVotes + 1;
        const nextTotal = previousUserRating > 0 ? previousTotal - previousUserRating + ratingValue : previousTotal + ratingValue;
        const nextRating = nextVotes > 0 ? Number((nextTotal / nextVotes).toFixed(1)) : 0;
        return { ...post, userRating: ratingValue, ratingVotes: nextVotes, rating: nextRating };
      })
    );
    setIsLightboxRatingMenuOpen(false);
  };

  const handleAddPulseComment = (pulseId: string, commentText: string) => {
    const normalized = commentText.trim();
    if (!normalized) return;
    setManagedPosts((prev) =>
      prev.map((post) => {
        if (post.id !== pulseId) return post;
        const nextComment = {
          id: `c-${Date.now()}`,
          userId: 'user-4',
          text: normalized,
          timestamp: 'Agora mesmo',
        };
        return { ...post, commentCount: post.commentCount + 1, comments: [...post.comments, nextComment] };
      })
    );
    setLightboxCommentText('');
  };

  const handleTogglePulseBookmark = (pulseId: string) => {
    setManagedPosts((prev) => prev.map((post) => (post.id === pulseId ? { ...post, isBookmarked: !post.isBookmarked } : post)));
  };

  const renderManagementPulseMedia = (pulse: Post) => {
    const normalizedType = (pulse.contentType || '').toUpperCase();
    const embedUrl = pulse.embed?.embedUrl;
    const coverUrl = pulse.imageUrl || KONQUEST_DEFAULT_COVER_IMAGE;

    if (normalizedType === 'IMAGE') {
      return <img src={coverUrl} alt="" className="w-full h-full object-contain" />;
    }

    if (normalizedType === 'VIDEO') {
      if (embedUrl) {
        return (
          <iframe
            title="Pulse video"
            src={embedUrl}
            className="w-full h-full border-0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        );
      }
      if (pulse.mediaUrl) {
        return <video src={pulse.mediaUrl} className="w-full h-full object-contain" controls />;
      }
      return <img src={coverUrl} alt="" className="w-full h-full object-contain" />;
    }

    if (normalizedType === 'PODCAST' || normalizedType === 'AUDIO') {
      return (
        <div className="w-full h-full relative flex items-center justify-center">
          <img src={coverUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-35" />
          <div className="relative w-[min(560px,88%)]">
            <audio src={pulse.mediaUrl} controls className="w-full" />
          </div>
        </div>
      );
    }

    if (embedUrl) {
      return (
        <iframe
          title="Pulse content"
          src={embedUrl}
          className="w-full h-full border-0 bg-white"
          allow="autoplay; encrypted-media; clipboard-write"
          allowFullScreen
        />
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center">
        <img src={coverUrl} alt="" className="w-full h-full object-contain" />
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="h-24 sm:h-28 px-6 flex items-center gap-2">
        {isChannelManagementView && selectedChannel ? (
          <>
            <button
              onClick={() => setSelectedChannelId(null)}
              className={`${ICON_SLOT} rounded-full text-gray-600 hover:bg-gray-100`}
              aria-label="Voltar para canais"
            >
              <Icon name="arrow_back" size="sm" />
            </button>
            <h1 className="text-2xl font-normal text-gray-900">{selectedChannel.name}</h1>
          </>
        ) : (
          <h1 className="text-2xl font-normal text-gray-900">Gestao de Conteudo</h1>
        )}
      </header>

      {!isChannelManagementView && (
        <div className="px-0">
          <nav className="border-b border-gray-200 flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-12 px-4 inline-flex items-center gap-2 border-b-2 text-sm font-semibold whitespace-nowrap ${
                  activeTab === tab.id ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon name={tab.icon} size="sm" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      <section className="px-0 border-t border-b border-gray-200">
        <div className="h-20 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 grow min-w-0">
            <div className={ICON_SLOT}>
              <Icon name="search" className="text-gray-400" />
            </div>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
              placeholder={
                activeTab === 'pulses'
                  ? selectedChannelId
                    ? 'Pesquisar pulse'
                    : 'Pesquisar canal'
                  : 'Pesquisar conteudo'
              }
            />
          </div>
        </div>
      </section>

      <section className="flex-1 min-h-0 px-0 pb-2">
        <div className="h-full overflow-auto">
          {activeTab !== 'pulses' && (
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-gray-200">
                  <th className={`${headerCellClass} min-w-16 max-w-16 ${LEFT_GUTTER} pr-0`}></th>
                  <th className={`${headerCellClass} min-w-72 sticky left-0 bg-white`}>Nome</th>
                  <th className={`${headerCellClass} min-w-72`}>Criador</th>
                  <th className={`${headerCellClass} min-w-72`}>Categoria</th>
                  <th className={`${headerCellClass} min-w-36 max-w-36`}>Tipo</th>
                  <th className={`${headerCellClass} min-w-36 max-w-36`}>Criado em</th>
                  <th className={`${headerCellClass} min-w-36 max-w-36`}>Duracao</th>
                  <th className={`${headerCellClass} min-w-40 max-w-40 text-right`}>{activeTab === 'trails' ? 'Cursos' : 'Inscritos'}</th>
                  <th className={`${headerCellClass} min-w-40 max-w-40`}>Status</th>
                  <th className={`${headerCellClass} min-w-20 max-w-20 text-right`}>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((row) => (
                  <tr key={row.id} className="group border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <td className={`${bodyCellClass} min-w-16 max-w-16 ${LEFT_GUTTER} pr-0`}>
                      <div className={ICON_SLOT}>
                        <Icon
                          name={activeTab === 'courses' ? 'rocket_launch' : activeTab === 'events' ? 'calendar_month' : 'conversion_path'}
                          size="sm"
                          className="text-purple-500"
                        />
                      </div>
                    </td>
                    <td className={`${bodyCellClass} min-w-72 font-medium text-gray-900`}>{row.name}</td>
                    <td className={`${bodyCellClass} min-w-72`}>{row.creator}</td>
                    <td className={`${bodyCellClass} min-w-72`}>{row.category}</td>
                    <td className={`${bodyCellClass} min-w-36 max-w-36`}>{row.typeLabel}</td>
                    <td className={`${bodyCellClass} min-w-36 max-w-36`}>{row.creationDate}</td>
                    <td className={`${bodyCellClass} min-w-36 max-w-36`}>{row.duration}</td>
                    <td className={`${bodyCellClass} min-w-40 max-w-40 text-right`}>{row.metric}</td>
                    <td className={`${bodyCellClass} min-w-40 max-w-40`}>
                      <span
                        className={`${statusChipClass} ${
                          row.status === 'Publicado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className={`${bodyCellClass} min-w-20 max-w-20 text-right`}>
                      <button className="w-10 h-10 inline-flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100" onClick={(event) => event.stopPropagation()}>
                        <Icon name="more_vert" size="sm" />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedRows.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-14 text-center text-gray-500">
                      Nenhum conteudo encontrado para os filtros atuais.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'pulses' && !selectedChannelId && (
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-gray-200">
                  <th className={`${headerCellClass} min-w-16 max-w-16 ${LEFT_GUTTER} pr-0`}></th>
                  <th className={`${headerCellClass} min-w-72 sticky left-0 bg-white`}>Canal</th>
                  <th className={`${headerCellClass} min-w-72`}>Categoria</th>
                  <th className={`${headerCellClass} min-w-72`}>Criador</th>
                  <th className={`${headerCellClass} min-w-40 max-w-40 text-right`}>Pulses</th>
                  <th className={`${headerCellClass} min-w-40 max-w-40 text-right`}>Inscritos</th>
                  <th className={`${headerCellClass} min-w-40 max-w-40`}>Status</th>
                  <th className={`${headerCellClass} min-w-20 max-w-20 text-right`}>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((row) => {
                  const isChannelMenuOpen = openActionMenu?.kind === 'channel' && openActionMenu.id === row.id;
                  return (
                  <tr
                    key={row.id}
                    className={`group border-b border-gray-100 hover:bg-gray-50 cursor-pointer relative ${isChannelMenuOpen ? 'z-30' : 'z-0'}`}
                    onClick={() => setSelectedChannelId(row.id)}
                  >
                    <td className={`${bodyCellClass} min-w-16 max-w-16 ${LEFT_GUTTER} pr-0`}>
                      <div className={ICON_SLOT}>
                        <Icon name="radio_button_checked" size="sm" className="text-purple-500" />
                      </div>
                    </td>
                    <td className={`${bodyCellClass} min-w-72 font-medium text-gray-900`}>{row.name}</td>
                    <td className={`${bodyCellClass} min-w-72`}>{row.category || 'Geral'}</td>
                    <td className={`${bodyCellClass} min-w-72`}>{row.ownerName}</td>
                    <td className={`${bodyCellClass} min-w-40 max-w-40 text-right`}>{row.pulseCount}</td>
                    <td className={`${bodyCellClass} min-w-40 max-w-40 text-right`}>{row.subscriberCount}</td>
                    <td className={`${bodyCellClass} min-w-40 max-w-40`}>
                      <span
                        className={`${statusChipClass} ${
                          row.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {row.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className={`${bodyCellClass} min-w-20 max-w-20 text-right ${isChannelMenuOpen ? 'relative z-40' : ''}`}>
                      <div className="relative inline-flex" data-action-menu>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            const rect = (event.currentTarget as HTMLButtonElement).getBoundingClientRect();
                            setOpenActionMenu((prev) =>
                              prev?.kind === 'channel' && prev.id === row.id
                                ? null
                                : { kind: 'channel', id: row.id, x: rect.right, y: rect.bottom }
                            );
                          }}
                          className="w-10 h-10 inline-flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                        >
                          <Icon name="more_vert" size="sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
                {paginatedRows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-14 text-center text-gray-500">
                      Nenhum canal encontrado para os filtros atuais.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'pulses' && selectedChannelId && (
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-gray-200">
                  <th className={`${headerCellClass} min-w-16 max-w-16 ${LEFT_GUTTER} pr-0`}></th>
                  <th className={`${headerCellClass} min-w-72 sticky left-0 bg-white`}>Pulse</th>
                  <th className={`${headerCellClass} min-w-36 max-w-36`}>Formato</th>
                  <th className={`${headerCellClass} min-w-72`}>Autor</th>
                  <th className={`${headerCellClass} min-w-36 max-w-36 text-right`}>Rating</th>
                  <th className={`${headerCellClass} min-w-36 max-w-36 text-right`}>Comentarios</th>
                  <th className={`${headerCellClass} min-w-40 max-w-40`}>Publicado em</th>
                  <th className={`${headerCellClass} min-w-20 max-w-20 text-right`}>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((row) => {
                  const isPulseMenuOpen = openActionMenu?.kind === 'pulse' && openActionMenu.id === row.id;
                  return (
                  <tr
                    key={row.id}
                    className={`group border-b border-gray-100 hover:bg-gray-50 relative ${isPulseMenuOpen ? 'z-30' : 'z-0'} ${row.isMock ? '' : 'cursor-pointer'}`}
                    onClick={() => {
                      if (row.isMock) return;
                      setActivePulseId(row.id);
                    }}
                  >
                    <td className={`${bodyCellClass} min-w-16 max-w-16 ${LEFT_GUTTER} pr-0`}>
                      <div className={ICON_SLOT}>
                        <Icon name={pulseTypeIcon(row.contentType)} size="sm" className="text-purple-500" />
                      </div>
                    </td>
                    <td className={`${bodyCellClass} min-w-72 font-medium text-gray-900`}>{row.title}</td>
                    <td className={`${bodyCellClass} min-w-36 max-w-36`}>{formatContentType(row.contentType)}</td>
                    <td className={`${bodyCellClass} min-w-72`}>{row.authorName}</td>
                    <td className={`${bodyCellClass} min-w-36 max-w-36 text-right`}>{row.rating.toFixed(1)}</td>
                    <td className={`${bodyCellClass} min-w-36 max-w-36 text-right`}>{row.commentCount}</td>
                    <td className={`${bodyCellClass} min-w-40 max-w-40`}>{row.timestamp}</td>
                    <td className={`${bodyCellClass} min-w-20 max-w-20 text-right ${isPulseMenuOpen ? 'relative z-40' : ''}`}>
                      <div className="relative inline-flex" data-action-menu>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            if (row.isMock) return;
                            const rect = (event.currentTarget as HTMLButtonElement).getBoundingClientRect();
                            setOpenActionMenu((prev) =>
                              prev?.kind === 'pulse' && prev.id === row.id
                                ? null
                                : { kind: 'pulse', id: row.id, x: rect.right, y: rect.bottom }
                            );
                          }}
                          className={`w-10 h-10 inline-flex items-center justify-center rounded-full ${row.isMock ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'}`}
                          disabled={!!row.isMock}
                        >
                          <Icon name="more_vert" size="sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
                {paginatedRows.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-14 text-center text-gray-500">
                      {selectedChannelPublishedPulsesCount === 0
                        ? 'Este canal ainda nao possui pulses publicados.'
                        : 'Nenhum pulse encontrado para os filtros atuais.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'pulses' && !selectedChannelId && channelsRows.length === 0 && (
            <div className="h-full flex items-center justify-center text-sm text-gray-500 px-6">
              Nenhum pulse encontrado no ambiente. Crie canais e pulses para preencher a tabela geral.
            </div>
          )}
        </div>
      </section>

      <div className="px-0">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={currentRows.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      {openActionMenu && (
        <div
          data-action-menu-panel
          className="fixed z-[90] w-56 rounded-lg border border-gray-200 bg-white shadow-xl overflow-hidden"
          style={{ top: openActionMenu.y + 6, left: Math.max(12, openActionMenu.x - 224) }}
        >
          {openActionMenu.kind === 'channel' ? (
            <>
              <button onClick={() => handleEditChannel(openActionMenu.id)} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Editar canal</button>
              <button onClick={() => handleChannelContributors(openActionMenu.id)} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Contribuidores</button>
              <button onClick={() => handleChannelTransfer(openActionMenu.id)} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Transferir canal</button>
              <button onClick={() => handleChannelLinkGroup(openActionMenu.id)} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Vincular grupo</button>
              <button onClick={() => handleDeactivateChannel(openActionMenu.id)} className="w-full px-3 py-2 text-left text-sm text-amber-700 hover:bg-amber-50">Inativar canal</button>
              <button onClick={() => handleDeleteChannel(openActionMenu.id)} className="w-full px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50">Excluir canal</button>
            </>
          ) : (
            <>
              <button onClick={() => handleEditPulse(openActionMenu.id)} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Editar pulse</button>
              <button onClick={() => handleTransferPulse(openActionMenu.id)} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Transferir pulse</button>
              <button onClick={() => handleLinkPulseGroup(openActionMenu.id)} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Vincular grupo</button>
              <button onClick={() => handleDeactivatePulse(openActionMenu.id)} className="w-full px-3 py-2 text-left text-sm text-amber-700 hover:bg-amber-50">Inativar pulse</button>
              <button onClick={() => handleDeletePulse(openActionMenu.id)} className="w-full px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50">Excluir pulse</button>
            </>
          )}
        </div>
      )}

      {activePulse && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-0" onClick={() => setActivePulseId(null)}>
          <div className="relative w-full h-full lg:py-6 lg:px-20" onClick={(event) => event.stopPropagation()}>
            <button
              onClick={(event) => {
                event.stopPropagation();
                setActivePulseId(null);
              }}
              className="hidden lg:flex absolute right-4 top-4 z-50 w-12 h-12 rounded-full bg-white/90 text-gray-800 items-center justify-center hover:bg-white shadow-md"
              aria-label="Fechar lightbox"
              title="Fechar"
            >
              <Icon name="close" size="md" />
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                setIsLightboxSidebarCollapsed((prev) => !prev);
              }}
              className="hidden lg:flex absolute right-4 top-20 z-50 w-12 h-12 rounded-full bg-white/90 text-gray-800 items-center justify-center hover:bg-white shadow-md"
              aria-label={isLightboxSidebarCollapsed ? 'Mostrar descrição e comentários' : 'Ocultar descrição e comentários'}
              title={isLightboxSidebarCollapsed ? 'Mostrar descrição e comentários' : 'Ocultar descrição e comentários'}
            >
              <Icon name={isLightboxSidebarCollapsed ? 'right_panel_open' : 'right_panel_close'} size="md" />
            </button>

            <button
              onClick={(event) => {
                event.stopPropagation();
                openPreviousPulse();
              }}
              disabled={!hasPreviousPulse}
              className={`hidden lg:flex absolute left-3 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full items-center justify-center shadow-md ${hasPreviousPulse ? 'bg-white/90 text-gray-800 hover:bg-white' : 'bg-white/50 text-gray-300 cursor-not-allowed'}`}
              aria-label="Pulse anterior"
            >
              <Icon name="chevron_left" size="md" />
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                openNextPulse();
              }}
              disabled={!hasNextPulse}
              className={`hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full items-center justify-center shadow-md ${hasNextPulse ? 'bg-white/90 text-gray-800 hover:bg-white' : 'bg-white/50 text-gray-300 cursor-not-allowed'}`}
              aria-label="Próximo pulse"
            >
              <Icon name="chevron_right" size="md" />
            </button>

            <div className="w-full h-full bg-white lg:rounded-2xl overflow-hidden grid grid-cols-1 grid-rows-[56px_minmax(240px,45vh)_1fr] lg:grid-rows-1 lg:grid-cols-12">
              <div className="lg:hidden h-14 px-3 border-b border-gray-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-1">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      openPreviousPulse();
                    }}
                    disabled={!hasPreviousPulse}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${hasPreviousPulse ? 'text-gray-800 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                    aria-label="Pulse anterior"
                  >
                    <Icon name="chevron_left" size="sm" />
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      openNextPulse();
                    }}
                    disabled={!hasNextPulse}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${hasNextPulse ? 'text-gray-800 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                    aria-label="Próximo pulse"
                  >
                    <Icon name="chevron_right" size="sm" />
                  </button>
                </div>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    setActivePulseId(null);
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100"
                  aria-label="Fechar lightbox"
                >
                  <Icon name="close" size="md" />
                </button>
              </div>

              <div className={`${isLightboxSidebarCollapsed ? 'lg:col-span-12' : 'lg:col-span-8'} relative bg-black flex items-center justify-center min-h-[240px]`}>
                {renderManagementPulseMedia(activePulse)}
              </div>

              <div className={`${isLightboxSidebarCollapsed ? 'hidden' : 'flex'} lg:col-span-4 flex-col min-h-0 h-full`}>
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={USERS[activePulse.userId]?.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{USERS[activePulse.userId]?.name || 'Usuário'}</p>
                      <p className="text-xs text-gray-500 truncate">{selectedChannel?.name || 'Canal'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                  <div>
                    <p className={`text-sm text-gray-800 whitespace-pre-wrap ${isLightboxDescriptionExpanded ? '' : 'line-clamp-4'}`}>
                      <span className="font-semibold mr-1">{USERS[activePulse.userId]?.name || 'Usuário'}</span>
                      {activePulse.text}
                    </p>
                    {activePulse.text.length > 180 && (
                      <button
                        onClick={() => setIsLightboxDescriptionExpanded((prev) => !prev)}
                        className="mt-1 text-xs font-semibold text-gray-500 hover:text-gray-800"
                      >
                        {isLightboxDescriptionExpanded ? 'Ver menos' : 'Ver mais'}
                      </button>
                    )}
                    <p className="text-xs text-gray-400 mt-2">{activePulse.timestamp}</p>
                  </div>
                  <div className="space-y-3">
                    {activePulse.comments.map((comment) => (
                      <div key={comment.id} className="text-sm text-gray-800 break-words">
                        <span className="font-semibold mr-1">{USERS[comment.userId]?.name || 'Usuário'}</span>
                        <span>{comment.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-3 pt-2 pb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div ref={lightboxRatingMenuRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setIsLightboxRatingMenuOpen((prev) => !prev)}
                        className="w-10 h-10 rounded-full text-gray-700 hover:bg-gray-100 flex items-center justify-center"
                        aria-label="Avaliar pulse"
                      >
                        <Icon
                          name="star"
                          size="md"
                          filled={(activePulse.userRating ?? 0) > 0}
                          className={(activePulse.userRating ?? 0) > 0 ? 'text-amber-500' : ''}
                        />
                      </button>
                      {isLightboxRatingMenuOpen && (
                        <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-full shadow-lg px-2 py-1 z-20">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleRatePulse(activePulse.id, star);
                                }}
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                                title={`Avaliar ${star} estrelas`}
                              >
                                <Icon
                                  name="star"
                                  size="sm"
                                  filled={star <= (activePulse.userRating ?? 0)}
                                  className={star <= (activePulse.userRating ?? 0) ? 'text-amber-500' : 'text-gray-300'}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => lightboxCommentInputRef.current?.focus()}
                      className="w-10 h-10 rounded-full text-gray-700 hover:bg-gray-100 flex items-center justify-center"
                      aria-label="Comentar"
                    >
                      <Icon name="chat_bubble" size="md" />
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const postUrl = `${window.location.origin}/pulse/${activePulse.id}`;
                        try {
                          await navigator.clipboard.writeText(postUrl);
                          setLightboxActionToastMessage('Link do pulse copiado.');
                        } catch {
                          setLightboxActionToastMessage('Nao foi possivel copiar o link.');
                        }
                      }}
                      className="w-10 h-10 rounded-full text-gray-700 hover:bg-gray-100 flex items-center justify-center"
                      aria-label="Compartilhar pulse"
                    >
                      <Icon name="send" size="md" className="-rotate-12" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTogglePulseBookmark(activePulse.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${(activePulse.isBookmarked ?? false) ? 'text-purple-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    aria-label={(activePulse.isBookmarked ?? false) ? 'Pulse salvo' : 'Salvar pulse'}
                  >
                    <Icon name="bookmark" size="md" filled={!!activePulse.isBookmarked} />
                  </button>
                </div>

                <div className="border-t border-gray-200"></div>
                <form
                  className="p-3 pt-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleAddPulseComment(activePulse.id, lightboxCommentText);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <input
                      ref={lightboxCommentInputRef}
                      type="text"
                      value={lightboxCommentText}
                      onChange={(event) => setLightboxCommentText(event.target.value.slice(0, 500))}
                      maxLength={500}
                      placeholder="Adicione um comentário..."
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button type="submit" className="px-3 py-2 text-sm font-semibold text-purple-600 hover:text-purple-800">
                      Publicar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {lightboxActionToastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]">
          <div className="inline-flex items-center rounded-md bg-gray-900 text-white text-xs px-3 py-1.5 shadow-lg">
            {lightboxActionToastMessage}
          </div>
        </div>
      )}
    </div>
  );
};
