import { createBrowserRouter } from 'react-router';

import { Login } from '@auth/Login';
import { Signup } from '@auth/Signup';
import { AuthCallback } from '@auth/callback';

import { Landing } from '@landing/index';
import { Dashboard } from '@dashboard/index';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
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
    element: <Dashboard />,
  },
]);
