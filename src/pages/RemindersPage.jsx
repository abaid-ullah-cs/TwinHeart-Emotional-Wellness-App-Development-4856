import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiCalendar, 
  FiBell, 
  FiFilter,
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { useReminderSystem } from '../hooks/useReminderSystem';
import CalendarPicker from '../components/CalendarPicker';
import ReminderCard from '../components/ReminderCard';
import { format, isToday, isTomorrow, addMinutes } from 'date-fns';

const RemindersPage = () => {
  const { state, dispatch } = useApp();
  const { addReminder, removeReminder, updateReminder } = useReminderSystem(state.user);
  
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [customReminders, setCustomReminders] = useState([]);

  // Load custom reminders from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('twinHeart_customReminders');
    if (saved) {
      setCustomReminders(JSON.parse(saved));
    }
  }, []);

  // Save custom reminders to localStorage
  const saveCustomReminders = (reminders) => {
    setCustomReminders(reminders);
    localStorage.setItem('twinHeart_customReminders', JSON.stringify(reminders));
  };

  const handleAddReminder = (reminder) => {
    const newReminders = [...customReminders, reminder];
    saveCustomReminders(newReminders);
    
    // Also add to the main reminder system
    addReminder({
      ...reminder,
      id: reminder.id.toString(),
      active: true
    });
  };

  const handleEditReminder = (reminder) => {
    // Implementation for editing
    console.log('Edit reminder:', reminder);
  };

  const handleDeleteReminder = (id) => {
    const newReminders = customReminders.filter(r => r.id !== id);
    saveCustomReminders(newReminders);
    removeReminder(id.toString());
  };

  const handleCompleteReminder = (id) => {
    const newReminders = customReminders.map(r => 
      r.id === id ? { ...r, completed: true, completedAt: new Date().toISOString() } : r
    );
    saveCustomReminders(newReminders);
  };

  const handleSnoozeReminder = (id) => {
    const newReminders = customReminders.map(r => {
      if (r.id === id) {
        const newDateTime = addMinutes(new Date(r.datetime), 15);
        return {
          ...r,
          datetime: newDateTime.toISOString(),
          snoozed: true
        };
      }
      return r;
    });
    saveCustomReminders(newReminders);
  };

  // Filter reminders
  const filteredReminders = customReminders.filter(reminder => {
    const matchesSearch = reminder.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'today') {
      return matchesSearch && isToday(new Date(reminder.date || reminder.datetime));
    }
    if (filterType === 'upcoming') {
      return matchesSearch && !reminder.completed && new Date(reminder.datetime) > new Date();
    }
    if (filterType === 'completed') {
      return matchesSearch && reminder.completed;
    }
    if (filterType === 'overdue') {
      return matchesSearch && !reminder.completed && new Date(reminder.datetime) < new Date();
    }
    
    return matchesSearch && reminder.type === filterType;
  });

  // Get reminder statistics
  const getStats = () => {
    const total = customReminders.length;
    const completed = customReminders.filter(r => r.completed).length;
    const overdue = customReminders.filter(r => 
      !r.completed && new Date(r.datetime) < new Date()
    ).length;
    const today = customReminders.filter(r => 
      isToday(new Date(r.date || r.datetime))
    ).length;

    return { total, completed, overdue, today };
  };

  const stats = getStats();

  const filterOptions = [
    { id: 'all', label: 'All', count: stats.total },
    { id: 'today', label: 'Today', count: stats.today },
    { id: 'upcoming', label: 'Upcoming', count: stats.total - stats.completed - stats.overdue },
    { id: 'completed', label: 'Completed', count: stats.completed },
    { id: 'overdue', label: 'Overdue', count: stats.overdue }
  ];

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
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
              <FiBell className="text-white text-2xl" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            My Reminders
          </h1>
          
          <p className="text-gray-600">
            Stay organized and never miss important tasks
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs text-gray-600">Done</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-orange-600">{stats.today}</div>
            <div className="text-xs text-gray-600">Today</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-red-600">{stats.overdue}</div>
            <div className="text-xs text-gray-600">Overdue</div>
          </div>
        </motion.div>

        {/* Search and Add Button */}
        <motion.div
          className="flex space-x-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reminders..."
              className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <motion.button
            onClick={() => setShowCalendar(true)}
            className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-2xl shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus size={20} />
          </motion.button>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex space-x-1 overflow-x-auto">
            {filterOptions.map((option) => (
              <motion.button
                key={option.id}
                onClick={() => setFilterType(option.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                  ${filterType === option.id 
                    ? 'bg-primary-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{option.label}</span>
                {option.count > 0 && (
                  <span className={`
                    px-1.5 py-0.5 rounded-full text-xs
                    ${filterType === option.id 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {option.count}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Reminders List */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <AnimatePresence>
            {filteredReminders.length > 0 ? (
              filteredReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onEdit={handleEditReminder}
                  onDelete={handleDeleteReminder}
                  onComplete={handleCompleteReminder}
                  onSnooze={handleSnoozeReminder}
                />
              ))
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <FiCalendar className="mx-auto text-6xl text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  {searchQuery ? 'No matching reminders' : 'No reminders yet'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery 
                    ? 'Try adjusting your search or filter'
                    : 'Add your first reminder to get started'
                  }
                </p>
                {!searchQuery && (
                  <motion.button
                    onClick={() => setShowCalendar(true)}
                    className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add First Reminder
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Calendar Modal */}
      <CalendarPicker
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        onDateSelect={handleAddReminder}
        selectedDate={new Date()}
        existingReminders={customReminders}
      />
    </div>
  );
};

export default RemindersPage;