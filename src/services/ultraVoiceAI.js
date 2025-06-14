// Ultra-Realistic Voice AI Platform for TwinHeart
import { v4 as uuidv4 } from 'uuid';

export class UltraVoiceAI {
  constructor() {
    this.isSupported = 'speechSynthesis' in window;
    this.synthesis = window.speechSynthesis;
    this.recognition = null;
    this.audioContext = null;
    this.isProcessing = false;
    this.currentCall = null;
    this.voiceProfiles = this.initializeVoiceProfiles();
    
    this.initializeAudioContext();
    this.initializeRecognition();
    this.loadVoices();
  }

  initializeVoiceProfiles() {
    return {
      sophie: {
        id: 'sophie',
        name: 'Sophie',
        description: 'A calm, conversational, feminine voice perfect for narration stories or phone calls',
        personality: 'calm',
        accent: 'american',
        gender: 'female',
        age: 'young-adult',
        tone: 'warm',
        rate: 0.85,
        pitch: 1.1,
        volume: 0.9,
        avatar: '👩🏻‍💼',
        specialties: ['narration', 'phone-calls', 'meditation', 'storytelling'],
        emotions: {
          happy: { rate: 0.9, pitch: 1.2 },
          sad: { rate: 0.7, pitch: 0.9 },
          excited: { rate: 1.0, pitch: 1.3 },
          calm: { rate: 0.8, pitch: 1.0 }
        }
      },
      savannah: {
        id: 'savannah',
        name: 'Savannah',
        description: 'A smooth, calm Southern female voice',
        personality: 'southern-charm',
        accent: 'southern',
        gender: 'female',
        age: 'adult',
        tone: 'smooth',
        rate: 0.8,
        pitch: 1.0,
        volume: 0.85,
        avatar: '👩🏼‍🌾',
        specialties: ['casual-chat', 'comfort', 'advice', 'storytelling'],
        emotions: {
          happy: { rate: 0.85, pitch: 1.1 },
          sad: { rate: 0.65, pitch: 0.85 },
          excited: { rate: 0.95, pitch: 1.2 },
          calm: { rate: 0.75, pitch: 0.95 }
        }
      },
      brooke: {
        id: 'brooke',
        name: 'Brooke',
        description: 'A friendly and natural American female voice that feels warm, engaging, and easy to listen to',
        personality: 'friendly',
        accent: 'american',
        gender: 'female',
        age: 'young-adult',
        tone: 'engaging',
        rate: 0.9,
        pitch: 1.15,
        volume: 0.95,
        avatar: '👩🏻‍💻',
        specialties: ['conversation', 'support', 'coaching', 'entertainment'],
        emotions: {
          happy: { rate: 1.0, pitch: 1.25 },
          sad: { rate: 0.75, pitch: 1.0 },
          excited: { rate: 1.1, pitch: 1.35 },
          calm: { rate: 0.85, pitch: 1.1 }
        }
      },
      amelie: {
        id: 'amelie',
        name: 'Amélie',
        description: 'Soft and calm voice, suited for soothing conversations in French',
        personality: 'sophisticated',
        accent: 'french',
        gender: 'female',
        age: 'adult',
        tone: 'soothing',
        rate: 0.75,
        pitch: 1.05,
        volume: 0.8,
        avatar: '👩🏻‍🎨',
        specialties: ['meditation', 'relaxation', 'poetry', 'romance'],
        emotions: {
          happy: { rate: 0.8, pitch: 1.15 },
          sad: { rate: 0.6, pitch: 0.9 },
          excited: { rate: 0.9, pitch: 1.2 },
          calm: { rate: 0.7, pitch: 1.0 }
        }
      },
      marta: {
        id: 'marta',
        name: 'Marta',
        description: 'A smooth, casual South American Spanish-speaking woman, great for casual conversations',
        personality: 'casual',
        accent: 'spanish',
        gender: 'female',
        age: 'young-adult',
        tone: 'casual',
        rate: 0.9,
        pitch: 1.1,
        volume: 0.9,
        avatar: '👩🏽‍💃',
        specialties: ['casual-chat', 'humor', 'dance', 'culture'],
        emotions: {
          happy: { rate: 1.0, pitch: 1.2 },
          sad: { rate: 0.7, pitch: 0.95 },
          excited: { rate: 1.15, pitch: 1.3 },
          calm: { rate: 0.8, pitch: 1.05 }
        }
      },
      alex: {
        id: 'alex',
        name: 'Alex',
        description: 'A confident, professional male voice perfect for business and presentations',
        personality: 'professional',
        accent: 'british',
        gender: 'male',
        age: 'adult',
        tone: 'confident',
        rate: 0.85,
        pitch: 0.9,
        volume: 0.9,
        avatar: '👨🏻‍💼',
        specialties: ['business', 'presentations', 'coaching', 'news'],
        emotions: {
          happy: { rate: 0.9, pitch: 0.95 },
          sad: { rate: 0.7, pitch: 0.8 },
          excited: { rate: 1.0, pitch: 1.0 },
          calm: { rate: 0.8, pitch: 0.85 }
        }
      },
      marcus: {
        id: 'marcus',
        name: 'Marcus',
        description: 'A warm, wise voice with gravitas, perfect for mentoring and deep conversations',
        personality: 'wise',
        accent: 'american',
        gender: 'male',
        age: 'mature',
        tone: 'wise',
        rate: 0.75,
        pitch: 0.85,
        volume: 0.85,
        avatar: '👨🏿‍🏫',
        specialties: ['mentoring', 'wisdom', 'philosophy', 'guidance'],
        emotions: {
          happy: { rate: 0.8, pitch: 0.9 },
          sad: { rate: 0.65, pitch: 0.75 },
          excited: { rate: 0.85, pitch: 0.95 },
          calm: { rate: 0.7, pitch: 0.8 }
        }
      }
    };
  }

