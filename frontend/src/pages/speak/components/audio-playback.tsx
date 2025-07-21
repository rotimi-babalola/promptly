import { useTranslation } from 'react-i18next';

interface AudioPlaybackProps {
  blob: Blob;
}

export const AudioPlayback = ({ blob }: AudioPlaybackProps) => {
  const { t } = useTranslation();
  const url = URL.createObjectURL(blob);

  return (
    <div className="text-center">
      <p className="font-medium">{t('speak.audioPlayback.title')}</p>
      <audio controls src={url} className="w-full mt-2" />
    </div>
  );
};
