import { useState, useEffect, useCallback } from 'react';
import { ReminderSystem } from '../utils/reminderSystem';

export function useReminderSystem(userProfile) {
  const [reminderSystem] = useState(() => new ReminderSystem());
  const [activeReminders, setActiveReminders] = useState([]);
  const [pendingNotifications, setPendingNotifications] = useState([]);

  // Initialize reminder system when user profile changes
  useEffect(() => {
    if (userProfile && Object.keys(userProfile).length > 0) {
      reminderSystem.initialize(userProfile);
    }
  }, [userProfile, reminderSystem]);

  // Check for due reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      const dueReminders = reminderSystem.checkDueReminders();
      if (dueReminders.length > 0) {
        setPendingNotifications(prev => [...prev, ...dueReminders]);
      }

      // Also check custom reminders
      const customReminders = getCustomReminders();
      const dueCustomReminders = checkCustomRemindersDue(customReminders);
      if (dueCustomReminders.length > 0) {
        setPendingNotifications(prev => [...prev, ...dueCustomReminders]);
      }
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    checkReminders(); // Check immediately

    return () => clearInterval(interval);
  }, [reminderSystem]);

  // Get custom reminders from localStorage
  const getCustomReminders = () => {
    try {
      const saved = localStorage.getItem('twinHeart_customReminders');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading custom reminders:', error);
      return [];
    }
  };

  // Check if custom reminders are due
  const checkCustomRemindersDue = (customReminders) => {
    const now = new Date();
    const dueReminders = [];

    customReminders.forEach(reminder => {
      if (reminder.completed || !reminder.active) return;

      const reminderTime = new Date(reminder.datetime);
      const timeDiff = Math.abs(now.getTime() - reminderTime.getTime());
      
      // If within 1 minute of reminder time
      if (timeDiff <= 60000 && reminderTime <= now) {
        dueReminders.push({
          ...reminder,
          triggered: now.toISOString()
        });
      }
    });

    return dueReminders;
  };

  // Get today's reminders
  const getTodaysReminders = useCallback(() => {
    const systemReminders = reminderSystem.getTodaysReminders();
    const customReminders = getCustomReminders();
    
    // Filter custom reminders for today
    const today = new Date();
    const todayCustomReminders = customReminders.filter(reminder => {
      const reminderDate = new Date(reminder.date || reminder.datetime);
      return reminderDate.toDateString() === today.toDateString();
    });

    return [...systemReminders, ...todayCustomReminders];
  }, [reminderSystem]);

  // Add custom reminder
  const addReminder = useCallback((reminder) => {
    // Add to system reminders if it's a recurring/system reminder
    if (reminder.recurring) {
      return reminderSystem.addReminder(reminder);
    }
    
    // For custom reminders, they're handled in the RemindersPage component
    return reminder.id;
  }, [reminderSystem]);

  // Remove reminder
  const removeReminder = useCallback((id) => {
    reminderSystem.removeReminder(id);
    setActiveReminders(prev => prev.filter(r => r.id !== id));
  }, [reminderSystem]);

  // Update reminder
  const updateReminder = useCallback((id, updates) => {
    reminderSystem.updateReminder(id, updates);
  }, [reminderSystem]);

  // Mark notification as seen
  const dismissNotification = useCallback((id) => {
    setPendingNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Update reminder preferences
  const updatePreferences = useCallback((preferences) => {
    reminderSystem.updatePreferences(preferences);
  }, [reminderSystem]);

  // Get reminder statistics
  const getStats = useCallback(() => {
    const systemStats = reminderSystem.getReminderStats();
    const customReminders = getCustomReminders();
    
    return {
      ...systemStats,
      custom: {
        total: customReminders.length,
        completed: customReminders.filter(r => r.completed).length,
        active: customReminders.filter(r => !r.completed).length
      }
    };
  }, [reminderSystem]);

  // Snooze reminder (add 15 minutes)
  const snoozeReminder = useCallback((id, minutes = 15) => {
    const customReminders = getCustomReminders();
    const updatedReminders = customReminders.map(reminder => {
      if (reminder.id === id) {
        const newDateTime = new Date(reminder.datetime);
        newDateTime.setMinutes(newDateTime.getMinutes() + minutes);
        return {
          ...reminder,
          datetime: newDateTime.toISOString(),
          snoozed: true,
          snoozeCount: (reminder.snoozeCount || 0) + 1
        };
      }
      return reminder;
    });
    
    localStorage.setItem('twinHeart_customReminders', JSON.stringify(updatedReminders));
  }, []);

  return {
    activeReminders: getTodaysReminders(),
    pendingNotifications,
    addReminder,
    removeReminder,
    updateReminder,
    dismissNotification,
    updatePreferences,
    getStats,
    snoozeReminder,
    reminderSystem
  };
}