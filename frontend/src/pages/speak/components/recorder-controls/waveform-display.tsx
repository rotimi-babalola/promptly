import clsx from 'clsx';

interface WaveformDisplayProps {
  isRecording: boolean;
}

export const WaveformDisplay = ({ isRecording }: WaveformDisplayProps) => {
  return (
    <div className="flex items-end gap-1 h-10">
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className={clsx(
            'w-1 bg-primary rounded-sm origin-bottom',
            // `w-1 h-8 bg-primary rounded-sm origin-bottom animate-wave-${i % 5}`,
            isRecording ? `animate-wave-${i % 5}` : 'h-8',
          )}
        />
      ))}
    </div>
  );
};
