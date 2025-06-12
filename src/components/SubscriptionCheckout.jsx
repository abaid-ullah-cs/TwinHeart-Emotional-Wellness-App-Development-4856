import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiCheck, 
  FiStar, 
  FiZap, 
  FiCreditCard,
  FiShield,
  FiArrowRight,
  FiLoader
} from 'react-icons/fi';
import { stripeService } from '../services/stripeService';

const SubscriptionCheckout = ({ isOpen, onClose, selectedPlan, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Plan, 2: Payment, 3: Success
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleProceedToPayment = () => {
    setCurrentStep(2);
  };

  const handleCompleteSubscription = async () => {
    setIsProcessing(true);

    try {
      // Create checkout session
      const session = await stripeService.createCheckoutSession(
        selectedPlan.id,
        'user_123', // Replace with actual user ID
        `${window.location.origin}/#/subscription-success`,
        `${window.location.origin}/#/subscription-cancelled`
      );

      if (session.success) {
        // Redirect to Stripe Checkout
        const result = await stripeService.redirectToCheckout(session.sessionId);
        
        if (result.success) {
          setCurrentStep(3);
          setTimeout(() => {
            onSuccess?.(selectedPlan);
            onClose();
          }, 2000);
        }
      }
    } catch (error) {
      console.error('❌ Subscription failed:', error);
      alert('Subscription failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !selectedPlan) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between rounded-t-3xl">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {currentStep === 1 && 'Confirm Plan'}
                {currentStep === 2 && 'Payment Details'}
                {currentStep === 3 && 'Welcome!'}
              </h2>
              <p className="text-gray-600 mt-1">
                {currentStep === 1 && 'Review your subscription details'}
                {currentStep === 2 && 'Secure payment processing'}
                {currentStep === 3 && 'Your subscription is active'}
              </p>
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

          {/* Step 1: Plan Confirmation */}
          {currentStep === 1 && (
            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    {selectedPlan.id === 'ultimate' ? (
                      <FiZap className="text-white text-2xl" />
                    ) : (
                      <FiStar className="text-white text-2xl" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {selectedPlan.name}
                    </h3>
                    <p className="text-3xl font-bold text-purple-600">
                      {stripeService.formatPrice(selectedPlan.price)}
                      <span className="text-lg text-gray-600">/month</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <FiCheck className="text-green-500 flex-shrink-0" size={16} />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <FiShield className="text-blue-600" size={20} />
                  <span className="font-semibold text-blue-800">30-Day Money-Back Guarantee</span>
                </div>
                <p className="text-blue-700 text-sm">
                  Try risk-free! If you're not completely satisfied, get a full refund within 30 days.
                </p>
              </div>

              <motion.button
                onClick={handleProceedToPayment}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Continue to Payment</span>
                <FiArrowRight size={20} />
              </motion.button>
            </div>
          )}

          {/* Step 2: Payment */}
          {currentStep === 2 && (
            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{selectedPlan.name}</span>
                    <span className="font-semibold">{stripeService.formatPrice(selectedPlan.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Billing cycle</span>
                    <span>Monthly</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{stripeService.formatPrice(selectedPlan.price)}/month</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Payment Method</h4>
                <div className="space-y-3">
                  <motion.div
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'card' 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-3">
                      <FiCreditCard className="text-purple-600" size={20} />
                      <div>
                        <div className="font-medium text-gray-800">Credit or Debit Card</div>
                        <div className="text-sm text-gray-600">Visa, Mastercard, American Express</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <FiShield className="text-green-600" size={16} />
                  <span className="font-medium text-green-800">Secure Payment</span>
                </div>
                <p className="text-green-700 text-sm">
                  Your payment information is encrypted and secure. We use Stripe for payment processing.
                </p>
              </div>

              <motion.button
                onClick={handleCompleteSubscription}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                whileTap={{ scale: isProcessing ? 1 : 0.98 }}
              >
                {isProcessing ? (
                  <>
                    <FiLoader className="animate-spin" size={20} />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FiShield size={20} />
                    <span>Complete Secure Payment</span>
                  </>
                )}
              </motion.button>
            </div>
          )}

          {/* Step 3: Success */}
          {currentStep === 3 && (
            <div className="p-6 text-center space-y-6">
              <motion.div
                className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
              >
                <FiCheck className="text-white text-3xl" />
              </motion.div>

              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Welcome to {selectedPlan.name}!
                </h3>
                <p className="text-gray-600">
                  Your subscription is now active. Enjoy all the premium features!
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                <h4 className="font-semibold text-purple-800 mb-2">What's Next?</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Start unlimited voice conversations</li>
                  <li>• Access advanced AI personalities</li>
                  <li>• Enjoy premium features immediately</li>
                  <li>• Check your email for confirmation</li>
                </ul>
              </div>

              <motion.button
                onClick={() => {
                  onSuccess?.(selectedPlan);
                  onClose();
                }}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Using Premium Features
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubscriptionCheckout;