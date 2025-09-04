const candidates = [
  'audio/webm; codecs=opus',
  'audio/webm',
  'audio/ogg; codecs=opus',
  'audio/ogg',
  'audio/mp4',
];

export const getAudioFormat = () => {
  if (typeof window !== 'undefined' && 'MediaRecorder' in window) {
    for (const type of candidates) {
      if (
        typeof MediaRecorder.isTypeSupported === 'function' &&
        MediaRecorder.isTypeSupported(type)
      ) {
        return type;
      }
    }
  }

  return '';
};
