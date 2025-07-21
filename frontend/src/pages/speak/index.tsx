import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

import { URLS } from '@/constants';

import { PromptDisplay } from './components/prompt-display';
import { RecorderControls } from './components/recorder-controls';
import { AudioPlayback } from './components/audio-playback';
import { SubmitButton } from './components/submit-button';
import { FeedbackSection } from './components/feedback-section';

import useUploadAudioResponse from './hooks/use-upload-audio-response';
import { useRecorder } from './hooks/use-recorder';

import { getRandomPrompt } from './prompts';
import { useSpeakPage } from './hooks/use-speak-page';

export type LanguageLevel = 'beginner' | 'intermediate' | 'native';

export const SpeakPage = () => {
  const navigate = useNavigate();

  const {
    feedbackData,
    prompt,
    languageLevel,
    handleLanguageLevelChange,
    setFeedbackData,
    setPrompt,
  } = useSpeakPage();

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
      languageLevel,
    });
  };

  useEffect(() => {
    if (data?.feedback) {
      setFeedbackData(data);
    }
  }, [data, setFeedbackData]);

  const handleReset = () => {
    resetRecording();
    setFeedbackData(null);
    resetUploadAudio();
    setPrompt(getRandomPrompt());
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="w-full">
        <Button
          variant="ghost"
          onClick={() => navigate(URLS.dashboard)}
          className="mb-4">
          <ChevronLeft />
          Back to Dashboard
        </Button>
      </div>
      <div className="flex flex-col gap-8 justify-between items-center">
        <PromptDisplay prompt={prompt} />
        <Select
          value={languageLevel}
          onValueChange={handleLanguageLevelChange}
          disabled={disableRecordButton}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
