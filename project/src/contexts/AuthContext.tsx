import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../supabase/supabaseClient';
import { UserProfile } from '../types/userTypes';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isManager: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithSocial: (provider: 'google' | 'facebook' | 'github') => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    // Check if user is a manager from localStorage
    const storedIsManager = localStorage.getItem('isManager') === 'true';
    const storedEmail = localStorage.getItem('userEmail');
    
    if (storedIsManager && storedEmail) {
      setIsManager(true);
      setUser({ email: storedEmail } as User);
      setIsLoading(false);
      return;
    }

    // Handle regular auth state
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
          setIsManager(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      setProfile(data as UserProfile);
      setIsManager(data?.role === 'manager');
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  async function signInWithEmail(email: string, password: string) {
    // For manager login, we'll skip actual authentication
    if (window.location.pathname === '/manager-login') {
      setIsManager(true);
      setUser({ email } as User);
      localStorage.setItem('isManager', 'true');
      localStorage.setItem('userEmail', email);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) throw error;
    return data;
  }

  async function signInWithSocial(provider: 'google' | 'facebook' | 'github') {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: provider === 'google' ? 'profile email' : '',
        },
      });
      
      if (error) throw error;
      
      // After successful OAuth login, create profile if needed
      if (data.session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.session.user.id)
          .single();

        if (!profile) {
          await supabase.from('profiles').insert({
            user_id: data.session.user.id,
            role: 'employee',
          });
        }
      }
    } catch (error) {
      console.error('Social login error:', error);
      throw error;
    }
  }

  async function signUp(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'employee',
          },
        }
      });
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      localStorage.removeItem('isManager');
      localStorage.removeItem('userEmail');
      setIsManager(false);
      setUser(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  const value = {
    session,
    user,
    profile,
    isLoading,
    isManager,
    signInWithEmail,
    signInWithSocial,
    signOut,
    signUp,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}