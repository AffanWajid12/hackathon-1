// utils/api.js

export const analyzeTextAPI = async (text) => {
  const response = await fetch('http://localhost:5000/analyze-text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error('Text analysis failed');
  }

  return await response.json();
};

export const analyzeAudioAPI = async (base64Audio) => {
  const response = await fetch('http://localhost:5000/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ audio: base64Audio }),
  });

  if (!response.ok) {
    throw new Error('Audio analysis failed');
  }

  return await response.json();
};
