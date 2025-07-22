import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import type { RateLimitInfo } from '@/lib/parseRateLimitHeaders';

interface CategoryFeedback {
  score: number;
  comment: string;
}

interface Feedback {
  fluency: CategoryFeedback;
  grammar: CategoryFeedback;
  vocabulary: CategoryFeedback;
  pronunciation: CategoryFeedback;
  closingMessage: string;
  tips?: string | null;
}

interface FeedbackSectionProps {
  feedback: Feedback;
  transcript: string;
  tips?: string | null;
  rateLimitInfo?: RateLimitInfo | null;
}

const categories = [
  'fluency',
  'grammar',
  'vocabulary',
  'pronunciation',
] as const;

export const FeedbackSection = ({
  feedback,
  transcript,
  rateLimitInfo = null,
  tips = null,
}: FeedbackSectionProps) => {
  const { t } = useTranslation();

  return (
    <div
      className="mt-6 space-y-3 border-t pt-4"
      data-testid="feedback-section">
      <h2 className="font-semibold text-lg">{t('speak.feedback.title')}</h2>

      {rateLimitInfo && (
        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
          <p>
            {t('speak.feedback.rateLimits.remaining', {
              remaining: rateLimitInfo.remaining,
              limit: rateLimitInfo.limit,
            })}
          </p>
          {rateLimitInfo.reset && (
            <p>
              {t('speak.feedback.rateLimits.resetsIn', {
                time: formatDistanceToNow(new Date(rateLimitInfo.reset)),
              })}
            </p>
          )}
        </div>
      )}
      <div className="bg-muted p-3 rounded text-sm">
        <span className="font-semibold">
          {t('speak.feedback.transcript.label')}
        </span>{' '}
        {transcript}
      </div>
      <ul className="grid grid-cols-2 gap-2">
        {categories.map(category => (
          <li key={category} className="text-sm">
            <strong>{t(`speak.feedback.categories.${category}`)}:</strong>{' '}
            {t('speak.feedback.categories.score', {
              score: feedback[category].score,
            })}
            <div className="text-muted-foreground text-xs mt-1">
              {feedback[category].comment}
            </div>
          </li>
        ))}
      </ul>
      <p className="text-primary font-medium mt-2">
        {feedback?.closingMessage}
      </p>
      {tips && <p className="text-primary font-medium mt-2">{tips}</p>}
    </div>
  );
};
