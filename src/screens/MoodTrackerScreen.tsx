import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import {useApp} from '../context/AppContext';
import {format, subDays, isToday, parseISO} from 'date-fns';

const MoodTrackerScreen = () => {
  const {state, dispatch} = useApp();
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodNote, setMoodNote] = useState('');

  const moods = [
    {id: 'amazing', emoji: '🤩', label: 'Amazing', colors: ['#fbbf24', '#f59e0b']},
    {id: 'happy', emoji: '😊', label: 'Happy', colors: ['#10b981', '#059669']},
    {id: 'good', emoji: '🙂', label: 'Good', colors: ['#3b82f6', '#2563eb']},
    {id: 'neutral', emoji: '😐', label: 'Neutral', colors: ['#6b7280', '#4b5563']},
    {id: 'low', emoji: '😔', label: 'Low', colors: ['#8b5cf6', '#7c3aed']},
    {id: 'anxious', emoji: '😰', label: 'Anxious', colors: ['#f59e0b', '#ef4444']},
    {id: 'sad', emoji: '😢', label: 'Sad', colors: ['#6366f1', '#8b5cf6']},
  ];

  const handleMoodSubmit = () => {
    if (!selectedMood) return;

    dispatch({
      type: 'SET_MOOD',
      payload: selectedMood,
    });

    if (moodNote.trim()) {
      dispatch({
        type: 'ADD_MEMORY',
        payload: {
          type: 'mood_note',
          content: moodNote,
          mood: selectedMood,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Reset form
    setSelectedMood(null);
    setMoodNote('');
  };

  const getMoodStats = () => {
    const recentMoods = state.mood.history.slice(-7);
    if (recentMoods.length === 0) return null;

    const moodCounts = {};
    recentMoods.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    const mostCommon = Object.keys(moodCounts).reduce((a, b) =>
      moodCounts[a] > moodCounts[b] ? a : b
    );

    return {
      mostCommon,
      totalEntries: recentMoods.length,
      streak: calculateStreak(),
    };
  };

  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const checkDate = subDays(today, i);
      const hasEntry = state.mood.history.some(entry =>
        isToday(parseISO(entry.timestamp))
      );

      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const stats = getMoodStats();

  return (
    <LinearGradient colors={['#fdf2f8', '#f0f9ff']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <LinearGradient colors={['#ec4899', '#be185d']} style={styles.iconGradient}>
                <Icon name="heart" size={24} color="#ffffff" />
              </LinearGradient>
            </View>
            
            <Text style={styles.title}>How are you feeling?</Text>
            <Text style={styles.subtitle}>Track your emotional wellness journey</Text>
          </View>

          {/* Current Mood Selection */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Today's Mood</Text>
            
            <View style={styles.moodsGrid}>
              {moods.map((mood, index) => (
                <TouchableOpacity
                  key={mood.id}
                  onPress={() => setSelectedMood(mood.id)}
                  style={[
                    styles.moodButton,
                    selectedMood === mood.id && styles.moodButtonSelected,
                  ]}>
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Mood Note */}
            <View style={styles.noteSection}>
              <Text style={styles.noteLabel}>Add a note (optional)</Text>
              <TextInput
                style={styles.noteInput}
                value={moodNote}
                onChangeText={setMoodNote}
                placeholder="What's on your mind today?"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleMoodSubmit}
              disabled={!selectedMood}
              style={[
                styles.submitButton,
                !selectedMood && styles.submitButtonDisabled,
              ]}>
              {selectedMood ? (
                <LinearGradient
                  colors={['#ec4899', '#0ea5e9']}
                  style={styles.submitButtonGradient}>
                  <Text style={styles.submitButtonText}>Save Mood Entry</Text>
                </LinearGradient>
              ) : (
                <Text style={styles.submitButtonTextDisabled}>Save Mood Entry</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Stats Card */}
          {stats && (
            <View style={styles.card}>
              <View style={styles.statsHeader}>
                <Text style={styles.cardTitle}>Your Progress</Text>
                <Icon name="trending-up" size={20} color="#ec4899" />
              </View>
              
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{stats.streak}</Text>
                  <Text style={styles.statLabel}>Day Streak</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{stats.totalEntries}</Text>
                  <Text style={styles.statLabel}>This Week</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statEmoji}>
                    {moods.find(m => m.id === stats.mostCommon)?.emoji || '😊'}
                  </Text>
                  <Text style={styles.statLabel}>Most Common</Text>
                </View>
              </View>
            </View>
          )}

          {/* Mood History */}
          <View style={styles.card}>
            <View style={styles.historyHeader}>
              <Text style={styles.cardTitle}>Recent Entries</Text>
              <TouchableOpacity style={styles.viewAllButton}>
                <Icon name="calendar" size={16} color="#ec4899" />
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.historyList}>
              {state.mood.history.length > 0 ? (
                state.mood.history.slice(-5).reverse().map((entry, index) => {
                  const mood = moods.find(m => m.id === entry.mood);
                  return (
                    <View key={entry.timestamp} style={styles.historyItem}>
                      <View style={styles.historyLeft}>
                        <Text style={styles.historyEmoji}>{mood?.emoji}</Text>
                        <View style={styles.historyInfo}>
                          <Text style={styles.historyMood}>
                            {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                          </Text>
                          <Text style={styles.historyTime}>
                            {format(parseISO(entry.timestamp), 'MMM d, h:mm a')}
                          </Text>
                        </View>
                      </View>
                      <Icon name="edit-3" size={16} color="#9ca3af" />
                    </View>
                  );
                })
              ) : (
                <View style={styles.emptyState}>
                  <Icon name="heart" size={48} color="#d1d5db" />
                  <Text style={styles.emptyStateText}>
                    Start tracking your mood to see your progress
                  </Text>
                </View>
              )}
            </View>
          </View>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  moodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  moodButton: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  moodButtonSelected: {
    borderColor: '#ec4899',
    backgroundColor: '#fdf2f8',
    transform: [{scale: 1.05}],
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4b5563',
    textAlign: 'center',
  },
  noteSection: {
    marginBottom: 24,
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  noteInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
    minHeight: 80,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  submitButtonTextDisabled: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ec4899',
    marginBottom: 4,
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#ec4899',
    fontWeight: '500',
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyMood: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default MoodTrackerScreen;