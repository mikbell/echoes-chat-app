import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Palette, ChevronDown, Coffee, Sparkles, Heart, Ghost, Trees, Waves, Headphones, Brush, Grid, Crown, Skull, Leaf, Building, Zap, Snowflake, Eye, Mountain, Sunset as SunsetIcon } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { THEMES } from '../constants';

// Mappatura temi con icone e colori rappresentativi
const getThemeConfig = (themeId) => {
  const themeConfigs = {
    light: { icon: Sun, gradient: 'from-yellow-400 to-orange-500', category: 'basic' },
    dark: { icon: Moon, gradient: 'from-slate-600 to-slate-800', category: 'basic' },
    coffee: { icon: Coffee, gradient: 'from-amber-600 to-amber-800', category: 'basic' },
    emerald: { icon: Trees, gradient: 'from-emerald-500 to-teal-600', category: 'basic' },
    synthwave: { icon: Sparkles, gradient: 'from-pink-500 via-purple-500 to-indigo-500', category: 'special' },
    cupcake: { icon: Heart, gradient: 'from-pink-300 to-pink-500', category: 'colorful' },
    corporate: { icon: Building, gradient: 'from-blue-600 to-blue-800', category: 'professional' },
    retro: { icon: Monitor, gradient: 'from-orange-400 to-red-500', category: 'vintage' },
    cyberpunk: { icon: Zap, gradient: 'from-cyan-400 to-purple-600', category: 'special' },
    valentine: { icon: Heart, gradient: 'from-red-400 to-pink-500', category: 'colorful' },
    halloween: { icon: Ghost, gradient: 'from-orange-500 to-purple-600', category: 'seasonal' },
    forest: { icon: Trees, gradient: 'from-green-600 to-green-800', category: 'nature' },
    aqua: { icon: Waves, gradient: 'from-cyan-400 to-blue-500', category: 'nature' },
    lofi: { icon: Headphones, gradient: 'from-purple-400 to-pink-400', category: 'aesthetic' },
    pastel: { icon: Brush, gradient: 'from-purple-200 to-pink-200', category: 'aesthetic' },
    wireframe: { icon: Grid, gradient: 'from-gray-400 to-gray-600', category: 'minimal' },
    luxury: { icon: Crown, gradient: 'from-yellow-400 to-yellow-600', category: 'premium' },
    dracula: { icon: Skull, gradient: 'from-purple-600 to-red-600', category: 'special' },
    autumn: { icon: Leaf, gradient: 'from-orange-500 to-red-500', category: 'seasonal' },
    business: { icon: Building, gradient: 'from-blue-500 to-blue-700', category: 'professional' },
    night: { icon: Moon, gradient: 'from-blue-900 to-purple-900', category: 'dark' },
    winter: { icon: Snowflake, gradient: 'from-blue-200 to-blue-400', category: 'seasonal' },
    dim: { icon: Eye, gradient: 'from-gray-600 to-gray-800', category: 'dark' },
    nord: { icon: Mountain, gradient: 'from-blue-400 to-indigo-500', category: 'aesthetic' },
    sunset: { icon: SunsetIcon, gradient: 'from-orange-400 to-purple-500', category: 'nature' }
  };
  
  return themeConfigs[themeId] || { icon: Monitor, gradient: 'from-gray-400 to-gray-600', category: 'basic' };
};

// Raggruppa i temi per categoria
const getThemesByCategory = () => {
  const categories = {
    basic: [],
    colorful: [],
    professional: [],
    special: [],
    nature: [],
    aesthetic: [],
    seasonal: [],
    dark: [],
    vintage: [],
    minimal: [],
    premium: []
  };
  
  THEMES.forEach(themeId => {
    const config = getThemeConfig(themeId);
    categories[config.category].push({
      id: themeId,
      name: themeId.charAt(0).toUpperCase() + themeId.slice(1),
      ...config
    });
  });
  
  return Object.entries(categories).filter(([_, themes]) => themes.length > 0);
};

const ThemeSelector = ({ className = "" }) => {
  const { t } = useTranslation();
  const { theme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const currentThemeConfig = getThemeConfig(theme);
  const currentTheme = {
    id: theme,
    name: theme.charAt(0).toUpperCase() + theme.slice(1),
    ...currentThemeConfig
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (themeId) => {
    setTheme(themeId);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-base-200 hover:bg-base-300 transition-all duration-200 border border-base-300 group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={`p-1 rounded bg-gradient-to-r ${currentTheme.gradient}`}>
          <currentTheme.icon size={14} className="text-white" />
        </div>
        <span className="text-sm font-medium hidden sm:inline">
          {t(`settings.themes.${currentTheme.id}`) || currentTheme.name}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-base-content/60 group-hover:text-base-content transition-colors" />
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
            className="absolute top-full right-0 mt-2 min-w-[200px] bg-base-100 rounded-xl shadow-2xl border border-base-300 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-base-300">
              <div className="flex items-center gap-2">
                <Palette size={16} className="text-primary" />
                <span className="font-semibold text-sm">{t('settings.theme')}</span>
              </div>
            </div>

            {/* Theme Options */}
            <div className="py-2 max-h-96 overflow-y-auto">
              {THEMES.map((themeId, index) => {
                const themeConfig = getThemeConfig(themeId);
                const Icon = themeConfig.icon;
                const isSelected = currentTheme.id === themeId;
                const themeName = themeId.charAt(0).toUpperCase() + themeId.slice(1);
                
                return (
                  <motion.button
                    key={themeId}
                    onClick={() => handleThemeChange(themeId)}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-base-200 transition-all duration-150 group ${
                      isSelected ? 'bg-primary/10 border-r-2 border-primary' : ''
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index % 10) * 0.05 }}
                    whileHover={{ x: 4 }}
                  >
                    {/* Theme Icon */}
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${themeConfig.gradient} group-hover:scale-110 transition-transform duration-200`}>
                      <Icon size={16} className="text-white" />
                    </div>

                    {/* Theme Info */}
                    <div className="flex flex-col items-start flex-1">
                      <span className={`font-medium text-sm ${isSelected ? 'text-primary' : 'text-base-content'}`}>
                        {t(`settings.themes.${themeId}`) || themeName}
                      </span>
                      
                      {/* Category badge */}
                      <span className="text-xs text-base-content/60 capitalize">
                        {themeConfig.category}
                      </span>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-3 h-3 bg-primary rounded-full"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-base-200 border-t border-base-300">
              <p className="text-xs text-base-content/60 text-center">
                {t('settings.appearance')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;
