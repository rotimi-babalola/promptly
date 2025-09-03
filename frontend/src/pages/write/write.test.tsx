import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { WritePage } from './index';

type RateLimitInfo = {
  remaining: number;
  limit: number;
  reset?: number;
};

type WriteResponseData = {
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
  tips: string | object | null;
};

// Mock react-router
vi.mock('react-router', () => ({
  useNavigate: () => vi.fn(),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (
      str: string,
      options?: {
        count?: number;
        remaining?: number;
        limit?: number;
        resetTime?: string;
      },
    ) => {
      // Handle interpolated strings
      if (str === 'write.form.wordCount' && options?.count !== undefined) {
        return `${options.count} words`;
      }
      if (
        str === 'speak.feedback.rateLimits.remaining' &&
        options?.remaining !== undefined &&
        options?.limit !== undefined
      ) {
        return `${options.remaining}/${options.limit} requests remaining`;
      }
      if (str === 'speak.feedback.rateLimits.resetsIn' && options?.resetTime) {
        return `Resets ${options.resetTime}`;
      }
      return str;
    },
  }),
}));

// Mock diff library used in InlineDiff
vi.mock('diff', () => ({
  diffWords: (oldValue: string, newValue: string) => [
    { value: 'same ', removed: false, added: false },
    {
      value: oldValue.includes('old') ? 'old' : 'text',
      removed: true,
      added: false,
    },
    {
      value: newValue.includes('new') ? 'new' : 'text',
      removed: false,
      added: true,
    },
    { value: ' text', removed: false, added: false },
  ],
}));

// Mock date-fns used in WriteFeedbackSection
vi.mock('date-fns', () => ({
  formatDistanceToNow: () => 'in 1 hour',
}));

// Mock the custom hooks
const mockUseWritePage = {
  inputText: '',
  setInputText: vi.fn(),
  correctedText: null as string | null,
  loading: false,
  error: null as string | null,
  prompt: 'Test prompt for writing',
  wordCount: 0,
  handleSubmit: vi.fn(),
  handleClear: vi.fn(),
  languageLevel: 'beginner' as 'beginner' | 'intermediate' | 'native',
  handleLanguageLevelChange: vi.fn(),
  data: null as WriteResponseData | null,
  isSuccess: false,
  rateLimitInfo: null as RateLimitInfo | null,
};

vi.mock('./hooks/use-write-page', () => ({
  useWritePage: () => mockUseWritePage,
}));

