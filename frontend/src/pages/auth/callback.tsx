import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { supabase } from '@/supabase';

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const { error, data } = await supabase.auth.getSession();
      console.log('Auth callback data:', data);
      if (error) {
        console.error('Auth callback error:', error.message);
      }

      navigate('/dashboard');
    };

    handleAuth();
  }, [navigate]);

  return <p>Logging you in...</p>;
};
