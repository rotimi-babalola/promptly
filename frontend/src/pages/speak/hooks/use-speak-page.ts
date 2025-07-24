import { useState } from 'react';

import type { UploadAudioResponseResult } from './use-upload-audio-response';
import { getRandomPrompt } from '@/services/prompts';

export type LanguageLevel = 'beginner' | 'intermediate' | 'native';

const randomPrompt = getRandomPrompt();

export const useSpeakPage = () => {
  const [feedbackData, setFeedbackData] =
    useState<UploadAudioResponseResult | null>(null);
  const [prompt, setPrompt] = useState(randomPrompt);
  const [languageLevel, setLanguageLevel] = useState<LanguageLevel>('beginner');

  const handleLanguageLevelChange = (value: LanguageLevel) => {
    setLanguageLevel(value);
  };

  return {
    feedbackData,
    prompt,
    languageLevel,
    handleLanguageLevelChange,
    setFeedbackData,
    setPrompt,
    setLanguageLevel,
  };
};
