import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  blob: Blob | null;
  // TODO: fix this type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFeedbackReceived: (feedback: any) => void;
  isSubmitting: boolean;
  setIsSubmitting: (val: boolean) => void;
}

export const SubmitButton = ({
  blob,
  onFeedbackReceived,
  isSubmitting,
  setIsSubmitting,
}: SubmitButtonProps) => {
  const handleSubmit = async () => {
    if (!blob) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('audio', blob);

    const res = await fetch('/api/v1/speak', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    onFeedbackReceived(data.feedback);
    setIsSubmitting(false);
  };

  return (
    <div className="text-center">
      <Button onClick={handleSubmit} disabled={!blob || isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : null}
        Submit
      </Button>
    </div>
  );
};
