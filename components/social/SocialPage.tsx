
import React, { useState } from 'react';
import { POSTS, CHANNELS, USERS, KONQUEST_DEFAULT_COVER_IMAGE } from '../../constants';
import { PostCard } from '../PostCard';
import { PulsesTable } from './PulsesTable';
import { Icon } from '../Icon';
import { KpiCard } from '../KpiCard';
import { SentimentChart } from './SentimentChart';
import { Post, Comment, Channel } from '../../types';

type SocialViewMode = 'feed' | 'management' | 'channels';
type FeedQuickFilter = 'all' | 'featured' | 'favorites';
type UserViewMode = 'admin' | 'user';
type CreateMainType = 'FILE' | 'LINK' | 'QUIZ' | 'HTML' | null;
type CreateSubtype =
    | 'VIDEO'
    | 'IMAGE'
    | 'PODCAST'
    | 'PDF'
    | 'WORD'
    | 'POWERPOINT'
    | 'EXCEL'
    | 'YOUTUBE'
    | 'VIMEO'
    | 'SOUNDCLOUD'
    | 'GOOGLE_DRIVE'
    | 'EXTERNAL_LINK'
    | 'GENIALLY'
    | 'H5P'
    | 'EVALUATIVE_QUIZ'
    | 'SURVEY_QUIZ'
    | null;

type EdgeCaseKey = 'emptyDataset' | 'missingCover' | 'longContent' | 'largeVolume';

