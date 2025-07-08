import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import ChatHistory from './components/ChatHistory';
import ErrorAlert from './components/ErrorAlert';
import InputSection from './components/InputSection';
import ResultSection from './components/ResultSection';
import { analyzeTextAPI, analyzeAudioAPI } from './utils/api';
import { AnimatePresence, motion } from 'framer-motion';

const EmotionAnalyzer = () => {
  const [activeTab, setActiveTab] = useState('audio');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [textInput, setTextInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      setRecordingTime(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRecording]);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  const handleTextSubmit = async (text) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeTextAPI(text);
      const newMessage = {
        id: Date.now(),
        text,
        results: data,
        timestamp: new Date().toLocaleTimeString(),
        type: 'text',
      };
      setChatHistory(prev => [...prev, newMessage]);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAudioSubmit = async (blob) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeAudioAPI(blob);
      const newMessage = {
        id: Date.now(),
        text: data.transcribed_text,
        results: data,
        timestamp: new Date().toLocaleTimeString(),
        type: 'audio',
      };
      setChatHistory(prev => [...prev, newMessage]);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResults(null);
    setAudioBlob(null);
    setTextInput('');
    setIsPlaying(false);
    setIsRecording(false);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Header />

      <div className="relative z-10 container mx-auto px-4 py-1">
        <AnimatePresence mode="wait">
          {!results ? (
            <InputSection
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
              audioBlob={audioBlob}
              setAudioBlob={setAudioBlob}
              isAnalyzing={isAnalyzing}
              handleAudioSubmit={handleAudioSubmit}
              handleTextSubmit={handleTextSubmit}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              recordingTime={recordingTime}
              audioRef={audioRef}
              mediaRecorderRef={mediaRecorderRef}
              setResults={setResults}
              setChatHistory={setChatHistory}
              setError={setError}
              textInput={textInput}
              setTextInput={setTextInput}
            />
          ) : (
            <ResultSection
  results={results}
  chatHistory={chatHistory} // ✅ Pass it here
  onReset={reset}
/>

          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <ErrorAlert error={error} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default EmotionAnalyzer;
