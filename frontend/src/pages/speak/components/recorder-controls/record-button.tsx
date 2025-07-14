import { Mic, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecordButtonProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
  isDisabled?: boolean;
}

export const RecordButton = ({
  isRecording,
  onStart,
  onStop,
  isDisabled,
}: RecordButtonProps) => {
  return (
    <Button
      onClick={isRecording ? onStop : onStart}
      variant="destructive"
      disabled={isDisabled}
      size="lg"
      className="rounded-full h-20 w-20 flex items-center justify-center cursor-pointer">
      {isRecording ? (
        <StopCircle className="w-8 h-8" />
      ) : (
        <Mic className="w-8 h-8" />
      )}
    </Button>
  );
};