type EdgeCaseState = Record<EdgeCaseKey, boolean>;
const COMMENT_CHAR_LIMIT = 500;
const CONTENT_NAME_MAX_LENGTH = 200;
const QUIZ_NAME_MAX_LENGTH = 100;
const URL_REGEX = /^https?:\/\/[\w.-]+(?:\.[\w-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=]+$/;
const YOUTUBE_REGEX = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/;
const VIMEO_REGEX = /(https?:\/\/)?(www\.)?(player\.)?vimeo\.com\/(?:channels\/\w+\/|groups\/[^/]*\/videos\/|video\/)?(\d+)/;
const SOUNDCLOUD_REGEX = /((https:\/\/)|(http:\/\/)|(www.)|(m\.)|(\s))+(soundcloud.com\/)+[a-zA-Z0-9\-.]+(\/)+[a-zA-Z0-9\-.]+/;
const GOOGLE_DRIVE_REGEX = /((https:)?\/\/(docs.google.com)\/(presentation|document|spreadsheets)\/d\/[a-zA-Z0-9_-]+\/(.*))/;
const GENIALLY_REGEX = /(https)?:\/\/(view\.genial\.ly\/|view\.genially\.com\/)[a-zA-Z0-9_-]+/;
const H5P_REGEX = /(https)?:\/\/(h5p\.org\/h5p\/embed\/)[a-zA-Z0-9_-]+/;

const CREATE_MAIN_OPTIONS: Array<{ type: Exclude<CreateMainType, null>; label: string; icon: string }> = [
    { type: 'FILE', label: 'Arquivo', icon: 'file_upload' },
    { type: 'LINK', label: 'Link', icon: 'link' },
    { type: 'QUIZ', label: 'Quiz', icon: 'quiz' },
    { type: 'HTML', label: 'Ferramentas de autoria', icon: 'html' }
];

const CREATE_SUB_OPTIONS: Record<Exclude<CreateMainType, null>, Array<{ type: Exclude<CreateSubtype, null>; label: string; icon: string }>> = {
    FILE: [
        { type: 'VIDEO', label: 'Video', icon: 'video_file' },
        { type: 'IMAGE', label: 'Imagem', icon: 'image' },
        { type: 'PODCAST', label: 'Podcast', icon: 'mic' },
        { type: 'PDF', label: 'PDF', icon: 'picture_as_pdf' },
        { type: 'WORD', label: 'Texto', icon: 'description' },
        { type: 'POWERPOINT', label: 'Apresentacao', icon: 'slideshow' },
        { type: 'EXCEL', label: 'Planilha', icon: 'table_view' }
    ],
    LINK: [
        { type: 'YOUTUBE', label: 'YouTube', icon: 'smart_display' },
        { type: 'VIMEO', label: 'Vimeo', icon: 'play_circle' },
        { type: 'SOUNDCLOUD', label: 'SoundCloud', icon: 'graphic_eq' },
        { type: 'GOOGLE_DRIVE', label: 'Google Drive', icon: 'cloud' },
        { type: 'EXTERNAL_LINK', label: 'Link externo', icon: 'language' }
    ],
    QUIZ: [
        { type: 'EVALUATIVE_QUIZ', label: 'Avaliativo', icon: 'quiz' },
        { type: 'SURVEY_QUIZ', label: 'Pesquisa', icon: 'quiz' }
    ],
    HTML: [
        { type: 'GENIALLY', label: 'Genially', icon: 'language' },
        { type: 'H5P', label: 'H5P', icon: 'language' }
    ]
};

const CREATE_ACCEPT_TYPES: Record<string, string> = {
    VIDEO: 'video/mp4,video/webm',
    IMAGE: 'image/jpeg,image/png,image/gif,image/webp',
    PODCAST: 'audio/mpeg,audio/mp3,audio/wav',
    PDF: 'application/pdf',
    WORD: '.doc,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    POWERPOINT: '.ppt,.pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation',
    EXCEL: '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    GENIALLY: '.zip,application/zip,application/x-zip-compressed',
    H5P: '.zip,application/zip,application/x-zip-compressed'
};

interface SocialPageProps {
    initialViewMode?: SocialViewMode;
}

export const SocialPage: React.FC<SocialPageProps> = ({ initialViewMode = 'feed' }) => {
    const CHANNEL_HASH_PREFIX = '#/canal/';
    const INITIAL_FEED_BATCH = 8;
    const FEED_BATCH_SIZE = 6;
    const INITIAL_CHANNELS_BATCH = 10;
    const CHANNELS_BATCH_SIZE = 8;
    const currentUserId = 'user-4';
    const [viewMode, setViewMode] = useState<SocialViewMode>(initialViewMode);
    const [feedDisplayMode, setFeedDisplayMode] = useState<'timeline' | 'grid'>('timeline');
    const [feedQuickFilter, setFeedQuickFilter] = useState<FeedQuickFilter>('all');
    const [posts, setPosts] = useState<Post[]>(() => POSTS.map(post => ({ ...post, isActive: post.isActive ?? true })));
    const [channels, setChannels] = useState<Channel[]>(() => CHANNELS.map(channel => ({ ...channel, isActive: channel.isActive ?? true })));
    const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [channelInternalTab, setChannelInternalTab] = useState<'pulses' | 'discussion'>('pulses');
    const [channelDiscussionText, setChannelDiscussionText] = useState('');
    const [activePostId, setActivePostId] = useState<string | null>(null);
    const [shouldFocusLightboxComment, setShouldFocusLightboxComment] = useState(false);
    const [isLightboxSidebarCollapsed, setIsLightboxSidebarCollapsed] = useState(false);
    const [lightboxCommentText, setLightboxCommentText] = useState('');
    const [isLightboxDescriptionExpanded, setIsLightboxDescriptionExpanded] = useState(false);
    const [isLightboxRatingMenuOpen, setIsLightboxRatingMenuOpen] = useState(false);
    const [lightboxActionToastMessage, setLightboxActionToastMessage] = useState<string | null>(null);
    const [failedChannelCovers, setFailedChannelCovers] = useState<Record<string, boolean>>({});
    const [failedDiscoveryThumbs, setFailedDiscoveryThumbs] = useState<Record<string, boolean>>({});
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createMainType, setCreateMainType] = useState<CreateMainType>(null);
    const [createSubtype, setCreateSubtype] = useState<CreateSubtype>(null);
    const [createFile, setCreateFile] = useState<File | null>(null);
    const [createName, setCreateName] = useState('');
    const [createDescription, setCreateDescription] = useState('');
    const [createExternalUrl, setCreateExternalUrl] = useState('');
    const [createCoverImageUrl, setCreateCoverImageUrl] = useState('');
    const [createChannelId, setCreateChannelId] = useState<string>(() => CHANNELS[0]?.id || '');
    const [createDuration, setCreateDuration] = useState<number>(60);
    const [edgeCases, setEdgeCases] = useState<EdgeCaseState>({
        emptyDataset: false,
        missingCover: false,
        longContent: false,
        largeVolume: false
    });
    const [userViewMode, setUserViewMode] = useState<UserViewMode>('admin');
    const [isEdgeMenuOpen, setIsEdgeMenuOpen] = useState(false);
    const [isEdgeHotspotActive, setIsEdgeHotspotActive] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [isCoverDragOver, setIsCoverDragOver] = useState(false);
    const [loadedFeedCount, setLoadedFeedCount] = useState(INITIAL_FEED_BATCH);
    const [isLoadingMoreFeed, setIsLoadingMoreFeed] = useState(false);
    const [loadedChannelsCount, setLoadedChannelsCount] = useState(INITIAL_CHANNELS_BATCH);
    const [isLoadingMoreChannels, setIsLoadingMoreChannels] = useState(false);
    const uploadInputRef = React.useRef<HTMLInputElement | null>(null);
    const coverUploadInputRef = React.useRef<HTMLInputElement | null>(null);
    const lightboxRatingMenuRef = React.useRef<HTMLDivElement | null>(null);
    const lightboxCommentInputRef = React.useRef<HTMLInputElement | null>(null);
    const edgeMenuRef = React.useRef<HTMLDivElement | null>(null);
    const feedSentinelRef = React.useRef<HTMLDivElement | null>(null);
    const channelsSentinelRef = React.useRef<HTMLDivElement | null>(null);
    const feedLoadTimeoutRef = React.useRef<number | null>(null);
    const channelsLoadTimeoutRef = React.useRef<number | null>(null);
    const socialScrollRef = React.useRef<HTMLDivElement | null>(null);

    const scenarioChannels = React.useMemo(() => {
        if (edgeCases.emptyDataset) return [] as Channel[];

        let list = channels.map(channel => ({ ...channel }));

        if (edgeCases.missingCover) {
            list = list.map(channel => ({ ...channel, imageUrl: '' }));
        }

        if (edgeCases.longContent) {
            list = list.map(channel => ({
                ...channel,
                name: `${channel.name} • canal com título propositalmente muito longo para validação visual`,
                description: `${channel.description} Este canal possui uma descrição extensa para validar truncamento, quebra de linha e comportamento em diferentes breakpoints do layout social.`
            }));
        }

        if (edgeCases.largeVolume && list.length > 0) {
            const extraChannels: Channel[] = Array.from({ length: 24 }, (_, index) => {
                const seed = list[index % list.length];
                return {
                    ...seed,
                    id: `edge-channel-${index + 1}`,
                    name: `${seed.name} ${index + 1}`,
                    isSubscribed: index % 2 === 0,
                    ownerId: index % 5 === 0 ? currentUserId : seed.ownerId
                };
            });
            list = [...list, ...extraChannels];
        }

        return list;
    }, [channels, currentUserId, edgeCases.emptyDataset, edgeCases.largeVolume, edgeCases.longContent, edgeCases.missingCover]);

    const scenarioPosts = React.useMemo(() => {
        if (edgeCases.emptyDataset) return [] as Post[];

        let list = posts.map(post => ({ ...post }));

        if (edgeCases.missingCover) {
            list = list.map(post => ({ ...post, imageUrl: undefined }));
        }

        if (edgeCases.longContent) {
            list = list.map(post => ({
                ...post,
                text: `${post.text} Conteúdo adicional para stress test de truncamento no card e expansão no lightbox. Este texto foi estendido propositalmente com múltiplas frases, detalhes de contexto, observações e exemplos para testar edge cases de leitura e legibilidade.`
            }));
        }

        if (edgeCases.largeVolume && list.length > 0 && scenarioChannels.length > 0) {
            const channelIds = scenarioChannels.map(channel => channel.id);
            const extraPosts: Post[] = Array.from({ length: 40 }, (_, index) => {
                const seed = list[index % list.length];
                return {
                    ...seed,
                    id: `edge-post-${index + 1}`,
                    channelId: channelIds[index % channelIds.length],
                    timestamp: `${index + 1} min atrás`
                };
            });
            list = [...extraPosts, ...list];
        }

        return list;
    }, [edgeCases.emptyDataset, edgeCases.largeVolume, edgeCases.longContent, edgeCases.missingCover, posts, scenarioChannels]);

    const channelsMap = React.useMemo(
        () => scenarioChannels.reduce((acc, channel) => {
            acc[channel.id] = channel;
            return acc;
        }, {} as Record<string, Channel>),
        [scenarioChannels]
    );

    // Update viewMode if initialViewMode prop changes
    React.useEffect(() => {
        const hash = window.location.hash || '';
        if (hash.startsWith(CHANNEL_HASH_PREFIX)) return;
        setViewMode(initialViewMode);
    }, [CHANNEL_HASH_PREFIX, initialViewMode]);

    React.useEffect(() => {
        setIsTouchDevice(window.matchMedia('(hover: none)').matches);
    }, []);

    React.useEffect(() => {
        const readChannelFromHash = () => {
            const hash = window.location.hash || '';
            if (!hash.startsWith(CHANNEL_HASH_PREFIX)) return null;
            const raw = hash.slice(CHANNEL_HASH_PREFIX.length);
            return raw ? decodeURIComponent(raw.split('?')[0]) : null;
        };

        const syncFromHash = () => {
            const channelIdFromHash = readChannelFromHash();
            if (!channelIdFromHash) return;
            setViewMode('channels');
            setSelectedChannel(channelIdFromHash);
        };

        syncFromHash();
        window.addEventListener('hashchange', syncFromHash);
        return () => window.removeEventListener('hashchange', syncFromHash);
    }, [CHANNEL_HASH_PREFIX]);

    React.useEffect(() => {
        const currentHash = window.location.hash || '';
        const hasChannelHash = currentHash.startsWith(CHANNEL_HASH_PREFIX);
        const shouldPersistChannel = viewMode === 'channels' && !!selectedChannel;

        if (shouldPersistChannel) {
            const expectedHash = `${CHANNEL_HASH_PREFIX}${encodeURIComponent(selectedChannel as string)}`;
            if (currentHash !== expectedHash) {
                window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${expectedHash}`);
            }
            return;
        }

        if (hasChannelHash) {
            window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
        }
    }, [CHANNEL_HASH_PREFIX, selectedChannel, viewMode]);

    React.useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (!isEdgeMenuOpen) return;
            if (edgeMenuRef.current && !edgeMenuRef.current.contains(event.target as Node)) {
                setIsEdgeMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isEdgeMenuOpen]);

    const toggleEdgeCase = (key: EdgeCaseKey) => {
        setEdgeCases(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleRate = (postId: string, ratingValue: number) => {
        setPosts(prev => prev.map(post => {
            if (post.id !== postId) return post;

            const previousUserRating = post.userRating ?? 0;
            const previousVotes = post.ratingVotes ?? 0;
            const previousTotal = (post.rating ?? 0) * previousVotes;
            const nextVotes = previousUserRating > 0 ? previousVotes : previousVotes + 1;
            const nextTotal = previousUserRating > 0
                ? previousTotal - previousUserRating + ratingValue
                : previousTotal + ratingValue;
            const nextRating = nextVotes > 0 ? Number((nextTotal / nextVotes).toFixed(1)) : 0;

            return {
                ...post,
                userRating: ratingValue,
                ratingVotes: nextVotes,
                rating: nextRating
            };

            return post;
        }));
    };

    const handleAddComment = (postId: string, commentText: string, parentId?: string) => {
        const normalizedCommentText = commentText.trim().slice(0, COMMENT_CHAR_LIMIT);
        if (!normalizedCommentText) return;

        const newComment: Comment = {
            id: `c-${Date.now()}`,
            userId: 'user-4',
            text: normalizedCommentText,
            timestamp: 'Agora mesmo',
            parentId: parentId
        };

        setPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    commentCount: post.commentCount + 1,
                    comments: [...post.comments, newComment]
                };
            }
            return post;
        }));
    };

    const handleSubmitChannelDiscussion = () => {
        const normalizedText = channelDiscussionText.trim().slice(0, COMMENT_CHAR_LIMIT);
        if (!selectedChannel || !normalizedText) return;
        const targetPost = selectedChannelPosts[0];
        if (!targetPost) return;
        handleAddComment(targetPost.id, normalizedText);
        setChannelDiscussionText('');
    };

    const collectCommentIdsToRemove = (comments: Comment[], rootId: string): Set<string> => {
        const ids = new Set<string>([rootId]);
        let foundNew = true;
        while (foundNew) {
            foundNew = false;
            comments.forEach(comment => {
                if (comment.parentId && ids.has(comment.parentId) && !ids.has(comment.id)) {
                    ids.add(comment.id);
                    foundNew = true;
                }
            });
        }
        return ids;
    };

    const handleEditComment = (postId: string, commentId: string) => {
        const post = posts.find(p => p.id === postId);
        const comment = post?.comments.find(c => c.id === commentId);
        if (!comment) return;

        const updatedText = window.prompt('Editar comentário', comment.text);
        if (!updatedText || !updatedText.trim()) return;
        if (updatedText.trim().length > COMMENT_CHAR_LIMIT) {
            window.alert(`Comentários podem ter no máximo ${COMMENT_CHAR_LIMIT} caracteres.`);
            return;
        }

        setPosts(prev => prev.map(p => {
            if (p.id !== postId) return p;
            return {
                ...p,
                comments: p.comments.map(c => c.id === commentId ? { ...c, text: updatedText.trim(), timestamp: 'Editado agora' } : c)
            };
        }));
    };

    const handleDeleteComment = (postId: string, commentId: string) => {
        const confirmed = window.confirm('Deseja excluir este comentário?');
        if (!confirmed) return;

        setPosts(prev => prev.map(p => {
            if (p.id !== postId) return p;
            const idsToRemove = collectCommentIdsToRemove(p.comments, commentId);
            const remainingComments = p.comments.filter(c => !idsToRemove.has(c.id));
            return {
                ...p,
                comments: remainingComments,
                commentCount: Math.max(0, p.commentCount - idsToRemove.size)
            };
        }));
    };

    const handleEditPost = (postId: string) => {
        const post = posts.find(p => p.id === postId);
        if (!post) return;

        const updatedText = window.prompt('Editar pulse', post.text);
        if (!updatedText || !updatedText.trim()) return;

        setPosts(prev => prev.map(p => p.id === postId ? { ...p, text: updatedText.trim(), timestamp: 'Editado agora' } : p));
    };

    const handleDeletePost = (postId: string) => {
        const confirmed = window.confirm('Deseja realmente excluir este pulse?');
        if (!confirmed) return;

        setPosts(prev => prev.filter(p => p.id !== postId));
    };

    const handleDeactivatePost = (postId: string) => {
        const confirmed = window.confirm('Deseja inativar este pulse?');
        if (!confirmed) return;

        setPosts(prev => prev.map(p => p.id === postId ? { ...p, isActive: false } : p));
    };

    const handleTogglePostBookmark = (postId: string) => {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p));
    };

    const showLightboxActionToast = (message: string) => {
        setLightboxActionToastMessage(message);
        window.setTimeout(() => setLightboxActionToastMessage(null), 2200);
    };

    const handleEditChannel = (channelId: string) => {
        const channel = channels.find(c => c.id === channelId);
        if (!channel) return;

        const updatedName = window.prompt('Editar nome do canal', channel.name);
        if (!updatedName || !updatedName.trim()) return;
        const updatedDescription = window.prompt('Editar descrição do canal', channel.description);
        if (!updatedDescription || !updatedDescription.trim()) return;

        setChannels(prev => prev.map(c => c.id === channelId ? { ...c, name: updatedName.trim(), description: updatedDescription.trim() } : c));
    };

    const handleDeleteChannel = (channelId: string) => {
        const confirmed = window.confirm('Deseja realmente excluir este canal?');
        if (!confirmed) return;

        setChannels(prev => prev.filter(c => c.id !== channelId));
        if (selectedChannel === channelId) {
            setSelectedChannel(null);
        }
    };

    const handleDeactivateChannel = (channelId: string) => {
        const confirmed = window.confirm('Deseja inativar este canal?');
        if (!confirmed) return;

        setChannels(prev => prev.map(c => c.id === channelId ? { ...c, isActive: false } : c));
        if (selectedChannel === channelId) {
            setSelectedChannel(null);
        }
    };

    const handleChannelContributors = (channelId: string) => {
        const channel = channels.find(c => c.id === channelId);
        window.alert(`Abrir gestão de contribuidores do canal "${channel?.name || 'Canal'}".`);
    };

    const handleChannelTransfer = (channelId: string) => {
        const channel = channels.find(c => c.id === channelId);
        window.alert(`Abrir fluxo de transferência do canal "${channel?.name || 'Canal'}".`);
    };

    const handleChannelLinkGroup = (channelId: string) => {
        const channel = channels.find(c => c.id === channelId);
        window.alert(`Abrir fluxo de vinculação de grupos para "${channel?.name || 'Canal'}".`);
    };

    const handleToggleChannelSubscription = (channelId: string) => {
        setChannels(prev => prev.map(channel => (
            channel.id === channelId
                ? { ...channel, isSubscribed: !channel.isSubscribed }
                : channel
        )));
    };

    const activeChannels = scenarioChannels.filter(channel => channel.isActive !== false);
    const myOwnedChannels = activeChannels.filter(channel => channel.ownerId === currentUserId);
    const subscribedChannels = activeChannels.filter(
        channel => channel.isSubscribed && channel.ownerId !== currentUserId
    );
    const availableCategories = Array.from(new Set(activeChannels.map(channel => channel.category || 'Geral')));
    const channelsInSelectedCategory = selectedCategory
        ? activeChannels.filter(channel => (channel.category || 'Geral') === selectedCategory)
        : activeChannels;
    const channelsFilteredForList = selectedChannel
        ? channelsInSelectedCategory.filter(channel => channel.id === selectedChannel)
        : channelsInSelectedCategory;
    const visibleChannelsForList = React.useMemo(
        () => channelsFilteredForList.slice(0, loadedChannelsCount),
        [channelsFilteredForList, loadedChannelsCount]
    );
    const hasMoreChannels = loadedChannelsCount < channelsFilteredForList.length;
    const activeChannelIds = new Set(activeChannels.map(channel => channel.id));
    const visiblePosts = scenarioPosts.filter(post => post.isActive !== false && activeChannelIds.has(post.channelId));
    const postsByCategory = selectedCategory
        ? visiblePosts.filter(post => (channelsMap[post.channelId]?.category || 'Geral') === selectedCategory)
        : visiblePosts;
    const filteredPosts = selectedChannel
        ? postsByCategory.filter(p => p.channelId === selectedChannel)
        : postsByCategory;
    const displayedFeedPosts = React.useMemo(() => {
        if (feedQuickFilter === 'favorites') {
            return filteredPosts.filter(post => !!post.isBookmarked);
        }
        if (feedQuickFilter === 'featured') {
            return [...filteredPosts].sort((a, b) => {
                if (b.rating !== a.rating) return b.rating - a.rating;
                return (b.ratingVotes || 0) - (a.ratingVotes || 0);
            });
        }
        return filteredPosts;
    }, [feedQuickFilter, filteredPosts]);
    const visibleFeedPosts = React.useMemo(
        () => displayedFeedPosts.slice(0, loadedFeedCount),
        [displayedFeedPosts, loadedFeedCount]
    );
    const hasMoreFeedPosts = loadedFeedCount < displayedFeedPosts.length;
    React.useEffect(() => {
        setLoadedFeedCount(Math.min(INITIAL_FEED_BATCH, displayedFeedPosts.length));
        setIsLoadingMoreFeed(false);
    }, [INITIAL_FEED_BATCH, displayedFeedPosts.length, feedDisplayMode, selectedChannel, selectedCategory, feedQuickFilter]);

    React.useEffect(() => {
        if (userViewMode === 'admin') return;
        setIsCreateModalOpen(false);
        if (viewMode === 'management') {
            setViewMode('feed');
        }
    }, [userViewMode, viewMode]);

    React.useEffect(() => {
        if (viewMode !== 'feed' || !hasMoreFeedPosts) return;
        if (!feedSentinelRef.current || !socialScrollRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (!entry?.isIntersecting || isLoadingMoreFeed || feedLoadTimeoutRef.current) return;
                setIsLoadingMoreFeed(true);
                feedLoadTimeoutRef.current = window.setTimeout(() => {
                    setLoadedFeedCount((prev) => Math.min(prev + FEED_BATCH_SIZE, displayedFeedPosts.length));
                    setIsLoadingMoreFeed(false);
                    feedLoadTimeoutRef.current = null;
                }, 650);
            },
            {
                root: socialScrollRef.current,
                rootMargin: '320px 0px',
                threshold: 0
            }
        );

        observer.observe(feedSentinelRef.current);

        return () => {
            observer.disconnect();
        };
    }, [FEED_BATCH_SIZE, displayedFeedPosts.length, hasMoreFeedPosts, isLoadingMoreFeed, loadedFeedCount, viewMode]);

    React.useEffect(() => {
        setLoadedChannelsCount(Math.min(INITIAL_CHANNELS_BATCH, channelsFilteredForList.length));
        setIsLoadingMoreChannels(false);
    }, [INITIAL_CHANNELS_BATCH, channelsFilteredForList.length, selectedChannel, selectedCategory, viewMode]);

    React.useEffect(() => {
        if (viewMode !== 'channels' || !!selectedChannel || !hasMoreChannels) return;
        if (!channelsSentinelRef.current || !socialScrollRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (!entry?.isIntersecting || isLoadingMoreChannels || channelsLoadTimeoutRef.current) return;
                setIsLoadingMoreChannels(true);
                channelsLoadTimeoutRef.current = window.setTimeout(() => {
                    setLoadedChannelsCount((prev) => Math.min(prev + CHANNELS_BATCH_SIZE, channelsFilteredForList.length));
                    setIsLoadingMoreChannels(false);
                    channelsLoadTimeoutRef.current = null;
                }, 500);
            },
            {
                root: socialScrollRef.current,
                rootMargin: '280px 0px',
                threshold: 0
            }
        );

        observer.observe(channelsSentinelRef.current);

        return () => {
            observer.disconnect();
        };
    }, [CHANNELS_BATCH_SIZE, channelsFilteredForList.length, hasMoreChannels, isLoadingMoreChannels, loadedChannelsCount, selectedChannel, viewMode]);

    React.useEffect(() => {
        return () => {
            if (feedLoadTimeoutRef.current) {
                window.clearTimeout(feedLoadTimeoutRef.current);
                feedLoadTimeoutRef.current = null;
            }
            if (channelsLoadTimeoutRef.current) {
                window.clearTimeout(channelsLoadTimeoutRef.current);
                channelsLoadTimeoutRef.current = null;
            }
        };
    }, []);
    const featuredPreviewPosts = React.useMemo(
        () => [...visiblePosts].sort((a, b) => b.rating - a.rating).slice(0, 4),
        [visiblePosts]
    );
    const favoritePreviewPosts = React.useMemo(
        () => visiblePosts.filter(post => !!post.isBookmarked).slice(0, 4),
        [visiblePosts]
    );
    const selectedChannelName = selectedChannel ? channelsMap[selectedChannel]?.name || 'Canal selecionado' : null;
    const selectedChannelData = selectedChannel ? channelsMap[selectedChannel] : null;
    const canManageAdminFeatures = userViewMode === 'admin';
    const canManageSelectedChannel = canManageAdminFeatures && !!selectedChannelData && selectedChannelData.ownerId === currentUserId;
    const canEditContributorsSelectedChannel = canManageSelectedChannel;
    const canTransferSelectedChannel = canManageSelectedChannel;
    const canDeleteSelectedChannel = canManageSelectedChannel;
    const selectedChannelPosts = React.useMemo(
        () => (selectedChannel ? visiblePosts.filter(post => post.channelId === selectedChannel) : []),
        [selectedChannel, visiblePosts]
    );
    const selectedChannelDiscussionItems = React.useMemo(
        () => selectedChannelPosts.flatMap(post => post.comments.map(comment => ({ ...comment, postId: post.id }))),
        [selectedChannelPosts]
    );
    const hasFilterSelection = !!selectedChannel || !!selectedCategory;
    const emptyFeedTitle = hasFilterSelection
        ? 'Nenhum pulse encontrado para este filtro'
        : 'Nenhum pulse disponível no momento';
    const emptyFeedDescription = selectedChannelName
        ? `Não há pulses publicados no canal ${selectedChannelName}.`
        : selectedCategory
            ? `Não há pulses publicados na categoria ${selectedCategory}.`
            : 'Ainda não existem pulses ativos para exibição no feed social.';
    const quickFilterLabel = feedQuickFilter === 'featured'
        ? 'Pulses em destaque'
        : feedQuickFilter === 'favorites'
            ? 'Pulses favoritos'
            : '';

    React.useEffect(() => {
        setChannelInternalTab('pulses');
        setChannelDiscussionText('');
    }, [selectedChannel]);
    const activePost = activePostId ? displayedFeedPosts.find(post => post.id === activePostId) || scenarioPosts.find(post => post.id === activePostId) || null : null;
    const activePostIndex = activePostId ? displayedFeedPosts.findIndex(post => post.id === activePostId) : -1;
    const hasPreviousPost = activePostIndex > 0;
    const hasNextPost = activePostIndex >= 0 && activePostIndex < displayedFeedPosts.length - 1;

    const openPreviousPost = () => {
        if (!hasPreviousPost) return;
        setActivePostId(displayedFeedPosts[activePostIndex - 1].id);
        setShouldFocusLightboxComment(false);
    };

    const openNextPost = () => {
        if (!hasNextPost) return;
        setActivePostId(displayedFeedPosts[activePostIndex + 1].id);
        setShouldFocusLightboxComment(false);
    };

    const handleOpenPost = (postId: string, options?: { focusComment?: boolean }) => {
        setActivePostId(postId);
        setShouldFocusLightboxComment(!!options?.focusComment);
    };

    React.useEffect(() => {
        if (!activePostId || !shouldFocusLightboxComment) return;
        const focusTimer = window.setTimeout(() => {
            lightboxCommentInputRef.current?.focus();
            setShouldFocusLightboxComment(false);
        }, 30);
        return () => window.clearTimeout(focusTimer);
    }, [activePostId, shouldFocusLightboxComment]);

    const markChannelCoverAsFailed = (channelId: string) => {
        setFailedChannelCovers(prev => ({ ...prev, [channelId]: true }));
    };

    const markDiscoveryThumbAsFailed = (postId: string) => {
        setFailedDiscoveryThumbs(prev => ({ ...prev, [postId]: true }));
    };

    const resetCreateForm = () => {
        setCreateMainType(null);
        setCreateSubtype(null);
        setCreateFile(null);
        setCreateName('');
        setCreateDescription('');
        setCreateExternalUrl('');
        setCreateCoverImageUrl('');
        setCreateDuration(60);
        if (uploadInputRef.current) {
            uploadInputRef.current.value = '';
        }
        if (coverUploadInputRef.current) {
            coverUploadInputRef.current.value = '';
        }
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        resetCreateForm();
    };

    const backCreateStep = () => {
        if (createSubtype) {
            setCreateSubtype(null);
            setCreateFile(null);
            setCreateExternalUrl('');
            if (uploadInputRef.current) {
                uploadInputRef.current.value = '';
            }
            return;
        }
        if (createMainType) {
            setCreateMainType(null);
            return;
        }
        closeCreateModal();
    };

    const handleSelectMainType = (mainType: Exclude<CreateMainType, null>) => {
        setCreateMainType(mainType);
        setCreateSubtype(null);
        setCreateFile(null);
        setCreateExternalUrl('');
        setCreateCoverImageUrl('');
        if (uploadInputRef.current) {
            uploadInputRef.current.value = '';
        }
    };

    const handleSelectSubtype = (subtype: Exclude<CreateSubtype, null>) => {
        setCreateSubtype(subtype);
        setCreateFile(null);
        setCreateExternalUrl('');
        setCreateCoverImageUrl('');
        if (uploadInputRef.current) {
            uploadInputRef.current.value = '';
        }

        const accept = CREATE_ACCEPT_TYPES[subtype];
        if (accept && createMainType === 'FILE' && uploadInputRef.current) {
            uploadInputRef.current.accept = accept;
            uploadInputRef.current.click();
        }
    };

    const handleSelectCreateFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setCreateFile(file);
        if (file && !createName.trim()) {
            const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
            setCreateName(fileNameWithoutExtension);
        }
    };

    const applyCreateCoverFile = (file: File | null) => {
        if (!file) return;
        const localUrl = URL.createObjectURL(file);
        setCreateCoverImageUrl(localUrl);
    };

    const handleSelectCreateCover = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        applyCreateCoverFile(file);
    };

    const needsSubtype = !!createMainType;
    const isCreateDetailsStepReady = !!createMainType && (!needsSubtype || !!createSubtype);
    const shouldShowCoverUpload = createSubtype === 'YOUTUBE'
        || createSubtype === 'VIMEO'
        || createSubtype === 'SOUNDCLOUD'
        || createSubtype === 'GOOGLE_DRIVE'
        || createSubtype === 'H5P'
        || createSubtype === 'GENIALLY';

    const isCreateNameTooLong = createName.length > (createMainType === 'QUIZ' ? QUIZ_NAME_MAX_LENGTH : CONTENT_NAME_MAX_LENGTH);

    const createUrlError = React.useMemo(() => {
        const normalizedUrl = createExternalUrl.trim();
        if (!normalizedUrl) return '';

        if (createSubtype === 'YOUTUBE' && !YOUTUBE_REGEX.test(normalizedUrl)) return 'URL inválida para YouTube';
        if (createSubtype === 'VIMEO' && !VIMEO_REGEX.test(normalizedUrl)) return 'URL inválida para Vimeo';
        if (createSubtype === 'SOUNDCLOUD' && !SOUNDCLOUD_REGEX.test(normalizedUrl)) return 'URL inválida para SoundCloud';
        if (createSubtype === 'GOOGLE_DRIVE' && !GOOGLE_DRIVE_REGEX.test(normalizedUrl)) return 'URL inválida para Google Drive';
        if (createSubtype === 'GENIALLY' && !GENIALLY_REGEX.test(normalizedUrl)) return 'URL inválida para Genially';
        if (createSubtype === 'H5P' && !H5P_REGEX.test(normalizedUrl)) return 'URL inválida para H5P';
        if (createSubtype === 'EXTERNAL_LINK' && !URL_REGEX.test(normalizedUrl)) return 'URL inválida';
        return '';
    }, [createExternalUrl, createSubtype]);

    const inferPostFromExternalUrl = (url: string): { contentType: string; embed?: Post['embed'] } => {
        const lower = url.toLowerCase();
        if (createSubtype === 'YOUTUBE') {
            const match = url.match(/(?:youtube\.com\/\S*(?:\/embed\/|watch\?(?:\S*?&?v=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/);
            const videoId = match?.[1];
            if (videoId) {
                return {
                    contentType: 'VIDEO',
                    embed: { provider: 'youtube', embedUrl: `https://www.youtube.com/embed/${videoId}` }
                };
            }
        }
        if (createSubtype === 'VIMEO') {
            const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
            const videoId = match?.[1];
            if (videoId) {
                return {
                    contentType: 'VIDEO',
                    embed: { provider: 'vimeo', embedUrl: `https://player.vimeo.com/video/${videoId}` }
                };
            }
        }
        if (createSubtype === 'SOUNDCLOUD') {
            return {
                contentType: 'PODCAST',
                embed: { provider: 'soundcloud', embedUrl: url }
            };
        }
        if (createSubtype === 'GOOGLE_DRIVE') {
            if (lower.includes('/spreadsheets/')) {
                return { contentType: 'SPREADSHEET', embed: { provider: 'google_sheets', embedUrl: url } };
            }
            if (lower.includes('/presentation/')) {
                return { contentType: 'PRESENTATION', embed: { provider: 'google_slides', embedUrl: url } };
            }
            return { contentType: 'TEXT', embed: { provider: 'google_docs', embedUrl: url } };
        }
        if (createSubtype === 'GENIALLY') {
            return { contentType: 'GENIALLY', embed: { provider: 'genially', embedUrl: url } };
        }
        if (createSubtype === 'H5P') {
            return { contentType: 'H5P', embed: { provider: 'h5p', embedUrl: url } };
        }
        return { contentType: 'TEXT', embed: { provider: 'link', embedUrl: url } };
    };

    const getContentTypeFromSubtype = (subtype: CreateSubtype): string => {
        switch (subtype) {
            case 'VIDEO':
            case 'IMAGE':
            case 'PODCAST':
            case 'PDF':
                return subtype;
            case 'WORD':
                return 'TEXT';
            case 'POWERPOINT':
                return 'PRESENTATION';
            case 'EXCEL':
                return 'SPREADSHEET';
            case 'GENIALLY':
                return 'GENIALLY';
            case 'H5P':
                return 'H5P';
            case 'EVALUATIVE_QUIZ':
            case 'SURVEY_QUIZ':
                return 'QUIZ';
            default:
                return 'TEXT';
        }
    };

    const canSubmitCreate = React.useMemo(() => {
        if (!createMainType || !createName.trim() || !createChannelId || isCreateNameTooLong) return false;
        if (needsSubtype && !createSubtype) return false;
        if (createMainType === 'FILE') return !!createFile;
        if (createMainType === 'LINK' || createMainType === 'HTML') {
            if (createMainType === 'HTML' && createDuration < 1) return false;
            const normalizedUrl = createExternalUrl.trim();
            if (createSubtype === 'GENIALLY') {
                const hasValidUrl = !!normalizedUrl && !createUrlError;
                const hasZipFile = !!createFile;
                return hasValidUrl || hasZipFile;
            }
            if (!normalizedUrl || !!createUrlError) return false;
        }
        return true;
    }, [
        createMainType,
        createSubtype,
        createName,
        createChannelId,
        createFile,
        createExternalUrl,
        createDuration,
        createUrlError,
        isCreateNameTooLong,
        needsSubtype
    ]);

    const selectedMainOption = createMainType ? CREATE_MAIN_OPTIONS.find(option => option.type === createMainType) : undefined;
    const selectedSubOption = createMainType && createSubtype
        ? CREATE_SUB_OPTIONS[createMainType]?.find(option => option.type === createSubtype)
        : undefined;
    const createDialogTypeLabel = selectedSubOption?.label || selectedMainOption?.label || '';
    const createDialogPreviewKey = (createSubtype || createMainType || '').toLowerCase();
    const createDialogPreviewGif = createDialogPreviewKey
        ? `https://assets.keepsdev.com/gifs/gif-${createDialogPreviewKey}.gif`
        : '';

    const handleSubmitCreatePulse = () => {
        if (!canSubmitCreate) return;

        const createdAt = 'Agora mesmo';
        let contentType = createSubtype ? getContentTypeFromSubtype(createSubtype) : 'QUIZ';
        let imageUrl: string | undefined = undefined;
        let mediaUrl: string | undefined = undefined;
        let embed: Post['embed'] | undefined = undefined;

        if (createMainType === 'FILE' && createFile) {
            const localUrl = URL.createObjectURL(createFile);
            if (contentType === 'IMAGE') {
                imageUrl = localUrl;
            } else if (contentType === 'VIDEO' || contentType === 'PODCAST') {
                mediaUrl = localUrl;
                imageUrl = createCoverImageUrl || KONQUEST_DEFAULT_COVER_IMAGE;
            } else {
                embed = { provider: 'file', embedUrl: localUrl };
                imageUrl = createCoverImageUrl || KONQUEST_DEFAULT_COVER_IMAGE;
            }
        } else if (createMainType === 'HTML' && createSubtype === 'GENIALLY' && createFile) {
            const localUrl = URL.createObjectURL(createFile);
            contentType = 'GENIALLY';
            embed = { provider: 'file', embedUrl: localUrl };
            imageUrl = createCoverImageUrl || KONQUEST_DEFAULT_COVER_IMAGE;
        } else if ((createMainType === 'LINK' || createMainType === 'HTML') && createExternalUrl.trim()) {
            const inferred = inferPostFromExternalUrl(createExternalUrl.trim());
            contentType = inferred.contentType;
            embed = inferred.embed;
            imageUrl = createCoverImageUrl || KONQUEST_DEFAULT_COVER_IMAGE;
        } else if (createMainType === 'QUIZ') {
            imageUrl = createCoverImageUrl || KONQUEST_DEFAULT_COVER_IMAGE;
        }

        const newPost: Post = {
            id: `post-${Date.now()}`,
            userId: 'user-4',
            channelId: createChannelId,
            contentType,
            text: createDescription.trim() || `Novo pulse: ${createName.trim()}`,
            timestamp: createdAt,
            imageUrl,
            mediaUrl,
            durationSeconds: createMainType === 'HTML' ? createDuration * 60 : createDuration,
            embed,
            rating: 0,
            ratingVotes: 0,
            userRating: 0,
            likes: 0,
            commentCount: 0,
            isLiked: false,
            isBookmarked: false,
            isActive: true,
            comments: []
        };

        setPosts(prev => [newPost, ...prev]);
        closeCreateModal();
    };

    const renderLightboxMedia = (post: Post) => {
        const type = (post.contentType || '').toUpperCase();
        const isVideoEmbed = post.embed && (post.embed.provider === 'youtube' || post.embed.provider === 'vimeo');
        const iframeTypes = new Set(['PDF', 'SPREADSHEET', 'TEXT', 'PRESENTATION', 'H5P', 'GENIALLY']);

        if (type === 'QUIZ') {
            return (
                <div className="w-full h-full flex items-center justify-center p-8">
                    <div className="max-w-xl text-center text-white">
                        <Icon name="quiz" size="lg" className="mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Quiz do Konquest</h3>
                        <p className="text-white/80">Este pulse possui formato de questionário interativo.</p>
                    </div>
                </div>
            );
        }

        if (type === 'PODCAST' && post.mediaUrl) {
            return (
                <div className="relative w-full h-full">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${post.imageUrl || KONQUEST_DEFAULT_COVER_IMAGE})` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8">
                        <div className="w-full max-w-xl rounded-xl bg-white p-4 sm:p-6 shadow-lg">
                            <h3 className="text-gray-900 font-bold mb-3">Podcast</h3>
                            <audio controls className="w-full">
                                <source src={post.mediaUrl} />
                            </audio>
                        </div>
                    </div>
                </div>
            );
        }

        if (type === 'VIDEO') {
            if (isVideoEmbed && post.embed) {
                return (
                    <iframe
                        src={post.embed.embedUrl}
                        title={`Embedded content for post ${post.id}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    />
                );
            }
            if (post.mediaUrl) {
                return (
                    <video controls className="w-full h-full object-contain bg-black">
                        <source src={post.mediaUrl} />
                    </video>
                );
            }
        }

        if (post.embed && iframeTypes.has(type)) {
            return (
                <iframe
                    src={post.embed.embedUrl}
                    title={`Embedded content for post ${post.id}`}
                    frameBorder="0"
                    allowFullScreen
                    className="w-full h-full bg-white"
                />
            );
        }

        if (post.imageUrl) {
            return <img src={post.imageUrl} alt="Post content" className="w-full h-full object-contain" />;
        }

        if (post.embed) {
            return (
                <iframe
                    src={post.embed.embedUrl}
                    title={`Embedded content for post ${post.id}`}
                    frameBorder="0"
                    allowFullScreen
                    className="w-full h-full bg-white"
                />
            );
        }

        return (
            <div className="p-8">
                <p className="text-white text-lg leading-relaxed">{post.text}</p>
            </div>
        );
    };

    React.useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setActivePostId(null);
            } else if (event.key === 'ArrowLeft') {
                openPreviousPost();
            } else if (event.key === 'ArrowRight') {
                openNextPost();
            }
        };
        if (activePostId) {
            window.addEventListener('keydown', onKeyDown);
        }
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [activePostId, hasPreviousPost, hasNextPost, activePostIndex, displayedFeedPosts]);

    React.useEffect(() => {
        setIsLightboxDescriptionExpanded(false);
        setIsLightboxSidebarCollapsed(false);
    }, [activePostId]);

    React.useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (lightboxRatingMenuRef.current && !lightboxRatingMenuRef.current.contains(event.target as Node)) {
                setIsLightboxRatingMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const renderTabsBar = () => (
        <div className="w-full flex items-center gap-2 bg-gray-200/50 p-1 rounded-lg">
            <div className="flex items-center gap-1 flex-1 min-w-0">
            <button
                onClick={() => setViewMode('feed')}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === 'feed' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Icon name="dynamic_feed" size="sm" />
                <span>Feed</span>
            </button>
            <button
                onClick={() => setViewMode('channels')}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === 'channels' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Icon name="hub" size="sm" />
                <span>Canais</span>
            </button>
            </div>
            {viewMode === 'feed' && (
                <div className="pl-2 border-l border-gray-300 flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => setFeedDisplayMode('timeline')}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${feedDisplayMode === 'timeline' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Timeline"
                    >
                        <Icon name="view_day" size="sm" />
                    </button>
                    <button
                        onClick={() => setFeedDisplayMode('grid')}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${feedDisplayMode === 'grid' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Grid"
                    >
                        <Icon name="grid_view" size="sm" />
                    </button>
                </div>
            )}
            {viewMode !== 'feed' && (
                <div className="pl-2 border-l border-gray-300 flex items-center gap-2 shrink-0">
                    <button
                        disabled
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-not-allowed ${feedDisplayMode === 'timeline' ? 'text-purple-400' : 'text-gray-300'}`}
                        title="Timeline"
                    >
                        <Icon name="view_day" size="sm" />
                    </button>
                    <button
                        disabled
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-not-allowed ${feedDisplayMode === 'grid' ? 'text-purple-400' : 'text-gray-300'}`}
                        title="Grid"
                    >
                        <Icon name="grid_view" size="sm" />
                    </button>
                </div>
            )}
        </div>
    );

    const renderChannelSidebarOption = (channel: Channel) => (
        <button
            key={channel.id}
            onClick={() => setSelectedChannel(channel.id)}
            className={`w-full text-left px-2 py-2 rounded-lg text-sm font-medium transition-all ${selectedChannel === channel.id ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
            <div className="min-w-0 flex-1">
                <span className="truncate block text-sm">{channel.name}</span>
            </div>
        </button>
    );

    const renderPulseDiscoveryCards = () => (
        <>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="mb-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Icon name="auto_awesome" size="sm" className="text-purple-600" />
                        Pulses em Destaque
                    </h3>
                </div>
                {featuredPreviewPosts.length > 0 ? (
                    <div className="space-y-2">
                        {featuredPreviewPosts.map(post => (
                            <button
                                key={post.id}
                                onClick={() => handleOpenPost(post.id)}
                                className="w-full text-left px-2 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    {post.imageUrl && !failedDiscoveryThumbs[post.id] ? (
                                        <img
                                            src={post.imageUrl}
                                            alt=""
                                            className="w-10 h-10 rounded-md object-cover flex-shrink-0 bg-gray-100"
                                            loading="lazy"
                                            onError={() => markDiscoveryThumbAsFailed(post.id)}
                                        />
                                    ) : (
                                        <div
                                            className="w-10 h-10 rounded-md flex-shrink-0 relative overflow-hidden bg-cover bg-center"
                                            style={{ backgroundImage: `url(${KONQUEST_DEFAULT_COVER_IMAGE})` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                        </div>
                                    )}
                                    <p className="min-w-0 flex-1 text-left truncate">{post.text}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">Ainda não há pulses em destaque.</p>
                )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="mb-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Icon name="bookmark" size="sm" className="text-purple-600" />
                        Pulses Favoritos
                    </h3>
                </div>
                {favoritePreviewPosts.length > 0 ? (
                    <div className="space-y-2">
                        {favoritePreviewPosts.map(post => (
                            <button
                                key={post.id}
                                onClick={() => handleOpenPost(post.id)}
                                className="w-full text-left px-2 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    {post.imageUrl && !failedDiscoveryThumbs[post.id] ? (
                                        <img
                                            src={post.imageUrl}
                                            alt=""
                                            className="w-10 h-10 rounded-md object-cover flex-shrink-0 bg-gray-100"
                                            loading="lazy"
                                            onError={() => markDiscoveryThumbAsFailed(post.id)}
                                        />
                                    ) : (
                                        <div
                                            className="w-10 h-10 rounded-md flex-shrink-0 relative overflow-hidden bg-cover bg-center"
                                            style={{ backgroundImage: `url(${KONQUEST_DEFAULT_COVER_IMAGE})` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                        </div>
                                    )}
                                    <p className="min-w-0 flex-1 text-left truncate">{post.text}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">Você ainda não possui pulses favoritos.</p>
                )}
            </div>
        </>
    );

    return (
        <div ref={socialScrollRef} className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {viewMode === 'management' ? (
                    <div className="space-y-8 animate-fadeIn">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-6 lg:col-start-4">
                                {renderTabsBar()}
                            </div>
                        </div>
                        {/* KPI Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <KpiCard label="Atividade Semanal" value="8.420" trend={{ value: 12, isUp: true }} icon="insights" color="purple" />
                            <KpiCard label="Humor da Rede" value="8.4" trend={{ value: 0.2, isUp: true }} icon="mood" color="green" />
                            <KpiCard label="Inscrições em Canais" value="152" trend={{ value: 8, isUp: true }} icon="hub" color="blue" />
                            <KpiCard label="Menções Críticas" value="0" icon="notifications_active" color="orange" />
                        </div>

                        {/* Main Management Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Analytics Section */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-bold text-gray-900">Tendência de Engajamento</h3>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 bg-purple-50 text-purple-600 rounded-md text-xs font-bold">7D</button>
                                            <button className="px-3 py-1 text-gray-400 hover:bg-gray-50 rounded-md text-xs font-bold">30D</button>
                                        </div>
                                    </div>
                                    <SentimentChart />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-bold text-gray-800">Logs de Pulses Recentes</h2>
                                        <button className="text-sm text-purple-600 font-semibold hover:underline">Ver todos os logs</button>
                                    </div>
                                    <PulsesTable />
                                </div>
                            </div>

                            {/* Rankings & Topics Section */}
                            <div className="space-y-8">
                                {renderPulseDiscoveryCards()}
                            </div>
                        </div>
                    </div>
                ) : viewMode === 'channels' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
                        {/* Sidebar - Channels & Categories */}
                        {!selectedChannelData && (
                        <aside className="space-y-6 lg:col-span-3 lg:order-1">
                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Icon name="hub" size="sm" className="text-purple-600" />
                                    Canais
                                </h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => {
                                            setSelectedChannel(null);
                                            setFeedQuickFilter('all');
                                        }}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${!selectedChannel ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        Todos os canais
                                    </button>
                                    {canManageAdminFeatures && (
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400 px-2 mb-1">Criados por mim</p>
                                            <div className="space-y-1">
                                                {myOwnedChannels.length > 0 ? (
                                                    myOwnedChannels.map(channel => renderChannelSidebarOption(channel))
                                                ) : (
                                                    <p className="px-3 py-2 text-xs text-gray-400">Você ainda não criou canais.</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400 px-2 mb-1">Inscritos</p>
                                        <div className="space-y-1">
                                            {subscribedChannels.length > 0 ? (
                                                subscribedChannels.map(channel => renderChannelSidebarOption(channel))
                                            ) : (
                                                <p className="px-3 py-2 text-xs text-gray-400">Sem canais inscritos no momento.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Icon name="category" size="sm" className="text-purple-600" />
                                    Categorias
                                </h3>
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => {
                                            setSelectedCategory(null);
                                            setFeedQuickFilter('all');
                                        }}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${!selectedCategory ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        Todas as categorias
                                    </button>
                                    {availableCategories.length > 0 ? (
                                        availableCategories.map(category => (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${selectedCategory === category ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                {category}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="px-3 py-2 text-xs text-gray-400">Sem categorias disponíveis.</p>
                                    )}
                                </div>
                            </div>
                        </aside>
                        )}

                        {/* Main Channels */}
                        <div className={`${selectedChannelData ? 'lg:col-span-12 lg:order-1' : 'lg:col-span-6 lg:order-2'} space-y-6`}>
                            {!selectedChannelData && renderTabsBar()}
                            {selectedChannelData ? (
                                <div className="space-y-6">
                                    <div>
                                        <button
                                            onClick={() => setSelectedChannel(null)}
                                            className="inline-flex items-center gap-2 h-10 px-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100"
                                        >
                                            <Icon name="chevron_left" size="sm" />
                                            Voltar
                                        </button>
                                    </div>
                                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-visible">
                                        <div className="flex items-stretch min-h-[144px]">
                                            {selectedChannelData.imageUrl && !failedChannelCovers[selectedChannelData.id] ? (
                                                <div className="w-48 h-48 lg:w-52 lg:h-52 self-start flex-shrink-0 bg-gray-100 overflow-hidden rounded-l-xl">
                                                    <img
                                                        src={selectedChannelData.imageUrl}
                                                        alt={selectedChannelData.name}
                                                        className="block w-full h-full object-cover rounded-l-xl"
                                                        onError={() => markChannelCoverAsFailed(selectedChannelData.id)}
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    className="w-48 h-48 lg:w-52 lg:h-52 self-start flex-shrink-0 relative overflow-hidden bg-cover bg-center rounded-l-xl"
                                                    style={{ backgroundImage: `url(${KONQUEST_DEFAULT_COVER_IMAGE})` }}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1 p-4 sm:p-5 flex flex-col justify-between">
                                                <div className="min-w-0">
                                                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">{selectedChannelData.name}</h2>
                                                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                                        <Icon name="lock_open" size="sm" />
                                                        <span>Canal aberto</span>
                                                    </div>
                                                    <p className="mt-3 text-sm text-gray-700 line-clamp-2">{selectedChannelData.description}</p>
                                                </div>
                                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <Icon name="play_circle" size="sm" />
                                                            {selectedChannelPosts.length} pulses
                                                        </span>
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <Icon name="person" size="sm" />
                                                            {selectedChannelData.isSubscribed ? 1 : 0} inscritos
                                                        </span>
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <Icon name="groups" size="sm" />
                                                            {selectedChannelData.ownerId ? 1 : 0} contribuidores
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleToggleChannelSubscription(selectedChannelData.id)}
                                                            className="h-10 px-3 text-sm font-semibold text-gray-700 hover:text-purple-700"
                                                        >
                                                            {selectedChannelData.isSubscribed ? 'Inscrito' : 'Inscrever-se'}
                                                        </button>
                                                        {canManageAdminFeatures && (
                                                            <>
                                                                <button
                                                                    onClick={() => {
                                                                        setCreateChannelId(selectedChannelData.id);
                                                                        setIsCreateModalOpen(true);
                                                                    }}
                                                                    className="h-10 px-4 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700"
                                                                >
                                                                    Novo pulse
                                                                </button>
                                                                <details className="relative">
                                                                    <summary className="list-none h-10 px-3 rounded-lg border border-gray-300 text-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-50 [&::-webkit-details-marker]:hidden">
                                                                        <Icon name="arrow_drop_down" size="sm" />
                                                                    </summary>
                                                                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-20">
                                                                        {canManageSelectedChannel && (
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleEditChannel(selectedChannelData.id);
                                                                                    (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open');
                                                                                }}
                                                                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                                            >
                                                                                Editar
                                                                            </button>
                                                                        )}
                                                                        {canEditContributorsSelectedChannel && (
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleChannelContributors(selectedChannelData.id);
                                                                                    (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open');
                                                                                }}
                                                                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                                            >
                                                                                Contribuidores
                                                                            </button>
                                                                        )}
                                                                        {canTransferSelectedChannel && (
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleChannelTransfer(selectedChannelData.id);
                                                                                    (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open');
                                                                                }}
                                                                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                                            >
                                                                                Transferir
                                                                            </button>
                                                                        )}
                                                                        {canDeleteSelectedChannel && (
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleDeleteChannel(selectedChannelData.id);
                                                                                    (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open');
                                                                                }}
                                                                                className="w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                                                                            >
                                                                                Excluir
                                                                            </button>
                                                                        )}
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleChannelLinkGroup(selectedChannelData.id);
                                                                                (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open');
                                                                            }}
                                                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                                        >
                                                                            Vincular grupo
                                                                        </button>
                                                                    </div>
                                                                </details>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                        <div className="px-4 pt-4">
                                            <div className="inline-flex items-center rounded-lg bg-gray-100 p-1">
                                                <button
                                                    onClick={() => setChannelInternalTab('pulses')}
                                                    className={`h-9 px-4 rounded-md text-sm font-semibold ${channelInternalTab === 'pulses' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                                                >
                                                    Pulses
                                                </button>
                                                <button
                                                    onClick={() => setChannelInternalTab('discussion')}
                                                    className={`h-9 px-4 rounded-md text-sm font-semibold ${channelInternalTab === 'discussion' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                                                >
                                                    Discussão
                                                </button>
                                            </div>
                                        </div>
                                        {channelInternalTab === 'pulses' ? (
                                            <div className="p-4 grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {selectedChannelPosts.length > 0 ? selectedChannelPosts.map(post => (
                                                    <PostCard
                                                        key={post.id}
                                                        post={post.imageUrl ? post : { ...post, imageUrl: KONQUEST_DEFAULT_COVER_IMAGE }}
                                                        onRate={handleRate}
                                                        onAddComment={handleAddComment}
                                                        onOpenPost={handleOpenPost}
                                                        onToggleBookmark={handleTogglePostBookmark}
                                                        viewMode="grid"
                                                    />
                                                )) : (
                                                    <div className="col-span-full p-8 text-center text-sm text-gray-500">
                                                        Este canal ainda não possui pulses.
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="p-4 space-y-4">
                                                <div className="rounded-lg border border-gray-200 p-3">
                                                    <textarea
                                                        value={channelDiscussionText}
                                                        onChange={(e) => setChannelDiscussionText(e.target.value.slice(0, COMMENT_CHAR_LIMIT))}
                                                        placeholder="Escreva um comentário para o canal..."
                                                        rows={3}
                                                        className="w-full resize-none text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                                                    />
                                                    <div className="mt-2 flex items-center justify-between">
                                                        <p className="text-[11px] text-gray-400">{channelDiscussionText.length}/{COMMENT_CHAR_LIMIT}</p>
                                                        <button
                                                            onClick={handleSubmitChannelDiscussion}
                                                            disabled={!channelDiscussionText.trim() || selectedChannelPosts.length === 0}
                                                            className="h-9 px-3 rounded-md bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            Publicar
                                                        </button>
                                                    </div>
                                                </div>
                                                {selectedChannelDiscussionItems.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {selectedChannelDiscussionItems.map(item => (
                                                            <div key={item.id} className="rounded-lg border border-gray-200 p-3">
                                                                <div className="flex items-start gap-2">
                                                                    <img src={USERS[item.userId]?.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                                                                    <div className="min-w-0">
                                                                        <p className="text-sm font-semibold text-gray-900">{USERS[item.userId]?.name}</p>
                                                                        <p className="text-sm text-gray-700 break-words">{item.text}</p>
                                                                        <p className="text-xs text-gray-400 mt-1">{item.timestamp}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-8 text-center text-sm text-gray-500">
                                                        Ainda não há discussões neste canal.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {channelsFilteredForList.length > 0 ? (
                                        <>
                                        {visibleChannelsForList.map(channel => (
                                            <div key={channel.id} className="relative bg-white rounded-xl border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow">
                                            {canManageAdminFeatures && (
                                            <details className="absolute top-3 right-3 z-10">
                                                <summary className="list-none w-9 h-9 rounded-full bg-white/90 text-gray-700 flex items-center justify-center cursor-pointer hover:bg-white [&::-webkit-details-marker]:hidden">
                                                    <Icon name="more_horiz" size="sm" />
                                                </summary>
                                                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg border border-gray-200 shadow-lg py-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditChannel(channel.id);
                                                            (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open');
                                                        }}
                                                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeactivateChannel(channel.id);
                                                            (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open');
                                                        }}
                                                        className="w-full text-left px-3 py-2 text-sm text-amber-700 hover:bg-amber-50"
                                                    >
                                                        Inativar
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteChannel(channel.id);
                                                            (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open');
                                                        }}
                                                        className="w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                                                    >
                                                        Excluir
                                                    </button>
                                                </div>
                                            </details>
                                            )}
                                            <div className="flex gap-3">
                                                {channel.imageUrl && !failedChannelCovers[channel.id] ? (
                                                    <img
                                                        src={channel.imageUrl}
                                                        alt={channel.name}
                                                        className="w-32 h-32 rounded-lg object-cover flex-shrink-0"
                                                        onError={() => markChannelCoverAsFailed(channel.id)}
                                                    />
                                                ) : (
                                                    <div
                                                        className="w-32 h-32 rounded-lg flex-shrink-0 relative overflow-hidden bg-cover bg-center"
                                                        style={{ backgroundImage: `url(${KONQUEST_DEFAULT_COVER_IMAGE})` }}
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                                    </div>
                                                )}
                                                <div className="min-w-0 flex-1 flex flex-col">
                                                    <button
                                                        onClick={() => setSelectedChannel(channel.id)}
                                                        className="text-left"
                                                    >
                                                        <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-1">{channel.name}</h3>
                                                    </button>
                                                    <p className="text-base text-gray-700 line-clamp-1">{channel.category || 'Geral'}</p>
                                                    <div className="mt-auto pt-4 border-t border-[#d4cbde] flex items-center justify-between gap-3">
                                                        <div className="flex items-center gap-2 text-xs text-gray-700">
                                                            <span className="inline-flex items-center gap-1">
                                                                <Icon name="public" size="sm" className="text-sm" />
                                                                PT-BR
                                                            </span>
                                                            <span className="inline-flex items-center gap-1">
                                                                <Icon name="visibility" size="sm" className="text-sm" />
                                                                1
                                                            </span>
                                                            <span className="inline-flex items-center gap-1">
                                                                <Icon name="person" size="sm" className="text-sm" />
                                                                1
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleToggleChannelSubscription(channel.id)}
                                                            className="text-sm font-medium text-gray-700 transition-colors hover:text-purple-700"
                                                        >
                                                            {channel.isSubscribed ? 'Inscrito' : 'Inscrever-se'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                        ))}
                                        <div ref={channelsSentinelRef} className="h-1" />
                                        {isLoadingMoreChannels && (
                                            <div className="py-4 flex justify-center">
                                                <div className="slingshot-loader" aria-label="Carregando mais canais">
                                                    <span className="slingshot-dot slingshot-dot-left"></span>
                                                    <span className="slingshot-dot slingshot-dot-right"></span>
                                                </div>
                                            </div>
                                        )}
                                        {!hasMoreChannels && channelsFilteredForList.length > 0 && (
                                            <div className="py-2 text-center text-xs font-semibold tracking-wide uppercase text-gray-400">
                                                Fim da lista de canais
                                            </div>
                                        )}
                                        </>
                                    ) : (
                                        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
                                            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 mx-auto flex items-center justify-center mb-3">
                                                <Icon name="inbox" size="md" />
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900">Nenhum canal disponível</p>
                                            <p className="text-xs text-gray-500 mt-1">Ajuste os filtros ou crie um novo canal para começar.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sidebar - Highlights */}
                        {!selectedChannelData && (
                        <aside className="space-y-6 lg:col-span-3 lg:order-3">
                            {renderPulseDiscoveryCards()}
                        </aside>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
                        {/* Main Feed */}
                        <div className="space-y-6 lg:col-span-6 lg:order-2">
                            {renderTabsBar()}
                            {feedQuickFilter !== 'all' && (
                                <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                                    <p className="text-sm text-purple-900">
                                        Filtro ativo: <span className="font-semibold">{quickFilterLabel}</span>
                                    </p>
                                    <button
                                        onClick={() => setFeedQuickFilter('all')}
                                        className="text-sm font-semibold text-purple-700 hover:text-purple-800"
                                    >
                                        Remover filtro
                                    </button>
                                </div>
                            )}
                            {/* New Post Input */}
                            {feedDisplayMode === 'timeline' && canManageAdminFeatures && (
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <img src={USERS['user-4'].avatarUrl} className="w-12 h-12 rounded-full border border-gray-100" alt="" />
                                        <button onClick={() => setIsCreateModalOpen(true)} className="flex-1 text-left px-5 py-3 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors text-sm font-medium">
                                            Compartilhe um aprendizado ou dúvida...
                                        </button>
                                    </div>
                                </div>
                            )}

                            {displayedFeedPosts.length === 0 ? (
                                <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 shadow-sm text-center">
                                    <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
                                        <Icon name="inbox" size="md" />
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900">{emptyFeedTitle}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{emptyFeedDescription}</p>
                                    {hasFilterSelection && (
                                        <button
                                            onClick={() => {
                                                setSelectedChannel(null);
                                                setSelectedCategory(null);
                                                setFeedQuickFilter('all');
                                            }}
                                            className="mt-5 inline-flex items-center gap-2 px-4 h-10 rounded-full text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                                        >
                                            <Icon name="filter_alt_off" size="sm" />
                                            Limpar filtros
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className={feedDisplayMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 gap-4' : 'space-y-6'}>
                                        {visibleFeedPosts.map(post => (
                                            <PostCard 
                                                key={post.id} 
                                                post={post} 
                                                onRate={handleRate} 
                                                onAddComment={handleAddComment}
                                                onChannelClick={setSelectedChannel}
                                                channelName={channelsMap[post.channelId]?.name}
                                                onEditPost={handleEditPost}
                                                onDeletePost={handleDeletePost}
                                                onDeactivatePost={handleDeactivatePost}
                                                onEditComment={handleEditComment}
                                                onDeleteComment={handleDeleteComment}
                                                onOpenPost={handleOpenPost}
                                                viewMode={feedDisplayMode === 'grid' ? 'grid' : 'list'}
                                                isChannelSubscribed={!!channelsMap[post.channelId]?.isSubscribed}
                                                onToggleChannelSubscription={handleToggleChannelSubscription}
                                                onToggleBookmark={handleTogglePostBookmark}
                                            />
                                        ))}
                                    </div>
                                    <div ref={feedSentinelRef} className="h-1" />
                                    {isLoadingMoreFeed && (
                                        <div className="py-6 flex justify-center">
                                            <div className="slingshot-loader" aria-label="Carregando mais pulses">
                                                <span className="slingshot-dot slingshot-dot-left"></span>
                                                <span className="slingshot-dot slingshot-dot-right"></span>
                                            </div>
                                        </div>
                                    )}
                                    {!hasMoreFeedPosts && displayedFeedPosts.length > 0 && (
                                        <div className="py-4 text-center text-xs font-semibold tracking-wide uppercase text-gray-400">
                                            Fim do feed
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Sidebar - Channels & Pulses */}
                        <aside className="space-y-6 lg:col-span-3 lg:order-1">
                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Icon name="hub" size="sm" className="text-purple-600" />
                                    Canais
                                </h3>
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => {
                                            setSelectedChannel(null);
                                            setFeedQuickFilter('all');
                                        }}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${!selectedChannel ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        Feed principal
                                    </button>
                                    {canManageAdminFeatures && (
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400 px-2 mb-1">Criados por mim</p>
                                            <div className="space-y-1">
                                                {myOwnedChannels.length > 0 ? (
                                                    myOwnedChannels.map(channel => renderChannelSidebarOption(channel))
                                                ) : (
                                                    <p className="px-3 py-2 text-xs text-gray-400">Você ainda não criou canais.</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400 px-2 mb-1">Inscritos</p>
                                        <div className="space-y-1">
                                            {subscribedChannels.length > 0 ? (
                                                subscribedChannels.map(channel => renderChannelSidebarOption(channel))
                                            ) : (
                                                <p className="px-3 py-2 text-xs text-gray-400">Sem canais inscritos no momento.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Icon name="category" size="sm" className="text-purple-600" />
                                    Categorias
                                </h3>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => {
                                            setSelectedCategory(null);
                                            setFeedQuickFilter('all');
                                        }}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${!selectedCategory ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        Todas as categorias
                                    </button>
                                    {availableCategories.length > 0 ? (
                                        availableCategories.map(category => (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${selectedCategory === category ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                {category}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="px-3 py-2 text-xs text-gray-400">Sem categorias disponíveis.</p>
                                    )}
                                </div>
                            </div>
                        </aside>

                        {/* Sidebar - Highlights */}
                        <aside className="space-y-6 lg:col-span-3 lg:order-3">
                            {renderPulseDiscoveryCards()}
                        </aside>
                    </div>
                )}
            </div>
            <div
                ref={edgeMenuRef}
                className="fixed bottom-0 right-0 z-40 w-28 h-28"
                onMouseEnter={() => setIsEdgeHotspotActive(true)}
                onMouseLeave={() => {
                    if (!isEdgeMenuOpen) setIsEdgeHotspotActive(false);
                }}
            >
                {isEdgeMenuOpen && (
                    <div className="absolute bottom-20 right-4 w-[320px] rounded-xl border border-gray-200 bg-white shadow-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-gray-900">Edge Cases</p>
                            <button
                                onClick={() => {
                                    setEdgeCases({
                                        emptyDataset: false,
                                        missingCover: false,
                                        longContent: false,
                                        largeVolume: false
                                    });
                                }}
                                className="text-xs font-semibold text-purple-700 hover:text-purple-800"
                            >
                                Resetar
                            </button>
                        </div>
                        <div className="rounded-lg border border-gray-200 p-2.5">
                            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Perfil de visualização</p>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setUserViewMode('admin')}
                                    className={`h-9 rounded-md text-sm font-semibold transition-colors ${userViewMode === 'admin' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    Admin
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUserViewMode('user')}
                                    className={`h-9 rounded-md text-sm font-semibold transition-colors ${userViewMode === 'user' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    Usuario
                                </button>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-2">
                                Modo usuario oculta funções administrativas (publicar, editar e excluir).
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-start justify-between gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Sem canais e pulses</p>
                                    <p className="text-xs text-gray-500">Força empty states nas colunas esquerda, central e direita.</p>
                                </div>
                                <input type="checkbox" checked={edgeCases.emptyDataset} onChange={() => toggleEdgeCase('emptyDataset')} className="mt-1" />
                            </label>
                            <label className="flex items-start justify-between gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Sem imagem de capa</p>
                                    <p className="text-xs text-gray-500">Remove capa de canais e pulses para validar fallback visual.</p>
                                </div>
                                <input type="checkbox" checked={edgeCases.missingCover} onChange={() => toggleEdgeCase('missingCover')} className="mt-1" />
                            </label>
                            <label className="flex items-start justify-between gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Títulos e descrições longas</p>
                                    <p className="text-xs text-gray-500">Expande textos para testar truncamento e quebras.</p>
                                </div>
                                <input type="checkbox" checked={edgeCases.longContent} onChange={() => toggleEdgeCase('longContent')} className="mt-1" />
                            </label>
                            <label className="flex items-start justify-between gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Muitos canais e pulses</p>
                                    <p className="text-xs text-gray-500">Replica dados para validar densidade e scroll.</p>
                                </div>
                                <input type="checkbox" checked={edgeCases.largeVolume} onChange={() => toggleEdgeCase('largeVolume')} className="mt-1" />
                            </label>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => {
                        setIsEdgeMenuOpen(prev => !prev);
                        setIsEdgeHotspotActive(true);
                    }}
                    className={`absolute bottom-4 right-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
                        (isTouchDevice || isEdgeHotspotActive || isEdgeMenuOpen)
                            ? 'opacity-100 translate-y-0 bg-purple-600 text-white'
                            : 'opacity-0 translate-y-2 pointer-events-none bg-purple-600 text-white'
                    }`}
                    aria-label="Abrir menu de edge cases"
                    title="Edge cases"
                >
                    <Icon name="science" size="md" />
                </button>
            </div>
            {isCreateModalOpen && canManageAdminFeatures && (
                <>
                    {!createMainType && (
                        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={closeCreateModal}>
                            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-gray-900">Novo conteúdo</h2>
                                    <button onClick={closeCreateModal} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100">
                                        <Icon name="close" size="sm" />
                                    </button>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-flow-col auto-cols-fr gap-3">
                                        {CREATE_MAIN_OPTIONS.map(option => (
                                            <button
                                                key={option.type}
                                                onClick={() => handleSelectMainType(option.type)}
                                                className="w-full h-[112px] min-w-0 rounded-md text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-2 px-2"
                                            >
                                                <Icon name={option.icon} size="md" />
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {createMainType && needsSubtype && !createSubtype && (
                        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={closeCreateModal}>
                            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Novo conteúdo <span className="font-medium text-gray-600">({selectedMainOption?.label})</span>
                                    </h2>
                                    <button onClick={closeCreateModal} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100">
                                        <Icon name="close" size="sm" />
                                    </button>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-flow-col auto-cols-fr gap-3">
                                        {CREATE_SUB_OPTIONS[createMainType].map(option => (
                                            <button
                                                key={option.type}
                                                onClick={() => handleSelectSubtype(option.type)}
                                                className="w-full h-[112px] min-w-0 rounded-md text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-2 px-2"
                                            >
                                                <Icon name={option.icon} size="md" />
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
                                    <button onClick={backCreateStep} className="h-11 px-4 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                        Voltar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isCreateDetailsStepReady && (
                        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={closeCreateModal}>
                            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Novo conteúdo
                                        {createDialogTypeLabel ? <span className="font-medium text-gray-600"> ({createDialogTypeLabel})</span> : null}
                                    </h2>
                                    <button onClick={closeCreateModal} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100">
                                        <Icon name="close" size="sm" />
                                    </button>
                                </div>
                                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    <div className="lg:col-span-4">
                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Imagem de capa (opcional)</label>
                                        <input
                                            ref={coverUploadInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/gif,image/webp"
                                            className="hidden"
                                            onChange={handleSelectCreateCover}
                                        />
                                        <div
                                            className={`mt-2 h-[260px] rounded-xl border-2 border-dashed transition-colors flex flex-col items-center justify-center text-center p-4 ${
                                                isCoverDragOver ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-gray-50'
                                            }`}
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                setIsCoverDragOver(true);
                                            }}
                                            onDragLeave={(e) => {
                                                e.preventDefault();
                                                setIsCoverDragOver(false);
                                            }}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                setIsCoverDragOver(false);
                                                const file = e.dataTransfer.files?.[0] ?? null;
                                                applyCreateCoverFile(file);
                                            }}
                                        >
                                            {createCoverImageUrl ? (
                                                <img src={createCoverImageUrl} alt="Preview da capa" className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                <>
                                                    <Icon name="image" size="md" className="text-gray-400 mb-2" />
                                                    <p className="text-sm font-semibold text-gray-700">Arraste e solte a imagem aqui</p>
                                                    <p className="text-xs text-gray-500 mt-1">ou selecione um arquivo</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => coverUploadInputRef.current?.click()}
                                                        className="mt-3 h-10 px-2 bg-transparent text-sm font-semibold text-purple-700 hover:text-purple-800 inline-flex items-center gap-2"
                                                    >
                                                        <Icon name="upload" size="sm" />
                                                        Enviar arquivo
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className={((createMainType === 'LINK' || createMainType === 'HTML') ? 'md:col-span-2' : '')}>
                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nome do conteúdo</label>
                                        <input
                                            type="text"
                                            value={createName}
                                            onChange={(e) => setCreateName(e.target.value)}
                                            maxLength={createMainType === 'QUIZ' ? QUIZ_NAME_MAX_LENGTH : CONTENT_NAME_MAX_LENGTH}
                                            className="mt-1 w-full h-11 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Ex: Boas práticas de onboarding"
                                        />
                                        <p className={`mt-1 text-[11px] ${isCreateNameTooLong ? 'text-red-600' : 'text-gray-400'}`}>
                                            {createName.length}/{createMainType === 'QUIZ' ? QUIZ_NAME_MAX_LENGTH : CONTENT_NAME_MAX_LENGTH}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Canal</label>
                                        <select
                                            value={createChannelId}
                                            onChange={(e) => setCreateChannelId(e.target.value)}
                                            className="mt-1 w-full h-11 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                                        >
                                            {activeChannels.map(channel => (
                                                <option key={channel.id} value={channel.id}>{channel.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Descrição</label>
                                        <textarea
                                            value={createDescription}
                                            onChange={(e) => setCreateDescription(e.target.value)}
                                            rows={3}
                                            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                            placeholder="Escreva a descrição da publicação"
                                        />
                                    </div>
                                    {(createMainType === 'LINK' || createMainType === 'HTML') && (
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Link externo</label>
                                            <input
                                                type="url"
                                                value={createExternalUrl}
                                                onChange={(e) => setCreateExternalUrl(e.target.value)}
                                                className="mt-1 w-full h-11 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="Cole aqui a URL do conteúdo"
                                            />
                                            {createUrlError && <p className="mt-1 text-xs text-red-600">{createUrlError}</p>}
                                        </div>
                                    )}
                                    {(createMainType === 'FILE' || createSubtype === 'GENIALLY') && (
                                        <div className="md:col-span-2 flex items-center gap-3">
                                            <input ref={uploadInputRef} type="file" className="hidden" onChange={handleSelectCreateFile} />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (uploadInputRef.current && createSubtype) {
                                                        uploadInputRef.current.accept = CREATE_ACCEPT_TYPES[createSubtype] || '';
                                                    }
                                                    uploadInputRef.current?.click();
                                                }}
                                                className="h-11 px-4 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 inline-flex items-center gap-2"
                                            >
                                                <Icon name="upload" size="sm" />
                                                Enviar arquivo
                                            </button>
                                            <span className="text-sm text-gray-600 truncate">
                                                {createFile ? createFile.name : 'Nenhum arquivo selecionado'}
                                            </span>
                                        </div>
                                    )}
                                    {createMainType === 'HTML' && (
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tempo (minutos)</label>
                                            <input
                                                type="number"
                                                min={1}
                                                value={createDuration}
                                                onChange={(e) => setCreateDuration(Number(e.target.value || 1))}
                                                className="mt-1 w-full h-11 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                    )}
                                    </div>
                                </div>
                                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
                                    <button onClick={backCreateStep} className="h-11 px-4 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                        Voltar
                                    </button>
                                    <button
                                        onClick={handleSubmitCreatePulse}
                                        disabled={!canSubmitCreate}
                                        className="h-11 px-5 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Publicar pulse
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            {activePost && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-0" onClick={() => setActivePostId(null)}>
                    <div className="relative w-full h-full lg:py-6 lg:px-20" onClick={(e) => e.stopPropagation()}>
                        {hasPreviousPost && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openPreviousPost();
                                }}
                                className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/90 text-gray-800 items-center justify-center hover:bg-white shadow-md"
                                aria-label="Pulse anterior"
                            >
                                <Icon name="chevron_left" size="md" />
                            </button>
                        )}
                        {hasNextPost && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openNextPost();
                                }}
                                className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/90 text-gray-800 items-center justify-center hover:bg-white shadow-md"
                                aria-label="Próximo pulse"
                            >
                                <Icon name="chevron_right" size="md" />
                            </button>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setActivePostId(null);
                            }}
                            className="hidden lg:flex absolute right-4 top-6 z-50 w-12 h-12 rounded-full bg-white/90 text-gray-800 items-center justify-center hover:bg-white shadow-md"
                            aria-label="Fechar lightbox"
                            title="Fechar"
                        >
                            <Icon name="close" size="md" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsLightboxSidebarCollapsed(prev => !prev);
                            }}
                            className="hidden lg:flex absolute right-4 top-20 z-50 w-12 h-12 rounded-full bg-white/90 text-gray-800 items-center justify-center hover:bg-white shadow-md"
                            aria-label={isLightboxSidebarCollapsed ? 'Mostrar descrição e comentários' : 'Ocultar descrição e comentários'}
                            title={isLightboxSidebarCollapsed ? 'Mostrar descrição e comentários' : 'Ocultar descrição e comentários'}
                        >
                            <Icon name={isLightboxSidebarCollapsed ? 'right_panel_open' : 'right_panel_close'} size="md" />
                        </button>
                        <div className="w-full h-full bg-white lg:rounded-2xl overflow-hidden grid grid-cols-1 grid-rows-[56px_minmax(240px,45vh)_1fr] lg:grid-rows-1 lg:grid-cols-12">
                            <div className="lg:hidden h-14 px-3 border-b border-gray-200 flex items-center justify-between bg-white">
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openPreviousPost();
                                        }}
                                        disabled={!hasPreviousPost}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${hasPreviousPost ? 'text-gray-800 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                                        aria-label="Pulse anterior"
                                    >
                                        <Icon name="chevron_left" size="sm" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openNextPost();
                                        }}
                                        disabled={!hasNextPost}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${hasNextPost ? 'text-gray-800 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                                        aria-label="Próximo pulse"
                                    >
                                        <Icon name="chevron_right" size="sm" />
                                    </button>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActivePostId(null);
                                    }}
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100"
                                    aria-label="Fechar lightbox"
                                    title="Fechar"
                                >
                                    <Icon name="close" size="md" />
                                </button>
                            </div>
                            <div className={`${isLightboxSidebarCollapsed ? 'lg:col-span-12' : 'lg:col-span-8'} relative bg-black flex items-center justify-center min-h-[240px]`}>
                                {renderLightboxMedia(activePost)}
                            </div>
                            <div className={`${isLightboxSidebarCollapsed ? 'hidden' : 'flex'} lg:col-span-4 flex-col min-h-0 h-full`}>
                                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src={USERS[activePost.userId]?.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900">{USERS[activePost.userId]?.name}</p>
                                            <p className="text-xs text-gray-500">{channelsMap[activePost.channelId]?.name}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                                    <div>
                                        <p className={`text-sm text-gray-800 whitespace-pre-wrap ${isLightboxDescriptionExpanded ? '' : 'line-clamp-4'}`}>
                                            <span className="font-semibold mr-1">{USERS[activePost.userId]?.name}</span>
                                            {activePost.text}
                                        </p>
                                        {activePost.text && activePost.text.length > 180 && (
                                            <button
                                                onClick={() => setIsLightboxDescriptionExpanded(prev => !prev)}
                                                className="mt-1 text-xs font-semibold text-gray-500 hover:text-gray-800"
                                            >
                                                {isLightboxDescriptionExpanded ? 'Ver menos' : 'Ver mais'}
                                            </button>
                                        )}
                                        <p className="text-xs text-gray-400 mt-2">{activePost.timestamp}</p>
                                    </div>
                                    <div className="space-y-3">
                                        {activePost.comments.map(comment => (
                                            <div key={comment.id} className="text-sm text-gray-800 flex items-start justify-between gap-2">
                                                <div className="min-w-0 break-words">
                                                    <span className="font-semibold mr-1">{USERS[comment.userId]?.name}</span>
                                                    <span>{comment.text}</span>
                                                </div>
                                                {comment.userId === 'user-4' && (
                                                    <details className="relative shrink-0">
                                                        <summary className="list-none p-1 rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer [&::-webkit-details-marker]:hidden">
                                                            <Icon name="more_horiz" size="sm" />
                                                        </summary>
                                                        <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-20">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEditComment(activePost.id, comment.id);
                                                                    (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open');
                                                                }}
                                                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteComment(activePost.id, comment.id);
                                                                    (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open');
                                                                }}
                                                                className="w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                                                            >
                                                                Excluir
                                                            </button>
                                                        </div>
                                                    </details>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="px-3 pt-2 pb-1 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div ref={lightboxRatingMenuRef} className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setIsLightboxRatingMenuOpen(prev => !prev)}
                                                className="w-10 h-10 rounded-full text-gray-700 hover:bg-gray-100 flex items-center justify-center"
                                                aria-label="Avaliar pulse"
                                            >
                                                <Icon
                                                    name="star"
                                                    size="md"
                                                    filled={(activePost.userRating ?? 0) > 0}
                                                    className={(activePost.userRating ?? 0) > 0 ? 'text-amber-500' : ''}
                                                />
                                            </button>
                                            {isLightboxRatingMenuOpen && (
                                                <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-full shadow-lg px-2 py-1 z-20">
                                                    <div className="flex items-center gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRate(activePost.id, star);
                                                                    setIsLightboxRatingMenuOpen(false);
                                                                }}
                                                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                                                                title={`Avaliar ${star} estrelas`}
                                                            >
                                                                <Icon
                                                                    name="star"
                                                                    size="sm"
                                                                    filled={star <= (activePost.userRating ?? 0)}
                                                                    className={star <= (activePost.userRating ?? 0) ? 'text-amber-500' : 'text-gray-300'}
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
                                                const postUrl = `${window.location.origin}/pulse/${activePost.id}`;
                                                try {
                                                    await navigator.clipboard.writeText(postUrl);
                                                    showLightboxActionToast('Link do pulse copiado.');
                                                } catch (err) {
                                                    console.error('Falha ao copiar o link: ', err);
                                                    showLightboxActionToast('Nao foi possivel copiar o link.');
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
                                        onClick={() => handleTogglePostBookmark(activePost.id)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${(activePost.isBookmarked ?? false) ? 'text-purple-700' : 'text-gray-700 hover:bg-gray-100'}`}
                                        aria-label={(activePost.isBookmarked ?? false) ? 'Pulse salvo' : 'Salvar pulse'}
                                    >
                                        <Icon name="bookmark" size="md" filled={!!activePost.isBookmarked} />
                                    </button>
                                </div>
                                <div className="border-t border-gray-200"></div>
                                <form
                                    className="p-3 pt-2"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const normalizedCommentText = lightboxCommentText.trim();
                                        if (!normalizedCommentText) return;
                                        handleAddComment(activePost.id, normalizedCommentText);
                                        setLightboxCommentText('');
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <input
                                            ref={lightboxCommentInputRef}
                                            type="text"
                                            value={lightboxCommentText}
                                            onChange={(e) => setLightboxCommentText(e.target.value.slice(0, COMMENT_CHAR_LIMIT))}
                                            maxLength={COMMENT_CHAR_LIMIT}
                                            placeholder="Adicione um comentário..."
                                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        <button type="submit" className="px-3 py-2 text-sm font-semibold text-purple-600 hover:text-purple-800">
                                            Publicar
                                        </button>
                                    </div>
                                    <p className={`mt-1 text-right text-[11px] ${lightboxCommentText.length >= COMMENT_CHAR_LIMIT ? 'text-amber-600' : 'text-gray-400'}`}>
                                        {lightboxCommentText.length}/{COMMENT_CHAR_LIMIT}
                                    </p>
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
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
                @keyframes slingshotLeft {
                    0% { transform: translateX(-10px) scale(0.9); opacity: 0.75; }
                    50% { transform: translateX(10px) scale(1.05); opacity: 1; }
                    100% { transform: translateX(-10px) scale(0.9); opacity: 0.75; }
                }
                @keyframes slingshotRight {
                    0% { transform: translateX(10px) scale(0.9); opacity: 0.75; }
                    50% { transform: translateX(-10px) scale(1.05); opacity: 1; }
                    100% { transform: translateX(10px) scale(0.9); opacity: 0.75; }
                }
                .slingshot-loader { position: relative; width: 56px; height: 16px; display: inline-flex; align-items: center; justify-content: center; }
                .slingshot-dot { width: 12px; height: 12px; border-radius: 9999px; background: #7c3aed; position: absolute; box-shadow: 0 2px 8px rgba(124, 58, 237, 0.35); }
                .slingshot-dot-left { left: 10px; animation: slingshotLeft 0.9s ease-in-out infinite; }
                .slingshot-dot-right { right: 10px; animation: slingshotRight 0.9s ease-in-out infinite; }
            `}</style>
        </div>
    );
};
