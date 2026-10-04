import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Upload, Volume2, AlertCircle } from 'lucide-react';

export const VoiceRecorder = ({ audioBlob, setAudioBlob, audioUrl, setAudioUrl }) => {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [micError, setMicError] = useState('');
  const [micSupported, setMicSupported] = useState(true);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioElementRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicSupported(false);
    }
  }, []);

  // Timer updater
  useEffect(() => {
    if (recording && !paused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [recording, paused]);

  const startRecording = async () => {
    setMicError('');
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        // Stop all audio tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setRecording(true);
      setPaused(false);
      setRecordingTime(0);
    } catch (err) {
      console.error('Microphone access error:', err);
      setMicError('Microphone permission denied or not available. You can upload an audio note below.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recording) {
      if (paused) {
        mediaRecorderRef.current.resume();
        setPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setPaused(true);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setPaused(false);
    }
  };

  const resetRecording = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    setAudioBlob(null);
    setAudioUrl('');
    setRecordingTime(0);
    setIsPlaying(false);
    audioChunksRef.current = [];
  };

  const togglePlayAudio = () => {
    if (!audioElementRef.current) return;
    if (isPlaying) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    } else {
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setMicError('Audio file is too large (max 10MB).');
        return;
      }
      setAudioBlob(file);
      setAudioUrl(URL.createObjectURL(file));
      setRecordingTime(0);
      setMicError('');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="p-4 rounded-2xl bg-white/70 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-pink-600 dark:text-pink-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-pink-900 dark:text-pink-200">
            Personal Voice Note (Optional)
          </h4>
        </div>
        <span className="text-[11px] text-pink-500 font-medium">Max 60 sec</span>
      </div>

      {micError && (
        <div className="mb-3 p-2.5 rounded-xl bg-amber-50 dark:bg-pink-950 border border-amber-200 dark:border-pink-800 flex items-start gap-2 text-xs text-amber-800 dark:text-pink-300">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-pink-400 flex-shrink-0 mt-0.5" />
          <span>{micError}</span>
        </div>
      )}

      {/* When audio is recorded/uploaded */}
      {audioUrl ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-pink-100/60 dark:bg-pink-900/40 rounded-xl border border-pink-200 dark:border-pink-700">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayAudio}
              type="button"
              className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md"
              aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-pink-900 dark:text-pink-100">
                Voice message attached
              </span>
              <span className="text-[11px] text-pink-600 dark:text-pink-300">
                {recordingTime > 0 ? `${recordingTime}s duration` : 'Audio ready'}
              </span>
            </div>
            <audio
              ref={audioElementRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          </div>

          <button
            type="button"
            onClick={resetRecording}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-pink-700 dark:text-pink-300 hover:bg-pink-200/60 dark:hover:bg-pink-800/50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-record / Remove</span>
          </button>
        </div>
      ) : recording ? (
        /* While recording */
        <div className="flex flex-col items-center p-4 bg-pink-100/50 dark:bg-pink-900/30 rounded-xl border border-pink-300 dark:border-pink-700">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span className="text-sm font-bold text-red-600 dark:text-red-400">
              {paused ? 'Recording Paused' : 'Recording Voice Note...'}
            </span>
            <span className="font-mono text-sm font-bold text-pink-900 dark:text-pink-100 ml-2">
              {formatTime(recordingTime)} / 1:00
            </span>
          </div>

          {/* Simple Animated Waveform */}
          <div className="flex items-center gap-1 my-3 h-8">
            {[40, 70, 30, 90, 60, 100, 50, 80, 45, 95, 35, 75].map((height, i) => (
              <span
                key={i}
                style={{ height: `${paused ? 20 : height}%` }}
                className="w-1 bg-pink-600 rounded-full transition-all duration-150 animate-pulse"
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={pauseRecording}
              className="px-3 py-1.5 rounded-lg bg-pink-200 dark:bg-pink-800 text-xs font-semibold text-pink-900 dark:text-pink-100 hover:bg-pink-300"
            >
              {paused ? 'Resume' : 'Pause'}
            </button>
            <button
              type="button"
              onClick={stopRecording}
              className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 flex items-center gap-1.5 shadow"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Finish & Save</span>
            </button>
          </div>
        </div>
      ) : (
        /* Idle State: Record or Upload */
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {micSupported && (
            <button
              type="button"
              onClick={startRecording}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-95"
            >
              <Mic className="w-4 h-4" />
              <span>Record Voice Note</span>
            </button>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="audio/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-pink-900/50 border border-pink-200 dark:border-pink-700 text-pink-800 dark:text-pink-200 text-xs font-semibold hover:bg-pink-50 dark:hover:bg-pink-800/40 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-pink-600" />
              <span>Upload Audio</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
