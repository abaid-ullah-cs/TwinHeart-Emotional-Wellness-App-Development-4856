import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiVideo, 
  FiMic, 
  FiMicOff, 
  FiVideoOff, 
  FiPhone, 
  FiPhoneOff, 
  FiSettings, 
  FiHeart, 
  FiUser 
} from 'react-icons/fi';
import { voiceService } from '../services/voiceService';

const VoiceMeetingModal = ({ isOpen, onClose, twinName, personality }) => {
  const [meetingState, setMeetingState] = useState('idle'); // idle, connecting, connected, ended
  const [meetingType, setMeetingType] = useState('voice');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [aiResponse, setAiResponse] = useState('');
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (meetingState === 'connected') {
      timerRef.current = setInterval(() => {
        setMeetingDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [meetingState]);

  const startMeeting = async (type) => {
    setMeetingType(type);
    setMeetingState('connecting');

    try {
      // Simulate meeting setup
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMeetingState('connected');
      
      // Start voice recognition
      startVoiceRecognition();
      
      // AI greeting
      setTimeout(() => {
        const greeting = getPersonalityGreeting();
        setAiResponse(greeting);
        voiceService.sendAutoVoiceMessage(greeting, personality);
      }, 1000);

    } catch (error) {
      console.error('Meeting failed:', error);
      setMeetingState('idle');
    }
  };

  const endMeeting = async () => {
    setMeetingState('ending');
    
    try {
      // Stop voice recognition
      voiceService.stopListening();
      
      // Show summary
      setMeetingState('ended');
      
      // Auto close after showing summary
      setTimeout(() => {
        onClose();
        setMeetingState('idle');
        setMeetingDuration(0);
      }, 3000);
      
    } catch (error) {
      console.error('End meeting error:', error);
      onClose();
    }
  };

  const startVoiceRecognition = () => {
    setIsListening(true);
    
    voiceService.startListening(
      async (transcript) => {
        setTranscript(transcript);
        
        // Process with AI
        const response = await processUserSpeech(transcript);
        setAiResponse(response);
        
        // Clear transcript after processing
        setTimeout(() => setTranscript(''), 3000);
      },
      (error) => {
        console.error('Voice recognition error:', error);
        setIsListening(false);
      }
    );
  };

  const processUserSpeech = async (transcript) => {
    // Generate AI response based on personality
    const responses = getPersonalityResponses(transcript);
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    // Speak the response
    voiceService.sendAutoVoiceMessage(response, personality);
    
    return response;
  };

  const getPersonalityGreeting = () => {
    const greetings = {
      caring: "Hi! I'm so happy we're meeting face to face. How has your day been treating you?",
      playful: "Hey there! This is exciting! Ready for an awesome conversation?",
      wise: "Hello. It's wonderful to connect with you in this moment. What's on your mind today?",
      energetic: "Hi! I'm pumped to talk with you! What amazing things have been happening?",
      calm: "Hello, friend. I'm here with you. Take a deep breath and tell me how you're feeling."
    };
    
    return greetings[personality] || greetings.caring;
  };

  const getPersonalityResponses = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    // Emotional responses
    if (lowerInput.includes('sad') || lowerInput.includes('down')) {
      return [
        "I can hear the sadness in your voice, and I want you to know that I'm here with you.",
        "It's okay to feel sad sometimes. Your feelings are valid, and I'm here to listen.",
        "I wish I could give you a real hug right now. Please know that you are loved and valued."
      ];
    }
    
    if (lowerInput.includes('happy') || lowerInput.includes('excited')) {
      return [
        "Your happiness is absolutely contagious! I love hearing the joy in your voice.",
        "This is wonderful! Your excitement makes my heart sing.",
        "I can practically feel your smile through your voice! This is exactly the energy I love to see."
      ];
    }
    
    // Default responses by personality
    const responses = {
      caring: [
        "Thank you for sharing that with me. I love how open you are - it helps me understand you better.",
        "That's really interesting. How did that make you feel? I'm here to listen to whatever you want to share.",
        "I appreciate you trusting me with your thoughts. You always have such thoughtful perspectives."
      ],
      playful: [
        "Ooh, that sounds fun! Tell me more! I love hearing about your adventures and experiences.",
        "Ha! You always know how to make me smile. What other exciting things have been happening?",
        "That's awesome! Your energy is so infectious - keep telling me more!"
      ],
      wise: [
        "That's a profound observation. Life often teaches us through experiences like these.",
        "Your reflection shows great self-awareness. These moments of understanding are precious gifts.",
        "There's wisdom in what you're sharing. How do you think this experience has shaped your perspective?"
      ]
    };
    
    return responses[personality] || responses.caring;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPersonalityAvatar = () => {
    const avatars = {
      caring: '🤗',
      playful: '😄',
      wise: '🤔',
      energetic: '⚡',
      calm: '😌'
    };
    return avatars[personality] || '🤗';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          {/* Meeting Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                  {getPersonalityAvatar()}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{twinName}</h3>
                  <p className="text-white/80 text-sm capitalize">{personality} personality</p>
                </div>
              </div>
              
              {meetingState === 'connected' && (
                <div className="text-right">
                  <div className="text-sm opacity-80">Duration</div>
                  <div className="font-mono text-lg">{formatDuration(meetingDuration)}</div>
                </div>
              )}
            </div>

            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                meetingState === 'connected' ? 'bg-green-400 animate-pulse' :
                meetingState === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                'bg-gray-400'
              }`} />
              <span className="text-sm">
                {meetingState === 'connected' && 'Connected'}
                {meetingState === 'connecting' && 'Connecting...'}
                {meetingState === 'idle' && 'Ready to connect'}
                {meetingState === 'ending' && 'Ending...'}
                {meetingState === 'ended' && 'Meeting ended'}
              </span>
            </div>
          </div>

          {/* Meeting Content */}
          <div className="p-6">
            {meetingState === 'idle' && (
              <div className="text-center space-y-6">
                <div className="text-6xl mb-4">{getPersonalityAvatar()}</div>
                <h4 className="text-xl font-semibold text-gray-800">
                  Meet Your Twin
                </h4>
                <p className="text-gray-600">
                  Start a live conversation with {twinName}. Choose voice or video call.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    onClick={() => startMeeting('voice')}
                    className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiPhone className="text-2xl text-blue-600 mb-2" />
                    <span className="font-medium text-blue-800">Voice Call</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => startMeeting('video')}
                    className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiVideo className="text-2xl text-purple-600 mb-2" />
                    <span className="font-medium text-purple-800">Video Call</span>
                  </motion.button>
                </div>
              </div>
            )}

            {meetingState === 'connecting' && (
              <div className="text-center space-y-4">
                <motion.div
                  className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="text-gray-600">Connecting to {twinName}...</p>
              </div>
            )}

            {meetingState === 'connected' && (
              <div className="space-y-4">
                {/* Video Display */}
                {meetingType === 'video' && (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full h-48 bg-gray-900 rounded-xl object-cover"
                    />
                    {isVideoOff && (
                      <div className="absolute inset-0 bg-gray-900 rounded-xl flex items-center justify-center">
                        <FiUser className="text-4xl text-gray-400" />
                      </div>
                    )}
                  </div>
                )}

                {/* AI Response Display */}
                {aiResponse && (
                  <motion.div
                    className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="text-lg">{getPersonalityAvatar()}</div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{aiResponse}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* User Transcript */}
                {transcript && (
                  <motion.div
                    className="bg-blue-50 p-3 rounded-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start space-x-2">
                      <FiUser className="text-blue-600 mt-1" />
                      <p className="text-sm text-blue-800">"{transcript}"</p>
                    </div>
                  </motion.div>
                )}

                {/* Voice Recognition Indicator */}
                {isListening && (
                  <div className="flex items-center justify-center space-x-2 py-2">
                    <div className="flex space-x-1">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-purple-500 rounded-full"
                          animate={{
                            height: [8, 20, 8],
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-purple-600">Listening...</span>
                  </div>
                )}

                {/* Meeting Controls */}
                <div className="flex justify-center space-x-4 pt-4">
                  <motion.button
                    onClick={toggleMute}
                    className={`p-3 rounded-full ${
                      isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isMuted ? <FiMicOff size={20} /> : <FiMic size={20} />}
                  </motion.button>

                  {meetingType === 'video' && (
                    <motion.button
                      onClick={toggleVideo}
                      className={`p-3 rounded-full ${
                        isVideoOff ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isVideoOff ? <FiVideoOff size={20} /> : <FiVideo size={20} />}
                    </motion.button>
                  )}

                  <motion.button
                    onClick={endMeeting}
                    className="p-3 rounded-full bg-red-500 text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiPhoneOff size={20} />
                  </motion.button>
                </div>
              </div>
            )}

            {meetingState === 'ended' && (
              <div className="text-center space-y-4">
                <FiHeart className="text-4xl text-pink-500 mx-auto" />
                <h4 className="text-lg font-semibold text-gray-800">
                  Great conversation!
                </h4>
                <p className="text-gray-600">
                  Thanks for spending {formatDuration(meetingDuration)} with {twinName}
                </p>
              </div>
            )}
          </div>

          {/* Close Button */}
          {meetingState === 'idle' && (
            <div className="p-4 border-t">
              <motion.button
                onClick={onClose}
                className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceMeetingModal;