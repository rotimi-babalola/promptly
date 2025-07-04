import { useState } from 'react';

import { PromptDisplay } from './components/prompt-display';
import { RecorderControls } from './components/recorder-controls';
import { AudioPlayback } from './components/audio-playback';
import { SubmitButton } from './components/submit-button';
import { FeedbackSection } from './components/feedback-section';
import useUploadAudioResponse from './hooks/use-upload-audio-response';

export const SpeakPage = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // TODO: fix this type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const { uploadAudioResponse, isUploading, data } = useUploadAudioResponse();

  const handleSubmit = async () => {
    if (!audioBlob) return;

    uploadAudioResponse({
      audioBlob,
      prompt: 'Talk about what you like to do in your free time',
    });
    // setFeedback(data.feedback);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <PromptDisplay prompt="Talk about what you like to do in your free time" />
      <RecorderControls onRecordingComplete={setAudioBlob} />
      {audioBlob && <AudioPlayback blob={audioBlob} />}
      <SubmitButton
        blob={audioBlob}
        // onFeedbackReceived={setFeedback}
        isSubmitting={isUploading}
        handleSubmit={handleSubmit}
      />
      {data?.feedback && <FeedbackSection feedback={data?.feedback} />}
    </div>
  );
};
