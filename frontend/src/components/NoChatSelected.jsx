import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MessageSquare, Users, ArrowRight, Sparkles } from "lucide-react";

const NoChatSelected = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-8 bg-gradient-to-br from-base-100 to-base-200">
      <motion.div 
        className="max-w-lg text-center space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated Icons */}
        <motion.div 
          className="flex justify-center gap-4 mb-8"
          variants={itemVariants}
        >
          <div className="relative">
            {/* Main Icon */}
            <motion.div
              className="w-20 h-20 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-primary/10"
              animate={{ 
                rotateY: [0, 180, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <MessageSquare className="w-10 h-10 text-primary" />
            </motion.div>
            
            {/* Floating sparkles */}
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center"
              animate={{ 
                rotate: 360,
                scale: [1, 1.3, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Sparkles className="w-3 h-3 text-white" />
            </motion.div>
            
            {/* Users icon */}
            <motion.div
              className="absolute -bottom-2 -left-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center border-2 border-base-100"
              animate={{ 
                y: [-2, 2, -2]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Users className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Welcome Content */}
        <motion.div className="space-y-6" variants={itemVariants}>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {t('app.name')} ✨
            </h2>
            <p className="text-lg text-base-content/80 font-medium">
              {t('chat.selectChat')}
            </p>
            <p className="text-base-content/60">
              {t('chat.startChatting')}
            </p>
          </div>
        </motion.div>

        {/* Action Hint */}
        <motion.div 
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary/5 rounded-xl border border-primary/10"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
        >
          <ArrowRight className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary font-medium">
            {t('chat.searchUsers')}
          </span>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div 
          className="flex justify-center gap-2 mt-8 opacity-30"
          variants={itemVariants}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NoChatSelected;
