import React, { useMemo, useState } from 'react';
import { Icon } from '../Icon';
import { Pagination } from '../courses/Pagination';
import { CHANNELS, POSTS, USERS, COURSES } from '../../constants';

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

  const activeChannels = useMemo(
    () => CHANNELS.map((channel) => ({ ...channel, isActive: channel.isActive ?? true })),
    []
  );

  const selectedChannel = useMemo(
    () => activeChannels.find((channel) => channel.id === selectedChannelId) ?? null,
    [activeChannels, selectedChannelId]
  );

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
        const pulseCount = POSTS.filter((post) => post.channelId === channel.id && post.isActive !== false).length;
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
  }, [activeChannels, searchTerm]);

  const pulsesRows = useMemo<PulseRow[]>(() => {
    if (!selectedChannelId) return [];
    const normalized = searchTerm.trim().toLowerCase();

    const channelRows: PulseRow[] = POSTS.filter((post) => post.channelId === selectedChannelId && post.isActive !== false)
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
  }, [searchTerm, selectedChannelId]);

  const selectedChannelPublishedPulsesCount = useMemo(() => {
    if (!selectedChannelId) return 0;
    return POSTS.filter((post) => post.channelId === selectedChannelId && post.isActive !== false).length;
  }, [selectedChannelId]);

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
                {paginatedRows.map((row) => (
                  <tr
                    key={row.id}
                    className="group border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
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
                    <td className={`${bodyCellClass} min-w-20 max-w-20 text-right`}>
                      <button
                        onClick={(event) => event.stopPropagation()}
                        className="w-10 h-10 inline-flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                      >
                        <Icon name="more_vert" size="sm" />
                      </button>
                    </td>
                  </tr>
                ))}
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
                {paginatedRows.map((row) => (
                  <tr key={row.id} className="group border-b border-gray-100 hover:bg-gray-50">
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
                    <td className={`${bodyCellClass} min-w-20 max-w-20 text-right`}>
                      <button className="w-10 h-10 inline-flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100">
                        <Icon name="more_vert" size="sm" />
                      </button>
                    </td>
                  </tr>
                ))}
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
    </div>
  );
};
