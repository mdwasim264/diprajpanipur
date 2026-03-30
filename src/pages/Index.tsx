import React, { useState, useEffect } from 'react';
import { Search, Heart, Filter, Star, Sparkles, Flame, Zap, X, Check, AlertCircle, ChevronRight, Ticket, Copy, Crown, Trophy, Tag, Medal, MapPin } from 'lucide-react';
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
      unsubscribeUsers();
    };
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getAvatar = (u: any) => u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.uid || u.id}`;

  const filteredProducts = products.filter(p => 
    (activeCategory === 'all' || p.category === activeCategory) &&
    (selectedTaste === null || p.taste === selectedTaste) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-4 space-y-8 bg-[#FAFAFA] min-h-screen">
      {/* Premium Vibrant Mesh Header */}
      <div className="relative p-8 bg-gradient-to-br from-[#FF6B00] via-[#FF4D00] to-[#E64000] rounded-[3rem] shadow-2xl shadow-orange-200 overflow-hidden">
        {/* Mesh Background Effects */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/30 rounded-full blur-[60px] -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-600/20 rounded-full blur-[50px] -ml-10 -mb-10"></div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-white/70 tracking-[0.3em] uppercase">
                {getGreeting()}
              </p>
              <h1 className="text-2xl font-black text-white leading-none">
                {user ? user.displayName?.split(' ')[0] : 'Foodie'}! 👋
              </h1>
            </div>
            
            <button 
              onClick={() => navigate('/profile')}
              className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/30 shadow-xl bg-white/10 backdrop-blur-md"
            >
              <img 
                src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'guest'}`} 
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`)}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <MapPin size={14} className="text-white" />
              <span className="text-[10px] font-black text-white uppercase tracking-wider">Fresh Delivery Near You</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-2 bg-yellow-400 rounded-2xl shadow-lg shadow-yellow-600/20">
              <Star size={12} fill="currentColor" className="text-orange-600" />
              <span className="text-[10px] font-black text-orange-600">4.9</span>
            </div>
          </div>
        </div>
      </div>

      {/* Banners */}
      <div className="overflow-x-auto no-scrollbar flex gap-4 snap-x">
        {banners.map((banner) => (
          <div 
            key={banner.id} 
            className="min-w-[90%] snap-center bg-gray-100 aspect-[21/9] rounded-[2.5rem] relative overflow-hidden shadow-xl shadow-gray-200"
          >
            <img src={banner.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
              <h2 className="text-xl font-black leading-tight">{banner.title}</h2>
              <p className="text-xs opacity-80 font-medium">{banner.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard Entry Banner */}
      <div 
        onClick={() => navigate('/leaderboard')}
        className="bg-gradient-to-r from-gray-900 to-gray-800 p-5 rounded-[2.5rem] flex items-center justify-between shadow-2xl relative overflow-hidden group cursor-pointer"
      >
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-3">
            {topCustomers.slice(0, 3).map((u) => (
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
        <div className="relative z-10 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
          <ChevronRight size={16} className="text-white" />
        </div>
        <Crown className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 rotate-12" />
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search your favorite puri..."
            className="w-full pl-12 pr-4 py-4 bg-white rounded-[1.5rem] border-none shadow-sm focus:ring-2 focus:ring-[#FF6B00] text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <button className={`p-4 rounded-[1.5rem] shadow-sm transition-all ${selectedTaste ? 'bg-[#FF6B00] text-white' : 'bg-white text-[#FF6B00]'}`}>
              <Filter size={20} />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-[3rem] h-[60vh] p-8 border-none shadow-2xl">
            <SheetHeader className="flex flex-row items-center justify-between">
              <SheetTitle className="text-2xl font-black">Filters</SheetTitle>
              <button onClick={() => {setSelectedTaste(null); setActiveCategory('all');}} className="text-xs font-black text-[#FF6B00] uppercase tracking-widest">Reset</button>
            </SheetHeader>
            <div className="mt-10 space-y-8">
              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Taste Profile</h3>
                <div className="flex flex-wrap gap-3">
                  {['Spicy', 'Sweet', 'Mix'].map((t) => (
                    <button 
                      key={t} 
                      onClick={() => setSelectedTaste(t)} 
                      className={`px-8 py-4 rounded-2xl text-sm font-black transition-all border-2 ${selectedTaste === t ? 'bg-[#FF6B00] border-[#FF6B00] text-white shadow-lg shadow-orange-100' : 'bg-gray-50 border-transparent text-gray-500'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <SheetFooter className="mt-auto pt-6">
              <SheetClose asChild>
                <Button className="w-full bg-[#FF6B00] h-16 rounded-[1.5rem] font-black text-lg shadow-xl shadow-orange-200">Apply Filters</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <div className="flex justify-between items-end px-2">
          <h2 className="text-lg font-black text-gray-900">Categories</h2>
          <button className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest">View All</button>
        </div>
        <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2 px-2">
          <button 
            onClick={() => setActiveCategory('all')} 
            className={`flex-shrink-0 flex flex-col items-center gap-3 transition-all ${activeCategory === 'all' ? 'scale-110' : 'opacity-50'}`}
          >
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 transition-all ${activeCategory === 'all' ? 'border-[#FF6B00] bg-white shadow-lg shadow-orange-50' : 'border-transparent bg-white shadow-sm'}`}>
              <Sparkles size={24} className={activeCategory === 'all' ? 'text-[#FF6B00]' : 'text-gray-400'} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider">All</span>
          </button>
          {categories.map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCategory(cat.id)} 
              className={`flex-shrink-0 flex flex-col items-center gap-3 transition-all ${activeCategory === cat.id ? 'scale-110' : 'opacity-50'}`}
            >
              <div className={`w-16 h-16 rounded-[1.5rem] overflow-hidden border-2 transition-all ${activeCategory === cat.id ? 'border-[#FF6B00] shadow-lg shadow-orange-50' : 'border-transparent shadow-sm'}`}>
                <img src={cat.image} className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-gray-900 px-2">Popular Now</h2>
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden flex flex-col group cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="relative h-44 overflow-hidden">
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                {product.discount > 0 && (
                  <div className="absolute top-4 right-4 bg-[#FF6B00] text-white px-3 py-1 rounded-xl text-[8px] font-black uppercase shadow-lg">
                    {product.discount}% OFF
                  </div>
                )}
                <div className="absolute bottom-3 left-3">
                  <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                    <Star size={8} fill="currentColor" className="text-yellow-400" />
                    <span className="text-[8px] font-black text-white">4.8</span>
                  </div>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-sm line-clamp-1 text-gray-800">{product.name}</h3>
                  <p className="text-[10px] font-medium text-gray-400 mt-1 line-clamp-1">{product.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[#FF6B00] font-black text-lg">₹{product.price}</span>
                  <button 
                    onClick={(e) => {e.stopPropagation(); addToCart(product); showSuccess(`${product.name} added!`);}} 
                    className="bg-[#FF6B00] text-white w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-100 active:scale-90 transition-transform"
                  >
                    <Zap size={20} fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;