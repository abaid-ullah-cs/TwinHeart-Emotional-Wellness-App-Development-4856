import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiCalendar, FiHeart, FiEdit3 } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { format, subDays, isToday, parseISO } from 'date-fns';

const MoodTracker = () => {
  const { state, dispatch } = useApp();
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodNote, setMoodNote] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const moods = [
    { id: 'amazing', emoji: '🤩', label: 'Amazing', color: 'from-yellow-400 to-orange-400' },
    { id: 'happy', emoji: '😊', label: 'Happy', color: 'from-green-400 to-blue-400' },
    { id: 'good', emoji: '🙂', label: 'Good', color: 'from-blue-400 to-indigo-400' },
    { id: 'neutral', emoji: '😐', label: 'Neutral', color: 'from-gray-400 to-gray-500' },
    { id: 'low', emoji: '😔', label: 'Low', color: 'from-blue-400 to-purple-400' },
    { id: 'anxious', emoji: '😰', label: 'Anxious', color: 'from-orange-400 to-red-400' },
    { id: 'sad', emoji: '😢', label: 'Sad', color: 'from-indigo-400 to-purple-400' }
  ];

  const handleMoodSubmit = () => {
    if (!selectedMood) return;

    dispatch({ 
      type: 'SET_MOOD', 
      payload: selectedMood 
    });

    if (moodNote.trim()) {
      dispatch({
        type: 'ADD_MEMORY',
        payload: {
          type: 'mood_note',
          content: moodNote,
          mood: selectedMood,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Reset form
    setSelectedMood(null);
    setMoodNote('');
  };

  const getMoodStats = () => {
    const recentMoods = state.mood.history.slice(-7);
    if (recentMoods.length === 0) return null;

    const moodCounts = {};
    recentMoods.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    const mostCommon = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );

    return {
      mostCommon,
      totalEntries: recentMoods.length,
      streak: calculateStreak()
    };
  };

  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = subDays(today, i);
      const hasEntry = state.mood.history.some(entry => 
        isToday(parseISO(entry.timestamp))
      );
      
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const stats = getMoodStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="text-center pt-8 pb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full">
              <FiHeart className="text-white text-2xl" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            How are you feeling?
          </h1>
          
          <p className="text-gray-600">
            Track your emotional wellness journey
          </p>
        </motion.div>

        {/* Current Mood Selection */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Today's Mood</h2>
          
          <div className="grid grid-cols-4 gap-3 mb-4">
            {moods.map((mood, index) => (
              <motion.button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  selectedMood === mood.id
                    ? 'border-primary-500 bg-primary-50 scale-105'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <div className="text-2xl mb-1">{mood.emoji}</div>
                <div className="text-xs font-medium text-gray-700">{mood.label}</div>
              </motion.button>
            ))}
          </div>

          {/* Mood Note */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Add a note (optional)
            </label>
            <textarea
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              placeholder="What's on your mind today?"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            onClick={handleMoodSubmit}
            disabled={!selectedMood}
            className={`w-full mt-4 py-3 rounded-xl font-medium transition-colors ${
              selectedMood
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={{ scale: selectedMood ? 1.02 : 1 }}
            whileTap={{ scale: selectedMood ? 0.98 : 1 }}
          >
            Save Mood Entry
          </motion.button>
        </motion.div>

        {/* Stats Card */}
        {stats && (
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Your Progress</h3>
              <FiTrendingUp className="text-primary-600" />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{stats.streak}</div>
                <div className="text-xs text-gray-600">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-600">{stats.totalEntries}</div>
                <div className="text-xs text-gray-600">This Week</div>
              </div>
              <div className="text-center">
                <div className="text-2xl">
                  {moods.find(m => m.id === stats.mostCommon)?.emoji || '😊'}
                </div>
                <div className="text-xs text-gray-600">Most Common</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Mood History */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Entries</h3>
            <motion.button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
              whileHover={{ scale: 1.05 }}
            >
              <FiCalendar size={16} />
              <span className="text-sm">View All</span>
            </motion.button>
          </div>

          <div className="space-y-3">
            {state.mood.history.slice(-5).reverse().map((entry, index) => {
              const mood = moods.find(m => m.id === entry.mood);
              return (
                <motion.div
                  key={entry.timestamp}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{mood?.emoji}</span>
                    <div>
                      <div className="font-medium text-gray-800 capitalize">{entry.mood}</div>
                      <div className="text-xs text-gray-500">
                        {format(parseISO(entry.timestamp), 'MMM d, h:mm a')}
                      </div>
                    </div>
                  </div>
                  <FiEdit3 className="text-gray-400" size={16} />
                </motion.div>
              );
            })}
            
            {state.mood.history.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FiHeart className="mx-auto text-4xl mb-2 opacity-50" />
                <p>Start tracking your mood to see your progress</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MoodTracker;