import { diffWords } from 'diff';
import { useTranslation } from 'react-i18next';

export const InlineDiff: React.FC<{ oldValue: string; newValue: string }> = ({
  oldValue,
  newValue,
}) => {
  const { t } = useTranslation();
  const diff = diffWords(oldValue, newValue);

  return (
    <div className="space-y-6" data-testid="inline-diff">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg overflow-hidden">
        <div className="bg-red-50 border-r border-gray-200">
          <div className="bg-red-100 px-4 py-2 border-b border-red-200">
            <h3 className="font-medium text-red-800 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              {t('write.corrections.originalText')}
            </h3>
          </div>
          <div className="p-4 whitespace-pre-wrap text-sm leading-relaxed">
            {diff.map((part, index) => {
              if (part.removed) {
                return (
                  <span
                    key={index}
                    className="bg-red-200 text-red-900 px-1 rounded">
                    {part.value}
                  </span>
                );
              }
              if (part.added) {
                return null;
              }
              return <span key={index}>{part.value}</span>;
            })}
          </div>
        </div>

        <div className="bg-green-50">
          <div className="bg-green-100 px-4 py-2 border-b border-green-200">
            <h3 className="font-medium text-green-800 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              {t('write.corrections.correctedText')}
            </h3>
          </div>
          <div className="p-4 whitespace-pre-wrap text-sm leading-relaxed">
            {diff.map((part, index) => {
              if (part.added) {
                return (
                  <span
                    key={index}
                    className="bg-green-200 text-green-900 px-1 rounded">
                    {part.value}
                  </span>
                );
              }
              if (part.removed) {
                return null; // Don't show removed parts in corrected
              }
              return <span key={index}>{part.value}</span>;
            })}
          </div>
        </div>
      </div>

      {/* Inline diff view */}
      <div className="border rounded-lg">
        <div className="bg-gray-100 px-4 py-2 border-b">
          <h3 className="font-medium text-gray-800 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            {t('write.corrections.changesHighlighted')}
          </h3>
        </div>
        <div className="p-4 whitespace-pre-wrap text-sm leading-relaxed">
          {diff.map((part, index) => {
            if (part.added) {
              return (
                <span
                  key={index}
                  className="bg-green-200 text-green-900 px-1 rounded relative"
                  title="Added by AI">
                  {part.value}
                </span>
              );
            }
            if (part.removed) {
              return (
                <span
                  key={index}
                  className="bg-red-200 text-red-900 px-1 rounded line-through relative"
                  title="Removed/corrected">
                  {part.value}
                </span>
              );
            }
            return <span key={index}>{part.value}</span>;
          })}
        </div>
      </div>

      {/* Summary of changes */}
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
        <p className="font-medium text-blue-800 mb-1">
          {t('write.corrections.legend.title')}
        </p>
        <div className="flex flex-wrap gap-4 text-xs">
          <span className="flex items-center">
            <span className="bg-red-200 px-2 py-1 rounded mr-2">removed</span>
            {t('write.corrections.legend.removed')}
          </span>
          <span className="flex items-center">
            <span className="bg-green-200 px-2 py-1 rounded mr-2">added</span>
            {t('write.corrections.legend.added')}
          </span>
        </div>
      </div>
    </div>
  );
};
