// Advanced Reminder System for TwinHeart
export class ReminderSystem {
  constructor() {
    this.reminders = [];
    this.activeNotifications = new Set();
    this.userPreferences = {};
    this.patterns = {};
  }

  // Initialize reminder system with user preferences
  initialize(userProfile) {
    this.userPreferences = {
      sleepSchedule: userProfile.sleepSchedule || { bedtime: '22:00', wakeup: '07:00' },
      reminderSettings: userProfile.reminderSettings || {
        hydration: true,
        sleep: true,
        selfCare: true,
        checkIn: true
      },
      timezone: userProfile.timezone || 'UTC'
    };

    this.setupAutomaticReminders();
    this.startReminderLoop();
  }

  setupAutomaticReminders() {
    // Clear existing reminders first
    this.reminders = this.reminders.filter(r => !r.recurring);

    // Hydration reminders (every 2 hours during awake time)
    if (this.userPreferences.reminderSettings.hydration) {
      this.scheduleHydrationReminders();
    }

    // Sleep reminders
    if (this.userPreferences.reminderSettings.sleep) {
      this.scheduleSleepReminders();
    }

    // Self-care reminders
    if (this.userPreferences.reminderSettings.selfCare) {
      this.scheduleSelfCareReminders();
    }

    // Mood check-in reminders
    if (this.userPreferences.reminderSettings.checkIn) {
      this.scheduleMoodCheckIns();
    }
  }

  scheduleHydrationReminders() {
    const wakeupTime = this.parseTime(this.userPreferences.sleepSchedule.wakeup);
    const bedtime = this.parseTime(this.userPreferences.sleepSchedule.bedtime);
    
    // Schedule every 2 hours between wake up and bedtime
    let currentTime = wakeupTime + 2; // Start 2 hours after waking up
    
    while (currentTime < bedtime) {
      this.addReminder({
        id: `hydration_${currentTime}`,
        type: 'hydration',
        time: this.formatTime(currentTime),
        message: this.getHydrationMessage(),
        icon: 'droplet',
        recurring: 'daily',
        active: true
      });
      
      currentTime += 2; // Every 2 hours
    }
  }

  scheduleSleepReminders() {
    const bedtime = this.parseTime(this.userPreferences.sleepSchedule.bedtime);
    
    // Wind down reminder (1 hour before bedtime)
    this.addReminder({
      id: 'sleep_winddown',
      type: 'sleep',
      time: this.formatTime(bedtime - 1),
      message: "Time to start winding down for the night. Consider dimming lights and avoiding screens.",
      icon: 'moon',
      recurring: 'daily',
      active: true
    });

    // Bedtime reminder
    this.addReminder({
      id: 'sleep_bedtime',
      type: 'sleep',
      time: this.formatTime(bedtime),
      message: "It's bedtime! Your body and mind will thank you for a good night's rest.",
      icon: 'moon',
      recurring: 'daily',
      active: true
    });

    // Wake up encouragement
    const wakeupTime = this.parseTime(this.userPreferences.sleepSchedule.wakeup);
    this.addReminder({
      id: 'sleep_wakeup',
      type: 'sleep',
      time: this.formatTime(wakeupTime),
      message: "Good morning! Time to start your day with positive energy!",
      icon: 'sun',
      recurring: 'daily',
      active: true
    });
  }

  scheduleSelfCareReminders() {
    // Morning self-care
    const wakeupTime = this.parseTime(this.userPreferences.sleepSchedule.wakeup);
    this.addReminder({
      id: 'selfcare_morning',
      type: 'selfCare',
      time: this.formatTime(wakeupTime + 1),
      message: "Take a moment for yourself this morning. Deep breath, stretch, or just enjoy a quiet moment.",
      icon: 'heart',
      recurring: 'daily',
      active: true
    });

    // Afternoon break
    this.addReminder({
      id: 'selfcare_afternoon',
      type: 'selfCare',
      time: '15:00',
      message: "Time for an afternoon self-care break! Step away from work and do something nice for yourself.",
      icon: 'heart',
      recurring: 'daily',
      active: true
    });

    // Evening reflection
    const bedtime = this.parseTime(this.userPreferences.sleepSchedule.bedtime);
    this.addReminder({
      id: 'selfcare_evening',
      type: 'selfCare',
      time: this.formatTime(bedtime - 2),
      message: "Evening self-care time! Reflect on your day and practice gratitude for three things.",
      icon: 'heart',
      recurring: 'daily',
      active: true
    });
  }

