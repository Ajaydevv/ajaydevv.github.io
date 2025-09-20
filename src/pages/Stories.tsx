import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, User, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading stories...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Stories</h1>
          <p className="text-muted-foreground">Discover and share amazing stories</p>
        </div>
        {user && (
          <Button asChild>
            <Link to="/create-story">
              <Plus className="w-4 h-4 mr-2" />
              Create Story
            </Link>
          </Button>
        )}
      </div>

      {stories.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">Ajayadev is cooking one. no stories yet!</p>
            {user && (
              <Button asChild>
                <Link to="/create-story">Create Your First Story</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {stories.map((story) => (
            <Card key={story.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <Link to={`/story/${story.id}`}>
                      <CardTitle className="text-xl hover:text-blog-primary transition-colors cursor-pointer">
                        {story.title}
                      </CardTitle>
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {story.author_name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(story.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-foreground whitespace-pre-wrap">
                    {expandedContent.has(story.id) ? story.content : getStoryPreview(story.content)}
                  </p>
                  {story.content.length > 200 && (
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => toggleContentExpansion(story.id)}
                        className="p-0 h-auto text-blog-primary hover:text-blog-accent"
                      >
                        {expandedContent.has(story.id) ? 'Show less' : 'Read more'}
                      </Button>
                      {!expandedContent.has(story.id) && (
                        <span className="text-muted-foreground">•</span>
                      )}
                      {!expandedContent.has(story.id) && (
                        <Link 
                          to={`/story/${story.id}`}
                          className="text-blog-primary hover:text-blog-accent text-sm"
                        >
                          View full story →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(story.id, story.user_liked || false)}
                      className="flex items-center gap-1"
                      disabled={!user}
                    >
                      <Heart 
                        className={`w-4 h-4 ${story.user_liked ? 'fill-red-500 text-red-500' : ''}`} 
                      />
                      {story.likes_count || 0}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStoryExpansion(story.id)}
                      className="flex items-center gap-1"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {story.comments_count || 0}
                    </Button>
                  </div>
                </div>

                {expandedStories.has(story.id) && (
                  <>
                    <Separator className="my-4" />
                    
                    {/* Add comment section */}
                    {user && (
                      <div className="space-y-2 mb-4">
                        <Textarea
                          placeholder="Write a comment..."
                          value={newComments[story.id] || ''}
                          onChange={(e) => setNewComments(prev => ({ 
                            ...prev, 
                            [story.id]: e.target.value 
                          }))}
                          rows={2}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleComment(story.id)}
                          disabled={submittingComments.has(story.id) || !newComments[story.id]?.trim()}
                        >
                          {submittingComments.has(story.id) ? 'Posting...' : 'Post Comment'}
                        </Button>
                      </div>
                    )}

                    {/* Comments list */}
                    <div className="space-y-3">
                      {comments[story.id]?.map((comment) => (
                        <div key={comment.id} className="bg-muted/50 dark:bg-blog-surface-elevated rounded-lg p-3 border border-border">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {comment.user_name}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(comment.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-foreground whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                      ))}
                      
                      {comments[story.id]?.length === 0 && (
                        <p className="text-center text-muted-foreground text-sm py-4">
                          No comments yet. Be the first to comment!
                        </p>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}