import { useState, useReducer, useEffect } from 'react';
import { getRandomPrompt } from '@/services/prompts';
import { writePageReducer, initialWritePageState } from './write-page-reducer';
import { useSubmitWriteResponse } from './use-submit-write-response';

export type LanguageLevel = 'beginner' | 'intermediate' | 'native';

export const useWritePage = () => {
  const [state, dispatch] = useReducer(writePageReducer, initialWritePageState);
  const [prompt, setPrompt] = useState<string>(getRandomPrompt());
  const [languageLevel, setLanguageLevel] = useState<LanguageLevel>('beginner');

  const {
    submitWriteResponse,
    isSubmitting,
    data,
    isSuccess,
    resetSubmitWrite,
    rateLimitInfo,
    error: mutationError,
    isError,
  } = useSubmitWriteResponse();

  const wordCount = state.inputText.trim()
    ? state.inputText.trim().split(/\s+/).length
    : 0;

  const handleLanguageLevelChange = (value: LanguageLevel) => {
    setLanguageLevel(value);
  };

  const handleSubmit = () => {
    if (wordCount < 5) return;

    dispatch({ type: 'SET_ERROR', payload: null });

    submitWriteResponse({
      prompt,
      userResponse: state.inputText,
      languageLevel,
    });
  };

  // Handle successful response
  useEffect(() => {
    if (isSuccess && data) {
      dispatch({
        type: 'SET_CORRECTED_TEXT',
        payload: data.feedback.correctedText,
      });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [isSuccess, data]);

  // Handle mutation error
  useEffect(() => {
    if (isError && mutationError) {
      dispatch({
        type: 'SET_ERROR',
        payload:
          mutationError instanceof Error
            ? mutationError.message
            : 'An error occurred',
      });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [isError, mutationError]);

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: isSubmitting });
  }, [isSubmitting]);

  const handleClear = () => {
    dispatch({ type: 'CLEAR' });
    resetSubmitWrite();
    setPrompt(getRandomPrompt());
  };

  const setInputText = (text: string) => {
    dispatch({ type: 'SET_INPUT_TEXT', payload: text });
  };

  const setCorrectedText = (text: string | null) => {
    dispatch({ type: 'SET_CORRECTED_TEXT', payload: text });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  return {
    inputText: state.inputText,
    setInputText,
    correctedText: state.correctedText,
    setCorrectedText,
    loading: state.loading,
    setLoading,
    error: state.error,
    setError,
    prompt,
    wordCount,
    handleSubmit,
    handleClear,
    languageLevel,
    handleLanguageLevelChange,
    // React Query mutation data
    data,
    isSuccess,
    rateLimitInfo,
  };
};
