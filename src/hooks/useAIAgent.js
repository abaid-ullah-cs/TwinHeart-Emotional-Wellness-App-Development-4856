import { useState, useEffect, useCallback } from 'react';
import { createIntelligentAgent } from '../services/intelligentAIAgent';

export function useAIAgent(userProfile, twinProfile) {
  const [agent, setAgent] = useState(null);
  const [isThinking, setIsThinking] = useState(false);

  // Initialize AI agent when profiles are available
  useEffect(() => {
    if (userProfile && twinProfile && Object.keys(userProfile).length > 0) {
      const newAgent = createIntelligentAgent(userProfile, twinProfile);
      setAgent(newAgent);
      console.log('🤖 AI Agent initialized with advanced capabilities');
    }
  }, [userProfile, twinProfile]);

  // Generate AI response
  const generateResponse = useCallback(async (message, context = {}) => {
    if (!agent) return "I'm still getting to know you. Let me set up properly first!";

    setIsThinking(true);
    try {
      // Simulate thinking time for more natural interaction
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const response = await agent.generateResponse(message, context);
      return response;
    } finally {
      setIsThinking(false);
    }
  }, [agent]);

  // Get proactive message from AI
  const getProactiveMessage = useCallback(() => {
    if (!agent) return null;
    return agent.generateProactiveMessage();
  }, [agent]);

  // Get user insights
  const getUserInsights = useCallback(() => {
    if (!agent) return [];
    return agent.getUserInsights();
  }, [agent]);

  // Update agent with new user data
  const updateAgent = useCallback((newUserProfile, newTwinProfile) => {
    if (agent) {
      agent.userProfile = { ...agent.userProfile, ...newUserProfile };
      agent.twinProfile = { ...agent.twinProfile, ...newTwinProfile };
    }
  }, [agent]);

  return {
    agent,
    generateResponse,
    getProactiveMessage,
    getUserInsights,
    updateAgent,
    isThinking
  };
}