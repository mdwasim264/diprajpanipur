import React from 'react';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ChevronRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-24 h-24 bg-[#FFF3E0] rounded-full flex items-center justify-center text-[#FF6B00]">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-xl font-bold">Your cart is empty</h2>
        <p className="text-gray-500">Add some delicious pani puri to get started!</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-[#FF6B00] text-white px-8 py-3 rounded-2xl font-bold"
        >
          Order Now
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">My Cart</h1>

      <div className="space-y-4">
        {cart.map((item) => (
          <motion.div 
            layout
            key={item.id} 
            className="bg-white p-3 rounded-3xl border border-gray-100 flex gap-4 items-center"
          >
            <img src={item.image} alt={item.name} className="w-20 h-20 rounded-2xl object-cover" />
            <div className="flex-1">
              <h3 className="font-bold text-sm">{item.name}</h3>
              <p className="text-[#FF6B00] font-bold">₹{item.price}</p>
              <div className="flex items-center gap-3 mt-2">
                <button 
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center"
                >
                  <Minus size={16} />
                </button>
                <span className="font-bold">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-8 h-8 rounded-full bg-[#FF6B00] text-white flex items-center justify-center"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <button 
              onClick={() => removeFromCart(item.id)}
              className="p-2 text-red-500"
            >
              <Trash2 size={20} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Bill Details */}
      <div className="bg-gray-50 p-6 rounded-3xl space-y-3">
        <h3 className="font-bold">Bill Details</h3>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Item Total</span>
          <span>₹{total}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Delivery Fee (2km)</span>
          <span className="text-green-600 font-bold">FREE</span>
        </div>
        <div className="h-px bg-gray-200 my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>To Pay</span>
          <span className="text-[#FF6B00]">₹{total}</span>
        </div>
      </div>

      <button 
        className="w-full bg-[#FF6B00] text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
      >
        Checkout <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Cart;