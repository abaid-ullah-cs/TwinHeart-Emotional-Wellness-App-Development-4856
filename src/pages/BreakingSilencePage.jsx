import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHeart, 
  FiMessageCircle, 
  FiMapPin, 
  FiUser, 
  FiClock,
  FiEdit3,
  FiSend,
  FiPlus,
  FiTrendingUp,
  FiEye,
  FiStar
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { createIntelligentAgent } from '../services/intelligentAIAgent';
import { format } from 'date-fns';

const BreakingSilencePage = () => {
  const { state, dispatch } = useApp();
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    emotion: '',
    location: '',
    category: 'unspoken'
  });
  const [filter, setFilter] = useState('all');
  const [aiAgent, setAiAgent] = useState(null);

  // Initialize AI therapist agent
  useEffect(() => {
    if (state.user && state.twin) {
      const agent = createIntelligentAgent(state.user, state.twin);
      setAiAgent(agent);
    }
  }, [state.user, state.twin]);

  // Load posts from localStorage
  useEffect(() => {
    const savedPosts = localStorage.getItem('breakingSilence_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Initialize with sample posts
      initializeSamplePosts();
    }
  }, []);

  const initializeSamplePosts = () => {
    const samplePosts = [
      {
        id: 1,
        userId: 'user1',
        username: 'Anonymous Heart',
        title: 'To the stranger who smiled when I was crying...',
        content: 'I was having the worst day of my life, sitting on a park bench crying. You walked by and gave me the warmest smile. You didn\'t stop, you didn\'t ask questions, but your smile told me everything would be okay. I never got to say thank you.',
        emotion: 'grateful',
        category: 'unspoken',
        location: 'Central Park, NYC',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        hearts: 47,
        replies: 12,
        views: 156,
        isAnonymous: true,
        aiResponse: null
      },
      {
        id: 2,
        userId: 'user2',
        username: 'Healing Soul',
        title: 'I should have said I love you more...',
        content: 'To my grandmother who passed last month. I was always too busy, too proud, too scared to show my feelings. She knew I loved her, but I wish I had said it more. I wish I had hugged her longer. I miss our Sunday phone calls.',
        emotion: 'grief',
        category: 'loss',
        location: 'Boston, MA',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        hearts: 89,
        replies: 23,
        views: 234,
        isAnonymous: true,
        aiResponse: null
      },
      {
        id: 3,
        userId: 'user3',
        username: 'Romantic Heart',
        title: 'To my crush who doesn\'t know...',
        content: 'We work in the same building, take the same elevator every morning. You always smell like coffee and vanilla. When you laugh at something on your phone, my whole day gets brighter. I practice conversations with you in my head but can never find the courage to say hello.',
        emotion: 'longing',
        category: 'romantic',
        location: 'San Francisco, CA',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        hearts: 34,
        replies: 8,
        views: 98,
        isAnonymous: true,
        aiResponse: null
      }
    ];
    setPosts(samplePosts);
    localStorage.setItem('breakingSilence_posts', JSON.stringify(samplePosts));
  };

  const handleCreatePost = async () => {
    if (!newPost.content.trim() || !newPost.location.trim()) return;

    const post = {
      id: Date.now(),
      userId: state.user.id || 'anonymous',
      username: newPost.isAnonymous ? 'Anonymous Heart' : (state.user.name || 'Anonymous'),
      title: newPost.title || 'Unspoken words...',
      content: newPost.content,
      emotion: newPost.emotion,
      category: newPost.category,
      location: newPost.location,
      timestamp: new Date().toISOString(),
      hearts: 0,
      replies: [],
      views: 0,
      isAnonymous: true,
      aiResponse: null
    };

    // Generate AI therapist response
    if (aiAgent) {
      try {
        const aiResponse = await generateTherapistResponse(post);
        post.aiResponse = aiResponse;
      } catch (error) {
        console.error('Error generating AI response:', error);
      }
    }

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('breakingSilence_posts', JSON.stringify(updatedPosts));

    // Reset form
    setNewPost({
      title: '',
      content: '',
      emotion: '',
      location: '',
      category: 'unspoken'
    });
    setShowCreatePost(false);
  };

  const generateTherapistResponse = async (post) => {
    const therapeuticPrompt = `As a compassionate AI therapist, respond to this person's unspoken feelings about ${post.category}. They shared: "${post.content}". Their emotion is ${post.emotion}. Provide supportive, validating, and helpful insights.`;
    
    const response = await aiAgent.generateResponse(therapeuticPrompt, {
      isTherapeuticResponse: true,
      emotionalContext: post.emotion,
      category: post.category
    });

    return {
      id: Date.now(),
      content: response,
      author: 'AI Therapist',
      timestamp: new Date().toISOString(),
      isAI: true,
      hearts: 0
    };
  };

  const handleHeartPost = (postId) => {
    const updatedPosts = posts.map(post => 
      post.id === postId 
        ? { ...post, hearts: post.hearts + 1 }
        : post
    );
    setPosts(updatedPosts);
    localStorage.setItem('breakingSilence_posts', JSON.stringify(updatedPosts));
  };

  const handleReplyToPost = async (postId, replyContent) => {
    if (!replyContent.trim()) return;

    const reply = {
      id: Date.now(),
      content: replyContent,
      author: state.user.name || 'Anonymous',
      timestamp: new Date().toISOString(),
      isAI: false,
      hearts: 0
    };

    const updatedPosts = posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            replies: [...(post.replies || []), reply],
            replyCount: (post.replies?.length || 0) + 1
          }
        : post
    );

    setPosts(updatedPosts);
    localStorage.setItem('breakingSilence_posts', JSON.stringify(updatedPosts));
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      grateful: 'from-green-400 to-emerald-500',
      grief: 'from-purple-400 to-indigo-500',
      longing: 'from-pink-400 to-rose-500',
      sad: 'from-blue-400 to-indigo-500',
      angry: 'from-red-400 to-rose-500',
      hopeful: 'from-yellow-400 to-orange-500',
      anxious: 'from-orange-400 to-red-500',
      peaceful: 'from-teal-400 to-cyan-500'
    };
    return colors[emotion] || 'from-gray-400 to-gray-500';
  };

  const getEmotionEmoji = (emotion) => {
    const emojis = {
      grateful: '🙏',
      grief: '💔',
      longing: '💭',
      sad: '😢',
      angry: '😤',
      hopeful: '🌟',
      anxious: '😰',
      peaceful: '😌'
    };
    return emojis[emotion] || '💝';
  };

  const categories = [
    { id: 'all', label: 'All Stories', icon: '🌍' },
    { id: 'unspoken', label: 'Unspoken Words', icon: '💭' },
    { id: 'romantic', label: 'Love & Romance', icon: '💕' },
    { id: 'loss', label: 'Grief & Loss', icon: '🕊️' },
    { id: 'gratitude', label: 'Gratitude', icon: '🙏' },
    { id: 'apology', label: 'Apologies', icon: '💔' },
    { id: 'hope', label: 'Hope & Dreams', icon: '⭐' }
  ];

  const emotions = [
    { id: 'grateful', label: 'Grateful', emoji: '🙏' },
    { id: 'grief', label: 'Grieving', emoji: '💔' },
    { id: 'longing', label: 'Longing', emoji: '💭' },
    { id: 'sad', label: 'Sad', emoji: '😢' },
    { id: 'hopeful', label: 'Hopeful', emoji: '🌟' },
    { id: 'anxious', label: 'Anxious', emoji: '😰' },
    { id: 'peaceful', label: 'Peaceful', emoji: '😌' }
  ];

  const filteredPosts = filter === 'all' ? posts : posts.filter(post => post.category === filter);
  const totalStats = {
    stories: posts.length,
    hearts: posts.reduce((sum, post) => sum + post.hearts, 0),
    replies: posts.reduce((sum, post) => sum + (post.replies?.length || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="text-center pt-8 pb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full">
              <FiHeart className="text-white text-3xl" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Breaking the Silence
          </h1>
          <p className="text-lg text-purple-600 font-medium mb-2">
            YOUR UNSPOKEN WORDS MATTER
          </p>
          <p className="text-gray-600 mb-4">
            They deserve to be heard
          </p>
          
          {/* Stats */}
          <div className="flex justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <span className="font-bold text-purple-600">{totalStats.stories}</span>
              <span>stories shared</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <span className="font-bold text-pink-600">{totalStats.hearts}</span>
              <span>hearts sent today</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <span className="font-bold text-blue-600">{totalStats.replies}</span>
              <span>replies shared</span>
            </div>
          </div>
        </motion.div>

        {/* Create Post Button */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.button
            onClick={() => setShowCreatePost(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg flex items-center space-x-2 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus size={24} />
            <span>Share Your Unspoken Words</span>
          </motion.button>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  filter === category.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Posts */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onHeart={() => handleHeartPost(post.id)}
                onReply={(content) => handleReplyToPost(post.id, content)}
                getEmotionColor={getEmotionColor}
                getEmotionEmoji={getEmotionEmoji}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Create Post Modal */}
        <CreatePostModal
          isOpen={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          newPost={newPost}
          setNewPost={setNewPost}
          onSubmit={handleCreatePost}
          emotions={emotions}
          categories={categories.filter(c => c.id !== 'all')}
        />
      </div>
    </div>
  );
};

// Post Card Component
const PostCard = ({ post, onHeart, onReply, getEmotionColor, getEmotionEmoji }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      onReply(replyContent);
      setReplyContent('');
      setShowReplyForm(false);
      setShowReplies(true);
    }
  };

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <FiUser className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{post.username}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FiClock size={12} />
              <span>{format(new Date(post.timestamp), 'MMM d, h:mm a')}</span>
              <FiMapPin size={12} />
              <span>{post.location}</span>
            </div>
          </div>
        </div>
        
        {post.emotion && (
          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getEmotionColor(post.emotion)} text-white text-sm font-medium flex items-center space-x-1`}>
            <span>{getEmotionEmoji(post.emotion)}</span>
            <span className="capitalize">{post.emotion}</span>
          </div>
        )}
      </div>

      {/* Post Title */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        {post.title}
      </h2>

      {/* Post Content */}
      <p className="text-gray-700 leading-relaxed mb-4">
        {post.content}
      </p>

      {/* AI Therapist Response */}
      {post.aiResponse && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4 border-l-4 border-blue-400">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <FiStar className="text-white" size={12} />
            </div>
            <span className="text-sm font-semibold text-blue-700">AI Therapist Response</span>
          </div>
          <p className="text-blue-800 text-sm leading-relaxed">
            {post.aiResponse.content}
          </p>
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <motion.button
            onClick={onHeart}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiHeart size={18} />
            <span className="text-sm font-medium">{post.hearts}</span>
          </motion.button>
          
          <motion.button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiMessageCircle size={18} />
            <span className="text-sm font-medium">{post.replies?.length || 0}</span>
          </motion.button>
          
          <div className="flex items-center space-x-2 text-gray-500">
            <FiEye size={16} />
            <span className="text-sm">{post.views}</span>
          </div>
        </div>

        {(post.replies?.length > 0) && (
          <motion.button
            onClick={() => setShowReplies(!showReplies)}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            whileHover={{ scale: 1.05 }}
          >
            {showReplies ? 'Hide' : 'Show'} Replies
          </motion.button>
        )}
      </div>

      {/* Reply Form */}
      <AnimatePresence>
        {showReplyForm && (
          <motion.div
            className="mt-4 p-4 bg-gray-50 rounded-xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Share your thoughts or support..."
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <motion.button
                onClick={() => setShowReplyForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                whileHover={{ scale: 1.05 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleReplySubmit}
                disabled={!replyContent.trim()}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: replyContent.trim() ? 1.05 : 1 }}
              >
                Reply
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Replies */}
      <AnimatePresence>
        {showReplies && post.replies?.length > 0 && (
          <motion.div
            className="mt-4 space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {post.replies.map((reply) => (
              <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      reply.isAI 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                        : 'bg-gradient-to-r from-gray-400 to-gray-600'
                    }`}>
                      {reply.isAI ? (
                        <FiStar className="text-white" size={12} />
                      ) : (
                        <FiUser className="text-white" size={12} />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {reply.author}
                    </span>
                    {reply.isAI && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        AI Therapist
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(new Date(reply.timestamp), 'MMM d, h:mm a')}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {reply.content}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Create Post Modal Component
const CreatePostModal = ({ isOpen, onClose, newPost, setNewPost, onSubmit, emotions, categories }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Share Your Heart</h2>
            <motion.button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What would you say if you could? (Optional)
              </label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="To my coworker who helped me today..."
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your words matter. Make them count. *
              </label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Share your unspoken words, feelings, or thoughts..."
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={5}
                maxLength={500}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {newPost.content.length}/500
              </div>
            </div>

            {/* Emotion */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How did they make you feel?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {emotions.map((emotion) => (
                  <motion.button
                    key={emotion.id}
                    onClick={() => setNewPost({ ...newPost, emotion: emotion.id })}
                    className={`p-3 rounded-xl border-2 text-sm transition-all ${
                      newPost.emotion === emotion.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-lg mb-1">{emotion.emoji}</div>
                    <div className="font-medium">{emotion.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📍 Location (required)
              </label>
              <input
                type="text"
                value={newPost.location}
                onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
                placeholder="City, State or General Area"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {/* Submit Button */}
            <motion.button
              onClick={onSubmit}
              disabled={!newPost.content.trim() || !newPost.location.trim()}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: newPost.content.trim() && newPost.location.trim() ? 1.02 : 1 }}
              whileTap={{ scale: newPost.content.trim() && newPost.location.trim() ? 0.98 : 1 }}
            >
              Share Your Heart 💝
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BreakingSilencePage;