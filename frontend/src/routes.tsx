import { createBrowserRouter } from 'react-router';

import { Login } from '@auth/Login';
import { Signup } from '@auth/Signup';
import { Landing } from '@landing/index';

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
]);
