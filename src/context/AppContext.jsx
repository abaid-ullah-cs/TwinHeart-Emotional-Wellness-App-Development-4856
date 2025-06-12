import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  user: {
    name: '',
    age: '',
    timezone: 'UTC',
    preferredTwinType: 'sibling',
    interests: [],
    sleepSchedule: { bedtime: '22:00', wakeup: '07:00' },
    reminderSettings: {
      hydration: true,
      sleep: true,
      selfCare: true,
      checkIn: true
    },
    joinDate: new Date().toISOString()
  },
  twin: {
    name: '',
    personality: 'caring',
    relationship: 'sibling',
    memories: [],
    conversationHistory: []
  },
  mood: {
    current: 'neutral',
    history: [],
    lastCheckIn: null
  },
  isOnboarded: false,
  currentMood: 'neutral',
  chatMessages: [],
  isVoiceActive: false,
  reminders: []
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER_DATA':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case 'SET_TWIN_DATA':
      return {
        ...state,
        twin: { ...state.twin, ...action.payload }
      };
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload]
      };
    case 'SET_MOOD':
      const newMoodEntry = {
        mood: action.payload,
        timestamp: new Date().toISOString(),
        date: new Date().toDateString()
      };
      return {
        ...state,
        currentMood: action.payload,
        mood: {
          ...state.mood,
          current: action.payload,
          history: [...state.mood.history, newMoodEntry],
          lastCheckIn: new Date().toISOString()
        }
      };
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        isOnboarded: true
      };
    case 'TOGGLE_VOICE':
      return {
        ...state,
        isVoiceActive: !state.isVoiceActive
      };
    case 'ADD_MEMORY':
      return {
        ...state,
        twin: {
          ...state.twin,
          memories: [...state.twin.memories, action.payload]
        }
      };
    case 'ADD_REMINDER':
      return {
        ...state,
        reminders: [...state.reminders, action.payload]
      };
    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('twinHeartData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_STATE', payload: parsedData });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem('twinHeartData', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}