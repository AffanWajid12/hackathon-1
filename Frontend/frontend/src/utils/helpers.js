// utils/helpers.js

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getEmotionColor = (emotion) => {
  const colors = {
    Happy: 'from-yellow-400 to-orange-400',
    Joy: 'from-yellow-400 to-orange-400',
    Sad: 'from-blue-400 to-blue-600',
    Sadness: 'from-blue-400 to-blue-600',
    Anger: 'from-red-400 to-red-600',
    Fear: 'from-purple-400 to-purple-600',
    Surprise: 'from-pink-400 to-pink-600',
    Disgust: 'from-green-400 to-green-600',
    Neutral: 'from-gray-400 to-gray-600',
    Excitement: 'from-orange-400 to-red-400',
    Gratitude: 'from-emerald-400 to-green-400',
    Love: 'from-pink-400 to-rose-400',
  };

  return colors[emotion] || 'from-indigo-400 to-indigo-600';
};
