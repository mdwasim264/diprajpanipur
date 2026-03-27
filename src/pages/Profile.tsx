import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, MapPin, CreditCard, Bell, LogOut, ChevronRight } from 'lucide-react';

const Profile = () => {
  const { user, profile, logout, login } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-24 h-24 bg-[#FFF3E0] rounded-full flex items-center justify-center text-[#FF6B00]">
          <User size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Login to your account</h2>
          <p className="text-gray-500">Track orders, save addresses and more!</p>
        </div>
        <button 
          onClick={login}
          className="w-full bg-[#FF6B00] text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-200"
        >
          Login with Google
        </button>
      </div>
    );
  }

  const menuItems = [
    { icon: MapPin, label: 'My Addresses', color: 'text-blue-500' },
    { icon: CreditCard, label: 'Payment Methods', color: 'text-purple-500' },
    { icon: Bell, label: 'Notifications', color: 'text-yellow-500' },
  ];

  return (
    <div className="p-4 space-y-8">
      {/* User Header */}
      <div className="flex items-center gap-4 bg-[#FFF3E0] p-6 rounded-3xl">
        <img 
          src={user.photoURL || 'https://via.placeholder.com/100'} 
          alt="Profile" 
          className="w-20 h-20 rounded-full border-4 border-white shadow-sm"
        />
        <div>
          <h2 className="text-xl font-bold">{user.displayName}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
          {profile?.taste && (
            <span className="inline-block mt-2 px-3 py-1 bg-[#FF6B00] text-white text-[10px] font-bold rounded-full uppercase">
              {profile.taste} Lover
            </span>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="space-y-2">
        {menuItems.map((item, idx) => (
          <button 
            key={idx}
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl bg-gray-50 ${item.color}`}>
                <item.icon size={20} />
              </div>
              <span className="font-medium">{item.label}</span>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
          </button>
        ))}
        
        <button 
          onClick={logout}
          className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-50 text-red-500 hover:bg-red-50 transition-colors mt-4"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-red-50">
              <LogOut size={20} />
            </div>
            <span className="font-bold">Logout</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Profile;