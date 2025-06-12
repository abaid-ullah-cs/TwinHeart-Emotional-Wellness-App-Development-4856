// Specialized AI Therapist for Breaking the Silence Platform
import { createIntelligentAgent } from './intelligentAIAgent';

export class TherapistAI {
  constructor() {
    this.therapeuticApproaches = {
      romantic: {
        keywords: ['love', 'crush', 'relationship', 'dating', 'heart', 'romance'],
        responses: [
          "It takes courage to acknowledge these feelings. Your emotions are valid and beautiful.",
          "Love often begins with these unspoken moments. Consider that small gestures of kindness can open doors to connection.",
          "The vulnerability you're feeling is actually a strength. It shows your capacity for deep connection.",
          "Sometimes the most meaningful relationships start with simple, authentic conversations."
        ],
        suggestions: [
          "Consider starting with a simple 'hello' - small steps can lead to meaningful connections",
          "Remember that rejection doesn't diminish your worth - it simply means finding the right match",
          "Focus on building genuine friendship first, as strong relationships often have that foundation"
        ]
      },
      grief: {
        keywords: ['death', 'passed', 'miss', 'grandmother', 'funeral', 'loss'],
        responses: [
          "Grief is love with nowhere to go. Your feelings honor the relationship you shared.",
          "It's natural to wish we had said more. The love you felt was likely communicated in countless ways beyond words.",
          "Your grandmother knew she was loved. Sometimes our presence and care speak louder than words.",
          "Grief reminds us of the depth of our connections. This pain reflects the beauty of what you shared."
        ],
        suggestions: [
          "Consider writing a letter to your grandmother - unexpressed words can still find their way to healing",
          "Share memories with family members - this can help you process grief together",
          "Honor her memory through actions she would have appreciated"
        ]
      },
      gratitude: {
        keywords: ['thank', 'grateful', 'helped', 'smile', 'kindness', 'stranger'],
        responses: [
          "Gratitude is a powerful emotion that connects us to others. Your awareness of kindness shows your emotional intelligence.",
          "Sometimes strangers become angels in our stories. Their kindness creates ripples of hope.",
          "The fact that you recognize and want to acknowledge kindness shows your beautiful heart.",
          "These moments of human connection remind us that we're not alone in this world."
        ],
        suggestions: [
          "Consider paying this kindness forward to someone else who might need it",
          "Write about this experience - it can help you process the positive emotions",
          "Look for opportunities to be that kind stranger for someone else"
        ]
      },
      anxiety: {
        keywords: ['anxious', 'worried', 'stressed', 'panic', 'fear', 'nervous'],
        responses: [
          "Anxiety often tries to protect us, but sometimes it overprotects. You're safe in this moment.",
          "Your feelings are valid. Anxiety can make small things feel overwhelming, but you have the strength to cope.",
          "Remember that thoughts are not facts. This feeling will pass, just like all feelings do.",
          "You've survived difficult moments before. Trust in your resilience."
        ],
        suggestions: [
          "Try the 5-4-3-2-1 grounding technique: 5 things you see, 4 things you feel, 3 things you hear, 2 things you smell, 1 thing you taste",
          "Practice deep breathing - inhale for 4, hold for 4, exhale for 6",
          "Consider talking to a trusted friend or professional counselor"
        ]
      },
      loneliness: {
        keywords: ['alone', 'lonely', 'isolated', 'nobody', 'empty', 'disconnected'],
        responses: [
          "Loneliness is a universal human experience. You're not alone in feeling alone.",
          "Your worth isn't determined by how many people surround you. You matter, exactly as you are.",
          "Sometimes loneliness is our heart's way of asking us to reach out and connect.",
          "You have value and deserve meaningful connections. This feeling doesn't last forever."
        ],
        suggestions: [
          "Consider joining a community group or volunteer organization aligned with your interests",
          "Reach out to one person today - even a simple text can start rebuilding connections",
          "Practice self-compassion - treat yourself with the kindness you'd show a good friend"
        ]
      }
    };
  }

  async generateTherapeuticResponse(post) {
    const category = this.identifyCategory(post.content, post.emotion, post.category);
    const approach = this.therapeuticApproaches[category] || this.therapeuticApproaches.gratitude;
    
    // Select appropriate response
    const response = approach.responses[Math.floor(Math.random() * approach.responses.length)];
    const suggestion = approach.suggestions[Math.floor(Math.random() * approach.suggestions.length)];
    
    // Create personalized therapeutic response
    let therapeuticResponse = response;
    
    // Add validation
    therapeuticResponse += " ";
    therapeuticResponse += this.addValidation(post.emotion);
    
    // Add gentle suggestion
    therapeuticResponse += " ";
    therapeuticResponse += suggestion;
    
    // Add hope and encouragement
    therapeuticResponse += " ";
    therapeuticResponse += this.addHopeMessage(category);
    
    return {
      id: Date.now(),
      content: therapeuticResponse,
      author: 'AI Therapist',
      timestamp: new Date().toISOString(),
      isAI: true,
      hearts: 0,
      category: category,
      therapeuticElements: {
        validation: true,
        suggestion: true,
        hope: true
      }
    };
  }

