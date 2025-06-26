interface Feedback {
  fluency: number;
  pronunciation: number;
  grammar: number;
  vocabulary: number;
  comment: string;
}

interface FeedbackSectionProps {
  feedback: Feedback;
}

export const FeedbackSection = ({ feedback }: FeedbackSectionProps) => {
  return (
    <div className="mt-6 space-y-3 border-t pt-4">
      <h2 className="font-semibold text-lg">AI Feedback</h2>
      <ul className="grid grid-cols-2 gap-2">
        {Object.entries(feedback).map(([key, value]) =>
          key !== 'comment' ? (
            <li key={key} className="text-sm">
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{' '}
              {value}/5
            </li>
          ) : null,
        )}
      </ul>
      <p className="text-muted-foreground text-sm">{feedback.comment}</p>
    </div>
  );
};
