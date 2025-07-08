import React from 'react';
import ResultDisplay from './ResultDisplay';
import ChatHistory from './ChatHistory'; // ✅ Import chat history
import { motion } from 'framer-motion';

const ResultSection = ({ results, chatHistory, onReset }) => {
  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="mt-6"
    >
      <div className="flex justify-center items-center mb-6">
        <h2 className="text-3xl font-semibold">Analysis Results</h2>
        
      </div>

      <ResultDisplay results={results} />
       
      {/* ✅ Show Chat History here */}
      {chatHistory?.length > 0 && (
        <div className="mt-10">
          <ChatHistory chatHistory={chatHistory} />
        </div>
      )}
       <><div className='flex justify-center'>
        <button
          onClick={onReset}
          className="px-20 py-2 text-lg  bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all"
        >
        Try Again
        </button></div></>
    </motion.div>
    
  );
};

export default ResultSection;
