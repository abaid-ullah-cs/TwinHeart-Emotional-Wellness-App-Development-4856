import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import {useApp} from '../context/AppContext';

const {width, height} = Dimensions.get('window');

const OnboardingScreen = () => {
  const {dispatch} = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    timezone: 'UTC',
    preferredTwinType: 'sibling',
    interests: [],
    twinName: '',
    twinPersonality: 'caring',
  });

  const steps = [
    {
      title: 'Welcome to TwinHeart',
      subtitle: 'Your AI companion for emotional wellness',
      component: WelcomeStep,
    },
    {
      title: 'Tell us about yourself',
      subtitle: 'Help us personalize your experience',
      component: PersonalInfoStep,
    },
    {
      title: 'Choose your twin',
      subtitle: 'What kind of companion would you like?',
      component: TwinTypeStep,
    },
    {
      title: 'Customize your twin',
      subtitle: 'Give your AI companion a personality',
      component: TwinCustomizationStep,
    },
    {
      title: "You're all set!",
      subtitle: 'Your TwinHeart companion is ready',
      component: CompletionStep,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      dispatch({type: 'SET_USER_DATA', payload: formData});
      dispatch({
        type: 'SET_TWIN_DATA',
        payload: {
          name: formData.twinName,
          personality: formData.twinPersonality,
          relationship: formData.preferredTwinType,
        },
      });
      dispatch({type: 'COMPLETE_ONBOARDING'});
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <LinearGradient
      colors={['#fdf2f8', '#f0f9ff']}
      style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#ec4899', '#0ea5e9']}
              style={styles.iconGradient}>
              <Icon name="heart" size={32} color="#ffffff" />
            </LinearGradient>
          </View>
          
          <Text style={styles.title}>{steps[currentStep].title}</Text>
          <Text style={styles.subtitle}>{steps[currentStep].subtitle}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={['#ec4899', '#0ea5e9']}
              style={[
                styles.progressFill,
                {width: `${((currentStep + 1) / steps.length) * 100}%`},
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Step {currentStep + 1} of {steps.length}
          </Text>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <CurrentStepComponent formData={formData} setFormData={setFormData} />
        </ScrollView>

        {/* Navigation */}
        <View style={styles.navigation}>
          {currentStep > 0 && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Icon name="arrow-left" size={20} color="#6b7280" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <LinearGradient
              colors={['#ec4899', '#0ea5e9']}
              style={styles.nextGradient}>
              <Text style={styles.nextText}>
                {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
              </Text>
              <Icon name="arrow-right" size={20} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

// Step Components
function WelcomeStep() {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.welcomeIcon}>
        <Icon name="heart" size={80} color="#ec4899" />
      </View>
      
      <Text style={styles.welcomeText}>
        TwinHeart creates a personalized AI companion that understands you like family. 
        Your twin will be there for you, remember your conversations, and help you maintain 
        emotional wellness.
      </Text>
      
      <View style={styles.featuresGrid}>
        {[
          '24/7 Emotional Support',
          'Personalized Conversations',
          'Mood Tracking',
          'Wellness Reminders',
        ].map((feature, index) => (
          <View key={feature} style={styles.featureCard}>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function PersonalInfoStep({formData, setFormData}) {
  const interests = ['Music', 'Movies', 'Books', 'Sports', 'Travel', 'Cooking', 'Art', 'Gaming'];

  return (
    <View style={styles.stepContainer}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>What's your name?</Text>
        <TextInput
          style={styles.textInput}
          value={formData.name}
          onChangeText={text => setFormData({...formData, name: text})}
          placeholder="Enter your name"
          placeholderTextColor="#9ca3af"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>What's your age?</Text>
        <TextInput
          style={styles.textInput}
          value={formData.age}
          onChangeText={text => setFormData({...formData, age: text})}
          placeholder="Enter your age"
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>What are your interests?</Text>
        <View style={styles.interestsGrid}>
          {interests.map(interest => (
            <TouchableOpacity
              key={interest}
              onPress={() => {
                const newInterests = formData.interests.includes(interest)
                  ? formData.interests.filter(i => i !== interest)
                  : [...formData.interests, interest];
                setFormData({...formData, interests: newInterests});
              }}
              style={[
                styles.interestButton,
                formData.interests.includes(interest) && styles.interestButtonSelected,
              ]}>
              <Text
                style={[
                  styles.interestText,
                  formData.interests.includes(interest) && styles.interestTextSelected,
                ]}>
                {interest}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

function TwinTypeStep({formData, setFormData}) {
  const twinTypes = [
    {id: 'sibling', name: 'Sibling', description: 'Like a caring brother or sister'},
    {id: 'parent', name: 'Parent', description: 'Like a wise mother or father'},
    {id: 'grandparent', name: 'Grandparent', description: 'Like a loving grandparent'},
    {id: 'friend', name: 'Best Friend', description: 'Like your closest friend'},
    {id: 'partner', name: 'Partner', description: 'Like a supportive romantic partner'},
  ];

  return (
    <View style={styles.stepContainer}>
      {twinTypes.map(type => (
        <TouchableOpacity
          key={type.id}
          onPress={() => setFormData({...formData, preferredTwinType: type.id})}
          style={[
            styles.optionCard,
            formData.preferredTwinType === type.id && styles.optionCardSelected,
          ]}>
          <Text style={styles.optionTitle}>{type.name}</Text>
          <Text style={styles.optionDescription}>{type.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function TwinCustomizationStep({formData, setFormData}) {
  const personalities = [
    {id: 'caring', name: 'Caring & Nurturing', emoji: '🤗'},
    {id: 'playful', name: 'Playful & Fun', emoji: '😄'},
    {id: 'wise', name: 'Wise & Thoughtful', emoji: '🤔'},
    {id: 'energetic', name: 'Energetic & Motivating', emoji: '⚡'},
    {id: 'calm', name: 'Calm & Peaceful', emoji: '😌'},
  ];

  return (
    <View style={styles.stepContainer}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>What should we call your twin?</Text>
        <TextInput
          style={styles.textInput}
          value={formData.twinName}
          onChangeText={text => setFormData({...formData, twinName: text})}
          placeholder="Choose a name for your AI twin"
          placeholderTextColor="#9ca3af"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>What personality should your twin have?</Text>
        {personalities.map(personality => (
          <TouchableOpacity
            key={personality.id}
            onPress={() => setFormData({...formData, twinPersonality: personality.id})}
            style={[
              styles.personalityCard,
              formData.twinPersonality === personality.id && styles.personalityCardSelected,
            ]}>
            <Text style={styles.personalityEmoji}>{personality.emoji}</Text>
            <Text style={styles.personalityName}>{personality.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function CompletionStep({formData}) {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.completionIcon}>
        <Text style={styles.celebrationEmoji}>🎉</Text>
      </View>
      
      <Text style={styles.completionTitle}>
        Meet {formData.twinName || 'Your Twin'}!
      </Text>
      
      <Text style={styles.completionText}>
        Your AI companion is ready to chat with you. {formData.twinName || 'Your twin'} will 
        remember your conversations, learn about your preferences, and be there whenever you need support.
      </Text>
      
      <View style={styles.profileCard}>
        <Text style={styles.profileTitle}>Your Twin Profile:</Text>
        <Text style={styles.profileDetail}>Name: {formData.twinName || 'Not set'}</Text>
        <Text style={styles.profileDetail}>Relationship: {formData.preferredTwinType}</Text>
        <Text style={styles.profileDetail}>Personality: {formData.twinPersonality}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 8,
  },
  nextButton: {
    flex: 1,
    marginLeft: 16,
  },
  nextGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },
  stepContainer: {
    paddingBottom: 24,
  },
  welcomeIcon: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  interestButtonSelected: {
    borderColor: '#ec4899',
    backgroundColor: '#fdf2f8',
  },
  interestText: {
    fontSize: 14,
    color: '#4b5563',
  },
  interestTextSelected: {
    color: '#be185d',
  },
  optionCard: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionCardSelected: {
    borderColor: '#ec4899',
    backgroundColor: '#fdf2f8',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  personalityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  personalityCardSelected: {
    borderColor: '#ec4899',
    backgroundColor: '#fdf2f8',
  },
  personalityEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  personalityName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  completionIcon: {
    alignItems: 'center',
    marginBottom: 24,
  },
  celebrationEmoji: {
    fontSize: 64,
  },
  completionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  completionText: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 16,
    borderRadius: 12,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  profileDetail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
});

export default OnboardingScreen;