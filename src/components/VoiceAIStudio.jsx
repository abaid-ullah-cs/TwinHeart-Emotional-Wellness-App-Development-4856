import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMic, 
  FiPhone, 
  FiRadio, 
  FiPlay, 
  FiPause, 
  FiPhoneCall,
  FiPhoneOff,
  FiSettings,
  FiStar,
  FiHeart,
  FiZap,
  FiVolume2,
  FiWaveform,
  FiUpload
} from 'react-icons/fi';
import { ultraVoiceAI } from '../services/ultraVoiceAI';

const VoiceAIStudio = ({ isOpen, onClose }) => {
  const [selectedVoice, setSelectedVoice] = useState('sophie');
  const [currentEmotion, setCurrentEmotion] = useState('calm');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const [callScenario, setCallScenario] = useState('casual');
  const [voiceProfiles, setVoiceProfiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showCustomVoice, setShowCustomVoice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVoiceProfiles(ultraVoiceAI.getVoiceProfiles());
    }
  }, [isOpen]);

  const handleTestVoice = async (voiceId, emotion = 'calm') => {
    setIsPlaying(true);
    try {
      await ultraVoiceAI.testVoice(voiceId, emotion);
    } catch (error) {
      console.error('Voice test failed:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleStartCall = async (scenario) => {
    try {
      const call = await ultraVoiceAI.startPhoneCall(selectedVoice, scenario);
      setActiveCall(call);
    } catch (error) {
      console.error('Call failed:', error);
    }
  };

  const handleEndCall = async () => {
    try {
      const summary = await ultraVoiceAI.endPhoneCall();
      console.log('Call summary:', summary);
      setActiveCall(null);
    } catch (error) {
      console.error('End call failed:', error);
    }
  };

  const handleStartPodcast = async (topic) => {
    try {
      await ultraVoiceAI.startPodcast(selectedVoice, topic);
    } catch (error) {
      console.error('Podcast failed:', error);
    }
  };

  const emotions = [
    { id: 'calm', label: 'Calm', icon: '😌', color: 'bg-blue-100 text-blue-700' },
    { id: 'happy', label: 'Happy', icon: '😊', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'excited', label: 'Excited', icon: '🤩', color: 'bg-orange-100 text-orange-700' },
    { id: 'sad', label: 'Sad', icon: '😢', color: 'bg-gray-100 text-gray-700' }
  ];

  const callScenarios = [
    { id: 'casual', label: 'Casual Chat', icon: '💬', description: 'Friendly conversation' },
    { id: 'business', label: 'Business Call', icon: '💼', description: 'Professional discussion' },
    { id: 'support', label: 'Support Call', icon: '🛟', description: 'Help and assistance' },
    { id: 'joke', label: 'Tell Jokes', icon: '😄', description: 'Comedy and humor' }
  ];

  const podcastTopics = [
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'health', label: 'Health & Wellness', icon: '🏃‍♂️' },
    { id: 'business', label: 'Business', icon: '📈' },
    { id: 'lifestyle', label: 'Lifestyle', icon: '🌟' }
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Ultra Voice AI Studio
            </h2>
            <p className="text-gray-600">
              The fastest, ultra-realistic voice AI platform
            </p>
          </div>
          <motion.button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
        </div>

        <div className="p-6 space-y-8">
          {/* Voice Profiles Grid */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <FiWaveform className="text-purple-600" />
              <span>Ultra-Realistic Voices</span>
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {voiceProfiles.map((voice) => (
                <motion.div
                  key={voice.id}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedVoice === voice.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedVoice(voice.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-3xl">{voice.avatar}</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{voice.name}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {voice.accent}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          {voice.gender}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                    {voice.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {voice.specialties.slice(0, 3).map((specialty) => (
                      <span key={specialty} className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                  
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTestVoice(voice.id, currentEmotion);
                    }}
                    disabled={isPlaying}
                    className="w-full py-2 bg-purple-500 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isPlaying ? (
                      <>
                        <FiPause size={16} />
                        <span>Playing...</span>
                      </>
                    ) : (
                      <>
                        <FiPlay size={16} />
                        <span>Test Voice</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Emotion Control */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <FiHeart className="text-red-500" />
              <span>Voice Emotion</span>
            </h3>
            
            <div className="flex flex-wrap gap-3">
              {emotions.map((emotion) => (
                <motion.button
                  key={emotion.id}
                  onClick={() => setCurrentEmotion(emotion.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    currentEmotion === emotion.id
                      ? emotion.color
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{emotion.icon}</span>
                  <span>{emotion.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Phone Call */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-blue-500 rounded-full">
                  <FiPhone className="text-white text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800">Make a Phone Call</h4>
                  <p className="text-sm text-blue-600">Start a live conversation</p>
                </div>
              </div>

              {!activeCall ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {callScenarios.map((scenario) => (
                      <motion.button
                        key={scenario.id}
                        onClick={() => handleStartCall(scenario.id)}
                        className="p-2 bg-white rounded-lg text-center hover:bg-blue-50 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-lg mb-1">{scenario.icon}</div>
                        <div className="text-xs font-medium text-blue-800">{scenario.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-green-600">
                    <FiPhoneCall className="animate-pulse" />
                    <span className="font-medium">Call in Progress</span>
                  </div>
                  <motion.button
                    onClick={handleEndCall}
                    className="w-full py-2 bg-red-500 text-white rounded-lg font-medium flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiPhoneOff size={16} />
                    <span>End Call</span>
                  </motion.button>
                </div>
              )}
            </div>

            {/* Tell Jokes */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-orange-500 rounded-full">
                  <span className="text-white text-xl">😄</span>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-800">Tell Me a Joke</h4>
                  <p className="text-sm text-orange-600">Get some laughs</p>
                </div>
              </div>

              <motion.button
                onClick={() => handleStartCall('joke')}
                className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Comedy Session
              </motion.button>
            </div>

            {/* Host Podcast */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-purple-500 rounded-full">
                  <FiRadio className="text-white text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800">Host a Podcast</h4>
                  <p className="text-sm text-purple-600">AI-powered content</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {podcastTopics.map((topic) => (
                  <motion.button
                    key={topic.id}
                    onClick={() => handleStartPodcast(topic.id)}
                    className="p-2 bg-white rounded-lg text-center hover:bg-purple-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-lg mb-1">{topic.icon}</div>
                    <div className="text-xs font-medium text-purple-800">{topic.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced Features */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <FiZap className="text-blue-600" />
              <span>Advanced Features</span>
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <motion.button
                onClick={() => setShowCustomVoice(true)}
                className="p-4 bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors text-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiUpload className="mx-auto text-2xl text-gray-400 mb-2" />
                <div className="font-medium text-gray-700">Voice Cloning</div>
                <div className="text-sm text-gray-500">Create custom AI voice</div>
              </motion.button>

              <motion.button
                className="p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-purple-400 transition-colors text-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiSettings className="mx-auto text-2xl text-gray-400 mb-2" />
                <div className="font-medium text-gray-700">Voice Studio</div>
                <div className="text-sm text-gray-500">Advanced voice controls</div>
              </motion.button>
            </div>
          </div>

          {/* Current Voice Display */}
          {selectedVoice && (
            <div className="bg-white border-2 border-purple-200 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">
                    {voiceProfiles.find(v => v.id === selectedVoice)?.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Currently Selected: {voiceProfiles.find(v => v.id === selectedVoice)?.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {voiceProfiles.find(v => v.id === selectedVoice)?.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <FiVolume2 className="text-purple-600" />
                  <span className="font-medium text-purple-600 capitalize">{currentEmotion}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VoiceAIStudio;