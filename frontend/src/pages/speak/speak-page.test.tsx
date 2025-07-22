import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { SpeakPage } from './index';

vi.mock('react-router', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

// Mock hooks and data
const mockResetRecording = vi.fn();
const mockResetUploadAudio = vi.fn();
const mockUploadAudioResponse = vi.fn();
const mockStartRecording = vi.fn();
const mockStopRecording = vi.fn();
const mockAudioBlob = new Blob(['mock audio'], { type: 'audio/webm' });

const mockData = {
  feedback: {
    fluency: {
      comment:
        "Your speech flows naturally with only minor hesitations. You're able to express yourself with good rhythm.",
      score: 8,
    },
    grammar: {
      comment:
        'Good control of basic grammar structures. Some mistakes with complex tenses but meaning remains clear.',
      score: 7,
    },
    vocabulary: {
      comment:
        'You use a good range of everyday vocabulary appropriately. Consider expanding your use of idiomatic expressions.',
      score: 7,
    },
    pronunciation: {
      comment:
        "Clear pronunciation with good intonation. A few sound issues with 'th' and 'r' sounds.",
      score: 8,
    },
    closingMessage:
      "Overall, you're communicating effectively! Keep practicing to build more confidence.",
  },
  transcript: 'Test transcript',
  tips: ['Tip 1'],
};

vi.mock('./hooks/use-recorder', () => ({
  useRecorder: () => ({
    isRecording: false,
    startRecording: mockStartRecording,
    stopRecording: mockStopRecording,
    timer: '00:00',
    audioUrl: 'mock-audio-url',
    audioBlob: mockAudioBlob,
    resetRecording: mockResetRecording,
  }),
}));

vi.mock('./hooks/use-speak-page', () => ({
  useSpeakPage: () => ({
    feedbackData: null,
    prompt: 'Mock prompt',
    languageLevel: 'beginner',
    handleLanguageLevelChange: vi.fn(),
    setFeedbackData: vi.fn(),
    setPrompt: vi.fn(),
  }),
}));

vi.mock('./hooks/use-upload-audio-response', () => ({
  useUploadAudioResponse: () => ({
    uploadAudioResponse: mockUploadAudioResponse,
    isUploading: false,
    data: null,
    isSuccess: false,
    resetUploadAudio: mockResetUploadAudio,
    rateLimitInfo: null,
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
    expect(screen.getByTestId('speak-submit-button')).toBeInTheDocument();
  });

  it('displays audio playback when audioUrl exists', () => {
    render(<SpeakPage />);
    expect(screen.getByTestId('audio-playback')).toBeInTheDocument();
  });

  it('handles submit when audio blob exists', async () => {
    render(<SpeakPage />);

    const submitButton = screen.getByTestId('speak-submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUploadAudioResponse).toHaveBeenCalledWith({
        audioBlob: mockAudioBlob,
        prompt: 'Mock prompt',
        languageLevel: 'beginner',
      });
    });
  });

  it('shows feedback section when feedback data exists', async () => {
    vi.mock('./hooks/use-speak-page', () => ({
      useSpeakPage: () => ({
        feedbackData: mockData,
        prompt: 'Mock prompt',
        languageLevel: 'beginner',
        handleLanguageLevelChange: vi.fn(),
        setFeedbackData: vi.fn(),
        setPrompt: vi.fn(),
      }),
    }));

    render(<SpeakPage />);

    await waitFor(() => {
      expect(screen.getByTestId('feedback-section')).toBeInTheDocument();
    });
  });

  it('handles reset functionality correctly', async () => {
    vi.mock('./hooks/use-speak-page', () => ({
      useSpeakPage: () => ({
        feedbackData: mockData,
        prompt: 'Mock prompt',
        languageLevel: 'beginner',
        handleLanguageLevelChange: vi.fn(),
        setFeedbackData: vi.fn(),
        setPrompt: vi.fn(),
      }),
    }));

    render(<SpeakPage />);

    const resetButton = screen.getByTestId('reset-button');
    fireEvent.click(resetButton);

    expect(mockResetRecording).toHaveBeenCalled();
    expect(mockResetUploadAudio).toHaveBeenCalled();
  });
});