describe('WritePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock values to defaults
    Object.assign(mockUseWritePage, {
      inputText: '',
      correctedText: null,
      loading: false,
      error: null,
      prompt: 'Test prompt for writing',
      wordCount: 0,
      languageLevel: 'beginner',
      data: null,
      isSuccess: false,
      rateLimitInfo: null,
    });
  });

  it('renders the write page with all basic elements', () => {
    render(<WritePage />);

    expect(
      screen.getByText('common.navigation.backToDashboard'),
    ).toBeInTheDocument();
    expect(screen.getByText('write.title')).toBeInTheDocument();
    expect(screen.getByText('Test prompt for writing')).toBeInTheDocument();
    expect(screen.getByText('common.languageLevel.label')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('write.form.placeholder'),
    ).toBeInTheDocument();
    expect(screen.getByText('write.form.submit')).toBeInTheDocument();
    expect(screen.getByText('common.actions.reset')).toBeInTheDocument();
  });

  it('displays word count correctly', () => {
    mockUseWritePage.wordCount = 25;
    render(<WritePage />);

    expect(screen.getByText('25 words')).toBeInTheDocument();
  });

  it('calls setInputText when typing in textarea', () => {
    render(<WritePage />);

    const textarea = screen.getByPlaceholderText('write.form.placeholder');
    fireEvent.change(textarea, { target: { value: 'Hello world' } });

    expect(mockUseWritePage.setInputText).toHaveBeenCalledWith('Hello world');
  });

  it('calls handleClear when clear button is clicked', () => {
    render(<WritePage />);

    const clearButton = screen.getByText('common.actions.reset');
    fireEvent.click(clearButton);

    expect(mockUseWritePage.handleClear).toHaveBeenCalled();
  });

  it('calls handleSubmit when submit button is clicked', () => {
    mockUseWritePage.wordCount = 10; // Ensure minimum word count
    render(<WritePage />);

    const submitButton = screen.getByText('write.form.submit');
    fireEvent.click(submitButton);

    expect(mockUseWritePage.handleSubmit).toHaveBeenCalled();
  });

  it('disables submit button when loading', () => {
    mockUseWritePage.loading = true;
    mockUseWritePage.wordCount = 10;
    render(<WritePage />);

    const submitButton = screen.getByText('write.form.submitting');
    expect(submitButton).toBeDisabled();
  });

  it('disables submit button when word count is less than 5', () => {
    mockUseWritePage.wordCount = 3;
    render(<WritePage />);

    const submitButton = screen.getByText('write.form.submit');
    expect(submitButton).toBeDisabled();
  });

  it('disables submit button when submission is successful', () => {
    mockUseWritePage.wordCount = 10;
    mockUseWritePage.isSuccess = true;
    render(<WritePage />);

    const submitButton = screen.getByText('write.form.submit');
    expect(submitButton).toBeDisabled();
  });

  it('shows submitting text when loading', () => {
    mockUseWritePage.loading = true;
    render(<WritePage />);

    expect(screen.getByText('write.form.submitting')).toBeInTheDocument();
  });

  it('displays error message when there is an error', () => {
    mockUseWritePage.error = 'Something went wrong';
    render(<WritePage />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('displays current language level option', () => {
    render(<WritePage />);

    // Only the selected option is visible initially
    expect(
      screen.getByText('common.languageLevel.options.beginner'),
    ).toBeInTheDocument();

    // Check that the select component is present
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows corrected text and inline diff when corrected text is available', () => {
    mockUseWritePage.inputText = 'Original text with errors';
    mockUseWritePage.correctedText = 'Corrected text without errors';
    render(<WritePage />);

    expect(screen.getByText('write.corrections.title')).toBeInTheDocument();
    expect(screen.getByTestId('inline-diff')).toBeInTheDocument();
  });

  it('shows feedback section when submission is successful and feedback is available', () => {
    const mockFeedback = {
      correctedText: 'Corrected text',
      grammar: {
        comment: 'Good grammar usage',
        score: 8,
      },
      vocabulary: {
        comment: 'Rich vocabulary',
        score: 9,
      },
      structure: {
        comment: 'Well structured',
        score: 8,
      },
      improvements: ['Use more varied sentence structures'],
      closingMessage: 'Great job overall!',
    };
    const mockTips = ['Tip 1', 'Tip 2'];
    const mockRateLimitInfo = {
      remaining: 5,
      limit: 10,
      reset: Date.now() + 3600000,
    };

    mockUseWritePage.isSuccess = true;
    mockUseWritePage.data = {
      feedback: mockFeedback,
      tips: mockTips,
    };
    mockUseWritePage.rateLimitInfo = mockRateLimitInfo;

    render(<WritePage />);

    expect(screen.getByTestId('write-feedback-section')).toBeInTheDocument();
  });

  it('does not show feedback section when not successful', () => {
    mockUseWritePage.isSuccess = false;
    mockUseWritePage.data = null;

    render(<WritePage />);

    expect(
      screen.queryByTestId('write-feedback-section'),
    ).not.toBeInTheDocument();
  });

  it('does not show inline diff when no corrected text is available', () => {
    mockUseWritePage.correctedText = null;

    render(<WritePage />);

    expect(screen.queryByTestId('inline-diff')).not.toBeInTheDocument();
    expect(
      screen.queryByText('write.corrections.title'),
    ).not.toBeInTheDocument();
  });

  it('disables clear button when loading and no input text', () => {
    mockUseWritePage.loading = true;
    mockUseWritePage.inputText = '';

    render(<WritePage />);

    const clearButton = screen.getByText('common.actions.reset');
    expect(clearButton).toBeDisabled();
  });

  it('enables clear button when there is input text even if loading', () => {
    mockUseWritePage.loading = true;
    mockUseWritePage.inputText = 'Some text';

    render(<WritePage />);

    const clearButton = screen.getByText('common.actions.reset');
    expect(clearButton).not.toBeDisabled();
  });

  it('renders InlineDiff component with correct content when corrected text exists', () => {
    mockUseWritePage.inputText = 'This has old text';
    mockUseWritePage.correctedText = 'This has new text';

    render(<WritePage />);

    const inlineDiff = screen.getByTestId('inline-diff');
    expect(inlineDiff).toBeInTheDocument();

    // Check that the diff components are rendered
    expect(
      screen.getByText('write.corrections.originalText'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('write.corrections.correctedText'),
    ).toBeInTheDocument();
  });

  it('renders WriteFeedbackSection with all feedback categories when successful', () => {
    const mockFeedback = {
      correctedText: 'Corrected text',
      grammar: {
        comment: 'Good grammar usage',
        score: 8,
      },
      vocabulary: {
        comment: 'Rich vocabulary',
        score: 9,
      },
      structure: {
        comment: 'Well structured',
        score: 8,
      },
      improvements: [
        'Use more varied sentence structures',
        'Add more complex sentences',
      ],
      closingMessage: 'Great job overall!',
    };

    mockUseWritePage.isSuccess = true;
    mockUseWritePage.data = {
      feedback: mockFeedback,
      tips: 'Practice writing daily',
    };
    mockUseWritePage.rateLimitInfo = { remaining: 3, limit: 10 };

    render(<WritePage />);

    const feedbackSection = screen.getByTestId('write-feedback-section');
    expect(feedbackSection).toBeInTheDocument();

    // Check that feedback title is rendered
    expect(screen.getByText('write.feedback.title')).toBeInTheDocument();

    // Check that rate limit info is displayed
    expect(screen.getByText('3/10 requests remaining')).toBeInTheDocument();
  });

  it('renders WriteFeedbackSection without rate limit info when not provided', () => {
    const mockFeedback = {
      correctedText: 'Corrected text',
      grammar: { comment: 'Good', score: 8 },
      vocabulary: { comment: 'Good', score: 8 },
      structure: { comment: 'Good', score: 8 },
      improvements: [],
      closingMessage: 'Well done!',
    };

    mockUseWritePage.isSuccess = true;
    mockUseWritePage.data = {
      feedback: mockFeedback,
      tips: null,
    };
    mockUseWritePage.rateLimitInfo = null;

    render(<WritePage />);

    const feedbackSection = screen.getByTestId('write-feedback-section');
    expect(feedbackSection).toBeInTheDocument();

    // Should not show rate limit info
    expect(screen.queryByText(/requests remaining/)).not.toBeInTheDocument();
  });

  it('displays correct submit button state based on various conditions', () => {
    // Test enabled state
    mockUseWritePage.wordCount = 10;
    mockUseWritePage.loading = false;
    mockUseWritePage.isSuccess = false;

    const { rerender } = render(<WritePage />);
    expect(screen.getByText('write.form.submit')).not.toBeDisabled();

    // Test disabled due to loading
    mockUseWritePage.loading = true;
    rerender(<WritePage />);
    expect(screen.getByText('write.form.submitting')).toBeDisabled();

    // Test disabled due to low word count
    mockUseWritePage.loading = false;
    mockUseWritePage.wordCount = 2;
    rerender(<WritePage />);
    expect(screen.getByText('write.form.submit')).toBeDisabled();

    // Test disabled due to success
    mockUseWritePage.wordCount = 10;
    mockUseWritePage.isSuccess = true;
    rerender(<WritePage />);
    expect(screen.getByText('write.form.submit')).toBeDisabled();
  });

  it('displays textarea with correct value from inputText state', () => {
    mockUseWritePage.inputText = 'This is a test input';

    render(<WritePage />);

    const textarea = screen.getByPlaceholderText(
      'write.form.placeholder',
    ) as HTMLTextAreaElement;
    expect(textarea.value).toBe('This is a test input');
  });

  it('shows prompt text in the prompt section', () => {
    mockUseWritePage.prompt = 'Write about your favorite hobby';

    render(<WritePage />);

    expect(
      screen.getByText('Write about your favorite hobby'),
    ).toBeInTheDocument();
  });

  it('handles different language levels correctly', () => {
    // Test intermediate level
    mockUseWritePage.languageLevel = 'intermediate';

    const { rerender } = render(<WritePage />);
    expect(
      screen.getByText('common.languageLevel.options.intermediate'),
    ).toBeInTheDocument();

    // Test native level
    mockUseWritePage.languageLevel = 'native';
    rerender(<WritePage />);
    expect(
      screen.getByText('common.languageLevel.options.native'),
    ).toBeInTheDocument();
  });

  it('renders without crashing when all optional props are null', () => {
    mockUseWritePage.correctedText = null;
    mockUseWritePage.error = null;
    mockUseWritePage.data = null;
    mockUseWritePage.rateLimitInfo = null;

    expect(() => render(<WritePage />)).not.toThrow();
  });
});
