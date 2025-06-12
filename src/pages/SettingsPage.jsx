import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSettings, 
  FiBell, 
  FiMoon, 
  FiSun,
  FiDroplet,
  FiHeart,
  FiClock,
  FiVolume2,
  FiSmartphone,
  FiTrash2,
  FiDownload,
  FiShield,
  FiToggleLeft,
  FiToggleRight,
  FiSave
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { useReminderSystem } from '../hooks/useReminderSystem';

const SettingsPage = () => {
  const { state, dispatch } = useApp();
  const [localSettings, setLocalSettings] = useState(state.user.reminderSettings);
  const [localSchedule, setLocalSchedule] = useState(state.user.sleepSchedule);
  const [hasChanges, setHasChanges] = useState(false);
  
  const { updatePreferences, getStats } = useReminderSystem(state.user);

  useEffect(() => {
    // Check if there are unsaved changes
    const settingsChanged = JSON.stringify(localSettings) !== JSON.stringify(state.user.reminderSettings);
    const scheduleChanged = JSON.stringify(localSchedule) !== JSON.stringify(state.user.sleepSchedule);
    setHasChanges(settingsChanged || scheduleChanged);
  }, [localSettings, localSchedule, state.user]);

  const handleReminderToggle = (type) => {
    setLocalSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSleepScheduleChange = (field, value) => {
    setLocalSchedule(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSettings = () => {
    // Update app state
    dispatch({ 
      type: 'SET_USER_DATA', 
      payload: { 
        reminderSettings: localSettings,
        sleepSchedule: localSchedule
      }
    });

    // Update reminder system
    updatePreferences({
      reminderSettings: localSettings,
      sleepSchedule: localSchedule
    });

    setHasChanges(false);
  };

  const resetSettings = () => {
    setLocalSettings(state.user.reminderSettings);
    setLocalSchedule(state.user.sleepSchedule);
    setHasChanges(false);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.removeItem('twinHeartData');
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `twinheart-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reminderTypes = [
    {
      id: 'hydration',
      title: 'Hydration Reminders',
      description: 'Get reminded to drink water every 2 hours',
      icon: FiDroplet,
      color: 'text-blue-600',
      schedule: 'Every 2 hours during awake time'
    },
    {
      id: 'sleep',
      title: 'Sleep Reminders',
      description: 'Wind down and bedtime notifications',
      icon: FiMoon,
      color: 'text-indigo-600',
      schedule: 'Based on your sleep schedule'
    },
    {
      id: 'selfCare',
      title: 'Self-Care Reminders',
      description: 'Take breaks and practice mindfulness',
      icon: FiHeart,
      color: 'text-pink-600',
      schedule: '3 times daily'
    },
    {
      id: 'checkIn',
      title: 'Mood Check-ins',
      description: 'Regular emotional wellness prompts',
      icon: FiSun,
      color: 'text-yellow-600',
      schedule: '3 times daily'
    }
  ];

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="text-center pt-8 pb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-gray-500 to-gray-700 p-3 rounded-full">
              <FiSettings className="text-white text-2xl" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Settings
          </h1>
          
          <p className="text-gray-600">
            Customize your TwinHeart experience
          </p>
        </motion.div>

        {/* Save Changes Bar */}
        {hasChanges && (
          <motion.div
            className="bg-yellow-100 border border-yellow-300 rounded-xl p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-800 font-medium">You have unsaved changes</p>
                <p className="text-yellow-700 text-sm">Save to apply your new settings</p>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  onClick={resetSettings}
                  className="px-3 py-1 text-yellow-700 hover:text-yellow-800 text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reset
                </motion.button>
                <motion.button
                  onClick={saveSettings}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium flex items-center space-x-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiSave size={14} />
                  <span>Save</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Reminder Settings */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 mb-6">
            <FiBell className="text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-800">Wellness Reminders</h2>
          </div>

          <div className="space-y-6">
            {reminderTypes.map((reminder, index) => (
              <motion.div
                key={reminder.id}
                className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-1">
                      <reminder.icon className={`${reminder.color} text-xl`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{reminder.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                      <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                        <FiClock size={12} />
                        <span>{reminder.schedule}</span>
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => handleReminderToggle(reminder.id)}
                    className="ml-4 mt-1"
                    whileTap={{ scale: 0.95 }}
                  >
                    {localSettings[reminder.id] ? (
                      <FiToggleRight className="text-primary-500 text-2xl" />
                    ) : (
                      <FiToggleLeft className="text-gray-300 text-2xl" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sleep Schedule */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <FiClock className="text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-800">Sleep Schedule</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedtime
              </label>
              <input
                type="time"
                value={localSchedule.bedtime}
                onChange={(e) => handleSleepScheduleChange('bedtime', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wake up
              </label>
              <input
                type="time"
                value={localSchedule.wakeup}
                onChange={(e) => handleSleepScheduleChange('wakeup', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 Your sleep reminders will be automatically scheduled based on these times
            </p>
          </div>
        </motion.div>

        {/* Reminder Statistics */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Reminder Statistics</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-700">{stats.active}</div>
              <div className="text-xs text-blue-600">Active Reminders</div>
            </div>
            
            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-2xl font-bold text-green-700">{stats.total}</div>
              <div className="text-xs text-green-600">Total Configured</div>
            </div>
          </div>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <FiVolume2 className="text-green-600" />
            <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <FiVolume2 className="text-green-600" />
                <span className="font-medium text-gray-800">Sound</span>
              </div>
              <FiToggleRight className="text-primary-500 text-2xl" />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <FiSmartphone className="text-purple-600" />
                <span className="font-medium text-gray-800">Push Notifications</span>
              </div>
              <FiToggleLeft className="text-gray-300 text-2xl" />
            </div>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <FiShield className="text-red-600" />
            <h2 className="text-lg font-semibold text-gray-800">Data Management</h2>
          </div>

          <div className="space-y-3">
            <motion.button
              onClick={handleExportData}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiDownload />
              <span>Export My Data</span>
            </motion.button>

            <motion.button
              onClick={handleClearData}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiTrash2 />
              <span>Clear All Data</span>
            </motion.button>
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-gray-800">TwinHeart</h3>
            <p className="text-sm text-gray-600">Version 2.0.0</p>
            <p className="text-xs text-gray-500">
              Your intelligent AI companion for emotional wellness
            </p>
            <div className="pt-2">
              <p className="text-xs text-gray-400">
                Built with ❤️ for your mental health
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;