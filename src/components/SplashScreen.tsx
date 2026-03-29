import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const SplashScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-[#FF6B00] flex flex-col items-center justify-center text-white"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 1, 
          ease: [0, 0.71, 0.2, 1.01],
          scale: {
            type: "spring",
            damping: 12,
            stiffness: 100,
            restDelta: 0.001
          }
        }}
        className="relative"
      >
        {/* Stylized Logo Circle */}
        <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-black/20 rotate-12">
          <div className="flex flex-col items-center -rotate-12">
            <span className="text-4xl font-black text-[#FF6B00] leading-none">DP</span>
            <span className="text-[8px] font-bold text-[#FF6B00] tracking-[0.2em] mt-1">PANI PURI</span>
          </div>
        </div>
        
        {/* Animated Sparkles around logo */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-4 -right-4 text-yellow-300"
        >
          <Sparkles size={32} fill="currentColor" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-8 text-center"
      >
        <h1 className="text-2xl font-black tracking-tight">DIPRAJ</h1>
        <p className="text-xs font-medium opacity-80 tracking-[0.3em] uppercase mt-1">The Taste of India</p>
      </motion.div>

      {/* Loading Bar */}
      <div className="absolute bottom-12 w-48 h-1 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="w-full h-full bg-white"
        />
      </div>
    </motion.div>
  );
};

export default SplashScreen;