import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPlay, 
  FiPause, 
  FiVolume2, 
  FiMic,
  FiSend,
  FiLoader
} from 'react-icons/fi';
import { voiceService } from '../services/voiceService';
import { subscriptionService } from '../services/subscriptionService';

const VoiceMessagePlayer = ({ 
  message, 
  onVoiceReply, 
  personality = 'caring',
  isAIMessage = false 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  
  const recordingTimerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Auto-play AI voice messages if it's a premium feature
    if (isAIMessage && subscriptionService.canUseFeature('voiceMessages')) {
      handlePlayVoice();
    }
  }, [isAIMessage, message]);

  const handlePlayVoice = async () => {
    if (!subscriptionService.canUseFeature('voiceMessages')) {
      // Show upgrade modal
      return;
    }

    setIsGeneratingVoice(true);
    
    try {
      // Track usage
      subscriptionService.trackVoiceMessage();
      
      // Generate and play voice
      await voiceService.sendAutoVoiceMessage(message, personality);
      
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), message.length * 50); // Estimate duration
    } catch (error) {
      console.error('Voice playback failed:', error);
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  const startRecording = async () => {
    if (!subscriptionService.canUseFeature('voiceMessages')) {
      // Show upgrade modal
      return;
    }

    const success = await voiceService.startRecording();
    if (success) {
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = async () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }

    const result = await voiceService.stopRecording();
    if (result) {
      setAudioBlob(result.blob);
      setIsRecording(false);
    }
  };

  const sendVoiceReply = async () => {
    if (audioBlob && onVoiceReply) {
      // Analyze voice tone for better AI response
      const voiceAnalysis = await voiceService.analyzeVoiceTone(audioBlob);
      
      onVoiceReply({
        audioBlob,
        voiceAnalysis,
        duration: recordingTime
      });
      
      // Reset
      setAudioBlob(null);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
      {/* Play Voice Button for AI messages */}
      {isAIMessage && (
        <motion.button
          onClick={handlePlayVoice}
          disabled={isGeneratingVoice}
          className={`p-2 rounded-full ${
            isPlaying 
              ? 'bg-green-500 text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-100'
          } transition-colors`}
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
      )}

      {/* Voice Waveform Visualization */}
      <div className="flex-1 flex items-center space-x-1">
        {isPlaying && (
          <>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-blue-500 rounded-full"
                animate={{
                  height: [4, Math.random() * 20 + 8, 4],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </>
        )}
        
        {!isPlaying && (
          <div className="flex items-center space-x-1">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-2 bg-gray-300 rounded-full"
              />
            ))}
          </div>
        )}
      </div>

      {/* Voice Reply Controls */}
      {!isAIMessage && (
        <div className="flex items-center space-x-2">
          {!isRecording && !audioBlob && (
            <motion.button
              onClick={startRecording}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiMic size={16} />
            </motion.button>
          )}

          {isRecording && (
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={stopRecording}
                className="p-2 bg-red-500 text-white rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <FiPause size={16} />
              </motion.button>
              <span className="text-sm text-red-600 font-mono">
                {formatTime(recordingTime)}
              </span>
            </div>
          )}

          {audioBlob && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {formatTime(recordingTime)}
              </span>
              <motion.button
                onClick={sendVoiceReply}
                className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiSend size={16} />
              </motion.button>
            </div>
          )}
        </div>
      )}

      {/* Volume Control */}
      <motion.button
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        whileHover={{ scale: 1.1 }}
      >
        <FiVolume2 size={14} />
      </motion.button>
    </div>
  );
};

export default VoiceMessagePlayer;