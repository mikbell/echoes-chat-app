import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Menu, X, Settings, User, LogOut, Globe, Palette } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import LanguageSelector from './LanguageSelector';
import ThemeSelector from './ThemeSelector';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { authUser, logout, onlineUsers } = useAuthStore();
  const { t } = useTranslation();

  const menuItems = [
    {
      icon: Settings,
      label: t('navigation.settings'),
      href: '/settings',
      color: 'text-blue-500'
    },
    {
      icon: User,
      label: t('navigation.profile'),
      href: '/profile',
      color: 'text-green-500',
      authRequired: true
    },
    {
      icon: LogOut,
      label: t('navigation.logout'),
      action: logout,
      color: 'text-red-500',
      authRequired: true
    }
  ];

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const menuVariants = {
    hidden: { 
      x: '100%',
      transition: { type: 'tween', duration: 0.3 }
    },
    visible: { 
      x: 0,
      transition: { type: 'tween', duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 }
    })
  };

  return (
    <div className="sm:hidden">
      {/* Menu Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-base-200 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Menu size={20} />
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-base-100 shadow-2xl z-50 flex flex-col"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-base-300">
                <div className="flex items-center gap-3">
                  {authUser && (
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full">
                        <img 
                          src={authUser.profilePic || '/avatar.png'} 
                          alt="Profile" 
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">
                      {authUser ? authUser.fullName : t('app.name')}
                    </h3>
                    {authUser && (
                      <p className="text-sm text-base-content/60">
                        {authUser.email}
                      </p>
                    )}
                  </div>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-base-200 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Online Status */}
              {authUser && onlineUsers.length > 0 && (
                <motion.div
                  className="mx-4 mt-4 p-3 bg-success/10 rounded-lg border border-success/20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-success">
                      {onlineUsers.length} {t('common.online')}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Menu Items */}
              <nav className="flex-1 p-4">
                <div className="space-y-2">
                  {menuItems.map((item, index) => {
                    if (item.authRequired && !authUser) return null;
                    
                    const Icon = item.icon;
                    
                    return (
                      <motion.div
                        key={item.label}
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {item.href ? (
                          <a
                            href={item.href}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors group"
                            onClick={() => setIsOpen(false)}
                          >
                            <Icon size={20} className={`${item.color} group-hover:scale-110 transition-transform`} />
                            <span className="font-medium">{item.label}</span>
                          </a>
                        ) : (
                          <button
                            onClick={() => {
                              item.action?.();
                              setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors group"
                          >
                            <Icon size={20} className={`${item.color} group-hover:scale-110 transition-transform`} />
                            <span className="font-medium">{item.label}</span>
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="divider my-6" />

                {/* Settings Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider">
                    {t('settings.appearance')}
                  </h4>
                  
                  {/* Language Selector */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg">
                      <Globe size={16} className="text-primary" />
                      <span className="text-sm font-medium flex-1">{t('settings.language')}</span>
                    </div>
                    <div className="mt-2">
                      <LanguageSelector className="w-full" />
                    </div>
                  </motion.div>

                  {/* Theme Selector */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg">
                      <Palette size={16} className="text-secondary" />
                      <span className="text-sm font-medium flex-1">{t('settings.theme')}</span>
                    </div>
                    <div className="mt-2">
                      <ThemeSelector className="w-full" />
                    </div>
                  </motion.div>
                </div>
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-base-300">
                <div className="text-center text-xs text-base-content/50">
                  <p>{t('app.name')} v1.0.0</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileMenu;
