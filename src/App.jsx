import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import MoodTracker from './pages/MoodTracker';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import OnboardingPage from './pages/OnboardingPage';
import RemindersPage from './pages/RemindersPage';
import BreakingSilencePage from './pages/BreakingSilencePage';
import { AppProvider } from './context/AppContext';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/*" element={<MainApp />} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </AppProvider>
  );
}

function MainApp() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/mood" element={<MoodTracker />} />
          <Route path="/breaking-silence" element={<BreakingSilencePage />} />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
      <Navbar />
    </div>
  );
}

export default App;