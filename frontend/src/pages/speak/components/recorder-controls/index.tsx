import { RecordButton } from './record-button';
import { TimerDisplay } from './timer-display';
import { WaveformDisplay } from './waveform-display';

interface RecorderControlsProps {
  isDisabled?: boolean;
  isRecording: boolean;
  timer: number;
  startRecording: () => void;
  stopRecording: () => void;
}

export const RecorderControls = ({
  isDisabled,
  isRecording,
  timer,
  startRecording,
  stopRecording,
}: RecorderControlsProps) => {
  return (
    <div
      className="flex flex-col items-center space-y-4"
      data-testid="recorder-controls">
      <WaveformDisplay isRecording={isRecording} />
      <TimerDisplay seconds={timer} />
      <RecordButton
        isRecording={isRecording}
        onStart={startRecording}
        onStop={stopRecording}
        isDisabled={isDisabled}
      />
    </div>
  );
};
