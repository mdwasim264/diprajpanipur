import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { rtdb, db } from '@/lib/firebase';
import { ref, push, set } from 'firebase/database';
import { doc, updateDoc, arrayUnion, collection, query, where, getDocs } from 'firebase/firestore';
import { MapPin, Truck, ShoppingBag, ChevronLeft, CheckCircle2, Ticket, Tag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { showSuccess, showError } from '@/utils/toast';

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [orderType, setOrderType] = useState('delivery');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  
  const [address, setAddress] = useState({
    name: user?.displayName || '',
    phone: '',
    pincode: '',
    city: '',
    state: '',
    fullAddress: ''
  });

  const finalTotal = Math.max(0, total - discountAmount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const q = query(collection(db, "coupons"), where("code", "==", couponCode.toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        showError("Invalid coupon code");
        return;
      }

      const couponData = querySnapshot.docs[0].data();
      const discount = (total * (couponData.discount / 100));
      
      setAppliedCoupon({ id: querySnapshot.docs[0].id, ...couponData });
      setDiscountAmount(discount);
      showSuccess(`Coupon applied! You saved ₹${discount.toFixed(2)}`);
    } catch (error) {
      showError("Error applying coupon");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode('');
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      showError("Please login to place order");
      navigate('/profile');
      return;
    }

    try {
      const orderData = {
        userId: user.uid,
        items: cart,
        subtotal: total,
        discount: discountAmount,
        couponCode: appliedCoupon?.code || null,
        total: finalTotal,
        orderType,
        address: orderType === 'delivery' ? address : null,
        status: 'Pending',
        paymentMethod: 'COD',
        createdAt: new Date().toISOString(),
      };

      // Save to Realtime Database for live tracking
      const ordersRef = ref(rtdb, 'orders');
      const newOrderRef = push(ordersRef);
      await set(newOrderRef, orderData);

      // Track behavior in Firestore (Analytics)
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        orderHistory: arrayUnion(newOrderRef.key),
        lastOrderAt: new Date().toISOString()
      });

      showSuccess("Order placed successfully!");
      clearCart();
      setStep(4); // Success step
    } catch (error) {
      showError("Failed to place order. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="p-4 flex items-center gap-4 border-b">
        <button onClick={() => step > 1 && step < 4 ? setStep(step - 1) : navigate('/cart')}>
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Checkout</h1>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-bold text-center">How do you want it?</h2>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: 'delivery', label: 'Delivery', icon: Truck, desc: 'Get it at your doorstep' },
                  { id: 'pickup', label: 'Pickup', icon: ShoppingBag, desc: 'Collect from our store' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setOrderType(type.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${orderType === type.id ? 'border-[#FF6B00] bg-[#FFF3E0]' : 'border-gray-100'}`}
                  >
                    <div className={`p-3 rounded-xl ${orderType === type.id ? 'bg-[#FF6B00] text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <type.icon size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">{type.label}</p>
                      <p className="text-xs text-gray-500">{type.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setStep(orderType === 'delivery' ? 2 : 3)}
                className="w-full bg-[#FF6B00] text-white py-4 rounded-2xl font-bold shadow-lg"
              >
                Continue
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-bold">Delivery Address</h2>
              <div className="space-y-3">
                <input 
                  placeholder="Full Name" 
                  className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#FF6B00]"
                  value={address.name}
                  onChange={e => setAddress({...address, name: e.target.value})}
                />
                <input 
                  placeholder="Phone Number" 
                  className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#FF6B00]"
                  value={address.phone}
                  onChange={e => setAddress({...address, phone: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    placeholder="Pincode" 
                    className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#FF6B00]"
                    value={address.pincode}
                    onChange={e => setAddress({...address, pincode: e.target.value})}
                  />
                  <input 
                    placeholder="City" 
                    className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#FF6B00]"
                    value={address.city}
                    onChange={e => setAddress({...address, city: e.target.value})}
                  />
                </div>
                <textarea 
                  placeholder="Full Address (House No, Street, Landmark)" 
                  rows={3}
                  className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#FF6B00]"
                  value={address.fullAddress}
                  onChange={e => setAddress({...address, fullAddress: e.target.value})}
                />
              </div>
              <button 
                onClick={() => setStep(3)}
                className="w-full bg-[#FF6B00] text-white py-4 rounded-2xl font-bold shadow-lg"
              >
                Save & Continue
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-bold">Payment & Offers</h2>
              
              {/* Coupon Section */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Apply Coupon</p>
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        placeholder="Enter Code" 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#FF6B00] text-sm font-bold uppercase"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={handleApplyCoupon}
                      className="bg-[#FF6B00] text-white px-6 rounded-xl font-bold text-sm"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                        <Ticket size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-green-700 uppercase">{appliedCoupon.code} Applied!</p>
                        <p className="text-[10px] text-green-600">You saved ₹{discountAmount.toFixed(2)}</p>
                      </div>
                    </div>
                    <button onClick={removeCoupon} className="text-green-700 p-1">
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl border-2 border-[#FF6B00] bg-[#FFF3E0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#FF6B00] text-white rounded-lg">
                    <CheckCircle2 size={20} />
                  </div>
                  <span className="font-bold">Cash on Delivery (COD)</span>
                </div>
                <span className="text-[#FF6B00] font-bold">₹{finalTotal.toFixed(2)}</span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-green-600 font-bold">
                  <span>Delivery Fee</span>
                  <span>FREE</span>
                </div>
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Amount to Pay</span>
                  <span className="text-[#FF6B00]">₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                className="w-full bg-[#FF6B00] text-white py-4 rounded-2xl font-bold shadow-lg"
              >
                Place Order
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center space-y-6"
            >
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <CheckCircle2 size={64} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Order Placed!</h2>
                <p className="text-gray-500">Your delicious pani puri is on the way.</p>
              </div>
              <button 
                onClick={() => navigate('/orders')}
                className="w-full bg-[#FF6B00] text-white py-4 rounded-2xl font-bold"
              >
                Track My Order
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Checkout;