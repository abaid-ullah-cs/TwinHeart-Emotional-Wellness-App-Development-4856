import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiCalendar,
  FiClock,
  FiCheck,
  FiX 
} from 'react-icons/fi';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from 'date-fns';

const CalendarPicker = ({ 
  isOpen, 
  onClose, 
  onDateSelect, 
  selectedDate, 
  existingReminders = [] 
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [reminderType, setReminderType] = useState('general');
  const [reminderMessage, setReminderMessage] = useState('');
  const [tempSelectedDate, setTempSelectedDate] = useState(selectedDate);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const reminderTypes = [
    { id: 'general', label: 'General Reminder', icon: '📝', color: 'bg-blue-100 text-blue-700' },
    { id: 'hydration', label: 'Hydration', icon: '💧', color: 'bg-blue-100 text-blue-700' },
    { id: 'selfCare', label: 'Self Care', icon: '🧘', color: 'bg-pink-100 text-pink-700' },
    { id: 'exercise', label: 'Exercise', icon: '💪', color: 'bg-green-100 text-green-700' },
    { id: 'medication', label: 'Medication', icon: '💊', color: 'bg-red-100 text-red-700' },
    { id: 'appointment', label: 'Appointment', icon: '📅', color: 'bg-purple-100 text-purple-700' },
    { id: 'call', label: 'Call Someone', icon: '📞', color: 'bg-yellow-100 text-yellow-700' }
  ];

  const handleDateClick = (date) => {
    setTempSelectedDate(date);
  };

  const handleSaveReminder = () => {
    if (!tempSelectedDate || !reminderMessage.trim()) return;

    const reminder = {
      id: Date.now(),
      date: tempSelectedDate,
      time: selectedTime,
      type: reminderType,
      message: reminderMessage,
      datetime: new Date(`${format(tempSelectedDate, 'yyyy-MM-dd')}T${selectedTime}`),
      created: new Date().toISOString(),
      active: true
    };

    onDateSelect(reminder);
    onClose();
  };

  const getDayReminders = (date) => {
    return existingReminders.filter(reminder => 
      reminder.date && isSameDay(new Date(reminder.date), date)
    );
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Add Reminder</h2>
          <motion.button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiX size={20} className="text-gray-600" />
          </motion.button>
        </div>

        {/* Calendar */}
        <div className="p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <motion.button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiChevronLeft size={20} />
            </motion.button>
            
            <h3 className="text-lg font-semibold text-gray-800">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            
            <motion.button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiChevronRight size={20} />
            </motion.button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {monthDays.map(date => {
              const dayReminders = getDayReminders(date);
              const isSelected = tempSelectedDate && isSameDay(date, tempSelectedDate);
              const isTodayDate = isToday(date);
              
              return (
                <motion.button
                  key={date.toISOString()}
                  onClick={() => handleDateClick(date)}
                  className={`
                    relative p-2 h-10 text-sm rounded-lg transition-all
                    ${isSelected 
                      ? 'bg-primary-500 text-white' 
                      : isTodayDate 
                      ? 'bg-primary-100 text-primary-700 font-semibold'
                      : isSameMonth(date, currentMonth)
                      ? 'hover:bg-gray-100 text-gray-700'
                      : 'text-gray-300'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!isSameMonth(date, currentMonth)}
                >
                  {format(date, 'd')}
                  {dayReminders.length > 0 && (
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-red-400 rounded-full"></div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Reminder Details */}
        {tempSelectedDate && (
          <div className="px-6 pb-6 space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-2 mb-4">
                <FiCalendar className="text-primary-600" />
                <span className="font-medium text-gray-800">
                  {format(tempSelectedDate, 'EEEE, MMMM d, yyyy')}
                </span>
              </div>

              {/* Time Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <div className="flex items-center space-x-2">
                  <FiClock className="text-gray-400" />
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Reminder Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {reminderTypes.map(type => (
                    <motion.button
                      key={type.id}
                      onClick={() => setReminderType(type.id)}
                      className={`
                        flex items-center space-x-2 p-2 rounded-lg text-sm transition-all
                        ${reminderType === type.id 
                          ? 'bg-primary-100 text-primary-700 border-2 border-primary-300' 
                          : 'bg-white border border-gray-200 hover:bg-gray-50'
                        }
                      `}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{type.icon}</span>
                      <span className="truncate">{type.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  placeholder="What would you like to be reminded about?"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <motion.button
                  onClick={onClose}
                  className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSaveReminder}
                  disabled={!reminderMessage.trim()}
                  className={`
                    flex-1 py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2
                    ${reminderMessage.trim()
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                  whileHover={{ scale: reminderMessage.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: reminderMessage.trim() ? 0.98 : 1 }}
                >
                  <FiCheck size={16} />
                  <span>Save Reminder</span>
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CalendarPicker;