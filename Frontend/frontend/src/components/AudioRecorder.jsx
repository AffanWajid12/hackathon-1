import React, { useMemo, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Pause, Loader2, Brain } from 'lucide-react';
import { formatTime } from '../utils/helpers';

const AudioRecorder = ({
  isAnalyzing,
  handleAudioSubmit,
  setError,
  setResults,
  setChatHistory,
  isRecording,
  setIsRecording,
  audioBlob,
  setAudioBlob,
  isPlaying,
  setIsPlaying,
  recordingTime,
  audioRef,
  mediaRecorderRef
}) => {
  const audioURL = useMemo(() => audioBlob ? URL.createObjectURL(audioBlob) : null, [audioBlob]);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {}, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => chunks.push(event.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setResults(null);
      setError(null);
    } catch (err) {
      console.error("❌ Microphone error:", err);
      setError('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const analyzeAudio = () => {
    if (!audioBlob) {
      setError("Please record some audio before analyzing.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const arrayBuffer = reader.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        const base64String = btoa(String.fromCharCode(...uint8Array));

        const response = await fetch('http://localhost:5000/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: base64String })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Server error");
        }

        setResults(data);
        setChatHistory(prev => [
          ...prev,
          {
            id: Date.now(),
            text: data.transcribed_text,
            results: data,
            timestamp: new Date().toLocaleTimeString(),
            type: 'audio'
          }
        ]);
      } catch (err) {
        console.error("❌ Audio analysis error:", err);
        setError('Analysis failed. Make sure your voice is audible and the server is running.');
      }
    };

    reader.readAsArrayBuffer(audioBlob);
  };

  return (
    <div className="rounded-2xl p-8">
      <div className="text-center">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isAnalyzing}
          className={`relative mb-6 w-32 h-32 rounded-full transition-all duration-300 ${
            isRecording
              ? 'border-red-500 bg-red-500 animate-pulse'
              : 'bg-indigo-500 hover:bg-indigo-00 border-0 hover:shadow-lg'
          } disabled:opacity-50`}
        >
          {isRecording
            ? <MicOff className="w-12 h-12 text-white mx-auto" />
            : <Mic className="w-12 h-12 text-white mx-auto" />}
        </button>

        <p className="text-lg font-medium mb-4">
          {isRecording
            ? `🎙️ Recording... ${formatTime(recordingTime)}`
            : audioBlob
              ? 'Recording Ready'
              : 'Click to Start Recording'}
        </p>

        {audioBlob && (
          <>
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={togglePlayback}
                className="flex items-center gap-2 px-4 py-2 bg-[#1c1d1d] hover:bg-[#2e2f2f] duration-400 transition-all rounded-lg"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>

              <audio
                ref={audioRef}
                src={audioURL}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </div>

            <button
              onClick={analyzeAudio}
              disabled={isAnalyzing}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full transition-all mt-20"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Brain className="w-5 h-5" /> Analyze Emotions
                </span>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
