import React, { useState, useRef, useEffect } from 'react';
import { Post, Comment, User, ViewMode, Channel } from '../types';
import { USERS, CHANNELS_MAP } from '../constants';
import { Icon } from './Icon';
import EmojiPicker, { Theme as EmojiTheme } from 'emoji-picker-react';


interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, commentText: string, parentId?: string) => void;
  viewMode?: ViewMode;
  onChannelClick?: (channelId: string) => void;
}

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
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, allComments, onAddComment, replyingTo, onReply, currentUser }) => {
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
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <span className="font-semibold text-sm text-gray-800">{author.name}</span>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.text}</p>
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
                            allComments={[]}
                            onAddComment={() => {}}
                            replyingTo={''}
                            onReply={() => {}}
                            currentUser={currentUser}
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


export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onAddComment, viewMode = 'list', onChannelClick }) => {
  const author = USERS[post.userId];
  const channel = CHANNELS_MAP[post.channelId];
  const currentUser = USERS['user-4']; // Assuming current user
  
  const [showComments, setShowComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);

  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl).then(() => {
        alert('Link da publicação copiado!');
    }).catch(err => {
        console.error('Falha ao copiar o link: ', err);
    });
  };
  
  const handleBookmark = () => {
      setIsBookmarked(prev => !prev);
  }

  if (viewMode === 'grid') {
    return (
        <div className="relative aspect-square group bg-gray-200">
             {post.imageUrl ? (
                <img src={post.imageUrl} alt="Post content" className="w-full h-full object-cover" />
             ) : (
                <div className="w-full h-full p-2 flex items-center justify-center">
                    <p className="text-xs text-center text-gray-600 line-clamp-6">{post.text}</p>
                </div>
             )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex items-center gap-4 text-white font-bold">
                    <div className="flex items-center gap-1.5">
                        <Icon name="favorite" filled size="sm" />
                        <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Icon name="chat_bubble" size="sm" />
                        <span>{post.commentCount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  const topLevelComments = post.comments.filter(c => !c.parentId);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Post Header */}
      <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
              <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={author.avatarUrl}
                  alt={author.name}
              />
              <div className="flex flex-col">
                  {channel && (
                      <div className="text-sm font-semibold text-gray-800">
                          {onChannelClick ? (
                              <button onClick={() => onChannelClick(channel.id)} className="hover:underline">
                                  {channel.name}
                              </button>
                          ) : (
                              <span>{channel.name}</span>
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
              <button className="px-4 py-1.5 text-sm font-semibold text-purple-600 border border-purple-600 rounded-full hover:bg-purple-600/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  Seguir
              </button>
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                  <Icon name="more_horiz" />
              </button>
          </div>
      </div>


      {/* Post Content: Image or Embed */}
      {post.embed ? (
          <div className="w-full bg-black border-y border-gray-200">
            {post.embed.provider === 'youtube' && (
                <div className="aspect-video">
                    <iframe
                        src={post.embed.embedUrl}
                        title={`Embedded content for post ${post.id}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>
            )}
          </div>
      ) : post.imageUrl ? (
          <div className="w-full bg-gray-100 border-y border-gray-200">
              <img src={post.imageUrl} alt="Post content" className="w-full h-auto max-h-[75vh] object-contain" />
          </div>
      ) : null}


      {/* Post Actions */}
      <div className="flex justify-between items-center px-2 pt-2 pb-1 sm:px-3">
          <div className="flex items-center gap-3 sm:gap-4">
               <button onClick={() => onLike(post.id)} className="text-gray-700 hover:opacity-70 transition-opacity p-1">
                  <Icon name="favorite" size="md" filled={post.isLiked} className={post.isLiked ? 'text-red-500' : ''} />
              </button>
               <button onClick={() => setShowComments(!showComments)} className="text-gray-700 hover:opacity-70 transition-opacity p-1">
                  <Icon name="chat_bubble" size="md" />
              </button>
               <button onClick={handleShare} className="text-gray-700 hover:opacity-70 transition-opacity p-1">
                  <Icon name="send" size="md" className="-rotate-12" />
              </button>
          </div>
           <button onClick={handleBookmark} className="text-gray-700 hover:opacity-70 transition-opacity p-1">
              <Icon name="bookmark" size="md" filled={isBookmarked} />
          </button>
      </div>

      {/* Post Stats (Likes) */}
      {post.likes > 0 && (
          <div className="px-4 pb-1">
              <span className="text-sm font-semibold text-gray-800">{post.likes.toLocaleString('pt-BR')} curtidas</span>
          </div>
      )}

      {/* Post Caption/Text */}
      <div className="px-4 pb-2 text-sm text-gray-800">
          <span className="font-semibold mr-1.5">{author.name}</span>
          <span className="text-gray-700 whitespace-pre-wrap">{post.text}</span>
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
                  />
              ))}
          </div>
      )}
      
      {/* Add Comment Form */}
      <div className="px-4 py-2 border-t border-gray-200">
           <SimpleCommentForm onSubmit={(text) => onAddComment(post.id, text)} />
      </div>
    </div>
  );
};
