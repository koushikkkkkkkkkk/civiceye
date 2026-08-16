import { createContext, useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import type { Profile } from '@/types';

/**
 * Decoupled AuthContext for offline development.
 * Hardcodes an Amrita student user session to bypass Supabase connection loops.
 */

interface AuthContextValue {
  configured: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAmrita: boolean;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ session: Session | null }>;
  signInWithMagicLink: (email: string) => Promise<void>;
  resendConfirmation: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const DUMMY_AMRITA_USER: User = {
  id: 'local-student-id-123',
  app_metadata: { provider: 'email' },
  user_metadata: { full_name: 'Local Amrita Student' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'local.student@cb.amrita.edu',
  phone: '',
  role: 'authenticated',
  updated_at: new Date().toISOString(),
} as User;

const DUMMY_SESSION: Session = {
  access_token: 'dummy-offline-token',
  token_type: 'bearer',
  expires_in: 3600,
  refresh_token: 'dummy-refresh-token',
  user: DUMMY_AMRITA_USER,
} as Session;

const DUMMY_PROFILE: Profile = {
  id: 'local-student-id-123',
  email: 'local.student@cb.amrita.edu',
  full_name: 'Local Amrita Student',
  is_amrita: true,
  created_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Hardcoded offline session with Amrita student credentials to bypass Supabase loops
  const [loading] = useState<boolean>(false);
  const [session] = useState<Session | null>(DUMMY_SESSION);
  const [profile] = useState<Profile | null>(DUMMY_PROFILE);

  const signInWithPassword = useCallback(async () => {}, []);
  const signUp = useCallback(async () => ({ session: DUMMY_SESSION }), []);
  const signInWithMagicLink = useCallback(async () => {}, []);
  const resendConfirmation = useCallback(async () => {}, []);
  const resetPassword = useCallback(async () => {}, []);
  const updatePassword = useCallback(async () => {}, []);
  const signOut = useCallback(async () => {}, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      configured: true,
      loading,
      session,
      user: session?.user ?? null,
      profile,
      isAmrita: true,
      signInWithPassword,
      signUp,
      signInWithMagicLink,
      resendConfirmation,
      resetPassword,
      updatePassword,
      signOut,
    }),
    [
      loading,
      session,
      profile,
      signInWithPassword,
      signUp,
      signInWithMagicLink,
      resendConfirmation,
      resetPassword,
      updatePassword,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };

