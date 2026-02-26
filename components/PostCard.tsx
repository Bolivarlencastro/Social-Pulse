import React, { useState, useRef, useEffect } from 'react';
import { Post, Comment, User, ViewMode, Channel } from '../types';
import { USERS, CHANNELS_MAP, KONQUEST_DEFAULT_COVER_IMAGE } from '../constants';
import { Icon } from './Icon';
import EmojiPicker, { Theme as EmojiTheme } from 'emoji-picker-react';


interface PostCardProps {
  post: Post;
  onRate: (postId: string, rating: number) => void;
  onAddComment: (postId: string, commentText: string, parentId?: string) => void;
  viewMode?: ViewMode;
  onChannelClick?: (channelId: string) => void;
  channelName?: string;
  onEditPost?: (postId: string) => void;
  onDeletePost?: (postId: string) => void;
  onDeactivatePost?: (postId: string) => void;
  onOpenPost?: (postId: string) => void;
  onEditComment?: (postId: string, commentId: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
  isChannelSubscribed?: boolean;
  onToggleChannelSubscription?: (channelId: string) => void;
  onToggleBookmark?: (postId: string) => void;
}

const EmptyCover: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`relative overflow-hidden bg-cover bg-center ${className}`} style={{ backgroundImage: `url(${KONQUEST_DEFAULT_COVER_IMAGE})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
    </div>
);

const CommentForm = ({ onSubmit, currentUser, placeholder, autoFocus = false }: {
    onSubmit: (text: string) => void;
    currentUser: User;
    placeholder: string;
    autoFocus?: boolean;
}) => {
    const [commentText, setCommentText] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleEmojiClick = (emojiObject: { emoji: string }) => {
        setCommentText(prev => prev + emojiObject.emoji);
        inputRef.current?.focus();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onSubmit(commentText.trim());
            setCommentText('');
            setShowPicker(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setShowPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [pickerRef]);
    
    useEffect(() => {
        if (autoFocus) {
            inputRef.current?.focus();
        }
    }, [autoFocus]);


    return (
        <form onSubmit={handleSubmit} className="flex items-start space-x-3 w-full">
            <img
                className="h-8 w-8 rounded-full object-cover"
                src={currentUser.avatarUrl}
                alt={currentUser.name}
            />
            <div className="flex-1 relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-gray-100 rounded-full py-2 pl-4 pr-10 text-sm border-transparent focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                    type="button"
                    onClick={() => setShowPicker(prev => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                    aria-label="Add emoji"
                >
                    <Icon name="mood" size="sm" />
                </button>
                {showPicker && (
                    <div ref={pickerRef} className="absolute z-10 right-0 mt-2">
                        <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            theme={EmojiTheme.LIGHT}
                            height={350}
                            width={300}
                        />
                    </div>
                )}
            </div>
        </form>
    );
};

interface CommentItemProps {
  comment: Comment;
  allComments: Comment[];
  onAddComment: (text: string, parentId: string) => void;
  replyingTo: string;
  onReply: (commentId: string) => void;
  currentUser: User;
  postId: string;
  onEditComment?: (postId: string, commentId: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, allComments, onAddComment, replyingTo, onReply, currentUser, postId, onEditComment, onDeleteComment }) => {
    const author = USERS[comment.userId];
    const replies = allComments.filter(c => c.parentId === comment.id);

    return (
        <div className="flex items-start space-x-3">
            <img
                className="h-8 w-8 rounded-full object-cover"
                src={author.avatarUrl}
                alt={author.name}
            />
            <div className="flex-1">
                <div className="bg-gray-100 rounded-lg px-3 py-2 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <span className="font-semibold text-sm text-gray-800">{author.name}</span>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.text}</p>
                    </div>
                    {comment.userId === currentUser.id && (onEditComment || onDeleteComment) && (
                        <details className="relative shrink-0">
                            <summary className="list-none p-1 rounded-full text-gray-500 hover:bg-gray-200 cursor-pointer [&::-webkit-details-marker]:hidden">
                                <Icon name="more_horiz" size="sm" />
                            </summary>
                            <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-20">
                                {onEditComment && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditComment(postId, comment.id);
                                            (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open');
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        Editar
                                    </button>
                                )}
                                {onDeleteComment && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteComment(postId, comment.id);
                                            (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open');
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                                    >
                                        Excluir
                                    </button>
                                )}
                            </div>
                        </details>
                    )}
                </div>
                <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1 pl-1">
                    <span>{comment.timestamp}</span>
                    <button onClick={() => onReply(comment.id)} className="font-semibold hover:underline">Responder</button>
                </div>
                {replyingTo === comment.id && (
                    <div className="mt-2">
                        <CommentForm
                            onSubmit={(text) => onAddComment(text, comment.id)}
                            currentUser={currentUser}
                            placeholder={`Respondendo a ${author.name}...`}
                            autoFocus
                        />
                    </div>
                )}

                {replies.length > 0 && (
                    <div className="mt-3 space-y-3">
                        {replies.map(reply => (
                           <CommentItem
                            key={reply.id}
                            comment={reply}
                            allComments={allComments}
                            onAddComment={onAddComment}
                            replyingTo={replyingTo}
                            onReply={onReply}
                            currentUser={currentUser}
                            postId={postId}
                            onEditComment={onEditComment}
                            onDeleteComment={onDeleteComment}
                           />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

const SimpleCommentForm: React.FC<{ onSubmit: (text: string) => void }> = ({ onSubmit }) => {
    const [commentText, setCommentText] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onSubmit(commentText.trim());
            setCommentText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Adicione um comentário..."
                className="w-full bg-transparent text-sm placeholder-gray-500 focus:outline-none"
            />
            {commentText.trim() && (
                <button type="submit" className="text-sm font-semibold text-purple-600 hover:text-purple-800">
                    Publicar
                </button>
            )}
        </form>
    );
};


export const PostCard: React.FC<PostCardProps> = ({ post, onRate, onAddComment, viewMode = 'list', onChannelClick, channelName, onEditPost, onDeletePost, onDeactivatePost, onOpenPost, onEditComment, onDeleteComment, isChannelSubscribed, onToggleChannelSubscription, onToggleBookmark }) => {
  const author = USERS[post.userId];
  const channel = CHANNELS_MAP[post.channelId];
  const displayedChannelName = channelName || channel?.name || 'Canal';
  const currentUser = USERS['user-4']; // Assuming current user
  const isBookmarked = !!post.isBookmarked;
  
  const [showComments, setShowComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState('');
  const [hasImageError, setHasImageError] = useState(false);
  const [isRatingMenuOpen, setIsRatingMenuOpen] = useState(false);
  const [actionToastMessage, setActionToastMessage] = useState<string | null>(null);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const ratingMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setHasImageError(false);
    setIsCaptionExpanded(false);
  }, [post.id, post.imageUrl]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ratingMenuRef.current && !ratingMenuRef.current.contains(event.target as Node)) {
        setIsRatingMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const showActionToast = (message: string) => {
      setActionToastMessage(message);
      window.setTimeout(() => setActionToastMessage(null), 2200);
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/pulse/${post.id}`;
    try {
        await navigator.clipboard.writeText(postUrl);
        showActionToast('Link do pulse copiado.');
    } catch (err) {
        console.error('Falha ao copiar o link: ', err);
        showActionToast('Nao foi possivel copiar o link.');
    }
  };
  
  const handleBookmark = () => {
      const next = !isBookmarked;
      onToggleBookmark?.(post.id);
      showActionToast(next ? 'Pulse salvo.' : 'Pulse removido dos salvos.');
  }

  const getGridTitle = () => {
      const raw = post.text?.trim() || 'Pulse sem título';
      const firstSentence = raw.split(/[.!?]/)[0]?.trim() || raw;
      return firstSentence.length > 44 ? `${firstSentence.slice(0, 44)}...` : firstSentence;
  };

  const getPulseTypeMeta = () => {
      const type = (post.contentType || 'TEXT').toUpperCase();
      switch (type) {
          case 'VIDEO':
              return { icon: 'play_circle', label: 'Vídeo' };
          case 'PODCAST':
              return { icon: 'graphic_eq', label: 'Podcast' };
          case 'PDF':
              return { icon: 'picture_as_pdf', label: 'PDF' };
          case 'QUIZ':
              return { icon: 'quiz', label: 'Question' };
          case 'SPREADSHEET':
              return { icon: 'table_view', label: 'Planilha' };
          case 'PRESENTATION':
              return { icon: 'slideshow', label: 'Apresentação' };
          case 'GENIALLY':
              return { icon: 'language', label: 'Genially' };
          case 'H5P':
              return { icon: 'html', label: 'H5P' };
          default:
              return { icon: 'description', label: 'Texto' };
      }
  };

  const formatDuration = (seconds?: number) => {
      const safeSeconds = typeof seconds === 'number' && seconds > 0
          ? Math.floor(seconds)
          : ((normalizedContentType === 'VIDEO' || normalizedContentType === 'PODCAST') ? 30 : 0);
      if (!safeSeconds) return '--';
      if (safeSeconds < 60) return `${safeSeconds} s`;
      const min = Math.floor(safeSeconds / 60);
      const sec = safeSeconds % 60;
      return sec ? `${min} min ${sec}s` : `${min} min`;
  };

  const normalizedContentType = (post.contentType || '').toUpperCase();
  const isVideoEmbed = !!post.embed && (post.embed.provider === 'youtube' || post.embed.provider === 'vimeo');
  const isInlineVideo = normalizedContentType === 'VIDEO' && (isVideoEmbed || !!post.mediaUrl);
  const isInlineAudio = normalizedContentType === 'PODCAST' && !!post.mediaUrl;
  const isImagePulse = normalizedContentType === 'IMAGE';
  const shouldShowFloatingPlay = !['VIDEO', 'PODCAST', 'IMAGE'].includes(normalizedContentType);
  const inlineVideoLayout = post.mediaLayout === 'vertical' ? 'vertical' : 'horizontal';
  const inlineImageLayout = post.mediaLayout === 'vertical' ? 'vertical' : post.mediaLayout === 'horizontal' ? 'horizontal' : 'square';
  const imageAspectClass = inlineImageLayout === 'vertical' ? 'aspect-[4/5]' : inlineImageLayout === 'horizontal' ? 'aspect-[16/9]' : 'aspect-square';

  const renderInlineFeedMedia = () => {
      if (isInlineVideo) {
          return (
              <div className="w-full bg-black border-y border-gray-200">
                  <div className={`mx-auto ${inlineVideoLayout === 'vertical' ? 'max-w-[420px]' : 'w-full'}`}>
                      <div className={inlineVideoLayout === 'vertical' ? 'aspect-[9/16] w-full' : 'aspect-video w-full'}>
                          {isVideoEmbed && post.embed ? (
                              <iframe
                                  src={post.embed.embedUrl}
                                  className="w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  title="Video do pulse"
                              />
                          ) : (
                              <video className="w-full h-full object-contain" controls preload="metadata">
                                  {post.mediaUrl && <source src={post.mediaUrl} />}
                                  Seu navegador não suporta vídeo.
                              </video>
                          )}
                      </div>
                  </div>
              </div>
          );
      }

      if (isInlineAudio) {
          return (
              <div className="w-full border-y border-gray-200">
                  <div className="relative aspect-square w-full overflow-hidden">
                      {post.imageUrl && !hasImageError ? (
                          <img
                              src={post.imageUrl}
                              alt="Capa do podcast"
                              className="absolute inset-0 w-full h-full object-cover"
                              onError={() => setHasImageError(true)}
                          />
                      ) : (
                          <EmptyCover className="absolute inset-0 w-full h-full" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center px-4">
                          <div className="w-full max-w-md rounded-xl bg-white px-4 py-3 shadow-lg">
                              <audio className="w-full" controls preload="metadata">
                                  {post.mediaUrl && <source src={post.mediaUrl} />}
                                  Seu navegador não suporta áudio.
                              </audio>
                          </div>
                      </div>
                  </div>
              </div>
          );
      }

      return null;
  };

  if (viewMode === 'grid') {
    const pulseMeta = getPulseTypeMeta();
    return (
        <div
            className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-[0_3px_6px_rgba(0,0,0,0.16),0_3px_6px_rgba(0,0,0,0.23)] p-2 sm:p-3 flex flex-col"
            onClick={() => onOpenPost?.(post.id)}
        >
            {post.imageUrl && !hasImageError ? (
                <img src={post.imageUrl} alt="Post content" className="absolute inset-0 w-full h-full object-cover" onError={() => setHasImageError(true)} />
            ) : (
                <EmptyCover className="absolute inset-0 w-full h-full" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />
            {!post.isActive && (
                <div className="absolute inset-0 bg-black/50 z-20">
                    <span className="absolute top-0 left-0 px-3 py-1 text-[11px] font-semibold bg-black text-white rounded-br-xl">Inativo</span>
                </div>
            )}

            <div className="relative z-10 mt-auto flex flex-col gap-1">
                <p className="text-white font-bold text-xs sm:text-base leading-tight truncate">{getGridTitle()}</p>
                <p className="text-white/90 text-[10px] sm:text-xs truncate">{displayedChannelName}</p>
                <div className="h-[2px] w-full bg-white/35 rounded-full mt-1">
                    <div className="h-full w-0 bg-white rounded-full" />
                </div>
            </div>

            <div className="relative z-10 pt-1.5 flex items-center gap-1 text-white min-h-[40px]">
                <div className="inline-flex items-center gap-1 px-1.5 py-1 rounded bg-black/25 text-[10px] sm:text-xs">
                    <Icon name={pulseMeta.icon} size="sm" className="text-[14px]" />
                    <span>{pulseMeta.label}</span>
                </div>
                <div className="inline-flex items-center gap-1 px-1.5 py-1 rounded bg-black/25 text-[10px] sm:text-xs">
                    <Icon name="schedule" size="sm" className="text-[14px]" />
                    <span>{formatDuration(post.durationSeconds)}</span>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleBookmark();
                    }}
                    className="ml-auto w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10"
                    aria-label={isBookmarked ? 'Pulse salvo' : 'Salvar pulse'}
                >
                    <Icon name="bookmark" size="sm" filled={isBookmarked} />
                </button>
            </div>

        </div>
    );
  }

  const topLevelComments = post.comments.filter(c => !c.parentId);
  const currentUserRating = post.userRating ?? 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Post Header */}
      <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3 min-w-0">
              <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={author.avatarUrl}
                  alt={author.name}
              />
              <div className="flex flex-col min-w-0">
                  {channel && (
                      <div className="text-sm font-semibold text-gray-800 min-w-0">
                          {onChannelClick ? (
                              <button onClick={() => onChannelClick(channel.id)} className="block w-full max-w-full truncate text-left hover:underline">
                                  {displayedChannelName}
                              </button>
                          ) : (
                              <span className="block w-full max-w-full truncate">{displayedChannelName}</span>
                          )}
                      </div>
                  )}
                  <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                      {post.contentType ? <span>{post.contentType} por </span> : <span>Publicado por </span>}
                      <span className="font-medium text-gray-700">{author.name}</span>
                      <span>&bull;</span>
                      <span>{post.timestamp}</span>
                  </div>
              </div>
          </div>
          <div className="flex items-center gap-2">
              {channel && (
                  <button
                      onClick={() => onToggleChannelSubscription?.(channel.id)}
                      className="px-1 py-1 text-sm font-semibold text-gray-700 transition-colors hover:text-purple-700 focus:outline-none"
                  >
                      {isChannelSubscribed ? 'Inscrito' : 'Inscrever-se'}
                  </button>
              )}
              {(onEditPost || onDeletePost || onDeactivatePost) && (
                  <details className="relative">
                      <summary className="list-none w-12 h-12 aspect-square rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer flex items-center justify-center [&::-webkit-details-marker]:hidden">
                          <Icon name="more_horiz" size="sm" />
                      </summary>
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-20">
                          {onEditPost && (
                              <button
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      onEditPost(post.id);
                                      (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open');
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                  Editar
                              </button>
                          )}
                          {onDeactivatePost && (
                              <button
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      onDeactivatePost(post.id);
                                      (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open');
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm text-amber-700 hover:bg-amber-50"
                              >
                                  Inativar
                              </button>
                          )}
                          {onDeletePost && (
                              <button
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      onDeletePost(post.id);
                                      (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open');
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                              >
                                  Excluir
                              </button>
                          )}
                      </div>
                  </details>
              )}
          </div>
      </div>


      {/* Post Content */}
      {(isInlineVideo || isInlineAudio) ? (
          renderInlineFeedMedia()
      ) : (
          post.imageUrl && !hasImageError ? (
              <div className="w-full bg-gray-100 border-y border-gray-200 cursor-pointer relative" onClick={() => onOpenPost?.(post.id)}>
                  <div className={`${isImagePulse ? imageAspectClass : 'aspect-square'} w-full`}>
                      <img src={post.imageUrl} alt="Post content" className="w-full h-full object-cover" onError={() => setHasImageError(true)} />
                  </div>
                  {shouldShowFloatingPlay && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-12 h-12 rounded-full bg-black/45 text-white flex items-center justify-center backdrop-blur-sm animate-playPulse">
                              <Icon name="play_arrow" size="md" />
                          </div>
                      </div>
                  )}
              </div>
          ) : (
              <div className="w-full border-y border-gray-200 cursor-pointer relative" onClick={() => onOpenPost?.(post.id)}>
                  <EmptyCover className={`${isImagePulse ? imageAspectClass : 'aspect-square'} w-full`} />
                  {shouldShowFloatingPlay && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-12 h-12 rounded-full bg-black/45 text-white flex items-center justify-center backdrop-blur-sm animate-playPulse">
                              <Icon name="play_arrow" size="md" />
                          </div>
                      </div>
                  )}
              </div>
          )
      )}


      {/* Post Actions */}
      <div className="flex justify-between items-center px-2 pt-2 pb-1 sm:px-3">
          <div className="flex items-center gap-3 sm:gap-4">
               <div ref={ratingMenuRef} className="relative">
                  <button onClick={() => setIsRatingMenuOpen(prev => !prev)} className="w-10 h-10 rounded-full text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-center">
                      <Icon name="star" size="md" filled={currentUserRating > 0} className={currentUserRating > 0 ? 'text-amber-500' : ''} />
                  </button>
                  {isRatingMenuOpen && (
                  <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-full shadow-lg px-2 py-1 z-20">
                      <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                  key={star}
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      onRate(post.id, star);
                                      setIsRatingMenuOpen(false);
                                  }}
                                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                                  title={`Avaliar ${star} estrelas`}
                              >
                                  <Icon name="star" size="sm" filled={star <= currentUserRating} className={star <= currentUserRating ? 'text-amber-500' : 'text-gray-300'} />
                              </button>
                          ))}
                      </div>
                  </div>
                  )}
              </div>
               <button onClick={() => setShowComments(!showComments)} className="text-gray-700 hover:opacity-70 transition-opacity p-1">
                  <Icon name="chat_bubble" size="md" />
              </button>
               <button onClick={handleShare} className="text-gray-700 hover:opacity-70 transition-opacity p-1">
                  <Icon name="send" size="md" className="-rotate-12" />
              </button>
          </div>
           <button
              onClick={handleBookmark}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isBookmarked ? 'text-purple-700 bg-purple-50' : 'text-gray-700 hover:bg-gray-100'}`}
              aria-label={isBookmarked ? 'Pulse salvo' : 'Salvar pulse'}
            >
              <Icon name="bookmark" size="md" filled={isBookmarked} />
          </button>
      </div>

      {/* Post Stats (Rating) */}
      {post.ratingVotes > 0 && (
          <div className="px-4 pb-1">
              <span className="text-sm font-semibold text-gray-800">{post.rating.toFixed(1)} de 5 ({post.ratingVotes.toLocaleString('pt-BR')} avaliações)</span>
          </div>
      )}

      {/* Post Caption/Text */}
      <div className="px-4 pb-2 text-sm text-gray-800 cursor-pointer" onClick={() => onOpenPost?.(post.id)}>
          <span className="font-semibold mr-1.5">{author.name}</span>
          <span className={`text-gray-700 whitespace-pre-wrap ${isCaptionExpanded ? '' : 'line-clamp-2'}`}>{post.text}</span>
          {post.text && post.text.length > 120 && (
              <button
                  onClick={(e) => {
                      e.stopPropagation();
                      setIsCaptionExpanded(prev => !prev);
                  }}
                  className="ml-1 text-gray-500 hover:text-gray-800 text-xs font-semibold"
              >
                  {isCaptionExpanded ? 'Ver menos' : 'Ver mais'}
              </button>
          )}
      </div>
      
      {/* View Comments Button */}
      {post.commentCount > 0 && !showComments && (
          <button onClick={() => setShowComments(true)} className="px-4 pb-2 text-sm text-gray-500 hover:text-gray-800">
              Ver todos os {post.commentCount} comentários
          </button>
      )}

      {/* Full Comments Section (Expanded) */}
      {showComments && (
          <div className="px-4 pb-4 mt-2 space-y-4">
              <h3 className="text-sm font-semibold">Comentários</h3>
              {topLevelComments.map(comment => (
                  <CommentItem
                      key={comment.id}
                      comment={comment}
                      allComments={post.comments}
                      onAddComment={(text, parentId) => onAddComment(post.id, text, parentId)}
                      replyingTo={replyingTo}
                      onReply={(commentId) => setReplyingTo(prev => prev === commentId ? '' : commentId)}
                      currentUser={currentUser}
                      postId={post.id}
                      onEditComment={onEditComment}
                      onDeleteComment={onDeleteComment}
                  />
              ))}
          </div>
      )}
      
      {/* Add Comment Form */}
      <div className="px-4 py-2 border-t border-gray-200">
           <SimpleCommentForm onSubmit={(text) => onAddComment(post.id, text)} />
      </div>
      {actionToastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
              <div className="inline-flex items-center rounded-md bg-gray-900 text-white text-xs px-3 py-1.5 shadow-lg">
                  {actionToastMessage}
              </div>
          </div>
      )}
    </div>
  );
};
