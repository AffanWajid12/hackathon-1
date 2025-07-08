import { AudioLines, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatHistory = ({ chatHistory }) => {
  if (chatHistory.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="history"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <div className="bg-[#131414] rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-indigo-400">Analysis History</h3>
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            <AnimatePresence>
              {chatHistory.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="bg-[#1c1d1d] rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {message.type === 'audio' ? (
                      <AudioLines className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-purple-400" />
                    )}
                    <span className="text-sm text-gray-400">{message.timestamp}</span>
                  </div>
                  <p className="text-gray-300 mb-2">"{message.text}"</p>
                  <div className="flex gap-2 flex-wrap">
                    {message.results.groq_emotions.map((emotion, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-full"
                      >
                        {emotion}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatHistory;
