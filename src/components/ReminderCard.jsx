import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiClock, 
  FiCalendar, 
  FiMoreVertical, 
  FiEdit3, 
  FiTrash2, 
  FiCheck,
  FiAlertCircle,
  FiRepeat
} from 'react-icons/fi';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

const ReminderCard = ({ 
  reminder, 
  onEdit, 
  onDelete, 
  onComplete, 
  onSnooze 
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getReminderIcon = (type) => {
    const icons = {
      general: '📝',
      hydration: '💧',
      selfCare: '🧘',
      exercise: '💪',
      medication: '💊',
      appointment: '📅',
      call: '📞'
    };
    return icons[type] || '📝';
  };

  const getReminderColor = (type) => {
    const colors = {
      general: 'from-blue-400 to-blue-600',
      hydration: 'from-blue-400 to-cyan-500',
      selfCare: 'from-pink-400 to-rose-500',
      exercise: 'from-green-400 to-emerald-500',
      medication: 'from-red-400 to-rose-500',
      appointment: 'from-purple-400 to-violet-500',
      call: 'from-yellow-400 to-orange-500'
    };
    return colors[type] || 'from-gray-400 to-gray-600';
  };

  const getDateDisplay = () => {
    const reminderDate = new Date(reminder.date || reminder.datetime);
    
    if (isToday(reminderDate)) {
      return 'Today';
    } else if (isTomorrow(reminderDate)) {
      return 'Tomorrow';
    } else {
      return format(reminderDate, 'MMM d');
    }
  };

  const getTimeDisplay = () => {
    if (reminder.time) {
      return reminder.time;
    } else if (reminder.datetime) {
      return format(new Date(reminder.datetime), 'h:mm a');
    }
    return '';
  };

  const isOverdue = () => {
    const reminderDateTime = new Date(reminder.datetime || `${reminder.date}T${reminder.time}`);
    return isPast(reminderDateTime) && !reminder.completed;
  };

  const handleMenuAction = (action) => {
    setShowMenu(false);
    switch (action) {
      case 'edit':
        onEdit(reminder);
        break;
      case 'delete':
        onDelete(reminder.id);
        break;
      case 'complete':
        onComplete(reminder.id);
        break;
      case 'snooze':
        onSnooze(reminder.id);
        break;
    }
  };

  return (
    <motion.div
      className={`
        relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-l-4
        ${isOverdue() ? 'border-red-400' : 'border-transparent'}
        ${reminder.completed ? 'opacity-60' : ''}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${getReminderColor(reminder.type)} flex items-center justify-center text-lg`}>
            {getReminderIcon(reminder.type)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className={`font-semibold text-gray-800 ${reminder.completed ? 'line-through' : ''}`}>
                {reminder.message || 'Reminder'}
              </h3>
              {isOverdue() && (
                <FiAlertCircle className="text-red-500" size={16} />
              )}
              {reminder.recurring && (
                <FiRepeat className="text-blue-500" size={14} />
              )}
            </div>
            
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <FiCalendar size={12} />
                <span>{getDateDisplay()}</span>
              </div>
              
              {getTimeDisplay() && (
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <FiClock size={12} />
                  <span>{getTimeDisplay()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu Button */}
        <div className="relative">
          <motion.button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiMoreVertical size={16} className="text-gray-600" />
          </motion.button>

          {/* Dropdown Menu */}
          {showMenu && (
            <motion.div
              className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 min-w-[120px]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {!reminder.completed && (
                <button
                  onClick={() => handleMenuAction('complete')}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors"
                >
                  <FiCheck size={14} />
                  <span>Complete</span>
                </button>
              )}
              
              {!reminder.completed && isOverdue() && (
                <button
                  onClick={() => handleMenuAction('snooze')}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  <FiClock size={14} />
                  <span>Snooze</span>
                </button>
              )}
              
              <button
                onClick={() => handleMenuAction('edit')}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiEdit3 size={14} />
                <span>Edit</span>
              </button>
              
              <button
                onClick={() => handleMenuAction('delete')}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
              >
                <FiTrash2 size={14} />
                <span>Delete</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {!reminder.completed && (
        <div className="flex space-x-2">
          <motion.button
            onClick={() => handleMenuAction('complete')}
            className="flex-1 py-2 px-3 bg-green-100 text-green-700 rounded-lg text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Mark Done
          </motion.button>
          
          {isOverdue() && (
            <motion.button
              onClick={() => handleMenuAction('snooze')}
              className="flex-1 py-2 px-3 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Snooze
            </motion.button>
          )}
        </div>
      )}

      {/* Completed Badge */}
      {reminder.completed && (
        <div className="absolute top-2 right-2">
          <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
            ✓ Done
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ReminderCard;