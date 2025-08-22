import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ 
  type = 'default', 
  count = 3, 
  className = '' 
}) => {
  const skeletonVariants = {
    pulse: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const shimmerVariants = {
    shimmer: {
      x: ['-100%', '100%'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (type === 'message') {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(count)].map((_, index) => (
          <motion.div
            key={index}
            className={`flex gap-3 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {index % 2 === 0 && (
              <motion.div
                className="w-8 h-8 bg-base-300 rounded-full relative overflow-hidden"
                variants={skeletonVariants}
                animate="pulse"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-base-100 to-transparent"
                  variants={shimmerVariants}
                  animate="shimmer"
                />
              </motion.div>
            )}
            <div className={`flex flex-col gap-2 ${index % 2 === 0 ? 'items-start' : 'items-end'}`}>
              <motion.div
                className={`h-10 bg-base-300 rounded-2xl relative overflow-hidden ${
                  index % 2 === 0 
                    ? 'w-48 rounded-bl-md' 
                    : 'w-36 rounded-br-md bg-primary/20'
                }`}
                variants={skeletonVariants}
                animate="pulse"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-base-100/50 to-transparent"
                  variants={shimmerVariants}
                  animate="shimmer"
                />
              </motion.div>
              <motion.div
                className="h-3 w-16 bg-base-300 rounded relative overflow-hidden"
                variants={skeletonVariants}
                animate="pulse"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-base-100 to-transparent"
                  variants={shimmerVariants}
                  animate="shimmer"
                />
              </motion.div>
            </div>
            {index % 2 !== 0 && (
              <motion.div
                className="w-8 h-8 bg-base-300 rounded-full relative overflow-hidden"
                variants={skeletonVariants}
                animate="pulse"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-base-100 to-transparent"
                  variants={shimmerVariants}
                  animate="shimmer"
                />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'sidebar') {
    return (
      <div className={`space-y-3 ${className}`}>
        {[...Array(count)].map((_, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-3 p-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className="w-12 h-12 bg-base-300 rounded-full relative overflow-hidden"
              variants={skeletonVariants}
              animate="pulse"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-base-100 to-transparent"
                variants={shimmerVariants}
                animate="shimmer"
              />
            </motion.div>
            <div className="flex-1 space-y-2">
              <motion.div
                className="h-4 bg-base-300 rounded w-3/4 relative overflow-hidden"
                variants={skeletonVariants}
                animate="pulse"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-base-100 to-transparent"
                  variants={shimmerVariants}
                  animate="shimmer"
                />
              </motion.div>
              <motion.div
                className="h-3 bg-base-300 rounded w-1/2 relative overflow-hidden"
                variants={skeletonVariants}
                animate="pulse"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-base-100 to-transparent"
                  variants={shimmerVariants}
                  animate="shimmer"
                />
              </motion.div>
            </div>
            <motion.div
              className="w-3 h-3 bg-base-300 rounded-full relative overflow-hidden"
              variants={skeletonVariants}
              animate="pulse"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-base-100 to-transparent"
                variants={shimmerVariants}
                animate="shimmer"
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Default skeleton
  return (
    <div className={`space-y-3 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <motion.div
            className="h-4 bg-base-300 rounded w-full relative overflow-hidden"
            variants={skeletonVariants}
            animate="pulse"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-base-100 to-transparent"
              variants={shimmerVariants}
              animate="shimmer"
            />
          </motion.div>
          <motion.div
            className="h-4 bg-base-300 rounded w-3/4 relative overflow-hidden"
            variants={skeletonVariants}
            animate="pulse"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-base-100 to-transparent"
              variants={shimmerVariants}
              animate="shimmer"
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
