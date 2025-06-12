import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import {useApp} from '../context/AppContext';

const ProfileScreen = () => {
  const {state, dispatch} = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: state.user.name,
    age: state.user.age,
    interests: state.user.interests,
    twinName: state.twin.name,
    twinPersonality: state.twin.personality,
  });

  const handleSave = () => {
    dispatch({
      type: 'SET_USER_DATA',
      payload: {
        name: editData.name,
        age: editData.age,
        interests: editData.interests,
      },
    });

    dispatch({
      type: 'SET_TWIN_DATA',
      payload: {
        name: editData.twinName,
        personality: editData.twinPersonality,
      },
    });

    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditData({
      name: state.user.name,
      age: state.user.age,
      interests: state.user.interests,
      twinName: state.twin.name,
      twinPersonality: state.twin.personality,
    });
    setIsEditing(false);
  };

  const personalities = [
    {id: 'caring', name: 'Caring & Nurturing', emoji: '🤗'},
    {id: 'playful', name: 'Playful & Fun', emoji: '😄'},
    {id: 'wise', name: 'Wise & Thoughtful', emoji: '🤔'},
    {id: 'energetic', name: 'Energetic & Motivating', emoji: '⚡'},
    {id: 'calm', name: 'Calm & Peaceful', emoji: '😌'},
  ];

  const interests = ['Music', 'Movies', 'Books', 'Sports', 'Travel', 'Cooking', 'Art', 'Gaming'];

  const getDaysWithApp = () => {
    const joinDate = state.user.joinDate ? new Date(state.user.joinDate) : new Date();
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <LinearGradient colors={['#fdf2f8', '#f0f9ff']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <LinearGradient colors={['#ec4899', '#0ea5e9']} style={styles.iconGradient}>
                <Icon name="user" size={24} color="#ffffff" />
              </LinearGradient>
            </View>
            
            <Text style={styles.title}>Your Profile</Text>
            <Text style={styles.subtitle}>Manage your account and twin settings</Text>
          </View>

          {/* Profile Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Personal Information</Text>
              {!isEditing ? (
                <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
                  <Icon name="edit-3" size={16} color="#ec4899" />
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.editActions}>
                  <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <Icon name="save" size={16} color="#10b981" />
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                    <Icon name="x" size={16} color="#ef4444" />
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.inputSection}>
              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.textInput}
                    value={editData.name}
                    onChangeText={text => setEditData({...editData, name: text})}
                    placeholder="Enter your name"
                    placeholderTextColor="#9ca3af"
                  />
                ) : (
                  <View style={styles.displayValue}>
                    <Text style={styles.displayText}>{state.user.name || 'Not set'}</Text>
                  </View>
                )}
              </View>

              {/* Age */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Age</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.textInput}
                    value={editData.age}
                    onChangeText={text => setEditData({...editData, age: text})}
                    placeholder="Enter your age"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                  />
                ) : (
                  <View style={styles.displayValue}>
                    <Text style={styles.displayText}>{state.user.age || 'Not set'}</Text>
                  </View>
                )}
              </View>

              {/* Interests */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Interests</Text>
                {isEditing ? (
                  <View style={styles.interestsGrid}>
                    {interests.map(interest => (
                      <TouchableOpacity
                        key={interest}
                        onPress={() => {
                          const newInterests = editData.interests.includes(interest)
                            ? editData.interests.filter(i => i !== interest)
                            : [...editData.interests, interest];
                          setEditData({...editData, interests: newInterests});
                        }}
                        style={[
                          styles.interestChip,
                          editData.interests.includes(interest) && styles.interestChipSelected,
                        ]}>
                        <Text
                          style={[
                            styles.interestChipText,
                            editData.interests.includes(interest) && styles.interestChipTextSelected,
                          ]}>
                          {interest}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View style={styles.interestsDisplay}>
                    {state.user.interests.length > 0 ? (
                      state.user.interests.map(interest => (
                        <View key={interest} style={styles.interestTag}>
                          <Text style={styles.interestTagText}>{interest}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.emptyText}>No interests selected</Text>
                    )}
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Twin Settings */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your AI Twin</Text>
            
            <View style={styles.inputSection}>
              {/* Twin Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Twin Name</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.textInput}
                    value={editData.twinName}
                    onChangeText={text => setEditData({...editData, twinName: text})}
                    placeholder="Enter twin name"
                    placeholderTextColor="#9ca3af"
                  />
                ) : (
                  <View style={styles.displayValue}>
                    <Text style={styles.displayText}>{state.twin.name || 'Not set'}</Text>
                  </View>
                )}
              </View>

              {/* Twin Personality */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Personality</Text>
                {isEditing ? (
                  <View style={styles.personalitiesGrid}>
                    {personalities.map(personality => (
                      <TouchableOpacity
                        key={personality.id}
                        onPress={() => setEditData({...editData, twinPersonality: personality.id})}
                        style={[
                          styles.personalityCard,
                          editData.twinPersonality === personality.id && styles.personalityCardSelected,
                        ]}>
                        <Text style={styles.personalityEmoji}>{personality.emoji}</Text>
                        <Text style={styles.personalityName}>{personality.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View style={styles.displayValue}>
                    <View style={styles.personalityDisplay}>
                      <Text style={styles.personalityDisplayEmoji}>
                        {personalities.find(p => p.id === state.twin.personality)?.emoji || '🤗'}
                      </Text>
                      <Text style={styles.personalityDisplayText}>
                        {personalities.find(p => p.id === state.twin.personality)?.name || 'Caring & Nurturing'}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Journey</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <LinearGradient colors={['#dbeafe', '#bfdbfe']} style={styles.statIconContainer}>
                  <Icon name="calendar" size={24} color="#2563eb" />
                </LinearGradient>
                <Text style={styles.statNumber}>{getDaysWithApp()}</Text>
                <Text style={styles.statLabel}>Days with TwinHeart</Text>
              </View>
              
              <View style={styles.statCard}>
                <LinearGradient colors={['#fce7f3', '#fbcfe8']} style={styles.statIconContainer}>
                  <Icon name="heart" size={24} color="#ec4899" />
                </LinearGradient>
                <Text style={styles.statNumber}>{state.mood.history.length}</Text>
                <Text style={styles.statLabel}>Mood Entries</Text>
              </View>
              
              <View style={styles.statCard}>
                <LinearGradient colors={['#dcfce7', '#bbf7d0']} style={styles.statIconContainer}>
                  <Icon name="smile" size={24} color="#16a34a" />
                </LinearGradient>
                <Text style={styles.statNumber}>{state.chatMessages.length}</Text>
                <Text style={styles.statLabel}>Conversations</Text>
              </View>
              
              <View style={styles.statCard}>
                <LinearGradient colors={['#e9d5ff', '#ddd6fe']} style={styles.statIconContainer}>
                  <Icon name="clock" size={24} color="#9333ea" />
                </LinearGradient>
                <Text style={styles.statNumber}>{state.twin.memories.length}</Text>
                <Text style={styles.statLabel}>Memories Shared</Text>
              </View>
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editButtonText: {
    fontSize: 14,
    color: '#ec4899',
    fontWeight: '500',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  saveButtonText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '500',
  },
  inputSection: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
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
  displayValue: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
  },
  displayText: {
    fontSize: 16,
    color: '#1f2937',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  interestChipSelected: {
    borderColor: '#ec4899',
    backgroundColor: '#fdf2f8',
  },
  interestChipText: {
    fontSize: 14,
    color: '#4b5563',
  },
  interestChipTextSelected: {
    color: '#be185d',
  },
  interestsDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#fdf2f8',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  interestTagText: {
    fontSize: 14,
    color: '#be185d',
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  personalitiesGrid: {
    gap: 8,
  },
  personalityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
  },
  personalityCardSelected: {
    borderColor: '#ec4899',
    backgroundColor: '#fdf2f8',
  },
  personalityEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  personalityName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  personalityDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personalityDisplayEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  personalityDisplayText: {
    fontSize: 16,
    color: '#1f2937',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  statCard: {
    width: '45%',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default ProfileScreen;