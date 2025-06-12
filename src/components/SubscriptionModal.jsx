import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiCheck, 
  FiStar, 
  FiZap, 
  FiHeart,
  FiMic,
  FiVideo,
  FiAward
} from 'react-icons/fi';
import { subscriptionService } from '../services/subscriptionService';

const SubscriptionModal = ({ isOpen, onClose, feature }) => {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const plans = subscriptionService.getPricingInfo();

  const handleSubscribe = async (planId) => {
    setIsProcessing(true);
    
    try {
      const result = await subscriptionService.subscribe(planId);
      
      if (result.success) {
        onClose();
        // Show success message
      } else {
        // Show error message
        console.error('Subscription failed:', result.error);
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getPlanIcon = (planId) => {
    const icons = {
      free: FiHeart,
      premium: FiStar,
      ultimate: FiAward
    };
    return icons[planId] || FiHeart;
  };

  const getPlanColor = (planId) => {
    const colors = {
      free: 'from-gray-400 to-gray-600',
      premium: 'from-purple-500 to-pink-500',
      ultimate: 'from-yellow-400 to-orange-500'
    };
    return colors[planId] || 'from-gray-400 to-gray-600';
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
          className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Unlock Premium Features
              </h2>
              {feature && (
                <p className="text-gray-600 mt-1">
                  {feature} is available with a premium subscription
                </p>
              )}
            </div>
            <motion.button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX size={24} className="text-gray-600" />
            </motion.button>
          </div>

          {/* Plans Grid */}
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const IconComponent = getPlanIcon(plan.id);
                const isPopular = plan.id === 'premium';
                const isBestValue = plan.id === 'ultimate';
                
                return (
                  <motion.div
                    key={plan.id}
                    className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                      selectedPlan === plan.id 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    } ${plan.id === 'free' ? 'opacity-75' : ''}`}
                    onClick={() => setSelectedPlan(plan.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Popular Badge */}
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Most Popular
                        </div>
                      </div>
                    )}

                    {/* Best Value Badge */}
                    {isBestValue && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Best Value
                        </div>
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${getPlanColor(plan.id)} flex items-center justify-center`}>
                        <IconComponent className="text-white text-2xl" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {plan.name}
                      </h3>
                      
                      <div className="text-3xl font-bold text-gray-800">
                        ${plan.price}
                        {plan.price > 0 && <span className="text-sm text-gray-600">/month</span>}
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <FiCheck className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    {plan.id === 'free' ? (
                      <div className="text-center text-sm text-gray-500">
                        Current Plan
                      </div>
                    ) : (
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubscribe(plan.id);
                        }}
                        disabled={isProcessing}
                        className={`w-full py-3 rounded-xl font-medium transition-colors ${
                          selectedPlan === plan.id
                            ? `bg-gradient-to-r ${getPlanColor(plan.id)} text-white`
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } disabled:opacity-50`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isProcessing ? 'Processing...' : `Choose ${plan.name}`}
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Feature Highlights */}
            <div className="mt-12 grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiMic className="text-blue-600 text-2xl" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Voice Messages</h4>
                <p className="text-gray-600 text-sm">
                  Get unlimited AI voice responses that sound natural and personal
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <FiVideo className="text-purple-600 text-2xl" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Live Meetings</h4>
                <p className="text-gray-600 text-sm">
                  Have real-time voice and video conversations with your AI twin
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                  <FiZap className="text-pink-600 text-2xl" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Advanced AI</h4>
                <p className="text-gray-600 text-sm">
                  Enhanced memory, personality, and emotional intelligence
                </p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl text-center">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <FiCheck className="text-green-500" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FiCheck className="text-green-500" />
                  <span>Secure payments</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FiCheck className="text-green-500" />
                  <span>No hidden fees</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubscriptionModal;