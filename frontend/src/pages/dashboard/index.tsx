import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import useAuth from '@/context/auth/useAuth';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {user?.email}</p>
    </div>
  );
};
