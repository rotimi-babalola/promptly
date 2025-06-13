import { useTranslation } from 'react-i18next';

export const Landing = () => {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{t('welcome')}</h1>
      <p className="mt-2">{t('homepage-description')}</p>
    </div>
  );
};
