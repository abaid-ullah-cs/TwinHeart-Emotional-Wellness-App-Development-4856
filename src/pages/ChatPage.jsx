import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSend, 
  FiPhone, 
  FiVideo,
  FiHeart,
  FiMoreVertical,
  FiCpu,
  FiZap,
  FiStar
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { useAIAgent } from '../hooks/useAIAgent';
import { advancedVoiceService } from '../services/advancedVoiceService';
import { stripeService } from '../services/stripeService';
import AIThinking from '../components/AIThinking';
import VoiceMessageComponent from '../components/VoiceMessageComponent';
import VoiceMeetingModal from '../components/VoiceMeetingModal';
import SubscriptionCheckout from '../components/SubscriptionCheckout';

const ChatPage = () => {
  const { state, dispatch } = useApp();
  const [message, setMessage] = useState('');
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState('free');
  const messagesEndRef = useRef(null);

  // Initialize AI agent with enhanced capabilities
  const { generateResponse, getProactiveMessage, getUserInsights, isThinking } = useAIAgent(
    state.user, 
    state.twin
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatMessages, isThinking]);

  // Send proactive message on first load
  useEffect(() => {
    if (state.chatMessages.length === 0 && state.twin.name) {
      const proactiveMsg = getProactiveMessage();
      if (proactiveMsg) {
        const aiMessage = {
          id: Date.now(),
          text: proactiveMsg,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          hasVoice: true,
          personality: state.twin.personality
        };
        dispatch({ type: 'ADD_CHAT_MESSAGE', payload: aiMessage });
      }
    }
  }, [state.twin.name, state.chatMessages.length, getProactiveMessage, dispatch]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });
    const currentMessage = message;
    setMessage('');

    try {
      // Get AI response with enhanced context
      const context = {
        recentMood: state.mood.current,
        timeOfDay: new Date().getHours(),
        conversationLength: state.chatMessages.length,
        userInterests: state.user.interests,
        isVoiceReply: false,
        personality: state.twin.personality
      };

      const aiResponse = await generateResponse(currentMessage, context);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        hasVoice: true,
        personality: state.twin.personality
      };

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: aiMessage });

      // Add to memories
      dispatch({ 
        type: 'ADD_MEMORY', 
        payload: {
          type: 'conversation',
          content: currentMessage,
          aiResponse: aiResponse,
          timestamp: new Date().toISOString(),
          context: context
        }
      });

      console.log('💬 Enhanced AI Response generated');

    } catch (error) {
      console.error('❌ Error generating AI response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm having trouble thinking right now. Could you try again? 🤔",
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: errorMessage });
    }
  };

  const handleVoiceTranscript = (transcript) => {
    setMessage(transcript);
    console.log('🎤 Voice transcript received:', transcript);
  };

  const handleVoiceMessage = async (voiceData) => {
    // Add user voice message to chat
    const userMessage = {
      id: Date.now(),
      text: '[Voice Message]',
      sender: 'user',
      timestamp: new Date().toISOString(),
      voiceData: voiceData,
      isVoiceMessage: true
    };

    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });

    try {
      // Process voice message with AI
      const context = {
        recentMood: state.mood.current,
        isVoiceReply: true,
        voiceMessage: true,
        timeOfDay: new Date().getHours(),
        personality: state.twin.personality
      };

      const aiResponse = await generateResponse('User sent a voice message', context);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        hasVoice: true,
        personality: state.twin.personality
      };

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: aiMessage });

      console.log('🎙️ Voice message processed by enhanced AI');

    } catch (error) {
      console.error('❌ Error processing voice message:', error);
    }
  };

  const handleStartMeeting = () => {
    if (currentSubscription === 'free') {
      setSelectedPlan(stripeService.getPlan('premium'));
      setShowSubscriptionModal(true);
      return;
    }
    setShowMeetingModal(true);
  };

  const handleGetInsights = () => {
    const insights = getUserInsights();
    if (insights.length > 0) {
      const insightMessage = {
        id: Date.now(),
        text: `Here's what I've learned about you: ${insights.join(' ')} These patterns help me understand you better! 💡`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        type: 'insight',
        hasVoice: true,
        personality: state.twin.personality
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: insightMessage });
    }
  };

  const handleUpgrade = () => {
    setSelectedPlan(stripeService.getPlan('premium'));
    setShowSubscriptionModal(true);
  };

  const handleSubscriptionSuccess = (plan) => {
    setCurrentSubscription(plan.id);
    console.log('🎉 Subscription successful:', plan.name);
    
    // Add success message to chat
    const successMessage = {
      id: Date.now(),
      text: `🎉 Welcome to ${plan.name}! You now have access to all premium features including unlimited voice messages and meetings. Thank you for upgrading! ✨`,
      sender: 'ai',
      timestamp: new Date().toISOString(),
      hasVoice: true,
      personality: state.twin.personality,
      type: 'success'
    };
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: successMessage });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isFreePlan = currentSubscription === 'free';

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm p-4 shadow-sm"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                <FiHeart className="text-primary-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">
                {state.twin.name || 'Your Twin'}
              </h2>
              <p className="text-xs text-gray-500 flex items-center space-x-1">
                <span>Online</span>
                {isThinking && (
                  <>
                    <span>•</span>
                    <FiCpu className="animate-pulse" size={12} />
                    <span>Thinking</span>
                  </>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Upgrade button for free users */}
            {isFreePlan && (
              <motion.button
                onClick={handleUpgrade}
                className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiStar size={12} />
                <span>Upgrade</span>
              </motion.button>
            )}

            <motion.button
              onClick={handleGetInsights}
              className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Get AI Insights"
            >
              <FiZap size={18} />
            </motion.button>
            
            <motion.button
              onClick={handleStartMeeting}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Start Voice Meeting"
            >
              <FiPhone size={18} className="text-gray-600" />
            </motion.button>
            
            <motion.button
              onClick={handleStartMeeting}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Start Video Meeting"
            >
              <FiVideo size={18} className="text-gray-600" />
            </motion.button>
            
            <motion.button
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiMoreVertical size={18} className="text-gray-600" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-md mx-auto w-full">
        <AnimatePresence>
          {state.chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`max-w-xs lg:max-w-md ${
                msg.sender === 'user' ? 'ml-auto' : 'mr-auto'
              }`}>
                {/* Message Bubble */}
                <div className={`px-4 py-2 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                    : msg.type === 'insight'
                    ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border-2 border-purple-200'
                    : msg.type === 'success'
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-200'
                    : 'bg-white/80 backdrop-blur-sm text-gray-800 shadow-sm'
                }`}>
                  {msg.type === 'insight' && (
                    <div className="flex items-center space-x-1 mb-1">
                      <FiCpu size={14} className="text-purple-600" />
                      <span className="text-xs font-medium text-purple-600">AI Insights</span>
                    </div>
                  )}

                  {msg.type === 'success' && (
                    <div className="flex items-center space-x-1 mb-1">
                      <FiStar size={14} className="text-green-600" />
                      <span className="text-xs font-medium text-green-600">Premium Activated</span>
                    </div>
                  )}
                  
                  {!msg.isVoiceMessage && (
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  )}
                  
                  <p className={`text-xs mt-1 ${
                    msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>

                {/* Enhanced Voice Message Component */}
                {(msg.hasVoice || msg.isVoiceMessage) && (
                  <div className="mt-2">
                    <VoiceMessageComponent
                      message={msg.text}
                      personality={msg.personality || state.twin.personality}
                      isAIMessage={msg.sender === 'ai'}
                      onVoiceMessage={msg.sender === 'user' ? null : handleVoiceMessage}
                      onTranscript={handleVoiceTranscript}
                      disabled={isThinking}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* AI Thinking Indicator */}
        {isThinking && <AIThinking />}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm p-4 border-t border-white/20"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="max-w-md mx-auto space-y-3">
          {/* Usage Indicator for Free Users */}
          {isFreePlan && (
            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="text-yellow-700">
                  🎤 Voice features limited on free plan
                </span>
                <button 
                  onClick={handleUpgrade}
                  className="text-yellow-600 font-medium hover:underline"
                >
                  Upgrade
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Voice Input Component */}
          <VoiceMessageComponent
            onTranscript={handleVoiceTranscript}
            onVoiceMessage={handleVoiceMessage}
            personality={state.twin.personality}
            disabled={isThinking}
          />

          {/* Text Input */}
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isThinking && handleSendMessage()}
                placeholder={isThinking ? "AI is thinking..." : "Type your message..."}
                disabled={isThinking}
                className="w-full px-4 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              />
            </div>
            
            <motion.button
              onClick={handleSendMessage}
              disabled={!message.trim() || isThinking}
              className={`p-3 rounded-2xl ${
                message.trim() && !isThinking
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
              whileHover={{ scale: (message.trim() && !isThinking) ? 1.05 : 1 }}
              whileTap={{ scale: (message.trim() && !isThinking) ? 0.95 : 1 }}
            >
              <FiSend size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <VoiceMeetingModal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
        twinName={state.twin.name || 'Your Twin'}
        personality={state.twin.personality}
      />

      <SubscriptionCheckout
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        selectedPlan={selectedPlan}
        onSuccess={handleSubscriptionSuccess}
      />
    </div>
  );
};

export default ChatPage;