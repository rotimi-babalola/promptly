import { useState } from 'react';
import { toast } from 'sonner';

import { supabase } from '@/supabase';
import { AuthForm } from './components/auth-form';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    setLoading(true);

    e.preventDefault();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        // this could naviagte to a custom callback page
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      toast.error(`Error: ${error.message}`);
    } else {
      toast.success('Magic link sent!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <AuthForm
        email={email}
        setEmail={setEmail}
        handleLogin={handleLogin}
        loading={loading}
      />
    </div>
  );
};
