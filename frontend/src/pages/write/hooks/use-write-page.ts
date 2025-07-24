import { useState, useReducer } from 'react';
import { getRandomPrompt } from '@/services/prompts';
import { writePageReducer, initialWritePageState } from './write-page-reducer';

export const useWritePage = () => {
  const [state, dispatch] = useReducer(writePageReducer, initialWritePageState);
  const [prompt] = useState<string>(getRandomPrompt());

  const wordCount = state.inputText.trim()
    ? state.inputText.trim().split(/\s+/).length
    : 0;

  const handleSubmit = async () => {
    dispatch({
      type: 'SET_CORRECTED_TEXT',
      payload:
        'This is a stub for corrected text. Replace with actual backend response.',
    });
  };

  const handleClear = () => {
    dispatch({ type: 'CLEAR' });
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
  };
};
