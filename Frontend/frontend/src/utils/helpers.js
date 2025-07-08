// utils/helpers.js

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getEmotionColor = (emotion) => {
  const colors = {
    // ✅ Positive emotions
    Happy: 'from-yellow-400 to-orange-400',
    Joy: 'from-yellow-400 to-orange-400',
    Excitement: 'from-orange-400 to-red-400',
    Gratitude: 'from-emerald-400 to-green-400',
    Love: 'from-pink-400 to-rose-400',
    Content: 'from-green-300 to-emerald-500',
    Hopeful: 'from-sky-300 to-sky-500',
    Calm: 'from-teal-300 to-cyan-500',
    Proud: 'from-amber-400 to-yellow-500',
    Admiration: 'from-rose-300 to-pink-400',
    Approval: 'from-lime-400 to-green-400',
    Inspired: 'from-violet-300 to-purple-500',
    Relieved: 'from-emerald-300 to-teal-500',
    Amused: 'from-amber-300 to-yellow-400',
    Cheerful: 'from-yellow-300 to-orange-300',

    // ➖ Neutral or Mixed emotions
    Neutral: 'from-gray-400 to-gray-600',
    Tired: 'from-gray-500 to-gray-700',
    Bored: 'from-zinc-400 to-zinc-600',
    Confused: 'from-indigo-300 to-indigo-500',
    Pensive: 'from-slate-400 to-slate-600',
    Realization: 'from-blue-300 to-blue-500',
    Anticipation: 'from-cyan-300 to-sky-500',
    Curiosity: 'from-indigo-300 to-violet-400',

    // ❌ Negative emotions
    Sad: 'from-blue-400 to-blue-600',
    Sadness: 'from-blue-400 to-blue-600',
    Angry: 'from-red-500 to-red-700',
    Anger: 'from-red-400 to-red-600',
    Annoyance: 'from-orange-300 to-orange-500',
    Frustrated: 'from-orange-600 to-red-500',
    Fear: 'from-purple-400 to-purple-600',
    Anxious: 'from-indigo-500 to-indigo-700',
    Nervous: 'from-violet-400 to-violet-600',
    Embarrassed: 'from-rose-300 to-rose-500',
    Shame: 'from-rose-600 to-pink-700',
    Guilt: 'from-pink-600 to-red-500',
    Disgust: 'from-green-400 to-green-600',
    Jealousy: 'from-lime-500 to-green-600',
    Envy: 'from-lime-400 to-lime-600',
    Shock: 'from-pink-400 to-pink-600',
    Surprise: 'from-pink-400 to-pink-600',
    Loneliness: 'from-cyan-700 to-blue-700',
    Hurt: 'from-rose-500 to-red-600',
    Insecure: 'from-zinc-500 to-zinc-700',
    Resentful: 'from-red-600 to-zinc-600',
  };

  return colors[emotion] || 'from-gray-300 to-gray-500'; // fallback for unknown emotions
};