  identifyCategory(content, emotion, category) {
    const lowerContent = content.toLowerCase();
    
    // Check for romantic themes
    if (this.therapeuticApproaches.romantic.keywords.some(keyword => 
      lowerContent.includes(keyword)) || category === 'romantic') {
      return 'romantic';
    }
    
    // Check for grief themes
    if (this.therapeuticApproaches.grief.keywords.some(keyword => 
      lowerContent.includes(keyword)) || category === 'loss') {
      return 'grief';
    }
    
    // Check for anxiety themes
    if (this.therapeuticApproaches.anxiety.keywords.some(keyword => 
      lowerContent.includes(keyword)) || emotion === 'anxious') {
      return 'anxiety';
    }
    
    // Check for loneliness themes
    if (this.therapeuticApproaches.loneliness.keywords.some(keyword => 
      lowerContent.includes(keyword))) {
      return 'loneliness';
    }
    
    // Default to gratitude for positive posts
    return 'gratitude';
  }

  addValidation(emotion) {
    const validations = {
      grateful: "Your gratitude shows a heart that notices beauty in the world.",
      grief: "Your grief is a testament to the love you carry.",
      longing: "Your capacity for deep feeling is a gift, even when it hurts.",
      sad: "It's okay to feel sad. Your emotions deserve space and respect.",
      anxious: "Your anxiety shows how much you care. That caring heart is precious.",
      hopeful: "Your hope is a light that can guide you through difficult times.",
      angry: "Your anger might be protecting something important to you.",
      peaceful: "Your awareness of peace shows emotional wisdom."
    };
    
    return validations[emotion] || "Your feelings are completely valid and important.";
  }

  addHopeMessage(category) {
    const hopeMessages = {
      romantic: "Love has a way of finding us when we're authentic and open to connection. Trust the process.",
      grief: "While the pain of loss never fully disappears, it transforms into a loving remembrance that honors their memory.",
      gratitude: "Your awareness of kindness creates more kindness in the world. You're part of the solution.",
      anxiety: "With each breath and each moment of self-compassion, you're building resilience. You're stronger than you know.",
      loneliness: "Connection is possible. Every person you meet is a potential friend, and you have so much to offer."
    };
    
    return hopeMessages[category] || "You have the strength to navigate this, and you don't have to do it alone.";
  }

  // Generate supportive community reply suggestions
  generateCommunityReplyPrompts(post) {
    const category = this.identifyCategory(post.content, post.emotion, post.category);
    
    const prompts = {
      romantic: [
        "I've felt this way too. Sometimes the most beautiful love stories start with uncertainty.",
        "Your courage to share this shows you're ready for connection. That's a beautiful first step.",
        "The right person will appreciate your genuine heart. Don't give up on love."
      ],
      grief: [
        "I'm sorry for your loss. Your love for them shines through your words.",
        "Grief is love persisting. Your grandmother's impact on you is her lasting legacy.",
        "Thank you for sharing something so personal. Your vulnerability helps others feel less alone."
      ],
      gratitude: [
        "This is beautiful. Sometimes strangers are exactly the angels we need.",
        "Your story reminds me to look for these moments of kindness too. Thank you.",
        "The fact that you want to say thank you shows what a grateful heart you have."
      ],
      anxiety: [
        "You're not alone in this feeling. Anxiety can be overwhelming, but you're stronger than it.",
        "I've been there too. Small steps and self-compassion have helped me through.",
        "Your awareness of your anxiety is actually a strength. You're taking care of yourself."
      ],
      loneliness: [
        "Loneliness is so hard, but sharing this takes courage. You're braver than you feel.",
        "I've felt this emptiness too. Connection is possible, even when it doesn't feel like it.",
        "Your words matter and you matter. Thank you for trusting us with your feelings."
      ]
    };
    
    return prompts[category] || prompts.gratitude;
  }

  // Analyze post for risk factors and provide appropriate resources
  assessPostRisk(post) {
    const riskKeywords = [
      'suicide', 'kill myself', 'end it all', 'no point', 'better off dead',
      'can\'t go on', 'want to die', 'hopeless', 'worthless', 'nobody cares'
    ];
    
    const lowerContent = post.content.toLowerCase();
    const hasRiskKeywords = riskKeywords.some(keyword => lowerContent.includes(keyword));
    
    if (hasRiskKeywords) {
      return {
        riskLevel: 'high',
        requiresIntervention: true,
        resources: [
          'National Suicide Prevention Lifeline: 988',
          'Crisis Text Line: Text HOME to 741741',
          'International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/'
        ],
        message: 'If you\'re having thoughts of self-harm, please reach out for immediate help. You matter and support is available.'
      };
    }
    
    return {
      riskLevel: 'low',
      requiresIntervention: false,
      resources: [],
      message: null
    };
  }
}

export const therapistAI = new TherapistAI();