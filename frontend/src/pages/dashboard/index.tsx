import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { URLS } from '@/constants';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full flex items-center justify-between px-6 py-4 shadow-sm bg-white sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-800">
          {t('dashboard.title')}
        </h1>
        <Button variant="outline" onClick={() => navigate(URLS.logout)}>
          {t('dashboard.logout')}
        </Button>
      </header>

      <main className="flex-grow px-6 py-8 max-w-4xl mx-auto w-full">
        <div className="mb-8 flex justify-end items-baseline">
          <label className="block mb-2 text-sm font-medium text-gray-700 mr-1">
            {t('dashboard.languageLabel')}
          </label>
          <Select defaultValue="german">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('dashboard.selectLanguage')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="german">
                {t('dashboard.languages.german')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Practice Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            className="border rounded-xl p-6 hover:shadow-md transition cursor-pointer bg-white"
            onClick={() => navigate(URLS.speak)}>
            <h2 className="text-lg font-semibold mb-2">
              {t('dashboard.speaking.title')}
            </h2>
            <p className="text-sm text-gray-600">
              {t('dashboard.speaking.description')}
            </p>
          </div>

          <div
            className="border rounded-xl p-6 hover:shadow-md transition cursor-pointer bg-white"
            onClick={() => navigate('/practice/writing')}>
            <h2 className="text-lg font-semibold mb-2">
              {t('dashboard.writing.title')}
            </h2>
            <p className="text-sm text-gray-600">
              {t('dashboard.writing.description')}
            </p>
          </div>

          <div className="border rounded-xl p-6 bg-gray-100 cursor-not-allowed opacity-50">
            <h2 className="text-lg font-semibold mb-2">
              {t('dashboard.reading.title')}
            </h2>
            <p className="text-sm text-gray-600">
              {t('dashboard.reading.description')}
            </p>
          </div>

          <div className="border rounded-xl p-6 bg-gray-100 cursor-not-allowed opacity-50">
            <h2 className="text-lg font-semibold mb-2">
              {t('dashboard.listening.title')}
            </h2>
            <p className="text-sm text-gray-600">
              {t('dashboard.listening.description')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
