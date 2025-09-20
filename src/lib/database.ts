import { supabase } from './supabase';

export interface Story {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  likes_count?: number;
  user_liked?: boolean;
  comments_count?: number;
}

export interface Comment {
  id: string;
  story_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStoryData {
  title: string;
  content: string;
}

export interface CreateCommentData {
  story_id: string;
  content: string;
}

// Stories service
export const storiesService = {
  // Get all stories with like counts and user's like status
  async getStories(userId?: string): Promise<Story[]> {
    let query = supabase
      .from('stories')
      .select(`
        *,
        likes:likes(count),
        comments:comments(count)
      `)
      .order('created_at', { ascending: false });

    const { data: stories, error } = await query;
    if (error) throw error;

    // Get user's likes if user is authenticated
    let userLikes: { story_id: string }[] = [];
    if (userId) {
      const { data: likes } = await supabase
        .from('likes')
        .select('story_id')
        .eq('user_id', userId);
      userLikes = likes || [];
    }

    return stories.map((story: any) => ({
      ...story,
      likes_count: story.likes[0]?.count || 0,
      comments_count: story.comments[0]?.count || 0,
      user_liked: userLikes.some(like => like.story_id === story.id),
    }));
  },

  // Get a single story by ID
  async getStory(id: string, userId?: string): Promise<Story | null> {
    const { data: story, error } = await supabase
      .from('stories')
      .select(`
        *,
        likes:likes(count),
        comments:comments(count)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!story) return null;

    // Check if user liked this story
    let userLiked = false;
    if (userId) {
      const { data: like } = await supabase
        .from('likes')
        .select('id')
        .eq('story_id', id)
        .eq('user_id', userId)
        .single();
      userLiked = !!like;
    }

    return {
      ...story,
      likes_count: story.likes[0]?.count || 0,
      comments_count: story.comments[0]?.count || 0,
      user_liked: userLiked,
    };
  },

  // Create a new story
  async createStory(data: CreateStoryData, userId: string, userName: string): Promise<Story> {
    const { data: story, error } = await supabase
      .from('stories')
      .insert({
        title: data.title,
        content: data.content,
        author_id: userId,
        author_name: userName,
      })
      .select()
      .single();

    if (error) throw error;
    return story;
  },

  // Update a story
  async updateStory(id: string, data: Partial<CreateStoryData>): Promise<Story> {
    const { data: story, error } = await supabase
      .from('stories')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return story;
  },

  // Delete a story
  async deleteStory(id: string): Promise<void> {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Likes service
export const likesService = {
  // Like a story
  async likeStory(storyId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('likes')
      .insert({
        story_id: storyId,
        user_id: userId,
      });

    if (error) throw error;
  },

  // Unlike a story
  async unlikeStory(storyId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('story_id', storyId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  // Get likes count for a story
  async getLikesCount(storyId: string): Promise<number> {
    const { count, error } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('story_id', storyId);

    if (error) throw error;
    return count || 0;
  },
};

// Comments service
export const commentsService = {
  // Get comments for a story
  async getComments(storyId: string): Promise<Comment[]> {
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('story_id', storyId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return comments || [];
  },

  // Create a comment
  async createComment(data: CreateCommentData, userId: string, userName: string): Promise<Comment> {
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        story_id: data.story_id,
        content: data.content,
        user_id: userId,
        user_name: userName,
      })
      .select()
      .single();

    if (error) throw error;
    return comment;
  },

  // Update a comment
  async updateComment(id: string, content: string): Promise<Comment> {
    const { data: comment, error } = await supabase
      .from('comments')
      .update({ content })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return comment;
  },

  // Delete a comment
  async deleteComment(id: string): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};