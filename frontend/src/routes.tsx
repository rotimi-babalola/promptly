import { createBrowserRouter } from 'react-router';

import { Login } from '@/pages/auth/Login';
import { AuthCallback } from '@auth/callback';

import { Landing } from '@landing/index';
import { Dashboard } from '@dashboard/index';
import { SpeakPage } from '@speak/index';
import { SessionGate } from '@/components/common/session-gate';

import { URLS } from './constants';

export const router = createBrowserRouter([
  {
    path: URLS.login,
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
    path: URLS.dashboard,
    element: (
      <SessionGate>
        <Dashboard />
      </SessionGate>
    ),
  },
  {
    path: URLS.speak,
    element: (
      <SessionGate>
        <SpeakPage />
      </SessionGate>
    ),
  },
]);
