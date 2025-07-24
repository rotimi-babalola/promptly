import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { URLS } from '@/constants';

import { InlineDiff } from './components/inline-diff';
import { useWritePage } from './hooks/use-write-page';

export const WritePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    inputText,
    setInputText,
    correctedText,
    loading,
    error,
    prompt,
    wordCount,
    handleSubmit,
    handleClear,
  } = useWritePage();

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="w-full">
        <Button
          variant="ghost"
          onClick={() => navigate(URLS.dashboard)}
          className="mb-4">
          <ChevronLeft />
          {t('common.navigation.backToDashboard')}
        </Button>
      </div>
      <h2 className="text-xl font-semibold mb-2">{t('write.title')}</h2>
      <div className="bg-gray-100 p-4 rounded mb-4 italic text-gray-700">
        {prompt}
      </div>

      <textarea
        className="w-full h-40 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={t('write.form.placeholder')}
        value={inputText}
        onChange={e => setInputText(e.target.value)}
      />
      <div className="flex justify-between items-center mt-1 text-sm text-gray-600">
        <span>{t('write.form.wordCount', { count: wordCount })}</span>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={handleClear}
          disabled={loading && !inputText}>
          {t('write.form.clear')}
        </button>
      </div>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <button
        className="mt-4 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
        onClick={handleSubmit}
        disabled={loading || wordCount < 5}>
        {loading ? t('write.form.submitting') : t('write.form.submit')}
      </button>

      {correctedText && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">
            {t('write.corrections.title')}
          </h2>
          <InlineDiff oldValue={inputText} newValue={correctedText} />
        </div>
      )}
    </div>
  );
};
