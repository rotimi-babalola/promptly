import { createBrowserRouter } from 'react-router';

import { Login } from '@/pages/auth/Login';
import { AuthCallback } from '@auth/callback';

import { Landing } from '@landing/index';
import { Dashboard } from '@dashboard/index';
import { SpeakPage } from '@speak/index';
import { WritePage } from '@/pages/write';
import NotFound from '@/pages/not-found';
import { SessionGate } from '@/components/common/session-gate';

import { URLS } from './constants';

export const router = createBrowserRouter([
  {
    path: URLS.login,
    element: <Login />,
  },
  {
    path: URLS.root,
    element: <Landing />,
  },
  {
    path: URLS.authCallback,
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
  {
    path: URLS.write,
    element: (
      <SessionGate>
        <WritePage />
      </SessionGate>
    ),
  },
  {
    path: URLS.notFound,
    element: <NotFound />,
  },
]);
