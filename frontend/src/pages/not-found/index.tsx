import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { URLS } from '@/constants';

import { Button } from '../../components/ui/button';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">
        {t('notFound.title', 'Page Not Found')}
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">
        {t(
          'notFound.description',
          'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
        )}
      </p>
      <Button asChild>
        <Link to={URLS.dashboard}>
          {t('common.navigation.backToDashboard')}
        </Link>
      </Button>
    </div>
  );
}
