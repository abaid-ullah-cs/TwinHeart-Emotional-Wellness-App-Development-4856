import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMic, 
  FiMicOff, 
  FiPlay, 
  FiPause, 
  FiSend, 
  FiVolume2,
  FiLoader,
  FiCheck
} from 'react-icons/fi';
import { advancedVoiceService } from '../services/advancedVoiceService';

const VoiceMessageComponent = ({ 
  onVoiceMessage, 
  onTranscript,
  personality = 'caring',
  isAIMessage = false,
  message = '',
  disabled = false 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  
  const recordingTimerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Auto-play AI messages if it's an AI message and has text
    if (isAIMessage && message && message.trim()) {
      handlePlayAIMessage();
    }
  }, [isAIMessage, message]);

  useEffect(() => {
    // Set up interim result callback for real-time transcription
    advancedVoiceService.onInterimResult = (transcript) => {
      setInterimTranscript(transcript);
    };

    return () => {
      advancedVoiceService.onInterimResult = null;
    };
  }, []);

  const handlePlayAIMessage = async () => {
    if (isGeneratingVoice || !message) return;

    setIsGeneratingVoice(true);
    setIsPlaying(true);

    try {
      await advancedVoiceService.speakMessage(message, personality);
      console.log('🎵 AI message played successfully');
    } catch (error) {
      console.error('❌ Failed to play AI message:', error);
    } finally {
      setIsGeneratingVoice(false);
      setIsPlaying(false);
    }
  };

  const startVoiceRecording = async () => {
    if (disabled || isRecording) return;

    try {
      const success = await advancedVoiceService.startRecording();
      if (success) {
        setIsRecording(true);
        setRecordingTime(0);
        
        recordingTimerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);

        console.log('🎙️ Started voice recording');
      }
    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      alert('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopVoiceRecording = async () => {
    if (!isRecording) return;

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }

    try {
      const voiceData = await advancedVoiceService.stopRecording();
      if (voiceData) {
        setAudioBlob(voiceData);
        setIsRecording(false);
        console.log('🎙️ Voice recording completed');
      }
    } catch (error) {
      console.error('❌ Failed to stop recording:', error);
      setIsRecording(false);
    }
  };

  const startVoiceToText = async () => {
    if (disabled || isListening) return;

    setIsListening(true);
    setInterimTranscript('');

    try {
      const transcript = await advancedVoiceService.startListening();
      console.log('🎤 Voice transcription:', transcript);
      
      if (transcript && transcript.trim()) {
        onTranscript?.(transcript);
      }
    } catch (error) {
      console.error('❌ Voice recognition failed:', error);
      if (error.message.includes('No speech detected')) {
        alert('No speech detected. Please try again and speak clearly.');
      } else {
        alert('Voice recognition failed. Please check microphone permissions.');
      }
    } finally {
      setIsListening(false);
      setInterimTranscript('');
    }
  };

  const stopVoiceToText = () => {
    if (isListening) {
      advancedVoiceService.stopListening();
      setIsListening(false);
      setInterimTranscript('');
    }
  };

  const sendVoiceMessage = () => {
    if (audioBlob && onVoiceMessage) {
      onVoiceMessage({
        id: audioBlob.id,
        audioBlob: audioBlob.blob,
        audioUrl: audioBlob.url,
        duration: recordingTime,
        timestamp: audioBlob.timestamp,
        type: 'voice_message'
      });

      // Reset state
      setAudioBlob(null);
      setRecordingTime(0);
    }
  };

  const playRecordedMessage = () => {
    if (audioBlob && audioRef.current) {
      audioRef.current.src = audioBlob.url;
      audioRef.current.play();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // For AI messages - show play button
  if (isAIMessage && message) {
    return (
      <motion.div
        className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          onClick={handlePlayAIMessage}
          disabled={isGeneratingVoice}
          className={`p-2 rounded-full transition-all ${
            isPlaying 
              ? 'bg-green-500 text-white shadow-lg' 
              : 'bg-white text-blue-600 hover:bg-blue-50 shadow-md'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isGeneratingVoice ? (
            <FiLoader className="animate-spin" size={16} />
          ) : isPlaying ? (
            <FiPause size={16} />
          ) : (
            <FiPlay size={16} />
          )}
        </motion.button>

        {/* Voice Waveform Visualization */}
        <div className="flex-1 flex items-center space-x-1">
          {isPlaying ? (
            <>
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-blue-500 rounded-full"
                  animate={{
                    height: [4, Math.random() * 16 + 8, 4],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </>
          ) : (
            <div className="flex items-center space-x-1">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-2 bg-gray-300 rounded-full"
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">🎵 AI Voice Message</span>
            </div>
          )}
        </div>

        <FiVolume2 className="text-gray-400" size={16} />
      </motion.div>
    );
  }

  // For user input - show recording/transcription controls
  return (
    <div className="space-y-3">
      {/* Voice Input Controls */}
      <div className="flex items-center space-x-3">
        {/* Voice-to-Text Button */}
        <motion.button
          onClick={isListening ? stopVoiceToText : startVoiceToText}
          disabled={disabled || isRecording}
          className={`p-3 rounded-full transition-all ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          whileHover={{ scale: disabled ? 1 : 1.1 }}
          whileTap={{ scale: disabled ? 1 : 0.9 }}
        >
          {isListening ? <FiMicOff size={20} /> : <FiMic size={20} />}
        </motion.button>

        {/* Voice Recording Button */}
        <motion.button
          onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
          disabled={disabled || isListening}
          className={`p-3 rounded-full transition-all ${
            isRecording
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-purple-500 text-white hover:bg-purple-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          whileHover={{ scale: disabled ? 1 : 1.1 }}
          whileTap={{ scale: disabled ? 1 : 0.9 }}
        >
          🎙️
        </motion.button>

        {/* Status Text */}
        <div className="flex-1 text-sm text-gray-600">
          {isListening && (
            <span className="flex items-center space-x-2">
              <span>🎤 Listening...</span>
              {interimTranscript && (
                <span className="text-blue-600 italic">"{interimTranscript}"</span>
              )}
            </span>
          )}
          {isRecording && (
            <span className="flex items-center space-x-2">
              <span>🎙️ Recording: {formatTime(recordingTime)}</span>
            </span>
          )}
          {!isListening && !isRecording && (
            <span>🎤 Voice-to-text | 🎙️ Voice message</span>
          )}
        </div>
      </div>

      {/* Recording Waveform */}
      {isRecording && (
        <motion.div
          className="flex items-center justify-center space-x-1 py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-red-500 rounded-full"
              animate={{
                height: [4, 20, 4],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Recorded Message Playback */}
      {audioBlob && (
        <motion.div
          className="bg-purple-50 rounded-xl p-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={playRecordedMessage}
              className="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiPlay size={16} />
            </motion.button>
            
            <div className="flex-1">
              <div className="text-sm text-purple-800 font-medium">
                Voice Message ({formatTime(recordingTime)})
              </div>
              <div className="text-xs text-purple-600">
                Tap play to review before sending
              </div>
            </div>

            <motion.button
              onClick={sendVoiceMessage}
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiSend size={16} />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Audio element for playback */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
};

export default VoiceMessageComponent;