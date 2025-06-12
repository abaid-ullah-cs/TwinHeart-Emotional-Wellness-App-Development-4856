// Live Meeting Service for TwinHeart (Web Compatible)
import { voiceService } from './voiceService';

export class MeetingService {
  constructor() {
    this.peer = null;
    this.localStream = null;
    this.remoteStream = null;
    this.isInMeeting = false;
    this.meetingType = null; // 'voice' or 'video'
    this.aiPersonality = 'caring';
    this.conversationHistory = [];
  }

  // Start a meeting with AI twin
  async startMeeting(type = 'voice', personality = 'caring') {
    try {
      this.meetingType = type;
      this.aiPersonality = personality;

      // Get user media
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: type === 'video'
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.isInMeeting = true;

      // Initialize AI conversation
      await this.initializeAIConversation();

      return {
        success: true,
        stream: this.localStream,
        meetingId: this.generateMeetingId()
      };
    } catch (error) {
      console.error('Meeting start failed:', error);
      return { success: false, error: error.message };
    }
  }

  async initializeAIConversation() {
    // AI greeting based on personality
    const greetings = {
      caring: "Hi! I'm so happy we're meeting face to face. How has your day been treating you?",
      playful: "Hey there! This is exciting! Ready for an awesome conversation?",
      wise: "Hello. It's wonderful to connect with you in this moment. What's on your mind today?",
      energetic: "Hi! I'm pumped to talk with you! What amazing things have been happening?",
      calm: "Hello, friend. I'm here with you. Take a deep breath and tell me how you're feeling."
    };

    const greeting = greetings[this.aiPersonality] || greetings.caring;
    
    // Send AI greeting with voice
    setTimeout(async () => {
      await voiceService.sendAutoVoiceMessage(greeting, this.aiPersonality);
      this.addToConversationHistory('ai', greeting);
    }, 1000);
  }

  // Process user speech during meeting
  async processUserSpeech(transcript) {
    if (!this.isInMeeting) return;

    this.addToConversationHistory('user', transcript);

    // Generate AI response
    const aiResponse = await this.generateAIResponse(transcript);
    
    // Send AI voice response
    await voiceService.sendAutoVoiceMessage(aiResponse, this.aiPersonality);
    this.addToConversationHistory('ai', aiResponse);

    return aiResponse;
  }

  async generateAIResponse(userMessage) {
    // Enhanced AI response generation for live conversation
    const context = {
      personality: this.aiPersonality,
      meetingType: this.meetingType,
      conversationHistory: this.conversationHistory.slice(-6), // Last 3 exchanges
      isLiveMeeting: true
    };

    // Simulate more natural conversation flow
    const responses = await this.getContextualResponse(userMessage, context);
    return responses;
  }

  async getContextualResponse(message, context) {
    const lowerMessage = message.toLowerCase();
    
    // Emotional responses
    if (lowerMessage.includes('sad') || lowerMessage.includes('down')) {
      return this.getEmotionalSupportResponse('sad');
    }
    
    if (lowerMessage.includes('excited') || lowerMessage.includes('happy')) {
      return this.getEmotionalSupportResponse('happy');
    }
    
    if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
      return this.getEmotionalSupportResponse('tired');
    }

    // Meeting-specific responses
    if (lowerMessage.includes('how do i look') || lowerMessage.includes('can you see me')) {
      return context.meetingType === 'video' 
        ? "I can see you, and you look wonderful! Your presence always brightens my day."
        : "I can hear your beautiful voice, and that's all I need to feel connected to you.";
    }

