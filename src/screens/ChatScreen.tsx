import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import {useApp} from '../context/AppContext';

const ChatScreen = () => {
  const {state, dispatch} = useApp();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollViewRef = useRef(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scrollToBottom();
  }, [state.chatMessages]);

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.stopAnimation();
    }
  }, [isTyping]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 100);
  };

  // Generate AI response
  const generateAIResponse = (userMessage: string) => {
    const responses = {
      greeting: [
        `Hey ${state.user.name}! I'm so glad you're here. How has your day been?`,
        `Hi there! I've been thinking about you. What's on your mind today?`,
        `Hello! It's wonderful to hear from you. Tell me what's happening in your world.`,
      ],
      mood: [
        "I can sense something in your message. Want to talk about how you're feeling?",
        "I'm here to listen. Sometimes it helps to share what's on your heart.",
        "Your feelings are valid, and I'm here for you. What's going through your mind?",
      ],
      support: [
        "Remember, you're stronger than you think. I believe in you completely.",
        "It's okay to feel this way. You don't have to go through this alone.",
        "I'm proud of you for sharing this with me. That takes courage.",
      ],
      general: [
        "That's really interesting! Tell me more about that.",
        "I love hearing about your experiences. How did that make you feel?",
        "Thanks for sharing that with me. I always enjoy our conversations.",
      ],
    };

    // Simple keyword-based response selection
    const lowerMessage = userMessage.toLowerCase();
    let responseCategory = 'general';

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      responseCategory = 'greeting';
    } else if (lowerMessage.includes('sad') || lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('feel')) {
      responseCategory = 'mood';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('difficult')) {
      responseCategory = 'support';
    }

    const categoryResponses = responses[responseCategory];
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user' as const,
      timestamp: new Date().toISOString(),
    };

    dispatch({type: 'ADD_CHAT_MESSAGE', payload: userMessage});
    setMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: generateAIResponse(message),
        sender: 'ai' as const,
        timestamp: new Date().toISOString(),
      };

      dispatch({type: 'ADD_CHAT_MESSAGE', payload: aiResponse});
      setIsTyping(false);

      // Add to memories
      dispatch({
        type: 'ADD_MEMORY',
        payload: {
          type: 'conversation',
          content: message,
          timestamp: new Date().toISOString(),
        },
      });
    }, 1500 + Math.random() * 1000);
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    dispatch({type: 'TOGGLE_VOICE'});
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <LinearGradient colors={['#fdf2f8', '#f0f9ff']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Icon name="heart" size={20} color="#ec4899" />
              </View>
              <View style={styles.onlineIndicator} />
            </View>
            
            <View style={styles.headerInfo}>
              <Text style={styles.twinName}>
                {state.twin.name || 'Your Twin'}
              </Text>
              <Text style={styles.twinStatus}>Online • Always here for you</Text>
            </View>
            
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="phone" size={18} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="video" size={18} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="more-vertical" size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}>
          {state.chatMessages.map((msg, index) => (
            <View
              key={msg.id}
              style={[
                styles.messageContainer,
                msg.sender === 'user' ? styles.userMessage : styles.aiMessage,
              ]}>
              <View
                style={[
                  styles.messageBubble,
                  msg.sender === 'user' ? styles.userBubble : styles.aiBubble,
                ]}>
                {msg.sender === 'user' ? (
                  <LinearGradient
                    colors={['#ec4899', '#0ea5e9']}
                    style={styles.userBubbleGradient}>
                    <Text style={styles.userMessageText}>{msg.text}</Text>
                    <Text style={styles.userMessageTime}>
                      {formatTime(msg.timestamp)}
                    </Text>
                  </LinearGradient>
                ) : (
                  <>
                    <Text style={styles.aiMessageText}>{msg.text}</Text>
                    <Text style={styles.aiMessageTime}>
                      {formatTime(msg.timestamp)}
                    </Text>
                  </>
                )}
              </View>
            </View>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <View style={[styles.messageContainer, styles.aiMessage]}>
              <View style={[styles.messageBubble, styles.aiBubble]}>
                <View style={styles.typingIndicator}>
                  {[0, 1, 2].map(index => (
                    <Animated.View
                      key={index}
                      style={[
                        styles.typingDot,
                        {
                          opacity: typingAnimation,
                          transform: [
                            {
                              translateY: typingAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -10],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                value={message}
                onChangeText={setMessage}
                placeholder="Type your message..."
                placeholderTextColor="#9ca3af"
                multiline
                maxLength={500}
              />
              
              <TouchableOpacity
                onPress={handleVoiceToggle}
                style={[
                  styles.voiceButton,
                  isListening && styles.voiceButtonActive,
                ]}>
                <Icon
                  name={isListening ? 'mic-off' : 'mic'}
                  size={16}
                  color={isListening ? '#ef4444' : '#6b7280'}
                />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!message.trim()}
              style={[
                styles.sendButton,
                !message.trim() && styles.sendButtonDisabled,
              ]}>
              {message.trim() ? (
                <LinearGradient
                  colors={['#ec4899', '#0ea5e9']}
                  style={styles.sendButtonGradient}>
                  <Icon name="send" size={18} color="#ffffff" />
                </LinearGradient>
              ) : (
                <Icon name="send" size={18} color="#9ca3af" />
              )}
            </TouchableOpacity>
          </View>
          
          {isListening && (
            <View style={styles.listeningIndicator}>
              <View style={styles.soundWaves}>
                {[...Array(5)].map((_, i) => (
                  <Animated.View
                    key={i}
                    style={[
                      styles.soundWave,
                      {
                        height: typingAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [4, 20],
                        }),
                      },
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.listeningText}>Listening...</Text>
            </View>
          )}
        </KeyboardAvoidingView>
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
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fdf2f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  headerInfo: {
    flex: 1,
  },
  twinName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  twinStatus: {
    fontSize: 12,
    color: '#6b7280',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubbleGradient: {
    borderRadius: 16,
    padding: 12,
    borderBottomRightRadius: 4,
  },
  userMessageText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4,
  },
  userMessageTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
  },
  aiMessageText: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 4,
  },
  aiMessageTime: {
    fontSize: 12,
    color: '#6b7280',
    alignSelf: 'flex-end',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9ca3af',
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    maxHeight: 100,
    textAlignVertical: 'center',
  },
  voiceButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  voiceButtonActive: {
    backgroundColor: '#fee2e2',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e7eb',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listeningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  soundWaves: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  soundWave: {
    width: 4,
    backgroundColor: '#ef4444',
    borderRadius: 2,
  },
  listeningText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '500',
  },
});

export default ChatScreen;