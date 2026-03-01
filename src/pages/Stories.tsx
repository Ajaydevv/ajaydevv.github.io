import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, User, Calendar, Plus, BookOpen, Sparkles, ArrowRight, Send, Pencil, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useAuth } from '@/hooks/useAuth';
import { storiesService, likesService, commentsService, type Story, type Comment } from '@/lib/database';
import { toast } from 'sonner';

export function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [expandedStories, setExpandedStories] = useState<Set<string>>(new Set());
  const [expandedContent, setExpandedContent] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [submittingComments, setSubmittingComments] = useState<Set<string>>(new Set());
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadStories();
  }, [user]);

  const loadStories = async () => {
    try {
      const storiesData = await storiesService.getStories(user?.id);
      setStories(storiesData);
    } catch (error) {
      console.error('Error loading stories:', error);
      toast.error('Failed to load stories');
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async (storyId: string) => {
    try {
      const commentsData = await commentsService.getComments(storyId);
      setComments(prev => ({ ...prev, [storyId]: commentsData }));
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
    }
  };

  const handleLike = async (storyId: string, isLiked: boolean) => {
    if (!user) {
      toast.error('You must be logged in to like stories');
      return;
    }

    try {
      if (isLiked) {
        await likesService.unlikeStory(storyId, user.id);
      } else {
        await likesService.likeStory(storyId, user.id);
      }

      // Update local state
      setStories(prev => prev.map(story => 
        story.id === storyId 
          ? { 
              ...story, 
              user_liked: !isLiked,
              likes_count: isLiked ? (story.likes_count || 0) - 1 : (story.likes_count || 0) + 1
            }
          : story
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleComment = async (storyId: string) => {
    if (!user) {
      toast.error('You must be logged in to comment');
      return;
    }

    const content = newComments[storyId]?.trim();
    if (!content) {
      toast.error('Please enter a comment');
      return;
    }

    setSubmittingComments(prev => new Set(prev).add(storyId));

    try {
      const newComment = await commentsService.createComment(
        { story_id: storyId, content },
        user.id,
        user.name
      );

      // Update local state
      setComments(prev => ({
        ...prev,
        [storyId]: [...(prev[storyId] || []), newComment]
      }));

      setStories(prev => prev.map(story => 
        story.id === storyId 
          ? { ...story, comments_count: (story.comments_count || 0) + 1 }
          : story
      ));

      setNewComments(prev => ({ ...prev, [storyId]: '' }));
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComments(prev => {
        const next = new Set(prev);
        next.delete(storyId);
        return next;
      });
    }
  };

  const toggleStoryExpansion = async (storyId: string) => {
    const isExpanded = expandedStories.has(storyId);
    
    if (!isExpanded) {
      setExpandedStories(prev => new Set(prev).add(storyId));
      if (!comments[storyId]) {
        await loadComments(storyId);
      }
    } else {
      setExpandedStories(prev => {
        const next = new Set(prev);
        next.delete(storyId);
        return next;
      });
    }
  };

  const isHtml = (str: string) => /^\s*</.test(str);

  const startEditing = (story: Story) => {
    setEditingStoryId(story.id);
    setEditTitle(story.title);
    // Wrap plain text in <p> tags so Tiptap renders it correctly
    setEditContent(isHtml(story.content) ? story.content : `<p>${story.content.replace(/\n/g, '</p><p>')}</p>`);
  };

  const cancelEditing = () => {
    setEditingStoryId(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleEditSave = async (storyId: string) => {
    const title = editTitle.trim();
    const content = editContent.trim();
    if (!title || !content) {
      toast.error('Title and content cannot be empty');
      return;
    }
    setIsSaving(true);
    try {
      await storiesService.updateStory(storyId, { title, content });
      setStories(prev => prev.map(s =>
        s.id === storyId ? { ...s, title, content } : s
      ));
      cancelEditing();
      toast.success('Story updated!');
    } catch (error) {
      console.error('Error updating story:', error);
      toast.error('Failed to update story');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleContentExpansion = (storyId: string) => {
    setExpandedContent(prev => {
      const next = new Set(prev);
      if (next.has(storyId)) {
        next.delete(storyId);
      } else {
        next.add(storyId);
      }
      return next;
    });
  };

  const getStoryPreview = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm tracking-wide">Loading stories…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero header */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-900/20 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary text-sm font-medium tracking-widest uppercase">
                <Sparkles className="w-4 h-4" />
                Community
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
                Stories
              </h1>
              <p className="text-muted-foreground max-w-md">
                Discover and share amazing stories from the community.
              </p>
            </div>
            {user && (
              <Button
                asChild
                className="group bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_32px_hsl(var(--primary)/0.5)] transition-all duration-300 self-start sm:self-auto"
              >
                <Link to="/create-story">
                  <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  New Story
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {stories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <BookOpen className="w-9 h-9 text-primary/60" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Something's brewing…</h2>
              <p className="text-muted-foreground max-w-xs">Ajayadev is cooking one. No stories yet — be the first!</p>
            </div>
            {user && (
              <Button asChild className="bg-primary hover:bg-primary/90 shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                <Link to="/create-story">Create your first story</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-5 max-w-3xl mx-auto">
            {stories.map((story) => {
              const isExpanded = expandedStories.has(story.id);
              const isContentExpanded = expandedContent.has(story.id);
              const isEditing = editingStoryId === story.id;
              const isOwner = user?.id === story.author_id;

              return (
                <article
                  key={story.id}
                  className="group relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_40px_hsl(var(--primary)/0.08)]"
                >
                  {/* Top gradient accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="p-6 pb-4">
                    {/* Author row */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/80 to-purple-700 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-[0_0_12px_hsl(var(--primary)/0.4)]">
                        {(story.author_name ?? 'A').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-none truncate">{story.author_name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{formatDate(story.created_at)}</p>
                      </div>
                      {isOwner && !isEditing && (
                        <button
                          onClick={() => startEditing(story)}
                          className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-3">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="text-lg font-semibold bg-card/50 border-primary/40 focus:border-primary"
                          placeholder="Story title…"
                        />
                        <RichTextEditor
                          content={editContent}
                          onChange={setEditContent}
                          placeholder="Write your story…"
                        />
                        <div className="flex items-center gap-2 pt-1">
                          <Button
                            size="sm"
                            onClick={() => handleEditSave(story.id)}
                            disabled={isSaving || !editTitle.trim() || !editContent.trim()}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-3 text-xs shadow-[0_0_12px_hsl(var(--primary)/0.25)] disabled:shadow-none"
                          >
                            <Check className="w-3.5 h-3.5 mr-1.5" />
                            {isSaving ? 'Saving…' : 'Save'}
                          </Button>
                          <button
                            onClick={cancelEditing}
                            disabled={isSaving}
                            className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all disabled:opacity-40"
                          >
                            <X className="w-3.5 h-3.5" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Title */}
                        <Link to={`/story/${story.id}`} className="block group/title">
                          <h2 className="text-xl font-semibold leading-snug group-hover/title:text-primary transition-colors duration-200 mb-3">
                            {story.title}
                          </h2>
                        </Link>

                        {/* Content preview */}
                        {isHtml(story.content) ? (
                          <div
                            className="story-content text-muted-foreground text-sm"
                            dangerouslySetInnerHTML={{
                              __html: isContentExpanded
                                ? story.content
                                : getStoryPreview(story.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim())
                            }}
                          />
                        ) : (
                          <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                            {isContentExpanded ? story.content : getStoryPreview(story.content)}
                          </p>
                        )}

                        {(() => {
                      const plainText = isHtml(story.content)
                        ? story.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
                        : story.content;
                      return plainText.length > 200 && (
                          <div className="mt-3 flex items-center gap-3">
                            <button
                              onClick={() => toggleContentExpansion(story.id)}
                              className="text-primary text-sm font-medium hover:underline underline-offset-2 transition-colors"
                            >
                              {isContentExpanded ? 'Show less' : 'Read more'}
                            </button>
                            {!isContentExpanded && (
                              <>
                                <span className="text-border">·</span>
                                <Link
                                  to={`/story/${story.id}`}
                                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                                >
                                  Full story <ArrowRight className="w-3 h-3" />
                                </Link>
                              </>
                            )}
                          </div>
                        );
                      })()}
                      </>
                    )}
                  </div>

                  {/* Action bar — hidden while editing */}
                  {!isEditing && <div className="px-6 py-3 border-t border-border/40 flex items-center gap-1">
                    <button
                      onClick={() => handleLike(story.id, story.user_liked || false)}
                      disabled={!user}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                        ${story.user_liked
                          ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                        }`}
                    >
                      <Heart className={`w-4 h-4 transition-transform duration-150 ${story.user_liked ? 'fill-red-400 scale-110' : ''}`} />
                      <span>{story.likes_count || 0}</span>
                    </button>

                    <button
                      onClick={() => toggleStoryExpansion(story.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                        ${isExpanded
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                        }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{story.comments_count || 0}</span>
                    </button>

                    <div className="ml-auto">
                      <Link
                        to={`/story/${story.id}`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200"
                      >
                        View <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>}

                  {/* Comments panel */}
                  {isExpanded && (
                    <div className="border-t border-border/40 bg-black/20 px-6 py-5 space-y-4">
                      {user && (
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/60 to-purple-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {(user.name ?? 'Y').charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 space-y-2">
                            <Textarea
                              placeholder="Write a comment…"
                              value={newComments[story.id] || ''}
                              onChange={(e) => setNewComments(prev => ({
                                ...prev,
                                [story.id]: e.target.value
                              }))}
                              rows={2}
                              className="bg-card/50 border-border/50 focus:border-primary/50 resize-none text-sm placeholder:text-muted-foreground/50 transition-colors"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleComment(story.id)}
                              disabled={submittingComments.has(story.id) || !newComments[story.id]?.trim()}
                              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8 px-3 shadow-[0_0_12px_hsl(var(--primary)/0.25)] disabled:shadow-none transition-all"
                            >
                              <Send className="w-3 h-3 mr-1.5" />
                              {submittingComments.has(story.id) ? 'Posting…' : 'Post'}
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        {comments[story.id]?.length === 0 && (
                          <p className="text-center text-muted-foreground/60 text-xs py-3 tracking-wide">
                            No comments yet — start the conversation.
                          </p>
                        )}
                        {comments[story.id]?.map((comment) => (
                          <div
                            key={comment.id}
                            className="flex gap-3"
                          >
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-muted to-card border border-border/60 flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
                              {(comment.user_name ?? '?').charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0 bg-card/40 rounded-xl px-4 py-3 border border-border/30">
                              <div className="flex items-baseline justify-between gap-2 mb-1">
                                <span className="text-xs font-semibold text-foreground/80 truncate">{comment.user_name}</span>
                                <span className="text-xs text-muted-foreground/60 shrink-0">{formatDate(comment.created_at)}</span>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}