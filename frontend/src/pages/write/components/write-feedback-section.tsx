import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import type { RateLimitInfo } from '@/lib/parseRateLimitHeaders';

interface CategoryFeedback {
  score: number;
  comment: string;
}

interface WriteFeedback {
  correctedText: string;
  grammar: CategoryFeedback;
  vocabulary: CategoryFeedback;
  structure: CategoryFeedback;
  improvements: string[];
  closingMessage: string;
}

interface WriteFeedbackSectionProps {
  feedback: WriteFeedback;
  tips?: string | object | null;
  rateLimitInfo?: RateLimitInfo | null;
}

const categories = ['grammar', 'vocabulary', 'structure'] as const;

export const WriteFeedbackSection = ({
  feedback,
  tips = null,
  rateLimitInfo = null,
}: WriteFeedbackSectionProps) => {
  const { t } = useTranslation();

  return (
    <div
      className="mt-6 space-y-4 border-t pt-4"
      data-testid="write-feedback-section">
      <h3 className="font-semibold text-lg">{t('write.feedback.title')}</h3>

      {rateLimitInfo && (
        <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
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

      {/* Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map(category => (
          <div key={category} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium capitalize">
                {t(`write.feedback.categories.${category}`)}
              </span>
              <span className="text-lg font-bold text-blue-600">
                {feedback[category].score}/10
              </span>
            </div>
            <p className="text-sm text-gray-700">
              {feedback[category].comment}
            </p>
          </div>
        ))}
      </div>

      {/* Improvements Section */}
      {feedback.improvements && feedback.improvements.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">
            {t('write.feedback.improvements.title')}
          </h4>
          <ul className="space-y-1">
            {feedback.improvements.map((improvement, index) => (
              <li
                key={index}
                className="text-sm text-blue-800 flex items-start">
                <span className="mr-2">•</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional Grammar Tips */}
      {tips && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">
            {t('write.feedback.tips.title')}
          </h4>
          <p className="text-sm text-yellow-800">
            {typeof tips === 'string' ? tips : JSON.stringify(tips)}
          </p>
        </div>
      )}

      {/* Closing Message */}
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-green-800 font-medium text-center">
          {feedback.closingMessage}
        </p>
      </div>
    </div>
  );
};
