import { createBrowserRouter } from 'react-router';

import { Login } from '@/pages/auth/Login';
import { AuthCallback } from '@auth/callback';

import { Landing } from '@landing/index';
import { Dashboard } from '@dashboard/index';
import { SessionGate } from '@/components/common/session-gate';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
  {
    path: '/dashboard',
    element: (
      <SessionGate>
        <Dashboard />
      </SessionGate>
    ),
  },
]);
