import { useEffect, useState } from 'react';

import { PromptDisplay } from './components/prompt-display';
import { RecorderControls } from './components/recorder-controls';
import { AudioPlayback } from './components/audio-playback';
import { SubmitButton } from './components/submit-button';
import { FeedbackSection } from './components/feedback-section';

import useUploadAudioResponse, {
  type UploadAudioResponseResult,
} from './hooks/use-upload-audio-response';
import { useRecorder } from './hooks/use-recorder';

import { getRandomPrompt } from './prompts';

const randomPrompt = getRandomPrompt();

export const SpeakPage = () => {
  const [feedbackData, setFeedbackData] =
    useState<UploadAudioResponseResult | null>(null);

  const [prompt, setPrompt] = useState(randomPrompt);

  const {
    uploadAudioResponse,
    isUploading,
    data,
    isSuccess,
    resetUploadAudio,
    rateLimitInfo,
  } = useUploadAudioResponse();

  const {
    isRecording,
    startRecording,
    stopRecording,
    timer,
    audioBlob,
    resetRecording,
  } = useRecorder();

  const disableRecordButton = isUploading || isSuccess;

  const handleSubmit = async () => {
    if (!audioBlob) return;

    uploadAudioResponse({
      audioBlob,
      prompt,
    });
  };

  useEffect(() => {
    if (data?.feedback) {
      setFeedbackData(data);
    }
  }, [data]);

  const handleReset = () => {
    resetRecording();
    setFeedbackData(null);
    resetUploadAudio();
    setPrompt(getRandomPrompt());
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <PromptDisplay prompt={prompt} />
      <RecorderControls
        isDisabled={disableRecordButton}
        isRecording={isRecording}
        timer={timer}
        startRecording={startRecording}
        stopRecording={stopRecording}
      />
      {audioBlob && <AudioPlayback blob={audioBlob} />}
      <SubmitButton
        blob={audioBlob}
        isSubmitting={isUploading}
        handleSubmit={handleSubmit}
        isSubmitted={isSuccess}
      />
      {feedbackData?.feedback && (
        <>
          <FeedbackSection
            feedback={feedbackData?.feedback}
            transcript={feedbackData?.transcript}
            tips={feedbackData?.tips}
            rateLimitInfo={rateLimitInfo}
          />
          <button
            className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
            onClick={handleReset}>
            Reset
          </button>
        </>
      )}
    </div>
  );
};
