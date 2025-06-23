import { Navigate } from 'react-router';
import useAuth from '@/context/auth/useAuth';

export function SessionGate({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  // Optional: redirect unauthenticated users
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
