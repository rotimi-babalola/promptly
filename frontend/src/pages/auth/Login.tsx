import { useState } from 'react';

import { supabase } from '@/supabase';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'http://localhost:5173/auth/callback',
      },
    });
    if (!error) setSent(true);
    else alert('Error sending link: ' + error.message);
  };

  return (
    <div className="p-4">
      {sent ? (
        <p>Check your email for the login link.</p>
      ) : (
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border p-2 mr-2"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2">
            Send Magic Link
          </button>
        </div>
      )}
    </div>
  );
};
