import { useRecorder } from '../../hooks/use-recorder';

import { RecordButton } from './record-button';
import { TimerDisplay } from './timer-display';
import { WaveformDisplay } from './waveform-display';

interface RecorderControlsProps {
  onRecordingComplete: (blob: Blob) => void;
}

export const RecorderControls = ({
  onRecordingComplete,
}: RecorderControlsProps) => {
  const { isRecording, startRecording, stopRecording, timer } = useRecorder({
    onRecordingComplete,
  });

  return (
    <div className="flex flex-col items-center space-y-4">
      <WaveformDisplay isRecording={isRecording} />
      <TimerDisplay seconds={timer} />
      <RecordButton
        isRecording={isRecording}
        onStart={startRecording}
        onStop={stopRecording}
      />
    </div>
  );
};
