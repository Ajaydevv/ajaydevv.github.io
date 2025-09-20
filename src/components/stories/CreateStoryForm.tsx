import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { storiesService } from '@/lib/database';
import { profilesService } from '@/lib/profiles';
import { toast } from 'sonner';

export function CreateStoryForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin when component mounts
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const adminStatus = await profilesService.isUserAdmin(user.id);
          setIsUserAdmin(adminStatus);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsUserAdmin(false);
        }
      }
      setIsCheckingAdmin(false);
    };

    checkAdminStatus();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a story');
      return;
    }

    if (!isUserAdmin) {
      toast.error('Only administrators can create stories');
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    setIsSubmitting(true);

    try {
      await storiesService.createStory(
        { title: title.trim(), content: content.trim() },
        user.id,
        user.name
      );
      
      toast.success('Story created successfully!');
      navigate('/stories');
    } catch (error) {
      console.error('Error creating story:', error);
      toast.error('Failed to create story. Only administrators can create stories.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingAdmin) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create a Story</CardTitle>
          <CardDescription>Checking permissions...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create a Story</CardTitle>
          <CardDescription>You must be logged in to create a story.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!isUserAdmin) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Access Restricted</CardTitle>
          <CardDescription>Only administrators can create stories.</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            You don't have permission to create stories. Please contact an administrator for access.
          </p>
          <Button onClick={() => navigate('/stories')} variant="outline">
            View Stories Instead
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Story</CardTitle>
        <CardDescription>Share your story with the community.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Story Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter your story title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Story Content</Label>
            <Textarea
              id="content"
              placeholder="Write your story here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              rows={10}
              required
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Story'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/stories')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}