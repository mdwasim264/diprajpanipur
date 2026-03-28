import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Plus, ShieldCheck } from 'lucide-react';

const Payments = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 flex items-center gap-4 border-b">
        <button onClick={() => navigate('/profile')}><ChevronLeft size={24} /></button>
        <h1 className="text-xl font-bold">Payment Methods</h1>
      </div>

      <div className="p-6 space-y-8">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-[2rem] text-white space-y-8 shadow-xl">
          <div className="flex justify-between items-start">
            <CreditCard size={32} className="opacity-50" />
            <span className="text-xs font-bold tracking-widest opacity-50 uppercase">Digital Wallet</span>
          </div>
          <div>
            <p className="text-xs opacity-50 mb-1">Available Balance</p>
            <h2 className="text-3xl font-black">₹0.00</h2>
          </div>
          <div className="flex justify-between items-end">
            <p className="text-sm font-bold">DIPRAJ CASH</p>
            <div className="w-8 h-8 bg-white/10 rounded-full" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Saved Methods</h3>
          <div className="p-8 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
              <Plus size={24} />
            </div>
            <p className="text-sm text-gray-400 font-medium">No cards or UPI IDs saved yet</p>
            <button className="text-[#FF6B00] font-bold text-sm">Add New Method</button>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl text-green-700">
          <ShieldCheck size={20} />
          <p className="text-xs font-bold">Your payment details are encrypted and secure.</p>
        </div>
      </div>
    </div>
  );
};

export default Payments;