import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, User, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { storiesService, likesService, commentsService, type Story, type Comment } from '@/lib/database';
import { toast } from 'sonner';

export function StoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      loadStory();
      loadComments();
    }
  }, [id, user]);

  const loadStory = async () => {
    if (!id) return;
    
    try {
      const storyData = await storiesService.getStory(id, user?.id);
      setStory(storyData);
    } catch (error) {
      console.error('Error loading story:', error);
      toast.error('Story not found');
      navigate('/stories');
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async () => {
    if (!id) return;
    
    try {
      const commentsData = await commentsService.getComments(id);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
    }
  };

  const handleLike = async () => {
    if (!user || !story) {
      toast.error('You must be logged in to like stories');
      return;
    }

    try {
      if (story.user_liked) {
        await likesService.unlikeStory(story.id, user.id);
      } else {
        await likesService.likeStory(story.id, user.id);
      }

      setStory(prev => prev ? {
        ...prev,
        user_liked: !prev.user_liked,
        likes_count: prev.user_liked ? (prev.likes_count || 0) - 1 : (prev.likes_count || 0) + 1
      } : null);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleComment = async () => {
    if (!user || !story) {
      toast.error('You must be logged in to comment');
      return;
    }

    const content = newComment.trim();
    if (!content) {
      toast.error('Please enter a comment');
      return;
    }

    setIsSubmittingComment(true);

    try {
      const newCommentData = await commentsService.createComment(
        { story_id: story.id, content },
        user.id,
        user.name
      );

      setComments(prev => [...prev, newCommentData]);
      setStory(prev => prev ? { 
        ...prev, 
        comments_count: (prev.comments_count || 0) + 1 
      } : null);
      setNewComment('');
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading story...</div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">Story not found</p>
            <Button asChild>
              <Link to="/stories">Back to Stories</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/stories')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Stories
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">{story.title}</CardTitle>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {story.author_name}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(story.created_at)}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
              {story.content}
            </p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className="flex items-center gap-2"
              disabled={!user}
            >
              <Heart 
                className={`w-5 h-5 ${story.user_liked ? 'fill-red-500 text-red-500' : ''}`} 
              />
              {story.likes_count || 0} {(story.likes_count || 0) === 1 ? 'Like' : 'Likes'}
            </Button>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircle className="w-5 h-5" />
              {story.comments_count || 0} {(story.comments_count || 0) === 1 ? 'Comment' : 'Comments'}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Add comment section */}
          {user && (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold">Add a Comment</h3>
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <Button
                onClick={handleComment}
                disabled={isSubmittingComment || !newComment.trim()}
              >
                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          )}

          {/* Comments list */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Comments {comments.length > 0 && `(${comments.length})`}
            </h3>
            
            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-muted/50 dark:bg-blog-surface-elevated rounded-lg p-4 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary">
                        {comment.user_name}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}