// Subscription Service for TwinHeart Premium Features (Web Compatible)
export class SubscriptionService {
  constructor() {
    this.plans = {
      free: {
        id: 'free',
        name: 'Free Twin',
        price: 0,
        features: [
          'Basic AI conversations',
          'Mood tracking',
          'Simple reminders',
          '5 voice messages per day',
          'Basic personality'
        ],
        limits: {
          voiceMessages: 5,
          meetingMinutes: 0,
          memoryEntries: 50,
          customVoices: 0
        }
      },
      premium: {
        id: 'premium',
        name: 'Premium Twin',
        price: 9.99,
        features: [
          'Unlimited AI conversations',
          'Advanced mood analytics',
          'Smart reminders',
          'Unlimited voice messages',
          'Voice meetings (30 min/day)',
          'Multiple personalities',
          'Memory journal',
          'Premium voice quality'
        ],
        limits: {
          voiceMessages: -1, // unlimited
          meetingMinutes: 30,
          memoryEntries: 1000,
          customVoices: 3
        }
      },
      ultimate: {
        id: 'ultimate',
        name: 'Ultimate Twin',
        price: 19.99,
        features: [
          'Everything in Premium',
          'Unlimited voice & video meetings',
          'Advanced voice features',
          'Custom AI personalities',
          'Advanced emotional AI',
          'Priority support',
          'Multiple AI twins'
        ],
        limits: {
          voiceMessages: -1,
          meetingMinutes: -1, // unlimited
          memoryEntries: -1,
          customVoices: -1,
          aiTwins: 3
        }
      }
    };

    this.currentPlan = 'free';
    this.usage = {
      voiceMessages: 0,
      meetingMinutes: 0,
      memoryEntries: 0,
      customVoices: 0
    };

    this.loadUsage();
  }

  // Get current subscription status
  getSubscriptionStatus() {
    const plan = this.plans[this.currentPlan];
    const usagePercentages = {};

    Object.keys(this.usage).forEach(key => {
      const limit = plan.limits[key];
      if (limit === -1) {
        usagePercentages[key] = 0; // unlimited
      } else {
        usagePercentages[key] = Math.min((this.usage[key] / limit) * 100, 100);
      }
    });

    return {
      plan: plan,
      usage: this.usage,
      usagePercentages,
      canUpgrade: this.currentPlan !== 'ultimate'
    };
  }

  // Check if feature is available
  canUseFeature(feature, amount = 1) {
    const plan = this.plans[this.currentPlan];
    const limit = plan.limits[feature];

    if (limit === -1) return true; // unlimited
    if (limit === 0) return false; // not available

    return (this.usage[feature] + amount) <= limit;
  }

  // Use a feature (increment usage)
  useFeature(feature, amount = 1) {
    if (this.canUseFeature(feature, amount)) {
      this.usage[feature] += amount;
      this.saveUsage();
      return true;
    }
    return false;
  }

  // Get upgrade suggestions
  getUpgradeSuggestions() {
    const suggestions = [];
    const currentPlan = this.plans[this.currentPlan];

    // Check usage patterns
    Object.keys(this.usage).forEach(feature => {
      const limit = currentPlan.limits[feature];
      const usage = this.usage[feature];

      if (limit > 0 && (usage / limit) > 0.8) {
        suggestions.push({
          type: 'usage_limit',
          feature,
          message: `You're using ${Math.round((usage / limit) * 100)}% of your ${feature} limit`,
          action: 'upgrade'
        });
      }
    });

    // Feature-based suggestions
    if (this.currentPlan === 'free') {
      suggestions.push({
        type: 'feature_unlock',
        message: 'Unlock unlimited voice messages and meetings with Premium',
        features: ['Unlimited voice messages', 'Voice meetings', 'Advanced personalities'],
        action: 'upgrade_premium'
      });
    }

    if (this.currentPlan === 'premium') {
      suggestions.push({
        type: 'feature_unlock',
        message: 'Get unlimited everything with Ultimate Twin',
        features: ['Advanced voice features', 'Unlimited meetings', 'Multiple AI twins'],
        action: 'upgrade_ultimate'
      });
    }

    return suggestions;
  }

  // Subscription management (mock implementation for demo)
  async subscribe(planId) {
    try {
      // In production, this would integrate with Stripe or similar
      console.log('Subscribing to plan:', planId);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      this.currentPlan = planId;
      this.resetUsage();

      return {
        success: true,
        subscriptionId: 'sub_' + Date.now()
      };
    } catch (error) {
      console.error('Subscription failed:', error);
      return {
        success: false,
        error: 'Subscription failed. Please try again.'
      };
    }
  }

  async cancelSubscription() {
    try {
      // In production, this would integrate with payment processor
      console.log('Cancelling subscription');

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };
    } catch (error) {
      console.error('Cancellation failed:', error);
      return {
        success: false,
        error: 'Cancellation failed. Please try again.'
      };
    }
  }

  // Premium feature gates
  showPremiumModal(feature) {
    return {
      title: 'Premium Feature',
      message: `${feature} is available with Premium subscription`,
      features: this.plans.premium.features,
      price: this.plans.premium.price,
      action: 'upgrade'
    };
  }

  showUltimateModal(feature) {
    return {
      title: 'Ultimate Feature',
      message: `${feature} requires Ultimate subscription`,
      features: this.plans.ultimate.features,
      price: this.plans.ultimate.price,
      action: 'upgrade'
    };
  }

  // Usage tracking
  trackVoiceMessage() {
    return this.useFeature('voiceMessages');
  }

  trackMeetingTime(minutes) {
    return this.useFeature('meetingMinutes', minutes);
  }

  trackMemoryEntry() {
    return this.useFeature('memoryEntries');
  }

  trackCustomVoice() {
    return this.useFeature('customVoices');
  }

  // Utility functions
  saveUsage() {
    localStorage.setItem('twinHeart_usage', JSON.stringify(this.usage));
  }

  loadUsage() {
    const saved = localStorage.getItem('twinHeart_usage');
    if (saved) {
      this.usage = JSON.parse(saved);
    }
  }

  resetUsage() {
    this.usage = {
      voiceMessages: 0,
      meetingMinutes: 0,
      memoryEntries: 0,
      customVoices: 0
    };
    this.saveUsage();
  }

  getUserId() {
    return localStorage.getItem('twinHeart_userId') || 'anonymous';
  }

  // Get pricing display
  getPricingInfo() {
    return Object.values(this.plans).map(plan => ({
      ...plan,
      isCurrentPlan: plan.id === this.currentPlan,
      savings: plan.id === 'ultimate' ? 'Best Value' : plan.id === 'premium' ? 'Popular' : null
    }));
  }
}

export const subscriptionService = new SubscriptionService();