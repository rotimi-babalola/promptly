interface TimerDisplayProps {
  seconds: number;
}

export const TimerDisplay = ({ seconds }: TimerDisplayProps) => {
  const formatTime = (s: number) => {
    const minutes = Math.floor(s / 60)
      .toString()
      .padStart(2, '0');
    const secs = (s % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  return (
    <div className="text-sm text-muted-foreground font-mono tracking-widest">
      {formatTime(seconds)}
    </div>
  );
};
