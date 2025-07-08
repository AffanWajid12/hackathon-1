import React from 'react';
import AudioRecorder from './AudioRecorder';
import TextAnalyzer from './TextAnalyzer';
import TabNavigation from './TabNavigation';
import { motion, AnimatePresence } from 'framer-motion';

const InputSection = ({
  activeTab,
  setActiveTab,
  isRecording,
  setIsRecording,
  audioBlob,
  setAudioBlob,
  isAnalyzing,
  handleAudioSubmit,
  handleTextSubmit,
  isPlaying,
  setIsPlaying,
  recordingTime,
  audioRef,
  mediaRecorderRef,
  setResults,
  setChatHistory,
  setError,
  textInput,
  setTextInput
}) => {
  return (
    <div>
      <motion.h2
        className="text-4xl font-semibold text-center mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'audio' ? 'Record Voice for Analysis' : 'Write Text for Analysis'}
      </motion.h2>

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Animate between audio and text inputs */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'audio' ? (
            <AudioRecorder
              isRecording={isRecording}
              setIsRecording={setIsRecording}
              audioBlob={audioBlob}
              setAudioBlob={setAudioBlob}
              isAnalyzing={isAnalyzing}
              handleAudioSubmit={handleAudioSubmit}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              recordingTime={recordingTime}
              audioRef={audioRef}
              mediaRecorderRef={mediaRecorderRef}
              setResults={setResults}
              setChatHistory={setChatHistory}
              setError={setError}
            />
          ) : (
            <TextAnalyzer
              textInput={textInput}
              setTextInput={setTextInput}
              isAnalyzing={isAnalyzing}
              handleTextSubmit={handleTextSubmit}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default InputSection;
