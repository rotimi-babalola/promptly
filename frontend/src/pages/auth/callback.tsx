import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { supabase } from '@/supabase';
import { URLS } from '@/constants';

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const { error } = await supabase.auth.getSession();

      if (error) {
        console.error('Auth callback error:', error.message);
      }

      navigate(URLS.dashboard);
    };

    handleAuth();
  }, [navigate]);

  return <p>Logging you in...</p>;
};
