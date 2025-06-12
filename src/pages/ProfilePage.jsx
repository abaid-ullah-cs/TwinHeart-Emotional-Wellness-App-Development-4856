import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUser, 
  FiHeart, 
  FiCalendar, 
  FiClock,
  FiEdit3,
  FiSave,
  FiX,
  FiMapPin,
  FiSmile
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

const ProfilePage = () => {
  const { state, dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: state.user.name,
    age: state.user.age,
    interests: state.user.interests,
    twinName: state.twin.name,
    twinPersonality: state.twin.personality
  });

  const handleSave = () => {
    dispatch({ type: 'SET_USER_DATA', payload: {
      name: editData.name,
      age: editData.age,
      interests: editData.interests
    }});
    
    dispatch({ type: 'SET_TWIN_DATA', payload: {
      name: editData.twinName,
      personality: editData.twinPersonality
    }});
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: state.user.name,
      age: state.user.age,
      interests: state.user.interests,
      twinName: state.twin.name,
      twinPersonality: state.twin.personality
    });
    setIsEditing(false);
  };

  const personalities = [
    { id: 'caring', name: 'Caring & Nurturing', emoji: '🤗' },
    { id: 'playful', name: 'Playful & Fun', emoji: '😄' },
    { id: 'wise', name: 'Wise & Thoughtful', emoji: '🤔' },
    { id: 'energetic', name: 'Energetic & Motivating', emoji: '⚡' },
    { id: 'calm', name: 'Calm & Peaceful', emoji: '😌' }
  ];

  const interests = ['Music', 'Movies', 'Books', 'Sports', 'Travel', 'Cooking', 'Art', 'Gaming'];

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
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-full">
              <FiUser className="text-white text-2xl" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Your Profile
          </h1>
          
          <p className="text-gray-600">
            Manage your account and twin settings
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
            {!isEditing ? (
              <motion.button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiEdit3 size={16} />
                <span className="text-sm">Edit</span>
              </motion.button>
            ) : (
              <div className="flex space-x-2">
                <motion.button
                  onClick={handleSave}
                  className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiSave size={16} />
                  <span className="text-sm">Save</span>
                </motion.button>
                <motion.button
                  onClick={handleCancel}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiX size={16} />
                  <span className="text-sm">Cancel</span>
                </motion.button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800 bg-gray-50 p-3 rounded-xl">{state.user.name || 'Not set'}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              {isEditing ? (
                <input
                  type="number"
                  value={editData.age}
                  onChange={(e) => setEditData({...editData, age: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800 bg-gray-50 p-3 rounded-xl">{state.user.age || 'Not set'}</p>
              )}
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
              {isEditing ? (
                <div className="grid grid-cols-2 gap-2">
                  {interests.map(interest => (
                    <motion.button
                      key={interest}
                      onClick={() => {
                        const newInterests = editData.interests.includes(interest)
                          ? editData.interests.filter(i => i !== interest)
                          : [...editData.interests, interest];
                        setEditData({...editData, interests: newInterests});
                      }}
                      className={`p-2 rounded-lg border-2 text-sm transition-colors ${
                        editData.interests.includes(interest)
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
              ) : (
                <div className="flex flex-wrap gap-2">
                  {state.user.interests.length > 0 ? (
                    state.user.interests.map(interest => (
                      <span
                        key={interest}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No interests selected</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Twin Settings */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your AI Twin</h2>
          
          <div className="space-y-4">
            {/* Twin Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Twin Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.twinName}
                  onChange={(e) => setEditData({...editData, twinName: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800 bg-gray-50 p-3 rounded-xl">{state.twin.name || 'Not set'}</p>
              )}
            </div>

            {/* Twin Personality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Personality</label>
              {isEditing ? (
                <div className="space-y-2">
                  {personalities.map(personality => (
                    <motion.button
                      key={personality.id}
                      onClick={() => setEditData({...editData, twinPersonality: personality.id})}
                      className={`w-full p-3 rounded-xl border-2 text-left transition-colors ${
                        editData.twinPersonality === personality.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{personality.emoji}</span>
                        <span className="font-medium text-gray-800">{personality.name}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-3 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">
                      {personalities.find(p => p.id === state.twin.personality)?.emoji || '🤗'}
                    </span>
                    <span className="text-gray-800">
                      {personalities.find(p => p.id === state.twin.personality)?.name || 'Caring & Nurturing'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Journey</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <FiCalendar className="mx-auto text-2xl text-blue-600 mb-2" />
              <div className="text-xl font-bold text-blue-700">
                {Math.floor((Date.now() - new Date(state.user.joinDate || Date.now()).getTime()) / (1000 * 60 * 60 * 24)) || 0}
              </div>
              <div className="text-xs text-blue-600">Days with TwinHeart</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
              <FiHeart className="mx-auto text-2xl text-pink-600 mb-2" />
              <div className="text-xl font-bold text-pink-700">{state.mood.history.length}</div>
              <div className="text-xs text-pink-600">Mood Entries</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <FiSmile className="mx-auto text-2xl text-green-600 mb-2" />
              <div className="text-xl font-bold text-green-700">{state.chatMessages.length}</div>
              <div className="text-xs text-green-600">Conversations</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
              <FiClock className="mx-auto text-2xl text-purple-600 mb-2" />
              <div className="text-xl font-bold text-purple-700">{state.twin.memories.length}</div>
              <div className="text-xs text-purple-600">Memories Shared</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;