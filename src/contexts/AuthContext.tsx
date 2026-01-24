import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { supabase } from "../lib/supabaseClient";
import { toast } from 'sonner';
import { supabaseService, UserProfile } from '../services/supabaseService';

interface AuthContextType {
  user: UserProfile | null;
  session: any;
  loading: boolean;
  signUp: (email: string, password: string, profileData: Partial<UserProfile>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);
  const userRef = useRef<UserProfile | null>(null);
  const sessionRef = useRef<any>(null);

  // Initialize auth state
  useEffect(() => {
    mounted.current = true;
    let authSubscription: { unsubscribe: () => void } | null = null;
    let initTimer: NodeJS.Timeout;

    const initialize = async () => {
      try {
        setLoading(true);

        // Safety timeout
        initTimer = setTimeout(() => {
          if (mounted.current) {
            console.warn("Auth initialization safety timeout reached.");
            setLoading(false);
          }
        }, 5000); // Reduce to 5 seconds

        const { data: { session: initialSession } } = await supabase.auth.getSession();

        if (mounted.current) {
          setSession(initialSession);
          sessionRef.current = initialSession;
          if (initialSession?.user) {
            await fetchUserProfile(initialSession.user.id);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted.current) {
          setLoading(false);
          clearTimeout(initTimer);
        }
      }
    };

    initialize();

    // Listen for auth changes
    const { data } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted.current) return;

        console.log('Auth state changed:', event, !!currentSession);

        // Safety timeout for this specific event transition
        const transitionTimer = setTimeout(() => {
          if (mounted.current) setLoading(false);
        }, 5000);

        // If we have a new user session, set loading immediately before updating state
        // ONLY if we don't already have one to avoid unmounting components during transitions
        if (currentSession?.user && !userRef.current) {
          setLoading(true);
        }

        setSession(currentSession);
        sessionRef.current = currentSession;

        if (currentSession?.user) {
          if (!userRef.current || userRef.current.id !== currentSession.user.id) {
            await fetchUserProfile(currentSession.user.id);
          }
          if (mounted.current) {
            setLoading(false);
            clearTimeout(transitionTimer);
          }
        } else if (!currentSession) {
          setUser(null);
          userRef.current = null;
          setLoading(false);
          clearTimeout(transitionTimer);
        }
      }
    );

    authSubscription = data.subscription;

    return () => {
      mounted.current = false;
      if (initTimer) clearTimeout(initTimer);
      authSubscription?.unsubscribe();
    };
  }, []);

  async function fetchUserProfile(userId: string) {
    try {
      if (!userId) return;
      const userData = await supabaseService.getProfile(userId);
      if (mounted.current) {
        setUser(userData);
        userRef.current = userData;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (mounted.current) {
        setUser(null);
        userRef.current = null;
      }
    }
  }

  const signUp = async (email: string, password: string, profileData: Partial<UserProfile>) => {
    try {
      setLoading(true);

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: profileData.name || '',
            role: 'mentee',
            ...profileData
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!signUpData.user) throw new Error('Failed to create user');

      toast.success('Account created successfully! Please check your email for verification.');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account');
      setLoading(false);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Failed to sign in');

      // fetchUserProfile is handled by onAuthStateChange
      toast.success('Signed in successfully!');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in. Please check your credentials.');
      setLoading(false); // Make sure to reset loading on error
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      // We attempt to sign out from Supabase, but we clear local state regardless
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn('Supabase signOut error:', error);
        // We don't throw here so the finally block can clear local state
      }

      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Logout process error:', error);
      toast.error('Error during logout');
    } finally {
      if (mounted.current) {
        setUser(null);
        setSession(null);
        userRef.current = null;
        sessionRef.current = null;
        setLoading(false);
      }
      // Redirect to home or login is handled by Route logic
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('Not authenticated');

    try {
      setLoading(true);
      const updatedProfile = await supabaseService.updateProfile(user.id, data);

      if (updatedProfile) {
        setUser(updatedProfile);
        toast.success('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error(error.message || 'Failed to update profile');
      throw error;
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  const refreshUser = async () => {
    // If we have a session but need to refresh profile
    if (!session?.user) {
      // Double check session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user.id);
      }
      return;
    }
    await fetchUserProfile(session.user.id);
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
