import { useTranslation } from 'react-i18next';

interface AudioPlaybackProps {
  audioUrl: string | null;
}

export const AudioPlayback = ({ audioUrl }: AudioPlaybackProps) => {
  const { t } = useTranslation();

  if (!audioUrl) {
    return (
      <p className="text-muted-foreground">
        {t('speak.audioPlayback.noAudio')}
      </p>
    );
  }

  return (
    <div className="text-center" data-testid="audio-playback">
      <p className="font-medium">{t('speak.audioPlayback.title')}</p>
      <audio controls src={audioUrl} className="w-full mt-2" />
    </div>
  );
};
