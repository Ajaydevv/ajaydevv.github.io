import { supabase } from './supabase';

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user' | 'moderator';
  granted_by: string | null;
  granted_at: string;
}

export const userRolesService = {
  // Get user roles
  async getUserRoles(userId: string): Promise<UserRole[]> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  },

  // Check if user has specific role
  async hasRole(userId: string, role: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .eq('role', role)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    return !!data;
  },

  // Check if current user is admin
  async isCurrentUserAdmin(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    return this.hasRole(user.id, 'admin');
  },

  // Grant role to user (admin only)
  async grantRole(userId: string, role: 'admin' | 'user' | 'moderator'): Promise<void> {
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: role,
      });

    if (error) throw error;
  },

  // Revoke role from user (admin only)
  async revokeRole(userId: string, role: string): Promise<void> {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);

    if (error) throw error;
  },

  // Get all users with their roles (admin only)
  async getAllUsersWithRoles(): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        *,
        user:user_id (
          email,
          created_at
        )
      `);

    if (error) throw error;
    return data || [];
  },
};