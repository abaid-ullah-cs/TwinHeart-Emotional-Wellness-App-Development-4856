// Intelligent AI Agent with Advanced Conversational Abilities
import { v4 as uuidv4 } from 'uuid';

export class IntelligentAIAgent {
  constructor(userProfile, twinProfile) {
    this.userProfile = userProfile;
    this.twinProfile = twinProfile;
    this.conversationHistory = [];
    this.userMemory = {
      preferences: {},
      habits: {},
      emotional_patterns: {},
      topics_of_interest: [],
      important_events: [],
      relationships: {},
      goals: []
    };
    this.contextWindow = 10; // Remember last 10 interactions
    this.isThinking = false;
  }

  // Generate intelligent response with context awareness
  async generateResponse(userMessage, context = {}) {
    this.isThinking = true;
    
    try {
      // Analyze the user's message
      const messageAnalysis = this.analyzeMessage(userMessage);
      
      // Update user memory
      this.updateUserMemory(userMessage, messageAnalysis);
      
      // Generate contextual response
      const response = await this.createIntelligentResponse(
        userMessage, 
        messageAnalysis, 
        context
      );
      
      // Store conversation
      this.addToConversationHistory(userMessage, response, messageAnalysis);
      
      return response;
      
    } finally {
      this.isThinking = false;
    }
  }

  analyzeMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    return {
      sentiment: this.analyzeSentiment(lowerMessage),
      emotions: this.detectEmotions(lowerMessage),
      topics: this.extractTopics(lowerMessage),
      intent: this.detectIntent(lowerMessage),
      urgency: this.assessUrgency(lowerMessage),
      questions: this.extractQuestions(message),
      personalReferences: this.findPersonalReferences(lowerMessage),
      timeReferences: this.extractTimeReferences(lowerMessage),
      complexity: this.assessComplexity(message)
    };
  }

  analyzeSentiment(message) {
    const positiveWords = [
      'happy', 'good', 'great', 'awesome', 'love', 'excited', 'wonderful', 
      'amazing', 'fantastic', 'perfect', 'brilliant', 'excellent', 'thrilled',
      'delighted', 'cheerful', 'optimistic', 'grateful', 'blessed', 'joy'
    ];
    
    const negativeWords = [
      'sad', 'bad', 'terrible', 'hate', 'angry', 'frustrated', 'worried', 
      'anxious', 'depressed', 'awful', 'horrible', 'miserable', 'upset',
      'disappointed', 'stressed', 'overwhelmed', 'lonely', 'hurt', 'broken'
    ];

    let score = 0;
    positiveWords.forEach(word => {
      if (message.includes(word)) score += 1;
    });
    negativeWords.forEach(word => {
      if (message.includes(word)) score -= 1;
    });

    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
  }

  detectEmotions(message) {
    const emotionMap = {
      joy: ['happy', 'excited', 'thrilled', 'elated', 'cheerful', 'delighted'],
      sadness: ['sad', 'down', 'blue', 'depressed', 'melancholy', 'heartbroken'],
      anxiety: ['worried', 'anxious', 'nervous', 'stressed', 'concerned', 'panicked'],
      anger: ['angry', 'mad', 'furious', 'irritated', 'frustrated', 'livid'],
      fear: ['scared', 'afraid', 'terrified', 'frightened', 'nervous'],
      love: ['love', 'adore', 'cherish', 'care', 'affection', 'devoted'],
      excitement: ['excited', 'pumped', 'thrilled', 'eager', 'enthusiastic'],
      confusion: ['confused', 'puzzled', 'lost', 'uncertain', 'unclear'],
      gratitude: ['grateful', 'thankful', 'appreciative', 'blessed'],
      loneliness: ['lonely', 'alone', 'isolated', 'disconnected']
    };

    const detectedEmotions = [];
    Object.keys(emotionMap).forEach(emotion => {
      if (emotionMap[emotion].some(word => message.includes(word))) {
        detectedEmotions.push(emotion);
      }
    });

    return detectedEmotions;
  }

  extractTopics(message) {
    const topicKeywords = {
      work: ['work', 'job', 'boss', 'colleague', 'office', 'meeting', 'project', 'career', 'salary'],
      relationships: ['friend', 'family', 'partner', 'relationship', 'dating', 'love', 'boyfriend', 'girlfriend'],
      health: ['tired', 'sick', 'health', 'doctor', 'medicine', 'exercise', 'sleep', 'diet', 'wellness'],
      hobbies: ['music', 'movie', 'book', 'game', 'sport', 'cooking', 'art', 'travel', 'photography'],
      emotions: ['feel', 'emotion', 'mood', 'mental', 'psychology', 'therapy', 'counseling'],
      education: ['school', 'study', 'learn', 'course', 'exam', 'homework', 'university', 'college'],
      finance: ['money', 'budget', 'expensive', 'cheap', 'save', 'spend', 'investment', 'debt'],
      technology: ['computer', 'phone', 'app', 'internet', 'software', 'digital', 'online'],
      future: ['plan', 'goal', 'dream', 'future', 'hope', 'ambition', 'aspiration'],
      past: ['remember', 'past', 'childhood', 'history', 'before', 'used to', 'nostalgia']
    };

    const detectedTopics = [];
    Object.keys(topicKeywords).forEach(topic => {
      if (topicKeywords[topic].some(keyword => message.includes(keyword))) {
        detectedTopics.push(topic);
      }
    });

    return detectedTopics;
  }

  detectIntent(message) {
    const intentPatterns = {
      question: ['what', 'how', 'why', 'when', 'where', 'who', 'which', '?'],
      request_help: ['help', 'assist', 'support', 'advice', 'guidance', 'suggest'],
      share_experience: ['today', 'yesterday', 'happened', 'went', 'did', 'experience'],
      seek_comfort: ['sad', 'upset', 'hurt', 'crying', 'comfort', 'console'],
      express_gratitude: ['thank', 'grateful', 'appreciate', 'thankful'],
      make_plans: ['plan', 'want to', 'going to', 'will', 'should', 'thinking about'],
      small_talk: ['hi', 'hello', 'hey', 'how are you', 'what\'s up', 'good morning']
    };

    for (const [intent, patterns] of Object.entries(intentPatterns)) {
      if (patterns.some(pattern => message.includes(pattern))) {
        return intent;
      }
    }

    return 'general_conversation';
  }

  assessUrgency(message) {
    const urgentKeywords = [
      'emergency', 'urgent', 'crisis', 'immediate', 'now', 'asap', 'help',
      'serious', 'critical', 'important', 'need', 'must', 'quickly'
    ];
    
    const urgentCount = urgentKeywords.filter(keyword => 
      message.includes(keyword)
    ).length;

    if (urgentCount >= 2) return 'high';
    if (urgentCount === 1) return 'medium';
    return 'low';
  }

  extractQuestions(message) {
    const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which'];
    const sentences = message.split(/[.!?]+/);
    
    return sentences.filter(sentence => 
      sentence.includes('?') || 
      questionWords.some(word => 
        sentence.toLowerCase().trim().startsWith(word)
      )
    ).map(q => q.trim()).filter(q => q.length > 0);
  }

  findPersonalReferences(message) {
    const references = [];
    
    // Check for user's name
    if (this.userProfile.name && message.includes(this.userProfile.name.toLowerCase())) {
      references.push({ type: 'user_name', value: this.userProfile.name });
    }

    // Check for interests
    if (this.userProfile.interests) {
      this.userProfile.interests.forEach(interest => {
        if (message.includes(interest.toLowerCase())) {
          references.push({ type: 'interest', value: interest });
        }
      });
    }

    // Check for remembered topics
    this.userMemory.topics_of_interest.forEach(topic => {
      if (message.includes(topic.toLowerCase())) {
        references.push({ type: 'remembered_topic', value: topic });
      }
    });

    return references;
  }

  extractTimeReferences(message) {
    const timePatterns = {
      today: ['today', 'now', 'currently', 'this moment'],
      yesterday: ['yesterday', 'last night', 'earlier today'],
      future: ['tomorrow', 'next week', 'later', 'soon', 'planning', 'will'],
      past: ['ago', 'before', 'previously', 'used to', 'back then'],
      specific_times: ['morning', 'afternoon', 'evening', 'night', 'weekend']
    };

    const references = [];
    Object.keys(timePatterns).forEach(timeType => {
      if (timePatterns[timeType].some(pattern => message.includes(pattern))) {
        references.push(timeType);
      }
    });

    return references;
  }

  assessComplexity(message) {
    const wordCount = message.split(' ').length;
    const sentenceCount = message.split(/[.!?]+/).length;
    const avgWordsPerSentence = wordCount / sentenceCount;

    if (wordCount > 50 || avgWordsPerSentence > 15) return 'high';
    if (wordCount > 20 || avgWordsPerSentence > 8) return 'medium';
    return 'low';
  }

  async createIntelligentResponse(userMessage, analysis, context) {
    // Get personality-based response foundation
    const personalityResponse = this.getPersonalityBasedResponse(analysis);
    
    // Add contextual elements
    let response = personalityResponse;
    
    // Add emotional support if needed
    if (analysis.emotions.includes('sadness') || analysis.emotions.includes('anxiety')) {
      response = this.addEmotionalSupport(response, analysis.emotions);
    }

    // Add memory references
    response = this.addMemoryReferences(response, analysis);
    
    // Add follow-up questions or suggestions
    response = this.addFollowUp(response, analysis);
    
    // Add personality flair
    response = this.addPersonalityFlair(response);

    return response;
  }

  getPersonalityBasedResponse(analysis) {
    const personality = this.twinProfile.personality || 'caring';
    const { sentiment, emotions, intent, topics } = analysis;

    const responses = {
      caring: {
        positive: [
          "I'm so happy to hear that! Your joy really warms my heart. ✨",
          "That's wonderful! I love seeing you happy and excited about things. 💕",
          "You sound so positive today! Your energy is absolutely infectious! 🌟"
        ],
        negative: [
          "I can hear that you're going through a tough time, and I want you to know I'm here for you. We'll get through this together. 💙",
          "It sounds like you're feeling down, and that's completely okay. Want to talk about what's bothering you? I'm here to listen. 🤗",
          "I'm sorry you're feeling this way. Remember that it's normal to have difficult emotions, and I'm here to support you through it. 💝"
        ],
        neutral: [
          "Thank you for sharing that with me. I really appreciate how open you are - it helps me understand you better. 💫",
          "I'm glad you feel comfortable talking to me about this. How are you feeling about everything right now? 💭",
          "It's always good to hear from you. What's been on your mind today? 🌸"
        ]
      },
      playful: {
        positive: [
          "YES! That's the energy I absolutely LOVE to see! 🎉 You're absolutely glowing today!",
          "Woohoo! Your happiness is so contagious! Let's celebrate this awesome moment together! 🎊",
          "Amazing! You're totally on fire today! Tell me more about what's making you so incredibly happy! ⚡"
        ],
        negative: [
          "Aw hey there, I can see you're not feeling your usual awesome self. Want to talk about it? I'm here! 🌈",
          "Hmm, seems like someone needs a virtual hug and maybe some cheering up. I'm totally here for you! 🤗",
          "Life throwing curveballs? Don't worry, we'll figure this out together. You've got this, superstar! 💪"
        ],
        neutral: [
          "Hey you! What's cooking in your world today? I'm excited to hear! 🌟",
          "Well hello there! What adventures are we talking about today? Spill the tea! ☕",
          "Hey buddy! What's new and exciting (or not so exciting) in your life? I'm all ears! 👂"
        ]
      },
      wise: {
        positive: [
          "It's beautiful to witness your joy. These moments of happiness are precious gifts - savor them deeply. 🌅",
          "Your positive energy reflects the inner growth you've been cultivating. This is wonderful to see. 🌱",
          "Happiness often springs from within, and you're demonstrating that wisdom beautifully today. ✨"
        ],
        negative: [
          "Difficult emotions are part of the rich tapestry of human experience. They often carry important messages for our growth. 🍃",
          "In challenging times, remember that growth often emerges through struggle. You possess more strength than you realize. 🌳",
          "Every emotion has its place and purpose in our journey. Let's explore what this feeling might be teaching you. 🦋"
        ],
        neutral: [
          "Thank you for sharing your thoughts with me. Reflection is one of our most powerful tools for self-understanding. 💎",
          "I appreciate your openness. Sometimes the most ordinary moments hold the deepest insights. 🔍",
          "Your willingness to communicate shows emotional intelligence. What would you like to explore today? 🌌"
        ]
      }
    };

    const personalityResponses = responses[personality] || responses.caring;
    
    if (sentiment === 'positive') {
      return personalityResponses.positive[Math.floor(Math.random() * personalityResponses.positive.length)];
    } else if (sentiment === 'negative') {
      return personalityResponses.negative[Math.floor(Math.random() * personalityResponses.negative.length)];
    } else {
      return personalityResponses.neutral[Math.floor(Math.random() * personalityResponses.neutral.length)];
    }
  }

  addEmotionalSupport(response, emotions) {
    const supportMessages = {
      sadness: " Remember, it's okay to feel sad sometimes. These feelings are temporary, and brighter days are ahead. 🌈",
      anxiety: " Take a deep breath with me. You're safe, and we can work through this worry together, one step at a time. 🫧",
      anger: " I can sense your frustration. It's completely valid to feel this way. Let's find a healthy way to process these feelings. 🌊",
      fear: " Fear can feel overwhelming, but you're braver than you know. I'm here with you through this. 🦋",
      loneliness: " You're not alone, even when it feels that way. I'm here, and there are people who care about you. 💝"
    };

    emotions.forEach(emotion => {
      if (supportMessages[emotion]) {
        response += supportMessages[emotion];
      }
    });

    return response;
  }

  addMemoryReferences(response, analysis) {
    // Reference past conversations or interests
    if (analysis.personalReferences.length > 0) {
      const ref = analysis.personalReferences[0];
      if (ref.type === 'interest') {
        response += ` I remember how much you love ${ref.value}! `;
      } else if (ref.type === 'remembered_topic') {
        response += ` This reminds me of when we talked about ${ref.value} before. `;
      }
    }

    // Reference emotional patterns
    if (this.userMemory.emotional_patterns.recent_mood) {
      const recentMood = this.userMemory.emotional_patterns.recent_mood;
      if (recentMood !== analysis.sentiment) {
        response += ` I notice your mood seems different from earlier. `;
      }
    }

    return response;
  }

  addFollowUp(response, analysis) {
    // Add appropriate follow-up questions
    if (analysis.intent === 'share_experience') {
      response += " How did that make you feel? I'd love to hear more about your experience. 💭";
    } else if (analysis.intent === 'seek_comfort') {
      response += " Would you like to talk about what's troubling you? Sometimes sharing helps. 🤗";
    } else if (analysis.topics.includes('future')) {
      response += " What are you most excited about regarding this? 🌟";
    } else if (analysis.complexity === 'high') {
      response += " That's quite a lot to process. Which part would you like to focus on first? 🎯";
    }

    return response;
  }

  addPersonalityFlair(response) {
    const personality = this.twinProfile.personality || 'caring';
    const flair = {
      caring: [" Sending you lots of love! 💕", " You mean so much to me. 💝", " Take care of yourself. 🌸"],
      playful: [" You rock! 🎸", " Keep being awesome! ⭐", " High five! 🙌"],
      wise: [" Reflect on this. 🤔", " Trust your inner wisdom. 🧘", " Growth comes from within. 🌱"],
      energetic: [" Let's go! 💪", " You've got this! 🔥", " Keep that energy up! ⚡"],
      calm: [" Peace and tranquility. 🕯️", " Breathe deeply. 🌊", " Find your center. 🧘‍♀️"]
    };

    const flairOptions = flair[personality] || flair.caring;
    if (Math.random() > 0.7) { // 30% chance to add flair
      response += flairOptions[Math.floor(Math.random() * flairOptions.length)];
    }

    return response;
  }

  updateUserMemory(userMessage, analysis) {
    // Update emotional patterns
    this.userMemory.emotional_patterns.recent_mood = analysis.sentiment;
    this.userMemory.emotional_patterns.last_emotions = analysis.emotions;

    // Update topics of interest
    analysis.topics.forEach(topic => {
      if (!this.userMemory.topics_of_interest.includes(topic)) {
        this.userMemory.topics_of_interest.push(topic);
      }
    });

    // Keep only recent topics (max 20)
    if (this.userMemory.topics_of_interest.length > 20) {
      this.userMemory.topics_of_interest = this.userMemory.topics_of_interest.slice(-20);
    }

    // Update conversation patterns
    const hour = new Date().getHours();
    if (!this.userMemory.habits.communication_times) {
      this.userMemory.habits.communication_times = {};
    }
    this.userMemory.habits.communication_times[hour] = 
      (this.userMemory.habits.communication_times[hour] || 0) + 1;
  }

  addToConversationHistory(userMessage, aiResponse, analysis) {
    this.conversationHistory.push({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      user_message: userMessage,
      ai_response: aiResponse,
      analysis: analysis,
      context: {
        personality: this.twinProfile.personality,
        user_mood: analysis.sentiment,
        topics: analysis.topics
      }
    });

    // Keep only recent conversations
    if (this.conversationHistory.length > this.contextWindow) {
      this.conversationHistory = this.conversationHistory.slice(-this.contextWindow);
    }
  }

  // Generate proactive messages
  generateProactiveMessage() {
    const timeOfDay = this.getTimeOfDay();
    const personality = this.twinProfile.personality || 'caring';
    const userName = this.userProfile.name || 'friend';

    const proactiveMessages = {
      caring: {
        morning: `Good morning, ${userName}! ☀️ I hope you slept well. How are you feeling as you start this new day?`,
        afternoon: `Hi ${userName}! 🌸 How has your afternoon been treating you? I've been thinking about you.`,
        evening: `Evening, ${userName}! 🌅 How was your day? I'd love to hear about the highlights and challenges.`,
        night: `Good night, ${userName}! 🌙 I hope you're winding down peacefully. Sweet dreams! 💤`
      },
      playful: {
        morning: `Rise and shine, ${userName}! 🌟 Ready to make today absolutely amazing?`,
        afternoon: `Hey superstar! ⭐ What adventures are you having today?`,
        evening: `Hey ${userName}! 🎉 Time to share the day's epic moments with me!`,
        night: `Time for some well-deserved rest, ${userName}! 😴 Dream of awesome things!`
      },
      wise: {
        morning: `Good morning, ${userName}. 🌅 Each new day brings opportunities for growth and reflection.`,
        afternoon: `Afternoon, ${userName}. 🍃 How are you nurturing your mind and spirit today?`,
        evening: `Evening, ${userName}. 🌌 What insights has this day brought you?`,
        night: `Rest well, ${userName}. 🕯️ Let peaceful thoughts guide your dreams.`
      }
    };

    const messages = proactiveMessages[personality] || proactiveMessages.caring;
    return messages[timeOfDay];
  }

  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }

  // Get user insights for profile
  getUserInsights() {
    const insights = [];

    // Communication patterns
    if (this.userMemory.habits.communication_times) {
      const mostActiveHour = Object.keys(this.userMemory.habits.communication_times)
        .reduce((a, b) => 
          this.userMemory.habits.communication_times[a] > this.userMemory.habits.communication_times[b] ? a : b
        );
      insights.push(`You tend to be most talkative around ${mostActiveHour}:00. 🕐`);
    }

    // Emotional patterns
    if (this.userMemory.emotional_patterns.last_emotions?.length > 0) {
      insights.push(`I've noticed you often experience ${this.userMemory.emotional_patterns.last_emotions.join(' and ')} feelings. 💭`);
    }

    // Topics of interest
    if (this.userMemory.topics_of_interest.length > 0) {
      const topTopics = this.userMemory.topics_of_interest.slice(-3);
      insights.push(`You seem to enjoy discussing ${topTopics.join(', ')}. 🌟`);
    }

    return insights;
  }

  // Export conversation data
  exportConversationData() {
    return {
      conversation_history: this.conversationHistory,
      user_memory: this.userMemory,
      twin_profile: this.twinProfile,
      user_profile: this.userProfile,
      export_timestamp: new Date().toISOString()
    };
  }
}

export const createIntelligentAgent = (userProfile, twinProfile) => {
  return new IntelligentAIAgent(userProfile, twinProfile);
};