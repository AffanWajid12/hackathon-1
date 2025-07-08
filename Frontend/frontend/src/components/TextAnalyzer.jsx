// src/components/TextAnalyzer.jsx
import { Send, Loader2 } from 'lucide-react';

const TextAnalyzer = ({ textInput, setTextInput, handleTextSubmit, isAnalyzing }) => (
  <div className="max-w-2xl mx-auto mb-8">
    <div className="bg-black rounded-2xl p-3">
      <form
  onSubmit={(e) => {
    e.preventDefault();
    if (!isAnalyzing && textInput.trim()) {
      handleTextSubmit(textInput.trim());
      setTextInput('');
    }
  }}
  className="space-y-6"
>

        <div>
          <label className="block text-lg font-medium mb-3 text-gray-300">
            Share your thoughts or message
          </label>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your message here to analyze emotions..."
            className="w-full mb-10 h-67 px-4 py-3 bg-[#222323] rounded-lg text-white placeholder-[#babbbb] focus:outline-none focus:ring-[1px] focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
            disabled={isAnalyzing}
          />
        </div>
        <button
          type="submit"
          disabled={!textInput.trim() || isAnalyzing}
          className="w-full px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full transition-all"
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />
              Analyze Emotions
            </span>
          )}
        </button>
      </form>
    </div>
  </div>
);

export default TextAnalyzer;