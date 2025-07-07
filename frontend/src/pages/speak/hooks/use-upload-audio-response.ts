import { useMutation } from '@tanstack/react-query';

import sendRequest from '@/services/api';
import { supabase } from '@/supabase';

type UploadAudioResponseParams = {
  audioBlob: Blob;
  prompt: string;
};

export const useUploadAudioResponse = () => {
  const uploadAudioResponse = async ({
    audioBlob,
    prompt,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  UploadAudioResponseParams): Promise<any> => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'response.wav'); // field name should match Multer config
    formData.append('prompt', prompt);

    const token = (await supabase.auth.getSession()).data.session?.access_token;

    const response = await sendRequest('http://localhost:8000/api/v1/speak', {
      method: 'POST',
      body: formData,
      isJSON: false,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to upload audio response');
    }

    return response.json();
  };

  const { mutate, isPending, data } = useMutation({
    mutationFn: uploadAudioResponse,
    onSuccess: data => {
      console.log('Audio response uploaded successfully:', data);
    },
    onError: error => {
      console.error('Error uploading audio response:', error);
    },
  });

  return {
    uploadAudioResponse: mutate,
    isUploading: isPending,
    data,
  };
};

export default useUploadAudioResponse;
