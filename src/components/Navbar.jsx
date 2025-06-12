import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiMessageCircle, 
  FiHeart, 
  FiUser, 
  FiSettings,
  FiBell,
  FiUsers
} from 'react-icons/fi';

const Navbar = () => {
  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/chat', icon: FiMessageCircle, label: 'Chat' },
    { path: '/mood', icon: FiHeart, label: 'Mood' },
    { path: '/breaking-silence', icon: FiUsers, label: 'Community' },
    { path: '/reminders', icon: FiBell, label: 'Reminders' },
    { path: '/profile', icon: FiUser, label: 'Profile' }
  ];

  return (
    <motion.nav 
      className="bg-white/80 backdrop-blur-lg border-t border-white/20 px-4 py-2 safe-bottom"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'text-primary-600' 
                  : 'text-gray-600 hover:text-primary-500'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={24} />
                <span className="text-xs mt-1 font-medium">{label}</span>
                {isActive && (
                  <motion.div
                    className="w-1 h-1 bg-primary-600 rounded-full mt-1"
                    layoutId="activeIndicator"
                  />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
};

export default Navbar;