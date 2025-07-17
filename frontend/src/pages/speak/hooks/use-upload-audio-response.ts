import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState } from 'react';

import sendRequest from '@/services/api';
import { supabase } from '@/supabase';
import type { RateLimitInfo } from '@/lib/parseRateLimitHeaders';

type UploadAudioResponseParams = {
  audioBlob: Blob;
  prompt: string;
};

export type UploadAudioResponseResult = {
  feedback: {
    fluency: {
      comment: string;
      score: number;
    };
    grammar: {
      comment: string;
      score: number;
    };
    vocabulary: {
      comment: string;
      score: number;
    };
    pronunciation: {
      comment: string;
      score: number;
    };
    closingMessage: string;
  };
  transcript: string;
  tips: string | null;
};

export const useUploadAudioResponse = () => {
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(
    null,
  );

  const uploadAudioResponse = async ({
    audioBlob,
    prompt,
  }: UploadAudioResponseParams): Promise<UploadAudioResponseResult> => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'response.wav');
    formData.append('prompt', prompt);

    const token = (await supabase.auth.getSession()).data.session?.access_token;

    const { response, rateLimitInfo: rateLimit } = await sendRequest(
      'http://localhost:8000/api/v1/speak',
      {
        method: 'POST',
        body: formData,
        isJSON: false,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setRateLimitInfo(rateLimit);

    if (!response.ok) {
      throw new Error('Failed to upload audio response');
    }

    return response.json();
  };

  const { mutate, isPending, data, isSuccess, reset } = useMutation({
    mutationFn: uploadAudioResponse,
    onError: () => {
      toast.error('Error uploading audio response. Please try again.');
    },
  });

  return {
    uploadAudioResponse: mutate,
    isUploading: isPending,
    data,
    isSuccess,
    resetUploadAudio: reset,
    rateLimitInfo,
  };
};

export default useUploadAudioResponse;
