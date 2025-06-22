// context/AuthContext.tsx
import { createContext, useEffect, useState } from 'react';
import { type Session } from '@supabase/supabase-js';

import { supabase } from '@/supabase';
import { type AuthContextType } from './authTypes';

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;
