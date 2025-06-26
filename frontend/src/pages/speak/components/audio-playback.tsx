interface AudioPlaybackProps {
  blob: Blob;
}

export const AudioPlayback = ({ blob }: AudioPlaybackProps) => {
  const url = URL.createObjectURL(blob);

  return (
    <div className="text-center">
      <p className="font-medium">Playback</p>
      <audio controls src={url} className="w-full mt-2" />
    </div>
  );
};
