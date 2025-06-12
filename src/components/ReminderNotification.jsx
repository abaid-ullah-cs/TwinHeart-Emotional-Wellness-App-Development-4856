import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDroplet, FiMoon, FiHeart, FiSun, FiSmile } from 'react-icons/fi';

const ReminderNotification = ({ reminder, onDismiss, onAction }) => {
  const getIcon = (type) => {
    const icons = {
      hydration: FiDroplet,
      sleep: FiMoon,
      selfCare: FiHeart,
      checkIn: FiSmile,
      general: FiSun
    };
    return icons[type] || FiSun;
  };

  const getColor = (type) => {
    const colors = {
      hydration: 'from-blue-400 to-blue-600',
      sleep: 'from-indigo-400 to-purple-600',
      selfCare: 'from-pink-400 to-rose-600',
      checkIn: 'from-green-400 to-emerald-600',
      general: 'from-yellow-400 to-orange-600'
    };
    return colors[type] || 'from-gray-400 to-gray-600';
  };

  const IconComponent = getIcon(reminder.type);
  const colorClass = getColor(reminder.type);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto"
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className={`h-1 bg-gradient-to-r ${colorClass}`} />
          
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-xl bg-gradient-to-r ${colorClass} flex-shrink-0`}>
                <IconComponent className="text-white" size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {reminder.type === 'hydration' && 'Hydration Reminder'}
                      {reminder.type === 'sleep' && 'Sleep Reminder'}
                      {reminder.type === 'selfCare' && 'Self-Care Time'}
                      {reminder.type === 'checkIn' && 'Mood Check-in'}
                      {reminder.type === 'general' && 'Reminder'}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                      {reminder.message}
                    </p>
                  </div>
                  
                  <motion.button
                    onClick={() => onDismiss(reminder.id)}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiX size={18} />
                  </motion.button>
                </div>
                
                {/* Action buttons */}
                <div className="flex space-x-2 mt-3">
                  {reminder.type === 'checkIn' && (
                    <motion.button
                      onClick={() => onAction('mood-check')}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Check Mood
                    </motion.button>
                  )}
                  
                  {reminder.type === 'hydration' && (
                    <motion.button
                      onClick={() => onAction('hydration-done')}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Done ✓
                    </motion.button>
                  )}
                  
                  <motion.button
                    onClick={() => onAction('snooze')}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Remind Later
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReminderNotification;