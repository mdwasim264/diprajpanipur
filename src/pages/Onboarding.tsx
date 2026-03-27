import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { showSuccess } from '@/utils/toast';

const Onboarding = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    taste: '',
    categories: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid), {
      ...formData,
      onboarded: true
    });
    showSuccess("Welcome to Dipraj Pani Puri!");
    navigate('/');
  };

  const toggleCategory = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat) 
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  return (
    <div className="min-h-screen bg-[#FFF3E0] p-6 flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 shadow-xl space-y-6"
      >
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-[#FF6B00]">Tell us about yourself!</h1>
          <p className="text-gray-500 text-sm">Help us personalize your experience</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold">Age</label>
            <input
              type="number"
              required
              className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#FF6B00]"
              value={formData.age}
              onChange={e => setFormData({...formData, age: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Gender</label>
            <div className="flex gap-4">
              {['Male', 'Female', 'Other'].map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFormData({...formData, gender: g})}
                  className={`flex-1 py-2 rounded-xl border-2 transition-all ${formData.gender === g ? 'border-[#FF6B00] bg-[#FFF3E0] text-[#FF6B00]' : 'border-gray-100 text-gray-500'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Favorite Taste</label>
            <div className="flex gap-4">
              {['Spicy', 'Sweet', 'Mix'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({...formData, taste: t})}
                  className={`flex-1 py-2 rounded-xl border-2 transition-all ${formData.taste === t ? 'border-[#FF6B00] bg-[#FFF3E0] text-[#FF6B00]' : 'border-gray-100 text-gray-500'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF6B00] text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-200 mt-4"
          >
            Get Started
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Onboarding;