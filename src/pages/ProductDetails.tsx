import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useCart } from '@/context/CartContext';
import { ChevronLeft, Star, Zap, ShoppingBag, Tag, Flame, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { showSuccess } from '@/utils/toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 border-4 border-[#FF6B00] border-t-transparent rounded-full" />
    </div>
  );

  if (!product) return <div className="p-10 text-center">Product not found</div>;

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header Image Section */}
      <div className="relative h-[45vh] overflow-hidden">
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-[#FF6B00] rounded-full text-[10px] font-black uppercase tracking-widest">
              {product.taste || 'Delicious'}
            </span>
            <div className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold">
              <Star size={10} fill="currentColor" className="text-yellow-400" />
              <span>4.8 (120+ Reviews)</span>
            </div>
          </div>
          <h1 className="text-3xl font-black leading-tight">{product.name}</h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-8 -mt-6 bg-white rounded-t-[2.5rem] relative z-10">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-[#FF6B00]">₹{product.price}</span>
              {product.discount > 0 && (
                <span className="text-lg text-gray-300 line-through font-bold">
                  ₹{Math.round(product.price / (1 - product.discount/100))}
                </span>
              )}
            </div>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-2xl flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-green-700">Freshly Prepared</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Description</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            {product.description || "Experience the authentic taste of our signature pani puri, made with fresh ingredients and our secret spice blend. Perfect for any time of the day!"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-3xl space-y-1">
            <div className="flex items-center gap-2 text-[#FF6B00]">
              <Flame size={16} />
              <span className="text-[10px] font-black uppercase">Spice Level</span>
            </div>
            <p className="text-sm font-bold text-gray-800">{product.taste || 'Medium'}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-3xl space-y-1">
            <div className="flex items-center gap-2 text-[#FF6B00]">
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase">Portion</span>
            </div>
            <p className="text-sm font-bold text-gray-800">Standard Serving</p>
          </div>
        </div>

        <div className="p-6 bg-[#FFF3E0] rounded-[2rem] flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FF6B00] text-white rounded-2xl flex items-center justify-center">
            <Zap size={24} fill="currentColor" />
          </div>
          <div>
            <h4 className="font-black text-sm text-gray-800">Instant Delivery</h4>
            <p className="text-[10px] text-orange-800 font-medium">Get it delivered within 20-30 mins</p>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex gap-4 z-50">
        <button 
          onClick={() => {
            addToCart(product);
            showSuccess(`${product.name} added to cart!`);
          }}
          className="flex-1 h-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center gap-2 font-black text-gray-800 hover:bg-gray-50 transition-colors"
        >
          <ShoppingBag size={20} /> Add to Cart
        </button>
        <button 
          onClick={handleBuyNow}
          className="flex-[1.5] h-14 rounded-2xl bg-[#FF6B00] text-white flex items-center justify-center gap-2 font-black text-lg shadow-xl shadow-orange-100 hover:bg-[#e66000] transition-all"
        >
          Buy Now <Zap size={20} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;