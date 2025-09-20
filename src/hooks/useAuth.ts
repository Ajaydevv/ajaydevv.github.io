import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Supabase auth implementation
export function useAuthProvider(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get initial session and user role
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth initialization timeout')), 15000)
        );
        
        const sessionPromise = supabase.auth.getSession().then(async ({ data: { session } }) => {
          if (session?.user) {
            const userWithRole = await mapSupabaseUser(session.user);
            setUser(userWithRole);
          }
        });
        
        await Promise.race([sessionPromise, timeoutPromise]);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          const userWithRole = await mapSupabaseUser(session.user);
          setUser(userWithRole);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const mapSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User> => {
    try {
      // Add timeout to prevent hanging on profile fetch
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
      );
      
      const profilePromise = supabase
        .from('profiles')
        .select('is_admin, full_name, avatar_url')
        .eq('id', supabaseUser.id)
        .single();
      
      const { data: profileData } = await Promise.race([profilePromise, timeoutPromise]) as any;

      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        role: profileData?.is_admin ? 'admin' : 'user',
        name: profileData?.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
        avatar: profileData?.avatar_url || supabaseUser.user_metadata?.avatar_url,
      };
    } catch (error) {
      console.error('Error mapping user:', error);
      // Return basic user info if profile fetch fails
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        role: 'user',
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
        avatar: supabaseUser.user_metadata?.avatar_url,
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    isLoading,
    isAdmin: user?.role === 'admin',
    signIn,
    signUp,
    signOut,
  };
}

export { AuthContext };