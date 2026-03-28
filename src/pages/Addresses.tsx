import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { MapPin, Plus, Trash2, ChevronLeft, Home, Briefcase, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { showSuccess, showError } from '@/utils/toast';

const Addresses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    houseNo: '',
    area: '',
    landmark: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    if (!user) return;
    const fetchAddresses = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAddresses(docSnap.data().addresses || []);
      }
    };
    fetchAddresses();
  }, [user]);

  const handleAdd = async () => {
    if (!newAddress.houseNo || !newAddress.area || !newAddress.city || !newAddress.pincode) {
      return showError("Please fill all required fields");
    }
    
    try {
      const userRef = doc(db, "users", user.uid);
      const fullAddressString = `${newAddress.houseNo}, ${newAddress.area}, ${newAddress.city}, ${newAddress.state} - ${newAddress.pincode}`;
      const addressData = { 
        ...newAddress, 
        fullAddress: fullAddressString,
        id: Date.now().toString() 
      };
      
      await updateDoc(userRef, {
        addresses: arrayUnion(addressData)
      });
      
      setAddresses([...addresses, addressData]);
      setIsAdding(false);
      setNewAddress({ 
        type: 'Home', 
        houseNo: '', 
        area: '', 
        landmark: '', 
        city: '', 
        state: '', 
        pincode: '' 
      });
      showSuccess("Address added!");
    } catch (e) {
      showError("Failed to add address");
    }
  };

  const handleDelete = async (addr: any) => {
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        addresses: arrayRemove(addr)
      });
      setAddresses(addresses.filter(a => a.id !== addr.id));
      showSuccess("Address removed");
    } catch (e) {
      showError("Failed to remove address");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 flex items-center gap-4 border-b">
        <button onClick={() => navigate('/profile')}><ChevronLeft size={24} /></button>
        <h1 className="text-xl font-bold">My Addresses</h1>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="p-4 rounded-2xl border border-gray-100 flex justify-between items-start">
              <div className="flex gap-3">
                <div className="p-2 bg-[#FFF3E0] text-[#FF6B00] rounded-xl h-fit">
                  {addr.type === 'Home' ? <Home size={20} /> : addr.type === 'Work' ? <Briefcase size={20} /> : <Map size={20} />}
                </div>
                <div>
                  <p className="font-bold text-sm">{addr.type}</p>
                  <p className="text-xs text-gray-500 mt-1">{addr.fullAddress}</p>
                  {addr.landmark && <p className="text-[10px] text-gray-400 mt-1">Landmark: {addr.landmark}</p>}
                </div>
              </div>
              <button onClick={() => handleDelete(addr)} className="text-red-400 p-1"><Trash2 size={18} /></button>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {isAdding ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 p-4 bg-gray-50 rounded-3xl">
              <div className="flex gap-2">
                {['Home', 'Work', 'Other'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setNewAddress({...newAddress, type: t})}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${newAddress.type === t ? 'border-[#FF6B00] bg-white text-[#FF6B00]' : 'border-transparent text-gray-400'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              
              <div className="space-y-3">
                <input 
                  placeholder="House No / Flat No" 
                  className="w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-[#FF6B00] text-sm"
                  value={newAddress.houseNo}
                  onChange={e => setNewAddress({...newAddress, houseNo: e.target.value})}
                />
                <input 
                  placeholder="Area / Street / Colony" 
                  className="w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-[#FF6B00] text-sm"
                  value={newAddress.area}
                  onChange={e => setNewAddress({...newAddress, area: e.target.value})}
                />
                <input 
                  placeholder="Landmark (Optional)" 
                  className="w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-[#FF6B00] text-sm"
                  value={newAddress.landmark}
                  onChange={e => setNewAddress({...newAddress, landmark: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    placeholder="City" 
                    className="w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-[#FF6B00] text-sm"
                    value={newAddress.city}
                    onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                  />
                  <input 
                    placeholder="State" 
                    className="w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-[#FF6B00] text-sm"
                    value={newAddress.state}
                    onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                  />
                </div>
                <input 
                  placeholder="Pincode" 
                  type="number"
                  className="w-full p-3 rounded-xl border-none focus:ring-2 focus:ring-[#FF6B00] text-sm"
                  value={newAddress.pincode}
                  onChange={e => setNewAddress({...newAddress, pincode: e.target.value})}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={() => setIsAdding(false)} className="flex-1 py-3 text-gray-500 font-bold">Cancel</button>
                <button onClick={handleAdd} className="flex-1 py-3 bg-[#FF6B00] text-white rounded-xl font-bold">Save Address</button>
              </div>
            </motion.div>
          ) : (
            <button 
              onClick={() => setIsAdding(true)}
              className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold flex items-center justify-center gap-2"
            >
              <Plus size={20} /> Add New Address
            </button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Addresses;