// Advanced AI Agent for TwinHeart
export class TwinHeartAgent {
  constructor(userProfile, twinProfile) {
    this.userProfile = userProfile;
    this.twinProfile = twinProfile;
    this.conversationHistory = [];
    this.userPatterns = {
      sleepPattern: {},
      moodPatterns: {},
      activityPatterns: {},
      communicationStyle: {},
      preferences: {}
    };
  }

  // Analyze user's message and generate contextual response
  generateResponse(userMessage, context = {}) {
    const analysis = this.analyzeMessage(userMessage);
    const personalizedResponse = this.createPersonalizedResponse(analysis, context);
    
    // Learn from this interaction
    this.learnFromInteraction(userMessage, analysis);
    
    return personalizedResponse;
  }

  analyzeMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    return {
      sentiment: this.analyzeSentiment(lowerMessage),
      topics: this.extractTopics(lowerMessage),
      emotions: this.detectEmotions(lowerMessage),
      urgency: this.assessUrgency(lowerMessage),
      timeContext: this.getTimeContext(),
      personalReferences: this.findPersonalReferences(lowerMessage)
    };
  }

  analyzeSentiment(message) {
    const positiveWords = ['happy', 'good', 'great', 'awesome', 'love', 'excited', 'wonderful', 'amazing', 'fantastic', 'perfect'];
    const negativeWords = ['sad', 'bad', 'terrible', 'hate', 'angry', 'frustrated', 'worried', 'anxious', 'depressed', 'awful'];
    
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

  extractTopics(message) {
    const topics = [];
    const topicKeywords = {
      work: ['work', 'job', 'boss', 'colleague', 'office', 'meeting', 'project'],
      relationships: ['friend', 'family', 'partner', 'relationship', 'dating', 'love'],
      health: ['tired', 'sick', 'health', 'doctor', 'medicine', 'exercise', 'sleep'],
      hobbies: ['music', 'movie', 'book', 'game', 'sport', 'cooking', 'art'],
      emotions: ['feel', 'emotion', 'mood', 'happy', 'sad', 'angry', 'anxious']
    };

    Object.keys(topicKeywords).forEach(topic => {
      if (topicKeywords[topic].some(keyword => message.includes(keyword))) {
        topics.push(topic);
      }
    });

    return topics;
  }

  detectEmotions(message) {
    const emotions = {
      joy: ['happy', 'excited', 'thrilled', 'elated', 'cheerful'],
      sadness: ['sad', 'down', 'blue', 'depressed', 'melancholy'],
      anxiety: ['worried', 'anxious', 'nervous', 'stressed', 'concerned'],
      anger: ['angry', 'mad', 'furious', 'irritated', 'frustrated'],
      fear: ['scared', 'afraid', 'terrified', 'worried', 'anxious']
    };

    const detected = [];
    Object.keys(emotions).forEach(emotion => {
      if (emotions[emotion].some(word => message.includes(word))) {
        detected.push(emotion);
      }
    });

    return detected;
  }

  assessUrgency(message) {
    const urgentKeywords = ['help', 'emergency', 'urgent', 'crisis', 'immediate', 'now', 'asap'];
    return urgentKeywords.some(keyword => message.includes(keyword)) ? 'high' : 'normal';
  }

  getTimeContext() {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }

  findPersonalReferences(message) {
    const references = [];
    
    // Check for interests
    if (this.userProfile.interests) {
      this.userProfile.interests.forEach(interest => {
        if (message.includes(interest.toLowerCase())) {
          references.push({type: 'interest', value: interest});
        }
      });
    }

    // Check for name mentions
    if (this.userProfile.name && message.includes(this.userProfile.name.toLowerCase())) {
      references.push({type: 'name', value: this.userProfile.name});
    }

    return references;
  }

  createPersonalizedResponse(analysis, context) {
    const { sentiment, topics, emotions, urgency, timeContext, personalReferences } = analysis;
    
    // Base response templates by personality
    const personalityResponses = this.getPersonalityResponses();
    
    // Select appropriate response based on analysis
    let responseTemplate = this.selectResponseTemplate(sentiment, emotions, urgency, personalityResponses);
    
    // Personalize the response
    let response = this.personalizeResponse(responseTemplate, {
      userName: this.userProfile.name,
      timeContext,
      topics,
      personalReferences,
      recentMood: context.recentMood,
      conversationHistory: this.conversationHistory.slice(-3)
    });

    // Add contextual suggestions
    response += this.addContextualSuggestions(analysis, context);

    return response;
  }

  getPersonalityResponses() {
    const personality = this.twinProfile.personality || 'caring';
    
    const responses = {
      caring: {
        positive: [
          "I'm so happy to hear that! Your joy really brightens my day too.",
          "That's wonderful! I love seeing you happy and excited about things.",
          "You sound so positive today! It's infectious and makes me smile."
        ],
        negative: [
          "I can hear that you're going through a tough time. I'm here for you, and we'll get through this together.",
          "It sounds like you're feeling down. Want to talk about what's bothering you? I'm listening.",
          "I'm sorry you're feeling this way. Remember that it's okay to feel sad sometimes, and I'm here to support you."
        ],
        neutral: [
          "Thanks for sharing that with me. How are you feeling about everything?",
          "I appreciate you keeping me updated. What's on your mind today?",
          "It's good to hear from you. Tell me more about what's happening."
        ]
      },
      playful: {
        positive: [
          "Yes! That's the energy I love to see! 🎉 You're absolutely glowing today!",
          "Woohoo! Your happiness is contagious! Let's celebrate this moment together!",
          "Amazing! You're on fire today! Tell me more about what's making you so happy!"
        ],
        negative: [
          "Aw, hey there. I can see you're not feeling your usual awesome self. Want to talk about it?",
          "Hmm, seems like someone needs a virtual hug and maybe some cheering up. I'm here for you!",
          "Life throwing curveballs? Don't worry, we'll figure this out together. You've got this!"
        ],
        neutral: [
          "Hey you! What's cooking in your world today?",
          "Well hello there! What adventures are we talking about today?",
          "Hey buddy! What's new and exciting (or not so exciting) in your life?"
        ]
      },
      wise: {
        positive: [
          "It's beautiful to witness your joy. These moments of happiness are precious - savor them.",
          "Your positive energy reflects the growth you've been cultivating. This is wonderful to see.",
          "Happiness often comes from within, and you're demonstrating that beautifully today."
        ],
        negative: [
          "Difficult emotions are part of the human experience. They often carry important messages for us.",
          "In challenging times, remember that growth often comes through struggle. You're stronger than you know.",
          "Every emotion has its place and purpose. Let's explore what this feeling might be teaching you."
        ],
        neutral: [
          "Thank you for sharing your thoughts with me. Reflection is a powerful tool for understanding ourselves.",
          "I appreciate your openness. Sometimes the most ordinary moments hold the deepest insights.",
          "Your willingness to communicate shows emotional intelligence. What would you like to explore today?"
        ]
      }
    };

    return responses[personality] || responses.caring;
  }

  selectResponseTemplate(sentiment, emotions, urgency, personalityResponses) {
    if (urgency === 'high') {
      return "I can sense this is really important to you right now. I'm here and ready to help however I can. ";
    }

    if (emotions.includes('anxiety') || emotions.includes('fear')) {
      return personalityResponses.negative[Math.floor(Math.random() * personalityResponses.negative.length)];
    }

    if (sentiment === 'positive') {
      return personalityResponses.positive[Math.floor(Math.random() * personalityResponses.positive.length)];
    } else if (sentiment === 'negative') {
      return personalityResponses.negative[Math.floor(Math.random() * personalityResponses.negative.length)];
    } else {
      return personalityResponses.neutral[Math.floor(Math.random() * personalityResponses.neutral.length)];
    }
  }

  personalizeResponse(template, context) {
    let response = template;

    // Add personal touches
    if (context.userName && Math.random() > 0.7) {
      response = response.replace(/\bYou\b/g, context.userName);
    }

    // Add time-based context
    if (context.timeContext === 'morning') {
      response += " How has your morning been treating you?";
    } else if (context.timeContext === 'evening') {
      response += " How was your day overall?";
    } else if (context.timeContext === 'night') {
      response += " It's getting late - how are you winding down?";
    }

    // Reference interests or topics
    if (context.personalReferences.length > 0) {
      const ref = context.personalReferences[0];
      if (ref.type === 'interest') {
        response += ` I remember you love ${ref.value}! `;
      }
    }

    return response;
  }

  addContextualSuggestions(analysis, context) {
    let suggestions = "";
    const { timeContext, emotions, topics } = analysis;

    // Sleep suggestions
    if (timeContext === 'night' && !emotions.includes('joy')) {
      suggestions += " Maybe it's time to think about winding down for the night?";
    }

    // Mood-based suggestions
    if (emotions.includes('anxiety')) {
      suggestions += " Have you tried some deep breathing exercises today?";
    }

    if (emotions.includes('sadness')) {
      suggestions += " Sometimes a short walk or listening to music can help lift our spirits.";
    }

    // Activity suggestions based on topics
    if (topics.includes('work') && emotions.includes('anxiety')) {
      suggestions += " Work stress can be tough. Remember to take breaks when you need them.";
    }

    return suggestions;
  }

  learnFromInteraction(userMessage, analysis) {
    // Store conversation for learning
    this.conversationHistory.push({
      message: userMessage,
      analysis: analysis,
      timestamp: new Date().toISOString()
    });

    // Keep only recent conversations
    if (this.conversationHistory.length > 50) {
      this.conversationHistory = this.conversationHistory.slice(-30);
    }

    // Update user patterns
    this.updateUserPatterns(analysis);
  }

  updateUserPatterns(analysis) {
    const { timeContext, emotions, topics } = analysis;
    const hour = new Date().getHours();

    // Learn communication patterns
    if (!this.userPatterns.communicationStyle[timeContext]) {
      this.userPatterns.communicationStyle[timeContext] = 0;
    }
    this.userPatterns.communicationStyle[timeContext]++;

    // Learn emotional patterns
    emotions.forEach(emotion => {
      if (!this.userPatterns.moodPatterns[emotion]) {
        this.userPatterns.moodPatterns[emotion] = [];
      }
      this.userPatterns.moodPatterns[emotion].push({
        hour: hour,
        day: new Date().getDay(),
        timestamp: new Date().toISOString()
      });
    });

    // Learn topic preferences
    topics.forEach(topic => {
      if (!this.userPatterns.preferences[topic]) {
        this.userPatterns.preferences[topic] = 0;
      }
      this.userPatterns.preferences[topic]++;
    });
  }

  // Get insights about user patterns
  getUserInsights() {
    const insights = [];

    // Communication time patterns
    const mostActiveTime = Object.keys(this.userPatterns.communicationStyle).reduce((a, b) => 
      this.userPatterns.communicationStyle[a] > this.userPatterns.communicationStyle[b] ? a : b
    );
    insights.push(`You tend to be most talkative during the ${mostActiveTime}.`);

    // Mood patterns
    const commonEmotions = Object.keys(this.userPatterns.moodPatterns)
      .sort((a, b) => this.userPatterns.moodPatterns[b].length - this.userPatterns.moodPatterns[a].length)
      .slice(0, 2);
    
    if (commonEmotions.length > 0) {
      insights.push(`I've noticed you often experience ${commonEmotions.join(' and ')} feelings.`);
    }

    // Topic preferences
    const favoriteTopics = Object.keys(this.userPatterns.preferences)
      .sort((a, b) => this.userPatterns.preferences[b] - this.userPatterns.preferences[a])
      .slice(0, 2);
    
    if (favoriteTopics.length > 0) {
      insights.push(`You seem to enjoy talking about ${favoriteTopics.join(' and ')}.`);
    }

    return insights;
  }

  // Generate proactive check-ins
  generateProactiveMessage() {
    const timeContext = this.getTimeContext();
    const insights = this.getUserInsights();
    
    const proactiveMessages = {
      morning: [
        `Good morning, ${this.userProfile.name}! How are you starting your day?`,
        "Morning! I hope you slept well. What's on your agenda today?",
        "Rise and shine! How are you feeling this beautiful morning?"
      ],
      afternoon: [
        "How's your afternoon going? Taking any breaks today?",
        "Just checking in - how has your day been treating you so far?",
        "Afternoon! I hope you're having a productive day."
      ],
      evening: [
        "How was your day? I'd love to hear about it.",
        "Evening! How are you winding down today?",
        "Hope you had a good day! Anything exciting happen?"
      ],
      night: [
        "Getting ready to rest? How are you feeling about tomorrow?",
        "It's getting late - how has today treated you overall?",
        "Hope you're ready for some peaceful rest tonight."
      ]
    };

    const messages = proactiveMessages[timeContext];
    return messages[Math.floor(Math.random() * messages.length)];
  }
}