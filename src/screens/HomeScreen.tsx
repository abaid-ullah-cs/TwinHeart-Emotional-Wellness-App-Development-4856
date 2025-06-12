import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import {useApp} from '../context/AppContext';
import {format} from 'date-fns';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const HomeScreen = () => {
  const {state} = useApp();
  const navigation = useNavigation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    return () => clearInterval(timer);
  }, []);

  const quickActions = [
    {
      id: 'chat',
      title: 'Chat with Twin',
      description: 'Talk to your AI companion',
      icon: 'message-circle',
      colors: ['#3b82f6', '#1d4ed8'],
      screen: 'Chat',
    },
    {
      id: 'mood',
      title: 'Mood Check-in',
      description: 'How are you feeling?',
      icon: 'heart',
      colors: ['#ec4899', '#be185d'],
      screen: 'Mood',
    },
    {
      id: 'reminders',
      title: 'Wellness Reminders',
      description: 'Stay healthy & happy',
      icon: 'bell',
      colors: ['#8b5cf6', '#7c3aed'],
      screen: 'Settings',
    },
  ];

  const todayReminders = [
    {id: 1, type: 'hydration', message: 'Time to drink some water!', icon: 'droplet', time: '2:00 PM'},
    {id: 2, type: 'sleep', message: 'Consider winding down soon', icon: 'moon', time: '9:30 PM'},
    {id: 3, type: 'selfcare', message: 'Take a moment for yourself', icon: 'sun', time: '3:00 PM'},
  ];

  const getMoodEmoji = (mood: string) => {
    const moodEmojis = {
      happy: '😊',
      sad: '😢',
      excited: '🤩',
      anxious: '😰',
      calm: '😌',
      neutral: '😐',
      amazing: '🤩',
      good: '🙂',
      low: '😔',
    };
    return moodEmojis[mood] || '😊';
  };

  return (
    <LinearGradient colors={['#fdf2f8', '#f0f9ff']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <LinearGradient colors={['#ec4899', '#0ea5e9']} style={styles.iconGradient}>
                <Icon name="heart" size={24} color="#ffffff" />
              </LinearGradient>
            </View>
            
            <Text style={styles.greeting}>
              {greeting}, {state.user.name || 'Friend'}!
            </Text>
            
            <Text style={styles.date}>
              {format(currentTime, 'EEEE, MMMM do')}
            </Text>
          </View>

          {/* Twin Status Card */}
          <View style={styles.card}>
            <View style={styles.twinStatus}>
              <View style={styles.twinAvatar}>
                <Icon name="smile" size={24} color="#ec4899" />
              </View>
              <View style={styles.twinInfo}>
                <Text style={styles.twinName}>
                  {state.twin.name || 'Your Twin'} is here for you
                </Text>
                <Text style={styles.twinSubtext}>
                  Ready to chat • Last active: Just now
                </Text>
              </View>
              <View style={styles.onlineIndicator} />
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <View style={styles.actionsGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={action.id}
                  onPress={() => navigation.navigate(action.screen)}
                  style={[styles.actionCard, {width: width - 48}]}>
                  <LinearGradient
                    colors={action.colors}
                    style={styles.actionIcon}>
                    <Icon name={action.icon} size={20} color="#ffffff" />
                  </LinearGradient>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionDescription}>{action.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Today's Reminders */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Reminders</Text>
            
            <View style={styles.remindersList}>
              {todayReminders.map((reminder, index) => (
                <View key={reminder.id} style={styles.reminderCard}>
                  <View style={styles.reminderIcon}>
                    <Icon name={reminder.icon} size={16} color="#6b7280" />
                  </View>
                  <View style={styles.reminderContent}>
                    <Text style={styles.reminderMessage}>{reminder.message}</Text>
                  </View>
                  <View style={styles.reminderTime}>
                    <Icon name="clock" size={12} color="#9ca3af" />
                    <Text style={styles.reminderTimeText}>{reminder.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Mood Summary */}
          {state.mood.current && (
            <View style={styles.section}>
              <View style={styles.moodCard}>
                <Text style={styles.moodTitle}>Current Mood</Text>
                <Text style={styles.moodEmoji}>
                  {getMoodEmoji(state.mood.current)}
                </Text>
                <Text style={styles.moodText}>
                  {state.mood.current.charAt(0).toUpperCase() + state.mood.current.slice(1)}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
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
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  twinStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  twinAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fdf2f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  twinInfo: {
    flex: 1,
  },
  twinName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  twinSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  actionsGrid: {
    gap: 16,
  },
  actionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  remindersList: {
    gap: 12,
  },
  reminderCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reminderContent: {
    flex: 1,
  },
  reminderMessage: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  reminderTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reminderTimeText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  moodCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  moodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  moodEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  moodText: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default HomeScreen;