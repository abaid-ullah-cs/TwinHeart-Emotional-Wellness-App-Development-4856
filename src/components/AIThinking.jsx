import React from 'react';
import { motion } from 'framer-motion';

const AIThinking = () => {
  return (
    <motion.div
      className="flex justify-start mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-white/80 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-sm max-w-xs">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-primary-400 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {Math.random() > 0.5 ? 'Thinking...' : 'Typing...'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default AIThinking;