import { Loader2 } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
  email: string;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  setEmail: (value: string) => void;
  loading: boolean;
};

export const AuthForm = ({ email, handleLogin, setEmail, loading }: Props) => {
  const { t } = useTranslation();
  const isSubmitButtonDisabled = !email || loading;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Welcome Back!</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Label htmlFor="email" className="mb-2">
            {t('login.email-label')}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <Button
          className={`w-full ${
            isSubmitButtonDisabled
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer'
          }`}
          type="submit"
          disabled={isSubmitButtonDisabled}>
          {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          {loading
            ? t('common.loading.sending')
            : t('common.auth.sendMagicLink')}
        </Button>
      </form>

      <p className="text-xs text-center text-muted-foreground mt-6">
        <Trans
          i18nKey="login.privacy-policy"
          components={{
            terms: <a href="/terms" className="underline mr-0.5" />,
            privacy: <a href="/privacy" className="underline ml-0.5" />,
          }}
        />
      </p>
    </div>
  );
};
