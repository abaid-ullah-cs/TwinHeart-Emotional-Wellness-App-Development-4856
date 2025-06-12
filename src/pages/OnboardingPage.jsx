import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    preferredTwinType: 'sibling',
    interests: [],
    twinName: '',
    twinPersonality: 'caring'
  });

  const steps = [
    {
      title: "Welcome to TwinHeart",
      subtitle: "Your AI companion for emotional wellness",
      component: WelcomeStep
    },
    {
      title: "Tell us about yourself",
      subtitle: "Help us personalize your experience",
      component: PersonalInfoStep
    },
    {
      title: "Choose your twin",
      subtitle: "What kind of companion would you like?",
      component: TwinTypeStep
    },
    {
      title: "Customize your twin",
      subtitle: "Give your AI companion a personality",
      component: TwinCustomizationStep
    },
    {
      title: "You're all set!",
      subtitle: "Your TwinHeart companion is ready",
      component: CompletionStep
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      dispatch({ type: 'SET_USER_DATA', payload: formData });
      dispatch({ type: 'SET_TWIN_DATA', payload: {
        name: formData.twinName,
        personality: formData.twinPersonality,
        relationship: formData.preferredTwinType
      }});
      dispatch({ type: 'COMPLETE_ONBOARDING' });
      navigate('/');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="p-6 text-center">
        <motion.div
          className="flex items-center justify-center mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-full">
            <FiHeart className="text-white text-2xl" />
          </div>
        </motion.div>
        
        <motion.h1
          className="text-2xl font-bold text-gray-800 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {steps[currentStep].title}
        </motion.h1>
        
        <motion.p
          className="text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {steps[currentStep].subtitle}
        </motion.p>
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-6">
        <div className="bg-white/50 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2 text-center">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      {/* Step Content */}
      <div className="flex-1 px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentStepComponent 
              formData={formData} 
              setFormData={setFormData} 
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-6 flex justify-between">
        {currentStep > 0 && (
          <motion.button
            onClick={handleBack}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiArrowLeft />
            <span>Back</span>
          </motion.button>
        )}
        
        <motion.button
          onClick={handleNext}
          className="ml-auto flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-xl font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}</span>
          <FiArrowRight />
        </motion.button>
      </div>
    </div>
  );
};

// Step Components
function WelcomeStep() {
  return (
    <div className="text-center space-y-6">
      <motion.div
        className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <FiHeart className="text-6xl text-primary-600" />
      </motion.div>
      
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          TwinHeart creates a personalized AI companion that understands you like family. 
          Your twin will be there for you, remember your conversations, and help you maintain 
          emotional wellness.
        </p>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          {[
            "24/7 Emotional Support",
            "Personalized Conversations", 
            "Mood Tracking",
            "Wellness Reminders"
          ].map((feature, index) => (
            <motion.div
              key={feature}
              className="bg-white/60 p-3 rounded-lg text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              {feature}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PersonalInfoStep({ formData, setFormData }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What's your name?
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter your name"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What's your age?
        </label>
        <input
          type="number"
          value={formData.age}
          onChange={(e) => setFormData({...formData, age: e.target.value})}
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter your age"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What are your interests? (Select all that apply)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['Music', 'Movies', 'Books', 'Sports', 'Travel', 'Cooking', 'Art', 'Gaming'].map(interest => (
            <motion.button
              key={interest}
              onClick={() => {
                const interests = formData.interests.includes(interest)
                  ? formData.interests.filter(i => i !== interest)
                  : [...formData.interests, interest];
                setFormData({...formData, interests});
              }}
              className={`p-3 rounded-xl border-2 transition-colors ${
                formData.interests.includes(interest)
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {interest}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TwinTypeStep({ formData, setFormData }) {
  const twinTypes = [
    { id: 'sibling', name: 'Sibling', description: 'Like a caring brother or sister' },
    { id: 'parent', name: 'Parent', description: 'Like a wise mother or father' },
    { id: 'grandparent', name: 'Grandparent', description: 'Like a loving grandparent' },
    { id: 'friend', name: 'Best Friend', description: 'Like your closest friend' },
    { id: 'partner', name: 'Partner', description: 'Like a supportive romantic partner' }
  ];

  return (
    <div className="space-y-4">
      {twinTypes.map(type => (
        <motion.button
          key={type.id}
          onClick={() => setFormData({...formData, preferredTwinType: type.id})}
          className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
            formData.preferredTwinType === type.id
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 bg-white hover:bg-gray-50'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <h3 className="font-medium text-gray-800">{type.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{type.description}</p>
        </motion.button>
      ))}
    </div>
  );
}

function TwinCustomizationStep({ formData, setFormData }) {
  const personalities = [
    { id: 'caring', name: 'Caring & Nurturing', emoji: '🤗' },
    { id: 'playful', name: 'Playful & Fun', emoji: '😄' },
    { id: 'wise', name: 'Wise & Thoughtful', emoji: '🤔' },
    { id: 'energetic', name: 'Energetic & Motivating', emoji: '⚡' },
    { id: 'calm', name: 'Calm & Peaceful', emoji: '😌' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What should we call your twin?
        </label>
        <input
          type="text"
          value={formData.twinName}
          onChange={(e) => setFormData({...formData, twinName: e.target.value})}
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Choose a name for your AI twin"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What personality should your twin have?
        </label>
        <div className="space-y-3">
          {personalities.map(personality => (
            <motion.button
              key={personality.id}
              onClick={() => setFormData({...formData, twinPersonality: personality.id})}
              className={`w-full p-3 rounded-xl border-2 text-left transition-colors ${
                formData.twinPersonality === personality.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{personality.emoji}</span>
                <span className="font-medium text-gray-800">{personality.name}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompletionStep({ formData }) {
  return (
    <div className="text-center space-y-6">
      <motion.div
        className="w-24 h-24 mx-auto bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 360]
        }}
        transition={{ duration: 2 }}
      >
        <span className="text-4xl">🎉</span>
      </motion.div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Meet {formData.twinName || 'Your Twin'}!
        </h2>
        
        <p className="text-gray-600 leading-relaxed">
          Your AI companion is ready to chat with you. {formData.twinName || 'Your twin'} will 
          remember your conversations, learn about your preferences, and be there whenever you need support.
        </p>
        
        <div className="bg-white/60 p-4 rounded-xl">
          <h3 className="font-medium text-gray-800 mb-2">Your Twin Profile:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Name: {formData.twinName || 'Not set'}</p>
            <p>Relationship: {formData.preferredTwinType}</p>
            <p>Personality: {formData.twinPersonality}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;