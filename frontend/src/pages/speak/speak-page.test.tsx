import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { SpeakPage } from './index';

// Mock all imported components
vi.mock('./components/prompt-display', () => ({
  PromptDisplay: () => <div data-testid="prompt-display">Mock Prompt</div>,
}));

vi.mock('./components/recorder-controls', () => ({
  RecorderControls: () => (
    <div data-testid="recorder-controls">Mock Controls</div>
  ),
}));

vi.mock('./components/audio-playback', () => ({
  AudioPlayback: () => <div data-testid="audio-playback">Mock Audio</div>,
}));

vi.mock('./components/submit-button', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SubmitButton: (props: any) => (
    <button data-testid="submit-button" onClick={props.handleSubmit}>
      Submit
    </button>
  ),
}));

vi.mock('./components/feedback-section', () => ({
  FeedbackSection: () => (
    <div data-testid="feedback-section">Mock Feedback</div>
  ),
}));

// Mock hooks
const mockUploadAudioResponse = vi.fn();
vi.mock('./hooks/use-upload-audio-response', () => ({
  default: () => ({
    uploadAudioResponse: mockUploadAudioResponse,
    isUploading: false,
    data: null,
    isSuccess: false,
    resetUploadAudio: vi.fn(),
  }),
}));

const mockAudioBlob = new Blob(['mock audio'], { type: 'audio/webm' });
vi.mock('./hooks/use-recorder', () => ({
  useRecorder: () => ({
    isRecording: false,
    startRecording: vi.fn(),
    stopRecording: vi.fn(),
    timer: '00:00',
    audioBlob: mockAudioBlob,
    resetRecording: vi.fn(),
  }),
}));

vi.mock('./prompts', () => ({
  getRandomPrompt: () => 'Mock prompt',
}));

describe('SpeakPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial state correctly', () => {
    render(<SpeakPage />);
    expect(screen.getByTestId('prompt-display')).toBeInTheDocument();
    expect(screen.getByTestId('recorder-controls')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('displays audio playback when audioBlob exists', () => {
    render(<SpeakPage />);
    expect(screen.getByTestId('audio-playback')).toBeInTheDocument();
  });

  it('handles submit when audio blob exists', async () => {
    render(<SpeakPage />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUploadAudioResponse).toHaveBeenCalledWith({
        audioBlob: mockAudioBlob,
        prompt: 'Mock prompt',
      });
    });
  });

  it('shows feedback section when feedback data exists', async () => {
    const mockData = {
      feedback: 'Test feedback',
      transcript: 'Test transcript',
      tips: ['Tip 1'],
    };

    vi.mock('./hooks/use-upload-audio-response', () => ({
      default: () => ({
        uploadAudioResponse: mockUploadAudioResponse,
        isUploading: false,
        data: mockData,
        isSuccess: true,
        resetUploadAudio: vi.fn(),
      }),
    }));

    render(<SpeakPage />);

    await waitFor(() => {
      expect(screen.getByTestId('feedback-section')).toBeInTheDocument();
    });
  });

  it('resets the page when reset button is clicked', async () => {
    const mockData = {
      feedback: 'Test feedback',
      transcript: 'Test transcript',
      tips: ['Tip 1'],
    };

    vi.mock('./hooks/use-upload-audio-response', () => ({
      default: () => ({
        uploadAudioResponse: mockUploadAudioResponse,
        isUploading: false,
        data: mockData,
        isSuccess: true,
        resetUploadAudio: vi.fn(),
      }),
    }));

    render(<SpeakPage />);

    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.queryByTestId('feedback-section')).not.toBeInTheDocument();
    });
  });
});
