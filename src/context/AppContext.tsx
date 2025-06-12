import React, {createContext, useContext, useReducer, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  name: string;
  age: string;
  timezone: string;
  preferredTwinType: string;
  interests: string[];
  sleepSchedule: {
    bedtime: string;
    wakeup: string;
  };
  reminderSettings: {
    hydration: boolean;
    sleep: boolean;
    selfCare: boolean;
    checkIn: boolean;
  };
  joinDate?: string;
}

interface Twin {
  name: string;
  personality: string;
  relationship: string;
  memories: any[];
  conversationHistory: any[];
}

interface MoodEntry {
  mood: string;
  timestamp: string;
  date: string;
}

interface Mood {
  current: string;
  history: MoodEntry[];
  lastCheckIn: string | null;
}

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface AppState {
  user: User;
  twin: Twin;
  mood: Mood;
  isOnboarded: boolean;
  currentMood: string;
  chatMessages: ChatMessage[];
  isVoiceActive: boolean;
  reminders: any[];
}

const initialState: AppState = {
  user: {
    name: '',
    age: '',
    timezone: 'UTC',
    preferredTwinType: 'sibling',
    interests: [],
    sleepSchedule: {bedtime: '22:00', wakeup: '07:00'},
    reminderSettings: {
      hydration: true,
      sleep: true,
      selfCare: true,
      checkIn: true,
    },
  },
  twin: {
    name: '',
    personality: 'caring',
    relationship: 'sibling',
    memories: [],
    conversationHistory: [],
  },
  mood: {
    current: 'neutral',
    history: [],
    lastCheckIn: null,
  },
  isOnboarded: false,
  currentMood: 'neutral',
  chatMessages: [],
  isVoiceActive: false,
  reminders: [],
};

type Action =
  | {type: 'SET_USER_DATA'; payload: Partial<User>}
  | {type: 'SET_TWIN_DATA'; payload: Partial<Twin>}
  | {type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage}
  | {type: 'SET_MOOD'; payload: string}
  | {type: 'COMPLETE_ONBOARDING'}
  | {type: 'TOGGLE_VOICE'}
  | {type: 'ADD_MEMORY'; payload: any}
  | {type: 'ADD_REMINDER'; payload: any}
  | {type: 'LOAD_STATE'; payload: Partial<AppState>};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER_DATA':
      return {
        ...state,
        user: {...state.user, ...action.payload},
      };
    case 'SET_TWIN_DATA':
      return {
        ...state,
        twin: {...state.twin, ...action.payload},
      };
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload],
      };
    case 'SET_MOOD':
      const newMoodEntry: MoodEntry = {
        mood: action.payload,
        timestamp: new Date().toISOString(),
        date: new Date().toDateString(),
      };
      return {
        ...state,
        currentMood: action.payload,
        mood: {
          ...state.mood,
          current: action.payload,
          history: [...state.mood.history, newMoodEntry],
          lastCheckIn: new Date().toISOString(),
        },
      };
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        isOnboarded: true,
      };
    case 'TOGGLE_VOICE':
      return {
        ...state,
        isVoiceActive: !state.isVoiceActive,
      };
    case 'ADD_MEMORY':
      return {
        ...state,
        twin: {
          ...state.twin,
          memories: [...state.twin.memories, action.payload],
        },
      };
    case 'ADD_REMINDER':
      return {
        ...state,
        reminders: [...state.reminders, action.payload],
      };
    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({children}: {children: ReactNode}) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('twinHeartData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          dispatch({type: 'LOAD_STATE', payload: parsedData});
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  // Save data to AsyncStorage when state changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('twinHeartData', JSON.stringify(state));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };
    saveData();
  }, [state]);

  return (
    <AppContext.Provider value={{state, dispatch}}>
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