import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe } from 'lucide-react';

const languages = [
  { 
    code: 'en', 
    name: 'English',
    flag: '🇺🇸'
  },
  { 
    code: 'it', 
    name: 'Italiano',
    flag: '🇮🇹'
  },
  { 
    code: 'es', 
    name: 'Español',
    flag: '🇪🇸'
  },
  { 
    code: 'fr', 
    name: 'Français',
    flag: '🇫🇷'
  }
];

const LanguageSelector = ({ className = "" }) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-base-200 hover:bg-base-300 transition-colors duration-200 border border-base-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe size={16} className="text-primary" />
        <span className="text-2xl">{currentLanguage.flag}</span>
        <span className="text-sm font-medium hidden sm:inline">
          {currentLanguage.name}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-base-content/60" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 min-w-[180px] bg-base-100 rounded-lg shadow-xl border border-base-300 overflow-hidden z-50"
          >
            <div className="py-2">
              {languages.map((language, index) => (
                <motion.button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-base-200 transition-colors duration-150 ${
                    currentLanguage.code === language.code 
                      ? 'bg-primary/10 text-primary border-r-2 border-primary' 
                      : 'text-base-content'
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                >
                  <span className="text-2xl">{language.flag}</span>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{language.name}</span>
                    <span className="text-xs text-base-content/60">
                      {t(`languages.${language.code}`)}
                    </span>
                  </div>
                  {currentLanguage.code === language.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 bg-primary rounded-full"
                    />
                  )}
                </motion.button>
              ))}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-2 bg-base-200 border-t border-base-300">
              <p className="text-xs text-base-content/60 text-center">
                {t('settings.language')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
