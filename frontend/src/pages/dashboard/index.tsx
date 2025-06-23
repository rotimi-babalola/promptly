import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import useAuth from '@/context/auth/useAuth';
import { supabase } from '@/supabase';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  console.log('Dashboard user:', { user });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    } else {
      navigate('/login');
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {user?.email}</p>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
        Logout
      </button>
    </div>
  );
};
