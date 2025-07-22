import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  blob: Blob | null;
  isSubmitting: boolean;
  handleSubmit: () => void;
  isSubmitted?: boolean;
}

export const SubmitButton = ({
  blob,
  isSubmitting,
  handleSubmit,
  isSubmitted,
}: SubmitButtonProps) => {
  const { t } = useTranslation();

  if (isSubmitted) {
    return null;
  }

  return (
    <div className="text-center">
      <Button
        onClick={handleSubmit}
        disabled={!blob || isSubmitting}
        className="cursor-pointer"
        data-testid="speak-submit-button">
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            {t('common.loading.submitting')}
          </>
        ) : (
          t('common.actions.submit')
        )}
      </Button>
    </div>
  );
};
