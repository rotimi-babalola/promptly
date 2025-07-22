import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/supabase';
import { useNavigate } from 'react-router';

import useAuth from '@/context/auth/useAuth';
import { URLS } from '@/constants';

import { AuthForm } from './components/auth-form';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !authLoading) {
      navigate(URLS.dashboard);
    }
  }, [authLoading, user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    setLoading(true);

    e.preventDefault();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      toast.error(`Error: ${error.message}`);
    } else {
      toast.success('Magic link sent!');
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {sent ? (
        <p className="text-center">✅ Magic link sent! Check your inbox.</p>
      ) : (
        <AuthForm
          email={email}
          setEmail={setEmail}
          handleLogin={handleLogin}
          loading={loading}
        />
      )}
    </div>
  );
};
