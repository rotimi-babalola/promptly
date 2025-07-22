import clsx from 'clsx';

import { getShuffledArray } from '@/lib/getShuffledArray';

interface WaveformDisplayProps {
  isRecording: boolean;
}

export const WaveformDisplay = ({ isRecording }: WaveformDisplayProps) => {
  const bars = getShuffledArray();

  return (
    <div className="flex items-end gap-1 h-10">
      {bars.map(num => (
        <span
          key={num}
          className={clsx(
            'w-1 bg-primary rounded-sm origin-bottom',
            isRecording ? `animate-wave-${num % 5}` : 'h-8',
          )}
        />
      ))}
    </div>
  );
};