  scheduleMoodCheckIns() {
    // Morning mood check
    const wakeupTime = this.parseTime(this.userPreferences.sleepSchedule.wakeup);
    this.addReminder({
      id: 'mood_morning',
      type: 'checkIn',
      time: this.formatTime(wakeupTime + 0.5),
      message: "Good morning! How are you feeling as you start your day?",
      icon: 'smile',
      recurring: 'daily',
      active: true
    });

    // Midday check-in
    this.addReminder({
      id: 'mood_midday',
      type: 'checkIn',
      time: '13:00',
      message: "Midday check-in: How's your energy and mood right now?",
      icon: 'smile',
      recurring: 'daily',
      active: true
    });

    // Evening reflection
    this.addReminder({
      id: 'mood_evening',
      type: 'checkIn',
      time: '19:00',
      message: "How has your day been emotionally? Take a moment to check in with yourself.",
      icon: 'smile',
      recurring: 'daily',
      active: true
    });
  }

  addReminder(reminder) {
    reminder.id = reminder.id || Date.now().toString();
    reminder.created = new Date().toISOString();
    reminder.active = reminder.active !== undefined ? reminder.active : true;
    
    // Check if reminder already exists (for recurring reminders)
    const existingIndex = this.reminders.findIndex(r => r.id === reminder.id);
    if (existingIndex !== -1) {
      this.reminders[existingIndex] = reminder;
    } else {
      this.reminders.push(reminder);
    }
    
    return reminder.id;
  }

  removeReminder(id) {
    this.reminders = this.reminders.filter(reminder => reminder.id !== id);
  }

  updateReminder(id, updates) {
    const reminderIndex = this.reminders.findIndex(reminder => reminder.id === id);
    if (reminderIndex !== -1) {
      this.reminders[reminderIndex] = { ...this.reminders[reminderIndex], ...updates };
    }
  }

  // Check for due reminders
  checkDueReminders() {
    const now = new Date();
    const currentTime = now.getHours() + now.getMinutes() / 60;
    
    const dueReminders = this.reminders.filter(reminder => {
      if (!reminder.active) return false;
      
      // Check if it's time for this reminder
      const reminderTime = this.parseTime(reminder.time);
      const timeDiff = Math.abs(currentTime - reminderTime);
      
      // Trigger if within 1 minute of reminder time and not already triggered today
      const isTimeMatch = timeDiff < 0.017; // ~1 minute
      const notTriggeredToday = !this.isTriggeredToday(reminder.id);
      
      return isTimeMatch && notTriggeredToday;
    });

    // Mark as triggered
    dueReminders.forEach(reminder => {
      this.markAsTriggered(reminder.id);
    });

    return dueReminders;
  }

  isTriggeredToday(reminderId) {
    const today = new Date().toDateString();
    const triggeredKey = `triggered_${reminderId}_${today}`;
    return localStorage.getItem(triggeredKey) === 'true';
  }

  markAsTriggered(reminderId) {
    const today = new Date().toDateString();
    const triggeredKey = `triggered_${reminderId}_${today}`;
    localStorage.setItem(triggeredKey, 'true');
  }

  // Start the reminder checking loop
  startReminderLoop() {
    // Clear any existing interval
    if (this.reminderInterval) {
      clearInterval(this.reminderInterval);
    }

    this.reminderInterval = setInterval(() => {
      // Clean up old triggered markers (older than 2 days)
      this.cleanupTriggeredMarkers();
    }, 60000); // Check every minute
  }

  cleanupTriggeredMarkers() {
    const keys = Object.keys(localStorage);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    keys.forEach(key => {
      if (key.startsWith('triggered_')) {
        const parts = key.split('_');
        if (parts.length >= 3) {
          const dateStr = parts.slice(2).join('_');
          const triggerDate = new Date(dateStr);
          if (triggerDate < twoDaysAgo) {
            localStorage.removeItem(key);
          }
        }
      }
    });
  }

  triggerReminder(reminder) {
    // Mark as active to prevent duplicate notifications
    this.activeNotifications.add(reminder.id);
    
    // Remove from active notifications after 5 minutes
    setTimeout(() => {
      this.activeNotifications.delete(reminder.id);
    }, 5 * 60 * 1000);

    // Return reminder for the UI to display
    return {
      ...reminder,
      triggered: new Date().toISOString()
    };
  }