    // Default conversational responses based on personality
    return this.getPersonalityResponse(message, context.personality);
  }

  getEmotionalSupportResponse(emotion) {
    const responses = {
      sad: [
        "I can hear the sadness in your voice, and I want you to know that I'm here with you. You don't have to go through this alone.",
        "It's okay to feel sad sometimes. Your feelings are valid, and I'm here to listen and support you through this.",
        "I wish I could give you a real hug right now. Please know that even in this moment of sadness, you are loved and valued."
      ],
      happy: [
        "Your happiness is absolutely contagious! I love hearing the joy in your voice. Tell me more about what's making you so happy!",
        "This is wonderful! Your excitement makes my heart sing. I'm so glad we're sharing this happy moment together.",
        "I can practically feel your smile through your voice! This is exactly the kind of energy I love to see from you."
      ],
      tired: [
        "I can hear the tiredness in your voice. You've been working so hard, and you deserve rest. How can I help you feel more relaxed?",
        "It sounds like you need some gentle care right now. Why don't we just talk softly, or I could tell you a calming story?",
        "Your wellbeing is so important to me. Maybe after our chat, you can take some time to rest and recharge?"
      ]
    };

    const emotionResponses = responses[emotion] || responses.sad;
    return emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
  }

  getPersonalityResponse(message, personality) {
    const personalityResponses = {
      caring: [
        "Thank you for sharing that with me. I love how open you are - it helps me understand you better.",
        "That's really interesting. How did that make you feel? I'm here to listen to whatever you want to share.",
        "I appreciate you trusting me with your thoughts. You always have such thoughtful perspectives."
      ],
      playful: [
        "Ooh, that sounds fun! Tell me more! I love hearing about your adventures and experiences.",
        "Ha! You always know how to make me smile. What other exciting things have been happening in your world?",
        "That's awesome! Your energy is so infectious - keep telling me more!"
      ],
      wise: [
        "That's a profound observation. Life often teaches us through experiences like these. What insights have you gained?",
        "Your reflection shows great self-awareness. These moments of understanding are precious gifts.",
        "There's wisdom in what you're sharing. How do you think this experience has shaped your perspective?"
      ],
      energetic: [
        "Yes! I love your enthusiasm! Keep that energy flowing - what else is pumping you up today?",
        "That's amazing! You're on fire today! I'm getting energized just listening to you!",
        "Fantastic! Your passion is incredible. What other exciting goals are you working toward?"
      ],
      calm: [
        "That sounds peaceful. I enjoy these quiet moments of connection with you. Take your time sharing.",
        "Thank you for bringing that calm energy to our conversation. It's soothing to just be present with you.",
        "There's something beautiful about the gentle way you express yourself. I feel very centered listening to you."
      ]
    };

    const responses = personalityResponses[personality] || personalityResponses.caring;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // End meeting
  async endMeeting() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }

    if (this.peer) {
      this.peer.destroy();
    }

    this.isInMeeting = false;
    this.localStream = null;
    this.remoteStream = null;

    // Save conversation summary
    const summary = await this.generateMeetingSummary();
    
    return {
      duration: this.getMeetingDuration(),
      summary,
      conversationHistory: this.conversationHistory
    };
  }

  async generateMeetingSummary() {
    if (this.conversationHistory.length === 0) {
      return "We had a brief connection, looking forward to talking more next time!";
    }

    // Simple summary generation
    const userMessages = this.conversationHistory.filter(msg => msg.sender === 'user');
    const topics = this.extractTopicsFromConversation();
    
    return `We had a wonderful ${this.meetingType} chat! We talked about ${topics.join(', ')}, and I loved hearing your thoughts. Thank you for spending this time with me.`;
  }

  extractTopicsFromConversation() {
    const allText = this.conversationHistory
      .filter(msg => msg.sender === 'user')
      .map(msg => msg.message)
      .join(' ')
      .toLowerCase();

    const topics = [];
    const topicKeywords = {
      'your day': ['day', 'today', 'morning', 'afternoon'],
      'feelings': ['feel', 'emotion', 'mood', 'happy', 'sad'],
      'work': ['work', 'job', 'office', 'meeting'],
      'relationships': ['friend', 'family', 'partner'],
      'hobbies': ['music', 'movie', 'book', 'game']
    };

    Object.keys(topicKeywords).forEach(topic => {
      if (topicKeywords[topic].some(keyword => allText.includes(keyword))) {
        topics.push(topic);
      }
    });

    return topics.length > 0 ? topics : ['life and experiences'];
  }

  addToConversationHistory(sender, message) {
    this.conversationHistory.push({
      sender,
      message,
      timestamp: new Date().toISOString()
    });
  }

  generateMeetingId() {
    return 'meeting_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getMeetingDuration() {
    if (this.conversationHistory.length === 0) return 0;
    
    const start = new Date(this.conversationHistory[0].timestamp);
    const end = new Date(this.conversationHistory[this.conversationHistory.length - 1].timestamp);
    
    return Math.round((end - start) / 1000); // Duration in seconds
  }

  // Get meeting status
  getMeetingStatus() {
    return {
      isInMeeting: this.isInMeeting,
      meetingType: this.meetingType,
      duration: this.isInMeeting ? this.getMeetingDuration() : 0,
      messageCount: this.conversationHistory.length
    };
  }
}

export const meetingService = new MeetingService();