import { supabase } from './supabase';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const profilesService = {
  // Get user profile
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    return data;
  },

  // Check if user is admin with caching
  async isUserAdmin(userId: string): Promise<boolean> {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Admin check timeout')), 8000)
      );
      
      const queryPromise = supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();
      
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

      if (error && error.code !== 'PGRST116') throw error;
      return data?.is_admin || false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false; // Default to false on error
    }
  },

  // Check if current user is admin
  async isCurrentUserAdmin(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    return this.isUserAdmin(user.id);
  },

  // Update profile
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Grant admin status (admin only)
  async grantAdminStatus(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', userId);

    if (error) throw error;
  },

  // Revoke admin status (admin only)
  async revokeAdminStatus(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: false })
      .eq('id', userId);

    if (error) throw error;
  },

  // Get all profiles (admin only)
  async getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get all admin users
  async getAdminUsers(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_admin', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};