  // Get personalized hydration messages
  getHydrationMessage() {
    const messages = [
      "Time to hydrate! Your body needs water to function at its best.",
      "Drink up! Staying hydrated helps your mood and energy levels.",
      "Water break! Your brain is about 75% water - keep it happy!",
      "Hydration reminder: A glass of water can boost your focus and alertness.",
      "Your body is calling for water! Take a refreshing sip.",
      "Time for H2O! Your skin, joints, and organs will thank you.",
      "Water time! Staying hydrated helps regulate your body temperature.",
      "Drink some water! It helps transport nutrients throughout your body."
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Utility functions
  parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + minutes / 60;
  }

  formatTime(timeFloat) {
    const hours = Math.floor(timeFloat);
    const minutes = Math.round((timeFloat - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  // Get today's reminders for display
  getTodaysReminders() {
    return this.reminders.filter(reminder => reminder.active);
  }

  // Get reminder statistics
  getReminderStats() {
    const total = this.reminders.length;
    const active = this.reminders.filter(r => r.active).length;
    const byType = {};
    
    this.reminders.forEach(reminder => {
      byType[reminder.type] = (byType[reminder.type] || 0) + 1;
    });

    return { total, active, byType };
  }

  // Update user preferences and reschedule reminders
  updatePreferences(newPreferences) {
    this.userPreferences = { ...this.userPreferences, ...newPreferences };
    
    // Clear existing automatic reminders
    this.reminders = this.reminders.filter(reminder => !reminder.recurring);
    
    // Reschedule with new preferences
    this.setupAutomaticReminders();
  }

  // Smart reminder suggestions based on user patterns
  suggestOptimalTimes(userActivity) {
    // Analyze when user is most active/responsive
    const suggestions = [];
    
    if (userActivity.mostActiveHours) {
      suggestions.push({
        type: 'checkIn',
        time: userActivity.mostActiveHours[0],
        reason: 'You seem most engaged during this time'
      });
    }

    if (userActivity.lowEnergyHours) {
      suggestions.push({
        type: 'selfCare',
        time: userActivity.lowEnergyHours[0],
        reason: 'A self-care reminder might help during lower energy periods'
      });
    }

    return suggestions;
  }

  // Snooze functionality
  snoozeReminder(reminderId, minutes = 15) {
    const reminder = this.reminders.find(r => r.id === reminderId);
    if (reminder) {
      const currentTime = new Date();
      const snoozeTime = new Date(currentTime.getTime() + minutes * 60000);
      
      // Create a new temporary reminder
      const snoozedReminder = {
        ...reminder,
        id: `${reminder.id}_snoozed_${Date.now()}`,
        time: this.formatTime(snoozeTime.getHours() + snoozeTime.getMinutes() / 60),
        snoozed: true,
        originalId: reminder.id,
        snoozeCount: (reminder.snoozeCount || 0) + 1
      };
      
      this.addReminder(snoozedReminder);
      return snoozedReminder.id;
    }
    return null;
  }

  // Complete reminder
  completeReminder(reminderId) {
    const reminderIndex = this.reminders.findIndex(r => r.id === reminderId);
    if (reminderIndex !== -1) {
      this.reminders[reminderIndex].completed = true;
      this.reminders[reminderIndex].completedAt = new Date().toISOString();
    }
  }

  // Get reminder by ID
  getReminderById(id) {
    return this.reminders.find(r => r.id === id);
  }

  // Get overdue reminders
  getOverdueReminders() {
    const now = new Date();
    const currentTime = now.getHours() + now.getMinutes() / 60;
    
    return this.reminders.filter(reminder => {
      if (!reminder.active || reminder.completed) return false;
      
      const reminderTime = this.parseTime(reminder.time);
      return reminderTime < currentTime;
    });
  }

  // Get upcoming reminders (next 24 hours)
  getUpcomingReminders() {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    return this.reminders.filter(reminder => {
      if (!reminder.active || reminder.completed) return false;
      
      // For recurring reminders, they're always "upcoming" for the next occurrence
      if (reminder.recurring) return true;
      
      // For one-time reminders, check if they're within 24 hours
      if (reminder.datetime) {
        const reminderTime = new Date(reminder.datetime);
        return reminderTime > now && reminderTime <= tomorrow;
      }
      
      return false;
    });
  }

  // Cleanup completed reminders older than specified days
  cleanupCompletedReminders(daysOld = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    this.reminders = this.reminders.filter(reminder => {
      if (!reminder.completed) return true;
      
      const completedDate = new Date(reminder.completedAt);
      return completedDate > cutoffDate;
    });
  }

  // Export reminders data
  exportReminders() {
    return {
      reminders: this.reminders,
      preferences: this.userPreferences,
      exportDate: new Date().toISOString()
    };
  }

  // Import reminders data
  importReminders(data) {
    if (data.reminders) {
      this.reminders = data.reminders;
    }
    if (data.preferences) {
      this.userPreferences = data.preferences;
    }
  }
}