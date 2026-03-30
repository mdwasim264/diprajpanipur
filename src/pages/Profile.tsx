import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, MapPin, CreditCard, Bell, LogOut, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, profile, logout, login } = useAuth();
  const navigate = useNavigate();

  // Function to get the best possible profile image
  const getProfileImage = () => {
    if (profile?.photoURL) return profile.photoURL;
    if (user?.photoURL) return user.photoURL;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'guest'}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 bg-white">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-[#FFF3E0] rounded-[2rem] flex items-center justify-center text-[#FF6B00] rotate-12 shadow-xl shadow-orange-100"
        >
          <User size={48} className="-rotate-12" />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-800">Join the Family!</h2>
          <p className="text-gray-500 text-sm max-w-[200px] mx-auto">Login to track orders, save addresses and earn rewards.</p>
        </div>
        <button 
          onClick={login}
          className="w-full bg-[#FF6B00] text-white py-4 rounded-2xl font-black shadow-xl shadow-orange-200 active:scale-95 transition-all"
        >
          Login with Google
        </button>
      </div>
    );
  }

  const menuItems = [
    { icon: MapPin, label: 'My Addresses', color: 'text-blue-500', bg: 'bg-blue-50', path: '/addresses' },
    { icon: CreditCard, label: 'Payment Methods', color: 'text-purple-500', bg: 'bg-purple-50', path: '/payments' },
    { icon: Bell, label: 'Notifications', color: 'text-yellow-500', bg: 'bg-yellow-50', path: '/notifications' },
  ];

  return (
    <div className="p-4 space-y-8 bg-[#FAFAFA] min-h-screen">
      {/* User Header Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative bg-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-200/50 overflow-hidden"
      >
        <div className="relative z-10 flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-[1.8rem] p-1 bg-gradient-to-tr from-[#FF6B00] to-[#FF9100] shadow-lg rotate-3">
              <img 
                src={getProfileImage()} 
                alt="Profile" 
                className="w-full h-full rounded-[1.5rem] object-cover border-2 border-white -rotate-3 bg-gray-50"
                onError={(e) => {
                  // If Google image fails, try to reload or use dicebear as last resort
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('dicebear')) {
                    target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;
                  }
                }}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white"></div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-black text-gray-800 leading-tight">{user.displayName}</h2>
            <p className="text-gray-400 text-xs font-medium truncate max-w-[150px]">{user.email}</p>
            <div className="flex gap-2 mt-2">
              <span className="px-3 py-1 bg-[#FFF3E0] text-[#FF6B00] text-[10px] font-black rounded-full uppercase tracking-wider">
                {profile?.taste || 'Foodie'}
              </span>
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-600 text-[10px] font-black rounded-full uppercase">
                <Sparkles size={10} fill="currentColor" />
                <span>Gold Member</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#FFF3E0] rounded-full opacity-50 blur-3xl"></div>
      </motion.div>

      {/* Menu Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-2">Account Settings</h3>
        <div className="space-y-2">
          {menuItems.map((item, idx) => (
            <motion.button 
              key={idx}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-3xl border border-gray-50 hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
                  <item.icon size={20} />
                </div>
                <span className="font-bold text-gray-700">{item.label}</span>
              </div>
              <ChevronRight size={20} className="text-gray-300" />
            </motion.button>
          ))}
          
          <motion.button 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={logout}
            className="w-full flex items-center justify-between p-4 bg-white rounded-3xl border border-red-50 text-red-500 hover:bg-red-50 active:scale-[0.98] transition-all mt-4 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-red-50">
                <LogOut size={20} />
              </div>
              <span className="font-black">Logout</span>
            </div>
          </motion.button>
        </div>
      </div>

      {/* App Version Info */}
      <div className="text-center pt-4">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Dipraj Pani Puri v1.0.4</p>
      </div>
    </div>
  );
};

export default Profile;