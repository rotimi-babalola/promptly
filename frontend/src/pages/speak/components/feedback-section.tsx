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
  tips = null,
}: FeedbackSectionProps) => {
  return (
    <div className="mt-6 space-y-3 border-t pt-4">
      <h2 className="font-semibold text-lg">AI Feedback</h2>
      <div className="bg-muted p-3 rounded text-sm">
        <span className="font-semibold">Transcript:</span> {transcript}
      </div>
      <ul className="grid grid-cols-2 gap-2">
        {categories.map(category => (
          <li key={category} className="text-sm">
            <strong>
              {category.charAt(0).toUpperCase() + category.slice(1)}:
            </strong>{' '}
            {feedback[category].score}/10
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
