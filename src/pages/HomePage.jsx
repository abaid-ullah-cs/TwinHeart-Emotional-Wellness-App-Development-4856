import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHeart, 
  FiMessageCircle, 
  FiSmile, 
  FiClock, 
  FiBell, 
  FiDroplet, 
  FiMoon, 
  FiSun, 
  FiVideo, 
  FiMic, 
  FiStar, 
  FiZap,
  FiUsers
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { useReminderSystem } from '../hooks/useReminderSystem';
import { subscriptionService } from '../services/subscriptionService';
import { format } from 'date-fns';
import ReminderNotification from '../components/ReminderNotification';
import SubscriptionModal from '../components/SubscriptionModal';
import VoiceMeetingModal from '../components/VoiceMeetingModal';

const HomePage = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  // Initialize reminder system
  const { activeReminders, pendingNotifications, dismissNotification, getStats } = useReminderSystem(state.user);

  // Get subscription status
  const subscriptionStatus = subscriptionService.getSubscriptionStatus();
  const isFreePlan = subscriptionStatus.plan.id === 'free';
  const upgradeSuggestions = subscriptionService.getUpgradeSuggestions();

  useEffect(() => {
    // Redirect to onboarding if not completed
    if (!state.isOnboarded) {
      window.location.hash = '/onboarding';
      return;
    }

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    return () => clearInterval(timer);
  }, [state.isOnboarded]);

  const handleNotificationAction = (action) => {
    switch (action) {
      case 'mood-check':
        navigate('/mood');
        break;
      case 'hydration-done':
        // Could track hydration completion
        break;
      case 'snooze':
        // Could implement snooze functionality
        break;
      default:
        break;
    }
  };

  const handleQuickMeeting = () => {
    if (!subscriptionService.canUseFeature('meetingMinutes', 1)) {
      setShowSubscriptionModal(true);
      return;
    }
    setShowMeetingModal(true);
  };

  const quickActions = [
    {
      id: 'chat',
      title: 'Chat with Twin',
      description: 'Talk to your AI companion',
      icon: FiMessageCircle,
      color: 'from-blue-400 to-blue-600',
      path: '/chat',
      isPremium: false
    },
    {
      id: 'breaking-silence',
      title: 'Breaking the Silence',
      description: 'Share your unspoken words',
      icon: FiUsers,
      color: 'from-purple-400 to-pink-500',
      path: '/breaking-silence',
      isPremium: false
    },
    {
      id: 'voice-meeting',
      title: 'Voice Meeting',
      description: 'Live conversation with AI',
      icon: FiMic,
      color: 'from-green-400 to-green-600',
      action: handleQuickMeeting,
      isPremium: true
    },
    {
      id: 'mood',
      title: 'Mood Check-in',
      description: 'How are you feeling?',
      icon: FiHeart,
      color: 'from-pink-400 to-pink-600',
      path: '/mood',
      isPremium: false
    }
  ];

  const getReminderIcon = (type) => {
    const icons = {
      hydration: FiDroplet,
      sleep: FiMoon,
      selfCare: FiHeart,
      checkIn: FiSun
    };
    return icons[type] || FiSun;
  };

  if (!state.isOnboarded) {
    return null; // Will redirect to onboarding
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 pb-20 relative">
      {/* Render pending notifications */}
      {pendingNotifications.map((notification) => (
        <ReminderNotification
          key={notification.id}
          reminder={notification}
          onDismiss={dismissNotification}
          onAction={handleNotificationAction}
        />
      ))}

      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="text-center pt-8 pb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-full">
              <FiHeart className="text-white text-2xl" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {greeting}, {state.user.name || 'Friend'}!
          </h1>
          <p className="text-gray-600">
            {format(currentTime, 'EEEE, MMMM do')}
          </p>
        </motion.div>

        {/* Upgrade Banner for Free Users */}
        {isFreePlan && upgradeSuggestions.length > 0 && (
          <motion.div
            className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 text-white"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FiStar className="text-2xl" />
                <div>
                  <h3 className="font-semibold">Unlock Premium Features</h3>
                  <p className="text-sm opacity-90">Voice meetings, unlimited messages & more</p>
                </div>
              </div>
              <motion.button
                onClick={() => setShowSubscriptionModal(true)}
                className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Upgrade
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Twin Status Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
              <FiSmile className="text-2xl text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">
                {state.twin.name || 'Your Twin'} is here for you
              </h3>
              <p className="text-sm text-gray-600">
                Ready to chat • AI-powered emotional support
              </p>
            </div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>

          {/* Subscription Status */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {subscriptionStatus.plan.id === 'ultimate' ? (
                  <FiZap className="text-yellow-500" />
                ) : subscriptionStatus.plan.id === 'premium' ? (
                  <FiStar className="text-purple-500" />
                ) : (
                  <FiHeart className="text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {subscriptionStatus.plan.name}
                </span>
              </div>
              {isFreePlan && (
                <motion.button
                  onClick={() => setShowSubscriptionModal(true)}
                  className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Upgrade
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 px-2">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                {action.path ? (
                  <Link to={action.path}>
                    <ActionCard action={action} isFreePlan={isFreePlan} />
                  </Link>
                ) : (
                  <div onClick={action.action}>
                    <ActionCard action={action} isFreePlan={isFreePlan} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Breaking the Silence Feature Highlight */}
        <motion.div
          className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 shadow-lg border border-purple-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <FiUsers className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-800">Breaking the Silence</h3>
              <p className="text-sm text-purple-600">Share your unspoken words</p>
            </div>
          </div>
          
          <p className="text-purple-700 text-sm mb-4 leading-relaxed">
            "To the stranger who smiled when I was crying..." - Your unspoken words matter. 
            Join our community and share what you've always wanted to say.
          </p>
          
          <Link to="/breaking-silence">
            <motion.button
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Share Your Heart 💝
            </motion.button>
          </Link>
        </motion.div>

        {/* Usage Stats for Premium Users */}
        {!isFreePlan && (
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="font-semibold text-gray-800 mb-4">Today's Activity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {subscriptionService.usage.voiceMessages}
                </div>
                <div className="text-xs text-gray-600">Voice Messages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.floor(subscriptionService.usage.meetingMinutes)}
                </div>
                <div className="text-xs text-gray-600">Meeting Minutes</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Active Reminders */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 px-2">Today's Wellness Plan</h2>
          <div className="space-y-3">
            {activeReminders.slice(0, 4).map((reminder, index) => {
              const IconComponent = getReminderIcon(reminder.type);
              return (
                <motion.div
                  key={reminder.id}
                  className="bg-white/60 backdrop-blur-sm rounded-xl p-3 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="text-gray-600" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {reminder.message.split('.')[0]}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <FiClock size={12} />
                      <span>{reminder.time}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {activeReminders.length === 0 && (
              <motion.div
                className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <FiBell className="mx-auto text-3xl text-gray-400 mb-2" />
                <p className="text-gray-600">No reminders set up yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Visit settings to configure wellness reminders
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mood Summary */}
        {state.mood.current && (
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="text-center">
              <h3 className="font-semibold text-gray-800 mb-2">Current Mood</h3>
              <div className="text-4xl mb-2">
                {state.mood.current === 'happy' && '😊'}
                {state.mood.current === 'sad' && '😢'}
                {state.mood.current === 'excited' && '🤩'}
                {state.mood.current === 'anxious' && '😰'}
                {state.mood.current === 'calm' && '😌'}
                {state.mood.current === 'neutral' && '😐'}
                {state.mood.current === 'amazing' && '🤩'}
                {state.mood.current === 'good' && '🙂'}
                {state.mood.current === 'low' && '😔'}
              </div>
              <p className="text-sm text-gray-600 capitalize">{state.mood.current}</p>
              {state.mood.lastCheckIn && (
                <p className="text-xs text-gray-500 mt-1">
                  Last updated: {format(new Date(state.mood.lastCheckIn), 'h:mm a')}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />

      <VoiceMeetingModal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
        twinName={state.twin.name || 'Your Twin'}
        personality={state.twin.personality}
      />
    </div>
  );
};

// Action Card Component
const ActionCard = ({ action, isFreePlan }) => (
  <motion.div
    className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg cursor-pointer relative ${
      action.isPremium && isFreePlan ? 'opacity-75' : ''
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {action.isPremium && isFreePlan && (
      <div className="absolute top-2 right-2">
        <FiStar className="text-yellow-500" size={16} />
      </div>
    )}

    <div className="flex flex-col items-center text-center space-y-3">
      <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center`}>
        <action.icon className="text-white text-xl" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 text-sm">{action.title}</h3>
        <p className="text-xs text-gray-600 mt-1">{action.description}</p>
        {action.isPremium && isFreePlan && (
          <p className="text-xs text-yellow-600 mt-1 font-medium">Premium</p>
        )}
      </div>
    </div>
  </motion.div>
);

export default HomePage;