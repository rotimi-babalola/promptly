import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState } from 'react';
import { supabase } from '@/supabase';

import sendRequest from '@/services/api';
import type { RateLimitInfo } from '@/lib/parseRateLimitHeaders';

import type { LanguageLevel } from './use-write-page';

type SubmitWriteResponseParams = {
  prompt: string;
  userResponse: string;
  languageLevel: LanguageLevel;
};

export type SubmitWriteResponseResult = {
  feedback: {
    correctedText: string;
    grammar: {
      comment: string;
      score: number;
    };
    vocabulary: {
      comment: string;
      score: number;
    };
    structure: {
      comment: string;
      score: number;
    };
    improvements: string[];
    closingMessage: string;
  };
  tips: string | object | null; // MessageContent type from langchain, could be string or object
};

export const useSubmitWriteResponse = () => {
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(
    null,
  );

  const submitWriteResponse = async ({
    prompt,
    userResponse,
    languageLevel,
  }: SubmitWriteResponseParams): Promise<SubmitWriteResponseResult> => {
    const token = (await supabase.auth.getSession()).data.session?.access_token;

    const { response, rateLimitInfo: rateLimit } = await sendRequest(
      'http://localhost:8000/api/v1/write',
      {
        method: 'POST',
        body: {
          prompt,
          userResponse,
          languageLevel,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setRateLimitInfo(rateLimit);

    if (!response.ok) {
      throw new Error('Failed to process writing response');
    }

    return response.json();
  };

  const { mutate, isPending, data, isSuccess, reset, error, isError } =
    useMutation({
      mutationFn: submitWriteResponse,
      onError: () => {
        toast.error('Error processing writing response. Please try again.');
      },
    });

  return {
    submitWriteResponse: mutate,
    isSubmitting: isPending,
    data,
    isSuccess,
    resetSubmitWrite: reset,
    rateLimitInfo,
    error,
    isError,
  };
};
