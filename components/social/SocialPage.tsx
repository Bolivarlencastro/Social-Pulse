
import React, { useState } from 'react';
import { POSTS, CHANNELS, USERS } from '../../constants';
import { PostCard } from '../PostCard';
import { PulsesTable } from './PulsesTable';
import { Icon } from '../Icon';
import { KpiCard } from '../KpiCard';
import { SentimentChart } from './SentimentChart';
import { TopTopics } from './TopTopics';
import { EngagementLeaders } from './EngagementLeaders';
import { Post, Comment } from '../../types';

type SocialViewMode = 'feed' | 'management' | 'channels';

interface SocialPageProps {
    initialViewMode?: SocialViewMode;
}

export const SocialPage: React.FC<SocialPageProps> = ({ initialViewMode = 'feed' }) => {
    const [viewMode, setViewMode] = useState<SocialViewMode>(initialViewMode);
    const [feedDisplayMode, setFeedDisplayMode] = useState<'timeline' | 'grid'>('timeline');
    const [posts, setPosts] = useState<Post[]>(POSTS);
    const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

    // Update viewMode if initialViewMode prop changes
    React.useEffect(() => {
        setViewMode(initialViewMode);
    }, [initialViewMode]);

    const handleLike = (postId: string) => {
        setPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    isLiked: !post.isLiked,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1
                };
            }
            return post;
        }));
    };

    const handleAddComment = (postId: string, commentText: string, parentId?: string) => {
        const newComment: Comment = {
            id: `c-${Date.now()}`,
            userId: 'user-4',
            text: commentText,
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

    const filteredPosts = selectedChannel 
        ? posts.filter(p => p.channelId === selectedChannel)
        : posts;

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header & Tabs */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-1">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {viewMode === 'feed' ? 'Social' : 'Pulses'}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {viewMode === 'feed' 
                                ? 'Acompanhe o que está acontecendo na sua rede' 
                                : 'O termômetro de engajamento da sua rede'}
                        </p>
                    </div>
                    
                    <div className="flex bg-gray-200/50 p-1 rounded-lg">
                        <button 
                            onClick={() => setViewMode('feed')}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === 'feed' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Icon name="dynamic_feed" size="sm" /> 
                            <span>Feed Social</span>
                        </button>
                        <button 
                            onClick={() => setViewMode('channels')}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === 'channels' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Icon name="hub" size="sm" /> 
                            <span>Canais</span>
                        </button>
                        <button 
                            onClick={() => setViewMode('management')}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === 'management' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Icon name="monitoring" size="sm" /> 
                            <span>Gestão</span>
                        </button>
                    </div>
                </header>

                {viewMode === 'management' ? (
                    <div className="space-y-8 animate-fadeIn">
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
                                <TopTopics />
                                <EngagementLeaders />
                            </div>
                        </div>
                    </div>
                ) : viewMode === 'channels' ? (
                    <div className="animate-fadeIn">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {CHANNELS.map(channel => (
                                <div key={channel.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="h-32 bg-gray-100 relative overflow-hidden">
                                        <img src={channel.imageUrl} alt={channel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-3 right-3">
                                            {channel.isSubscribed ? (
                                                <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Inscrito</span>
                                            ) : (
                                                <button className="bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider hover:bg-white transition-colors">Seguir</button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-gray-900 mb-2"># {channel.name}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{channel.description}</p>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex -space-x-2">
                                                {[1,2,3].map(i => (
                                                    <img key={i} src={`https://i.pravatar.cc/32?u=chan-${channel.id}-${i}`} className="w-7 h-7 rounded-full border-2 border-white" alt="" />
                                                ))}
                                                <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">+12</div>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    setSelectedChannel(channel.id);
                                                    setViewMode('feed');
                                                }}
                                                className="text-purple-600 text-sm font-bold hover:underline"
                                            >
                                                Ver Pulses
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 animate-fadeIn">
                        {/* Main Feed */}
                        <div className="flex-1 space-y-6">
                            {/* Feed Controls */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => setFeedDisplayMode('timeline')}
                                        className={`p-2 rounded-lg transition-colors ${feedDisplayMode === 'timeline' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:bg-gray-100'}`}
                                        title="Timeline"
                                    >
                                        <Icon name="view_day" size="sm" />
                                    </button>
                                    <button 
                                        onClick={() => setFeedDisplayMode('grid')}
                                        className={`p-2 rounded-lg transition-colors ${feedDisplayMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:bg-gray-100'}`}
                                        title="Grid"
                                    >
                                        <Icon name="grid_view" size="sm" />
                                    </button>
                                </div>
                                {selectedChannel && (
                                    <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100">
                                        <span className="text-xs font-bold text-purple-700"># {CHANNELS_MAP[selectedChannel]?.name}</span>
                                        <button onClick={() => setSelectedChannel(null)} className="text-purple-400 hover:text-purple-600">
                                            <Icon name="close" size="xs" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* New Post Input */}
                            {feedDisplayMode === 'timeline' && (
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-4 mb-4">
                                        <img src={USERS['user-4'].avatarUrl} className="w-12 h-12 rounded-full border border-gray-100" alt="" />
                                        <button className="flex-1 text-left px-5 py-3 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors text-sm font-medium">
                                            Compartilhe um aprendizado ou dúvida...
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div className="flex gap-4">
                                            <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-purple-600 transition-colors">
                                                <Icon name="image" size="sm" /> Foto/Vídeo
                                            </button>
                                            <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-purple-600 transition-colors">
                                                <Icon name="poll" size="sm" /> Enquete
                                            </button>
                                        </div>
                                        <button className="bg-purple-600 text-white h-10 px-6 rounded-full font-bold text-sm shadow-md hover:bg-purple-700 transition-colors">
                                            Pulser
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className={feedDisplayMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 gap-4' : 'space-y-6'}>
                                {filteredPosts.map(post => (
                                    <PostCard 
                                        key={post.id} 
                                        post={post} 
                                        onLike={handleLike} 
                                        onAddComment={handleAddComment}
                                        onChannelClick={setSelectedChannel}
                                        viewMode={feedDisplayMode === 'grid' ? 'grid' : 'list'}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Sidebar - Channels & Trends */}
                        <aside className="w-full lg:w-80 space-y-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Icon name="hub" size="sm" className="text-purple-600" />
                                    Seus Canais
                                </h3>
                                <div className="space-y-1">
                                    <button 
                                        onClick={() => setSelectedChannel(null)}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${!selectedChannel ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        # Todos os Pulses
                                    </button>
                                    {CHANNELS.map(channel => (
                                        <button 
                                            key={channel.id}
                                            onClick={() => setSelectedChannel(channel.id)}
                                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-between group ${selectedChannel === channel.id ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            <span className="truncate"># {channel.name}</span>
                                            {channel.isSubscribed && <Icon name="check_circle" size="sm" className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <TopTopics />
                            <EngagementLeaders />
                        </aside>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};
