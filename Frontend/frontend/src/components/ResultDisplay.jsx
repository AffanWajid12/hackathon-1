import React from 'react';
import { Volume2 } from 'lucide-react';
import { getEmotionColor } from '../utils/helpers';

const ResultDisplay = ({ results }) => {
  if (!results) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Transcription */}
      <div className="bg-[#131414] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Volume2 className="w-6 h-6 text-indigo-400" />
          <h3 className="text-xl font-semibold">Transcription</h3>
        </div>
        <p className="text-gray-300 text-lg leading-relaxed">
          "{results.transcribed_text}"
        </p>
      </div>

      {/* Emotions Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* HuggingFace Emotions */}
        <div className="bg-[#131414] rounded-2xl p-6 border border-gray-800">
          <h3 className="text-xl font-semibold mb-4 text-indigo-400">Detailed Emotions</h3>
          <div className="space-y-3">
            {results.huggingface_emotions.map((emotion, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{emotion.label}</span>
                  <span className="text-gray-400">{(emotion.score * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${getEmotionColor(emotion.label)} transition-all duration-1000`}
                    style={{ width: `${emotion.score * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Groq Emotions */}
        <div className="bg-[#131414] rounded-2xl p-6 border border-gray-800">
          <h3 className="text-xl font-semibold mb-4 text-purple-400">Primary Emotions</h3>
          <div className="space-y-3">
            {results.groq_emotions.map((emotion, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getEmotionColor(emotion)}`}></div>
                <span className="font-medium capitalize">{emotion}</span>
              </div>
            ))}
            {results.groq_emotions.length === 0 && (
              <p className="text-gray-400 italic">No primary emotions detected</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;