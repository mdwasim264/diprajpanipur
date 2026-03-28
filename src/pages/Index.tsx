import React, { useState, useEffect } from 'react';
import { Search, Heart, Filter, Star, Sparkles, Flame, Zap, X, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, doc, updateDoc, increment } from 'firebase/firestore';
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
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTaste, setSelectedTaste] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time Products Fetching
  useEffect(() => {
    const q = collection(db, "products");
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore Error:", err);
        setError("Permission Denied. Please update Firebase Rules.");
        setLoading(false);
      }
    );

    // Fetch Categories
    const catQ = collection(db, "categories");
    const unsubscribeCats = onSnapshot(catQ, (snapshot) => {
      const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(cats);
    });

    return () => {
      unsubscribe();
      unsubscribeCats();
    };
  }, []);

  const trackClick = async (productId: string) => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        [`clicks.${productId}`]: increment(1)
      });
    } catch (e) {
      console.log("Tracking failed - likely permissions");
    }
  };

  const filteredProducts = products.filter(p => 
    (activeCategory === 'all' || p.category === activeCategory) &&
    (selectedTaste === null || p.taste === selectedTaste) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const resetFilters = () => {
    setSelectedTaste(null);
    setActiveCategory('all');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#FF6B00] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <AlertCircle size={48} className="text-red-500" />
        <h2 className="text-xl font-bold">Database Error</h2>
        <p className="text-gray-500 text-sm">{error}</p>
        <p className="text-xs bg-gray-100 p-3 rounded-lg">Go to Firebase Console > Firestore > Rules and set them to allow reads.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-orange-200">DP</div>
          <div>
            <h1 className="text-lg font-black text-[#212121] leading-none">DIPRAJ</h1>
            <p className="text-[10px] font-bold text-[#FF6B00] tracking-widest">PANI PURI</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-full bg-[#FFF3E0] text-[#FF6B00]">
            <Heart size={20} />
          </button>
        </div>
      </div>

      {/* Promo Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-[#FF6B00] to-[#FF9100] p-6 rounded-[2rem] text-white relative overflow-hidden shadow-xl shadow-orange-100"
      >
        <div className="relative z-10 space-y-1">
          <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Limited Offer</p>
          <h2 className="text-2xl font-black">FREE DELIVERY</h2>
          <p className="text-sm opacity-90">On all orders above ₹199</p>
          <button className="mt-3 bg-white text-[#FF6B00] px-4 py-1.5 rounded-full text-xs font-bold">Order Now</button>
        </div>
        <Sparkles className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 rotate-12" />
      </motion.div>

      {/* Search Bar & Filter */}
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search your favorite puri..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF6B00] transition-all text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <button className={`p-4 rounded-2xl shadow-sm transition-all ${selectedTaste ? 'bg-[#FF6B00] text-white' : 'bg-white text-[#FF6B00] border border-gray-100'}`}>
              <Filter size={20} />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-[2.5rem] h-[60vh] p-6">
            <SheetHeader className="flex flex-row items-center justify-between">
              <SheetTitle className="text-xl font-black">Filters</SheetTitle>
              <button onClick={resetFilters} className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider">Reset All</button>
            </SheetHeader>
            
            <div className="mt-8 space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Select Taste</h3>
                <div className="flex flex-wrap gap-3">
                  {['Spicy', 'Sweet', 'Mix'].map((taste) => (
                    <button
                      key={taste}
                      onClick={() => setSelectedTaste(selectedTaste === taste ? null : taste)}
                      className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${
                        selectedTaste === taste 
                        ? 'bg-[#FF6B00] border-[#FF6B00] text-white shadow-lg shadow-orange-100' 
                        : 'bg-white border-gray-100 text-gray-500'
                      }`}
                    >
                      {taste}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Category</h3>
                <div className="flex flex-wrap gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(activeCategory === cat.id ? 'all' : cat.id)}
                      className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${
                        activeCategory === cat.id 
                        ? 'bg-[#FF6B00] border-[#FF6B00] text-white shadow-lg shadow-orange-100' 
                        : 'bg-white border-gray-100 text-gray-500'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <SheetFooter className="mt-auto pt-6">
              <SheetClose asChild>
                <Button className="w-full bg-[#FF6B00] hover:bg-[#e66000] text-white h-14 rounded-2xl font-black text-lg shadow-xl shadow-orange-100">
                  Apply Filters
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={product.id}
              className="bg-white rounded-[2rem] shadow-sm border border-gray-50 overflow-hidden flex flex-col group"
              onClick={() => trackClick(product.id)}
            >
              <div className="relative h-40 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]"></div>
                  <span className="text-[8px] font-black text-[#2E7D32] uppercase tracking-tighter">Veg</span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm line-clamp-1 text-gray-800">{product.name}</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{product.description}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[#FF6B00] font-black text-base">₹{product.price}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                      showSuccess(`${product.name} added!`);
                    }}
                    className="bg-[#FF6B00] text-white w-10 h-10 rounded-2xl flex items-center justify-center hover:rotate-90 transition-transform shadow-lg shadow-orange-100"
                  >
                    <Zap size={18} fill="currentColor" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-2 py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
              <Filter size={40} />
            </div>
            <p className="text-gray-500 font-bold">No products found</p>
            <button onClick={resetFilters} className="text-[#FF6B00] font-black text-sm underline">Clear All Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;