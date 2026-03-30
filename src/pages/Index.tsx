import React, { useState, useEffect } from 'react';
import { Search, Heart, Filter, Star, Sparkles, Flame, Zap, X, Check, AlertCircle, ChevronRight, Ticket, Copy, Crown, Trophy, Tag, Medal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, doc, updateDoc, increment, orderBy, limit } from 'firebase/firestore';
import { showSuccess, showError } from '@/utils/toast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { addToCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTaste, setSelectedTaste] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = collection(db, "products");
    const unsubscribeProducts = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    const catQ = collection(db, "categories");
    const unsubscribeCats = onSnapshot(catQ, (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const bannerQ = collection(db, "banners");
    const unsubscribeBanners = onSnapshot(bannerQ, (snapshot) => {
      setBanners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const couponQ = collection(db, "coupons");
    const unsubscribeCoupons = onSnapshot(couponQ, (snapshot) => {
      setCoupons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const usersQ = query(
      collection(db, "users"), 
      where("totalOrders", ">", 0),
      orderBy("totalOrders", "desc"),
      limit(5)
    );
    const unsubscribeUsers = onSnapshot(usersQ, (snapshot) => {
      setTopCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeProducts();
      unsubscribeCats();
      unsubscribeBanners();
      unsubscribeCoupons();
      unsubscribeUsers();
    };
  }, []);

  const getAvatar = (u: any) => u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.uid || u.id}`;

  const filteredProducts = products.filter(p => 
    (activeCategory === 'all' || p.category === activeCategory) &&
    (selectedTaste === null || p.taste === selectedTaste) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 border-4 border-[#FF6B00] border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="p-4 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-bold shadow-lg">DP</div>
          <div>
            <h1 className="text-lg font-black text-[#212121] leading-none">DIPRAJ</h1>
            <p className="text-[10px] font-bold text-[#FF6B00] tracking-widest">PANI PURI</p>
          </div>
        </div>
        <button className="p-2 rounded-full bg-[#FFF3E0] text-[#FF6B00]"><Heart size={20} /></button>
      </div>

      {/* Banners */}
      <div className="overflow-x-auto no-scrollbar flex gap-4 snap-x">
        {banners.map((banner) => (
          <div key={banner.id} className="min-w-[90%] snap-center bg-gray-100 aspect-[21/9] rounded-[2rem] relative overflow-hidden shadow-xl">
            <img src={banner.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 p-6 flex flex-col justify-end text-white">
              <h2 className="text-xl font-black">{banner.title}</h2>
              <p className="text-xs opacity-90">{banner.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard Entry Banner */}
      <motion.div 
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/leaderboard')}
        className="bg-gradient-to-r from-gray-900 to-gray-800 p-5 rounded-[2rem] flex items-center justify-between shadow-xl relative overflow-hidden group cursor-pointer"
      >
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-3">
            {topCustomers.slice(0, 3).map((u, i) => (
              <img 
                key={u.id} 
                src={getAvatar(u)} 
                className="w-10 h-10 rounded-full border-2 border-gray-800 object-cover bg-gray-700"
                onError={(e) => (e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`)}
              />
            ))}
          </div>
          <div>
            <h2 className="text-white font-black text-sm">Wall of Fame</h2>
            <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest">See Top Customers</p>
          </div>
        </div>
        <div className="relative z-10 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
          <ChevronRight size={16} className="text-white" />
        </div>
        <Crown className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 rotate-12" />
      </motion.div>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search your favorite puri..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF6B00] text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <button className={`p-4 rounded-2xl shadow-sm ${selectedTaste ? 'bg-[#FF6B00] text-white' : 'bg-white text-[#FF6B00] border border-gray-100'}`}>
              <Filter size={20} />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-[2.5rem] h-[60vh] p-6">
            <SheetHeader className="flex flex-row items-center justify-between">
              <SheetTitle className="text-xl font-black">Filters</SheetTitle>
              <button onClick={() => {setSelectedTaste(null); setActiveCategory('all');}} className="text-xs font-bold text-[#FF6B00] uppercase">Reset</button>
            </SheetHeader>
            <div className="mt-8 space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase">Taste</h3>
                <div className="flex flex-wrap gap-3">
                  {['Spicy', 'Sweet', 'Mix'].map((t) => (
                    <button key={t} onClick={() => setSelectedTaste(t)} className={`px-6 py-3 rounded-2xl text-sm font-bold border-2 ${selectedTaste === t ? 'bg-[#FF6B00] border-[#FF6B00] text-white' : 'bg-white border-gray-100 text-gray-500'}`}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
            <SheetFooter className="mt-auto pt-6">
              <SheetClose asChild><Button className="w-full bg-[#FF6B00] h-14 rounded-2xl font-black text-lg">Apply</Button></SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-gray-800">Categories</h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          <button onClick={() => setActiveCategory('all')} className={`flex-shrink-0 flex flex-col items-center gap-2 ${activeCategory === 'all' ? 'scale-110' : 'opacity-60'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${activeCategory === 'all' ? 'border-[#FF6B00] bg-[#FFF3E0]' : 'border-gray-100 bg-gray-50'}`}><Sparkles size={24} /></div>
            <span className="text-[10px] font-bold uppercase">All</span>
          </button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex-shrink-0 flex flex-col items-center gap-2 ${activeCategory === cat.id ? 'scale-110' : 'opacity-60'}`}>
              <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${activeCategory === cat.id ? 'border-[#FF6B00]' : 'border-gray-100'}`}><img src={cat.image} className="w-full h-full object-cover" /></div>
              <span className="text-[10px] font-bold uppercase">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-gray-800">Popular Now</h2>
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-[2rem] shadow-sm border border-gray-50 overflow-hidden flex flex-col group cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="relative h-40 overflow-hidden">
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                {product.discount > 0 && <div className="absolute top-3 right-3 bg-[#FF6B00] text-white px-2 py-1 rounded-lg text-[8px] font-black uppercase">{product.discount}% OFF</div>}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm line-clamp-1 text-gray-800">{product.name}</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{product.description}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[#FF6B00] font-black text-base">₹{product.price}</span>
                  <button onClick={(e) => {e.stopPropagation(); addToCart(product); showSuccess(`${product.name} added!`);}} className="bg-[#FF6B00] text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"><Zap size={18} fill="currentColor" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;