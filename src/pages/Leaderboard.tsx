"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Trophy, Crown, Medal, Star, Flame, Sparkles } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersQ = query(
      collection(db, "users"), 
      where("totalOrders", ">", 0),
      orderBy("totalOrders", "desc"),
      limit(20)
    );
    
    const unsubscribe = onSnapshot(usersQ, (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTopCustomers(users);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#FF6B00] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const topThree = topCustomers.slice(0, 3);
  const others = topCustomers.slice(3);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-10">
      {/* Header */}
      <div className="bg-white p-6 flex items-center gap-4 sticky top-0 z-50 shadow-sm">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-50 text-gray-600"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-gray-800">Wall of Fame</h1>
      </div>

      <div className="p-4 space-y-8">
        {/* Podium Section */}
        <div className="relative pt-12 pb-6 bg-gradient-to-b from-orange-50/50 to-transparent rounded-[3rem]">
          <div className="flex items-end justify-center gap-2">
            {/* 2nd Place */}
            {topThree[1] && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center gap-3 flex-1"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-gray-300 to-gray-400 shadow-xl">
                    <img src={topThree[1].photoURL || 'https://via.placeholder.com/100'} alt="" className="w-full h-full rounded-full object-cover border-4 border-white" />
                  </div>
                  <div className="absolute -top-2 -left-2 bg-gray-400 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-4 border-white shadow-lg">2</div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-gray-800 truncate w-24">{topThree[1].displayName}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Flame size={12} className="text-orange-500" />
                    <p className="text-[10px] font-bold text-orange-600 uppercase">{topThree[1].totalOrders} Orders</p>
                  </div>
                </div>
                <div className="w-full h-24 bg-gray-100 rounded-t-2xl flex items-center justify-center">
                  <Medal className="text-gray-400" size={32} />
                </div>
              </motion.div>
            )}

            {/* 1st Place */}
            {topThree[0] && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-3 flex-1 -mt-8"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-500 drop-shadow-xl"
                  >
                    <Crown size={40} fill="currentColor" />
                  </motion.div>
                  <div className="w-28 h-28 rounded-full p-1.5 bg-gradient-to-tr from-yellow-400 via-orange-500 to-yellow-600 shadow-2xl shadow-orange-200">
                    <img src={topThree[0].photoURL || 'https://via.placeholder.com/100'} alt="" className="w-full h-full rounded-full object-cover border-4 border-white" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-white px-4 py-1 rounded-full text-xs font-black border-4 border-white shadow-lg">1st</div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-gray-900 truncate w-28">{topThree[0].displayName}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Trophy size={14} className="text-yellow-500" />
                    <p className="text-xs font-black text-orange-600 uppercase">{topThree[0].totalOrders} Orders</p>
                  </div>
                </div>
                <div className="w-full h-32 bg-gradient-to-b from-yellow-100 to-orange-50 rounded-t-3xl flex items-center justify-center border-x-4 border-t-4 border-white">
                  <Sparkles className="text-yellow-500" size={40} />
                </div>
              </motion.div>
            )}

            {/* 3rd Place */}
            {topThree[2] && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center gap-3 flex-1"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-orange-300 to-orange-500 shadow-xl">
                    <img src={topThree[2].photoURL || 'https://via.placeholder.com/100'} alt="" className="w-full h-full rounded-full object-cover border-4 border-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-4 border-white shadow-lg">3</div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-gray-800 truncate w-24">{topThree[2].displayName}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star size={12} className="text-orange-400" />
                    <p className="text-[10px] font-bold text-orange-600 uppercase">{topThree[2].totalOrders} Orders</p>
                  </div>
                </div>
                <div className="w-full h-20 bg-orange-50 rounded-t-2xl flex items-center justify-center">
                  <Medal className="text-orange-300" size={32} />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Others List */}
        <div className="space-y-3">
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Top Contenders</h2>
          <div className="space-y-3">
            {others.map((customer, idx) => (
              <motion.div 
                key={customer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-4 rounded-3xl flex items-center justify-between shadow-sm border border-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center font-black text-gray-300 text-lg">#{idx + 4}</div>
                  <div className="relative">
                    <img src={customer.photoURL || 'https://via.placeholder.com/100'} alt="" className="w-12 h-12 rounded-2xl object-cover border-2 border-gray-50" />
                  </div>
                  <div>
                    <p className="font-black text-gray-800">{customer.displayName}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Loyal Customer</p>
                  </div>
                </div>
                <div className="bg-orange-50 px-4 py-2 rounded-2xl">
                  <p className="text-sm font-black text-[#FF6B00]">{customer.totalOrders}</p>
                  <p className="text-[8px] font-bold text-orange-400 uppercase leading-none">Orders</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;