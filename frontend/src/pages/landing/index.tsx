import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { URLS } from '@/constants';

export const Landing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-br from-blue-50 to-white">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">
        {t('landing.welcome')}
      </h1>
      <p className="text-lg md:text-xl text-gray-700 max-w-xl mb-8">
        {t('landing.description')}
      </p>
      <Button
        className="text-lg px-8 py-4 rounded-full cursor-pointer"
        onClick={() => navigate(URLS.login)}>
        {t('landing.getStarted')}
      </Button>

      <div className="mt-12 text-sm text-gray-500">
        <p>{t('landing.subtitle-1')}</p>
        <p className="mt-2">{t('landing.subtitle-2')}</p>
      </div>
    </div>
  );
};
