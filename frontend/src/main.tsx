import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { Toaster } from '@/components/ui/sonner';
import AuthProvider from './context/auth/AuthContext';

import { router } from './routes';

import './index.css';

import './i18n'; // Ensure i18n is initialized before rendering

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster richColors />
    </AuthProvider>
  </StrictMode>,
);