  async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log('🎵 Ultra Voice AI initialized');
    } catch (error) {
      console.error('Audio context failed:', error);
    }
  }

  initializeRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 3;
  }

  loadVoices() {
    this.synthesis.onvoiceschanged = () => {
      this.availableVoices = this.synthesis.getVoices();
      this.mapVoicesToProfiles();
    };
    this.availableVoices = this.synthesis.getVoices();
    this.mapVoicesToProfiles();
  }

  mapVoicesToProfiles() {
    Object.keys(this.voiceProfiles).forEach(profileId => {
      const profile = this.voiceProfiles[profileId];
      
      // Find best matching system voice
      const matchingVoice = this.findBestVoiceMatch(profile);
      if (matchingVoice) {
        profile.systemVoice = matchingVoice;
      }
    });
  }

  findBestVoiceMatch(profile) {
    if (!this.availableVoices || this.availableVoices.length === 0) return null;

    // Priority matching by gender and accent
    const genderMatches = this.availableVoices.filter(voice => {
      const name = voice.name.toLowerCase();
      if (profile.gender === 'female') {
        return name.includes('female') || name.includes('woman') || 
               name.includes('samantha') || name.includes('karen') || 
               name.includes('zira') || name.includes('susan');
      } else {
        return name.includes('male') || name.includes('man') || 
               name.includes('david') || name.includes('mark') || 
               name.includes('daniel');
      }
    });

    // Accent matching
    const accentMatches = this.availableVoices.filter(voice => {
      const lang = voice.lang.toLowerCase();
      switch (profile.accent) {
        case 'british': return lang.includes('gb') || lang.includes('uk');
        case 'french': return lang.includes('fr');
        case 'spanish': return lang.includes('es');
        case 'southern':
        case 'american': 
        default: return lang.includes('us') || lang.includes('en');
      }
    });

    // Return best match
    return genderMatches.find(v => accentMatches.includes(v)) || 
           genderMatches[0] || 
           accentMatches[0] || 
           this.availableVoices.find(v => v.lang.startsWith('en')) ||
           this.availableVoices[0];
  }

  // Ultra-realistic text-to-speech
  async speak(text, voiceId = 'sophie', emotion = 'calm', options = {}) {
    if (!text || !this.synthesis) return false;

    this.synthesis.cancel();
    
    const profile = this.voiceProfiles[voiceId] || this.voiceProfiles.sophie;
    const emotionSettings = profile.emotions[emotion] || profile.emotions.calm;
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply voice profile settings
    if (profile.systemVoice) {
      utterance.voice = profile.systemVoice;
    }
    
    utterance.rate = options.rate || emotionSettings.rate || profile.rate;
    utterance.pitch = options.pitch || emotionSettings.pitch || profile.pitch;
    utterance.volume = options.volume || profile.volume;

    // Add natural pauses and emphasis
    const processedText = this.addNaturalSpeechPatterns(text, profile);
    utterance.text = processedText;

    return new Promise((resolve, reject) => {
      utterance.onstart = () => {
        console.log(`🎵 ${profile.name} started speaking:`, text.substring(0, 50) + '...');
      };

      utterance.onend = () => {
        console.log(`✅ ${profile.name} finished speaking`);
        resolve(true);
      };

      utterance.onerror = (error) => {
        console.error(`❌ ${profile.name} speech error:`, error);
        reject(error);
      };

      try {
        this.synthesis.speak(utterance);
      } catch (error) {
        reject(error);
      }
    });
  }

  addNaturalSpeechPatterns(text, profile) {
    let processedText = text;

    // Add pauses for natural speech
    processedText = processedText.replace(/\./g, '. ');
    processedText = processedText.replace(/,/g, ', ');
    processedText = processedText.replace(/;/g, '; ');
    processedText = processedText.replace(/:/g, ': ');

    // Add emphasis based on personality
    switch (profile.personality) {
      case 'friendly':
        processedText = processedText.replace(/!/g, '! ');
        break;
      case 'calm':
        processedText = processedText.replace(/\?/g, '? ');
        break;
      case 'southern-charm':
        processedText = processedText.replace(/\byou\b/g, 'y\'all');
        break;
    }

    return processedText;
  }

  // Start a phone call simulation
  async startPhoneCall(voiceId = 'sophie', scenario = 'casual') {
    const profile = this.voiceProfiles[voiceId];
    if (!profile) return null;

    this.currentCall = {
      id: uuidv4(),
      voiceId,
      scenario,
      startTime: new Date(),
      duration: 0,
      transcript: [],
      isActive: true
    };

    // Start with greeting
    const greeting = this.getCallGreeting(scenario, profile);
    await this.speak(greeting, voiceId, 'happy');

    this.currentCall.transcript.push({
      speaker: 'ai',
      text: greeting,
      timestamp: new Date(),
      emotion: 'happy'
    });

    // Start listening for user response
    this.startCallListening();

    return this.currentCall;
  }

  getCallGreeting(scenario, profile) {
    const greetings = {
      casual: [
        `Hi there! This is ${profile.name}. How's your day going?`,
        `Hello! It's ${profile.name} calling. I hope you're having a wonderful day!`,
        `Hey! This is ${profile.name}. I was thinking about you and wanted to chat!`
      ],
      business: [
        `Good day! This is ${profile.name} calling. How may I assist you today?`,
        `Hello, this is ${profile.name}. Thank you for taking my call.`,
        `Good morning! ${profile.name} here. I hope you're having a productive day.`
      ],
      support: [
        `Hi, this is ${profile.name} from TwinHeart support. How can I help you today?`,
        `Hello! This is ${profile.name}. I'm here to help with any questions you might have.`,
        `Hi there! ${profile.name} calling to check in. How are things going?`
      ],
      joke: [
        `Hey! It's ${profile.name}! I've got some great jokes to share with you today!`,
        `Hello! This is ${profile.name}, your personal comedian for the day!`,
        `Hi there! ${profile.name} here with some humor to brighten your day!`
      ]
    };

    const scenarioGreetings = greetings[scenario] || greetings.casual;
    return scenarioGreetings[Math.floor(Math.random() * scenarioGreetings.length)];
  }

  async startCallListening() {
    if (!this.recognition || !this.currentCall) return;

    this.recognition.onresult = async (event) => {
      const result = event.results[event.results.length - 1];
      if (result.isFinal) {
        const userText = result[0].transcript;
        
        this.currentCall.transcript.push({
          speaker: 'user',
          text: userText,
          timestamp: new Date()
        });

        // Generate AI response
        const response = await this.generateCallResponse(userText, this.currentCall);
        
        this.currentCall.transcript.push({
          speaker: 'ai',
          text: response.text,
          timestamp: new Date(),
          emotion: response.emotion
        });

        // Speak the response
        await this.speak(response.text, this.currentCall.voiceId, response.emotion);
      }
    };

    this.recognition.start();
  }

  async generateCallResponse(userInput, call) {
    const profile = this.voiceProfiles[call.voiceId];
    const lowerInput = userInput.toLowerCase();

    // Analyze user input for emotion and intent
    const emotion = this.detectEmotionInSpeech(lowerInput);
    const intent = this.detectIntent(lowerInput);

    // Generate contextual response based on scenario
    let responseText = '';
    let responseEmotion = 'calm';

    switch (call.scenario) {
      case 'joke':
        responseText = this.generateJokeResponse(lowerInput, profile);
        responseEmotion = 'happy';
        break;
      case 'business':
        responseText = this.generateBusinessResponse(lowerInput, profile);
        responseEmotion = 'calm';
        break;
      case 'support':
        responseText = this.generateSupportResponse(lowerInput, profile, emotion);
        responseEmotion = emotion === 'sad' ? 'calm' : 'happy';
        break;
      default:
        responseText = this.generateCasualResponse(lowerInput, profile, call.transcript);
        responseEmotion = emotion === 'happy' ? 'happy' : 'calm';
    }

    return { text: responseText, emotion: responseEmotion };
  }

  generateJokeResponse(input, profile) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "I told my wife she was drawing her eyebrows too high. She looked surprised!",
      "Why don't eggs tell jokes? They'd crack each other up!",
      "What do you call a fake noodle? An impasta!",
      "Why did the scarecrow win an award? He was outstanding in his field!",
      "What do you call a dinosaur that crashes his car? Tyrannosaurus Wrecks!",
      "Why don't skeletons fight each other? They don't have the guts!",
      "What's the best thing about Switzerland? I don't know, but the flag is a big plus!"
    ];

    if (input.includes('another') || input.includes('more')) {
      return `Here's another one for you: ${jokes[Math.floor(Math.random() * jokes.length)]} Did that make you smile?`;
    }

    if (input.includes('funny') || input.includes('good')) {
      return `I'm so glad you enjoyed that! Here's another: ${jokes[Math.floor(Math.random() * jokes.length)]}`;
    }

    return `${jokes[Math.floor(Math.random() * jokes.length)]} Would you like to hear another one?`;
  }

  generateBusinessResponse(input, profile) {
    if (input.includes('help') || input.includes('assist')) {
      return "I'd be happy to help you with that. Could you tell me more about what you need assistance with?";
    }

    if (input.includes('meeting') || input.includes('schedule')) {
      return "Regarding scheduling, I can help coordinate that for you. What timeframe works best for you?";
    }

    if (input.includes('thank')) {
      return "You're very welcome! Is there anything else I can help you with today?";
    }

    return "I understand. Let me see how I can best assist you with that. Could you provide a bit more detail?";
  }

  generateSupportResponse(input, profile, emotion) {
    if (emotion === 'sad' || input.includes('problem') || input.includes('issue')) {
      return "I'm sorry to hear you're experiencing difficulties. I'm here to help you through this. Can you tell me more about what's happening?";
    }

    if (input.includes('thank') || input.includes('better')) {
      return "I'm so glad I could help! That's exactly what I'm here for. Is there anything else you'd like to discuss?";
    }

    if (input.includes('confused') || input.includes('understand')) {
      return "I completely understand that this can be confusing. Let me break it down for you step by step.";
    }

    return "I hear you, and I want to make sure we get this resolved for you. What would be most helpful right now?";
  }

  generateCasualResponse(input, profile, transcript) {
    // Context-aware responses based on conversation history
    const recentTopics = transcript.slice(-4).map(t => t.text.toLowerCase());
    
    if (input.includes('how are you') || input.includes('how\'s your day')) {
      return `I'm doing wonderfully, thank you for asking! I love getting to chat with you. How has your day been treating you?`;
    }

    if (input.includes('tired') || input.includes('exhausted')) {
      return `Oh, it sounds like you've had a long day. Would you like to talk about what's been keeping you busy, or would you prefer something more relaxing?`;
    }

    if (input.includes('excited') || input.includes('happy')) {
      return `That's fantastic! I love hearing the excitement in your voice. What's got you feeling so positive today?`;
    }

    if (input.includes('weather')) {
      return `The weather can really affect our mood, can't it? I hope you're staying comfortable wherever you are!`;
    }

    // Default responses with personality
    const responses = {
      sophie: [
        "That's really interesting. I'd love to hear more about your thoughts on that.",
        "I appreciate you sharing that with me. How do you feel about the situation?",
        "That sounds like quite an experience. What was the most memorable part for you?"
      ],
      brooke: [
        "Oh wow, that sounds amazing! Tell me more about that!",
        "I love hearing about your experiences! What happened next?",
        "That's so cool! I'm really enjoying our conversation."
      ],
      savannah: [
        "Well, that's mighty interesting, honey. How did that make you feel?",
        "Bless your heart, that sounds like quite the adventure!",
        "Oh my, that's something else! I'd love to hear more about that."
      ]
    };

    const profileResponses = responses[profile.id] || responses.sophie;
    return profileResponses[Math.floor(Math.random() * profileResponses.length)];
  }

  detectEmotionInSpeech(text) {
    const emotions = {
      happy: ['happy', 'excited', 'great', 'awesome', 'wonderful', 'fantastic', 'amazing'],
      sad: ['sad', 'down', 'upset', 'disappointed', 'depressed', 'terrible'],
      angry: ['angry', 'mad', 'frustrated', 'annoyed', 'furious'],
      calm: ['calm', 'peaceful', 'relaxed', 'fine', 'okay', 'good']
    };

    for (const [emotion, keywords] of Object.entries(emotions)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return emotion;
      }
    }

    return 'calm';
  }

  detectIntent(text) {
    if (text.includes('help') || text.includes('assist')) return 'help';
    if (text.includes('bye') || text.includes('goodbye')) return 'goodbye';
    if (text.includes('joke') || text.includes('funny')) return 'humor';
    if (text.includes('how are you')) return 'greeting';
    return 'conversation';
  }

  // End phone call
  async endPhoneCall() {
    if (!this.currentCall) return null;

    this.currentCall.duration = Date.now() - this.currentCall.startTime.getTime();
    this.currentCall.isActive = false;

    if (this.recognition) {
      this.recognition.stop();
    }

    // Farewell message
    const profile = this.voiceProfiles[this.currentCall.voiceId];
    const farewell = `It was wonderful talking with you! Have a fantastic rest of your day. This is ${profile.name} signing off!`;
    
    await this.speak(farewell, this.currentCall.voiceId, 'happy');

    const callSummary = {
      ...this.currentCall,
      endTime: new Date(),
      totalMessages: this.currentCall.transcript.length,
      averageResponseTime: 2.5 // Mock data
    };

    this.currentCall = null;
    return callSummary;
  }

  // Host a podcast simulation
  async startPodcast(voiceId = 'alex', topic = 'technology') {
    const profile = this.voiceProfiles[voiceId];
    
    const podcastIntro = this.generatePodcastIntro(topic, profile);
    await this.speak(podcastIntro, voiceId, 'excited');

    return {
      id: uuidv4(),
      voiceId,
      topic,
      startTime: new Date(),
      status: 'recording'
    };
  }

  generatePodcastIntro(topic, profile) {
    const intros = {
      technology: `Welcome to Tech Talk with ${profile.name}! Today we're diving deep into the latest innovations that are shaping our digital world. I'm your host, and I'm excited to explore these fascinating developments with you.`,
      health: `Hello and welcome to Wellness Wisdom with ${profile.name}! I'm your host, and today we're discussing important health topics that can transform your daily life. Let's embark on this journey to better health together.`,
      business: `Welcome to Business Insights with ${profile.name}! I'm your host, and today we're exploring strategies and trends that are revolutionizing the business world. Let's dive into what successful leaders are doing differently.`,
      lifestyle: `Hey there, and welcome to Life & Style with ${profile.name}! I'm your host, and today we're talking about ways to enhance your daily life and find more joy in the simple moments.`
    };

    return intros[topic] || intros.technology;
  }

  // Get voice profiles for UI
  getVoiceProfiles() {
    return Object.values(this.voiceProfiles);
  }

  // Get specific voice profile
  getVoiceProfile(id) {
    return this.voiceProfiles[id];
  }

  // Test voice with sample text
  async testVoice(voiceId, emotion = 'calm') {
    const profile = this.voiceProfiles[voiceId];
    if (!profile) return false;

    const testTexts = {
      sophie: "Hello! I'm Sophie. I have a calm, conversational voice that's perfect for storytelling and meaningful conversations.",
      savannah: "Well hey there, honey! I'm Savannah, and I bring that smooth Southern charm to every conversation.",
      brooke: "Hi! I'm Brooke! I love connecting with people through warm, engaging conversations that feel natural and friendly.",
      amelie: "Bonjour! Je suis Amélie. My voice is soft and soothing, perfect for peaceful moments and gentle conversations.",
      marta: "¡Hola! Soy Marta. I bring casual, fun energy to our chats with a smooth Latin flair!",
      alex: "Good day! I'm Alex. My professional yet approachable voice is perfect for business discussions and presentations.",
      marcus: "Greetings! I'm Marcus. My voice carries wisdom and warmth, ideal for deep conversations and mentoring."
    };

    const testText = testTexts[voiceId] || testTexts.sophie;
    return await this.speak(testText, voiceId, emotion);
  }

  // Voice cloning simulation (mock for demo)
  async createCustomVoice(audioSample, voiceName, personality) {
    // Mock voice cloning process
    console.log('🎤 Processing voice sample for cloning...');
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    const customVoice = {
      id: `custom_${Date.now()}`,
      name: voiceName,
      description: `Custom cloned voice: ${voiceName}`,
      personality: personality,
      isCustom: true,
      rate: 0.9,
      pitch: 1.0,
      volume: 0.9,
      avatar: '🎭',
      specialties: ['personal', 'custom'],
      created: new Date().toISOString()
    };

    // Add to voice profiles
    this.voiceProfiles[customVoice.id] = customVoice;

    console.log('✅ Custom voice created successfully!');
    return customVoice;
  }

  // Advanced voice analysis
  async analyzeVoiceCharacteristics(audioBlob) {
    // Mock analysis - in production would use ML models
    return {
      pitch: Math.random() * 0.5 + 0.75, // 0.75 - 1.25
      speed: Math.random() * 0.4 + 0.8,  // 0.8 - 1.2
      tone: ['warm', 'professional', 'casual', 'energetic'][Math.floor(Math.random() * 4)],
      accent: ['american', 'british', 'neutral'][Math.floor(Math.random() * 3)],
      confidence: 0.85 + Math.random() * 0.15 // 0.85 - 1.0
    };
  }

  // Real-time voice modulation
  modulateVoice(text, modulation) {
    const { speed, pitch, emphasis, pauses } = modulation;
    
    let modulated = text;
    
    if (emphasis) {
      modulated = modulated.replace(/\b(important|amazing|incredible|fantastic)\b/gi, '<emphasis>$1</emphasis>');
    }
    
    if (pauses) {
      modulated = modulated.replace(/\./g, '. <break time="500ms"/>');
    }
    
    return modulated;
  }

  // Stop all voice activities
  stopAll() {
    this.synthesis.cancel();
    
    if (this.recognition) {
      this.recognition.stop();
    }
    
    if (this.currentCall) {
      this.endPhoneCall();
    }
  }

  // Get current status
  getStatus() {
    return {
      isSupported: this.isSupported,
      isSpeaking: this.synthesis.speaking,
      isInCall: !!this.currentCall,
      availableVoices: Object.keys(this.voiceProfiles).length,
      currentCall: this.currentCall
    };
  }
}

export const ultraVoiceAI = new UltraVoiceAI();