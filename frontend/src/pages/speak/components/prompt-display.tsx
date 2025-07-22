import { useTranslation } from 'react-i18next';

interface PromptDisplayProps {
  prompt: string;
}

export const PromptDisplay = ({ prompt }: PromptDisplayProps) => {
  const { t } = useTranslation();

  return (
    <div className="text-center space-y-2" data-testid="prompt-display">
      <h1 className="text-2xl font-semibold">{t('speak.title')}</h1>
      <p className="text-muted-foreground">{prompt}</p>
    </div>
  );
};
