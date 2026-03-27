import React, { useEffect, useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the custom install UI
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 left-4 right-4 z-[100] bg-white rounded-3xl shadow-2xl border border-orange-100 p-5 flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-[#FFF3E0] rounded-2xl flex items-center justify-center text-[#FF6B00] flex-shrink-0">
            <Smartphone size={24} />
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-sm">Install Dipraj App</h3>
            <p className="text-[10px] text-gray-500">Get the best experience on your phone!</p>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setIsVisible(false)}
              className="p-2 text-gray-400"
            >
              <X size={18} />
            </button>
            <button 
              onClick={handleInstall}
              className="bg-[#FF6B00] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-100"
            >
              <Download size={14} /> Install
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;