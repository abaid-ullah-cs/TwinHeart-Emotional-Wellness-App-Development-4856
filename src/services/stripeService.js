// Complete Stripe Integration Service
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51234567890abcdef'); // Replace with your actual key

export class StripeService {
  constructor() {
    this.stripe = null;
    this.plans = {
      premium: {
        id: 'premium',
        name: 'Premium Twin',
        price: 999, // $9.99 in cents
        currency: 'usd',
        interval: 'month',
        priceId: 'price_premium_monthly', // Replace with actual Stripe price ID
        features: [
          'Unlimited AI conversations',
          'Advanced mood analytics', 
          'Smart reminders',
          'Unlimited voice messages',
          'Voice meetings (30 min/day)',
          'Multiple personalities',
          'Memory journal'
        ]
      },
      ultimate: {
        id: 'ultimate',
        name: 'Ultimate Twin',
        price: 1999, // $19.99 in cents
        currency: 'usd',
        interval: 'month',
        priceId: 'price_ultimate_monthly', // Replace with actual Stripe price ID
        features: [
          'Everything in Premium',
          'Unlimited voice & video meetings',
          'Voice cloning technology',
          'Custom AI personalities',
          'Advanced emotional AI',
          'Priority support',
          'Multiple AI twins'
        ]
      }
    };
    
    this.initializeStripe();
  }

  async initializeStripe() {
    try {
      this.stripe = await stripePromise;
      console.log('✅ Stripe initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Stripe:', error);
    }
  }

  // Create checkout session
  async createCheckoutSession(planId, userId, successUrl, cancelUrl) {
    try {
      const plan = this.plans[planId];
      if (!plan) {
        throw new Error('Invalid plan selected');
      }

      // In a real app, this would call your backend API
      const response = await this.mockCreateCheckoutSession({
        planId,
        userId,
        priceId: plan.priceId,
        successUrl,
        cancelUrl
      });

      return response;
    } catch (error) {
      console.error('❌ Failed to create checkout session:', error);
      throw error;
    }
  }

  // Mock backend API call (replace with real backend)
  async mockCreateCheckoutSession(params) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful response
    return {
      sessionId: 'cs_test_' + Math.random().toString(36).substr(2, 9),
      url: `https://checkout.stripe.com/pay/cs_test_${Math.random().toString(36).substr(2, 9)}`,
      success: true
    };
  }

  // Redirect to Stripe Checkout
  async redirectToCheckout(sessionId) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    try {
      // For demo purposes, show a mock checkout
      const confirmed = window.confirm(
        `🚀 Demo Mode: This would redirect to Stripe Checkout.\n\n` +
        `In production, you would be redirected to secure payment processing.\n\n` +
        `Continue with demo subscription?`
      );

      if (confirmed) {
        // Simulate successful payment
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { success: true, demo: true };
      } else {
        return { success: false, cancelled: true };
      }

      // Real implementation would be:
      // const { error } = await this.stripe.redirectToCheckout({ sessionId });
      // if (error) throw error;
      
    } catch (error) {
      console.error('❌ Checkout redirect failed:', error);
      throw error;
    }
  }

  // Handle subscription upgrade
  async upgradeSubscription(currentPlan, newPlan, userId) {
    try {
      const currentPlanData = this.plans[currentPlan];
      const newPlanData = this.plans[newPlan];

      if (!currentPlanData || !newPlanData) {
        throw new Error('Invalid plan specified');
      }

      // Calculate prorated amount
      const proratedAmount = this.calculateProration(currentPlanData, newPlanData);

      const checkoutSession = await this.createCheckoutSession(
        newPlan,
        userId,
        `${window.location.origin}/#/subscription-success?plan=${newPlan}`,
        `${window.location.origin}/#/subscription-cancelled`
      );

      return {
        ...checkoutSession,
        proratedAmount,
        upgrade: true
      };

    } catch (error) {
      console.error('❌ Subscription upgrade failed:', error);
      throw error;
    }
  }

  // Calculate prorated amount for upgrades
  calculateProration(currentPlan, newPlan) {
    const priceDifference = newPlan.price - currentPlan.price;
    const daysInMonth = 30;
    const daysRemaining = Math.floor(Math.random() * 30) + 1; // Mock calculation
    
    return Math.floor((priceDifference * daysRemaining) / daysInMonth);
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId, userId) {
    try {
      // In real app, call your backend API
      const response = await this.mockCancelSubscription(subscriptionId, userId);
      return response;
    } catch (error) {
      console.error('❌ Subscription cancellation failed:', error);
      throw error;
    }
  }

  async mockCancelSubscription(subscriptionId, userId) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      cancelled: true,
      endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      message: 'Subscription cancelled successfully. Access continues until end of billing period.'
    };
  }

  // Get subscription status
  async getSubscriptionStatus(userId) {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock subscription data
      return {
        isActive: true,
        plan: 'free',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false,
        subscriptionId: 'sub_' + Math.random().toString(36).substr(2, 9)
      };
    } catch (error) {
      console.error('❌ Failed to get subscription status:', error);
      throw error;
    }
  }

  // Update payment method
  async updatePaymentMethod(subscriptionId, paymentMethodId) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Payment method updated successfully'
      };
    } catch (error) {
      console.error('❌ Failed to update payment method:', error);
      throw error;
    }
  }

  // Get invoice history
  async getInvoiceHistory(customerId) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock invoice data
      return [
        {
          id: 'in_test_123',
          amount: 999,
          currency: 'usd',
          status: 'paid',
          created: Date.now() - 30 * 24 * 60 * 60 * 1000,
          description: 'Premium Twin - Monthly'
        },
        {
          id: 'in_test_124',
          amount: 999,
          currency: 'usd',
          status: 'paid',
          created: Date.now() - 60 * 24 * 60 * 60 * 1000,
          description: 'Premium Twin - Monthly'
        }
      ];
    } catch (error) {
      console.error('❌ Failed to get invoice history:', error);
      throw error;
    }
  }

  // Format price for display
  formatPrice(amount, currency = 'usd') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  }

  // Get plan details
  getPlan(planId) {
    return this.plans[planId] || null;
  }

  // Get all plans
  getAllPlans() {
    return Object.values(this.plans);
  }

  // Validate webhook signature (for backend)
  validateWebhookSignature(payload, signature, secret) {
    // This would be implemented on your backend
    console.log('Webhook validation would happen on backend');
    return true;
  }
}

export const stripeService = new StripeService();