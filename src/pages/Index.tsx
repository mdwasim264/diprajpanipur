import React, { useState } from 'react';
import { Search, Heart, Filter, Star, Sparkles, Flame, Zap, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { showSuccess } from '@/utils/toast';
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

const CATEGORIES = [
  { id: 'pani-puri', name: 'Pani Puri' },
  { id: 'dahi-puri', name: 'Dahi Puri' },
  { id: 'sev-puri', name: 'Sev Puri' },
  { id: 'combos', name: 'Special Combos' },
];

const TASTES = ['Spicy', 'Sweet', 'Mix'];

const PRODUCTS = [
  {
    id: '1',
    name: 'Classic Pani Puri (6 Pcs)',
    price: 40,
    discount: 10,
    rating: 4.8,
    category: 'pani-puri',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
    isVeg: true,
    taste: 'Spicy',
    description: 'Crispy puris filled with spicy tangy water and potato mash.'
  },
  {
    id: '2',
    name: 'Special Dahi Puri',
    price: 60,
    discount: 5,
    rating: 4.9,
    category: 'dahi-puri',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80',
    isVeg: true,
    taste: 'Sweet',
    description: 'Sweet and tangy dahi puri topped with sev and pomegranate.'
  },
  {
    id: '3',
    name: 'Family Combo Pack',
    price: 250,
    discount: 15,
    rating: 4.7,
    category: 'combos',
    image: 'https://images.unsplash.com/photo-1626132646529-500637504079?auto=format&fit=crop&w=400&q=80',
    isVeg: true,
    taste: 'Mix',
    description: 'Perfect for 4 people. Includes Pani Puri, Sev Puri and Dahi Puri.'
  },
  {
    id: '4',
    name: 'Spicy Garlic Pani Puri',
    price: 50,
    discount: 0,
    rating: 4.6,
    category: 'pani-puri',
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=400&q=80',
    isVeg: true,
    taste: 'Spicy',
    description: 'Extra spicy garlic water for the brave hearts.'
  }
];

const Index = () => {
  const { addToCart } = useCart();
  const { user, profile } = useAuth();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTaste, setSelectedTaste] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const trackClick = async (productId: string) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      [`clicks.${productId}`]: increment(1)
    });
  };

  const filteredProducts = PRODUCTS.filter(p => 
    (activeCategory === 'all' || p.category === activeCategory) &&
    (selectedTaste === null || p.taste === selectedTaste) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const recommendedProducts = profile?.taste 
    ? PRODUCTS.filter(p => p.taste === profile.taste).slice(0, 2)
    : PRODUCTS.slice(0, 2);

  const resetFilters = () => {
    setSelectedTaste(null);
    setActiveCategory('all');
  };

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
          <button className="p-2 rounded-full bg-gray-50 text-gray-400">
            <Zap size={20} />
          </button>
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
              {/* Taste Filter */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Select Taste</h3>
                <div className="flex flex-wrap gap-3">
                  {TASTES.map((taste) => (
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

              {/* Category Filter (Quick Access) */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Category</h3>
                <div className="flex flex-wrap gap-3">
                  {CATEGORIES.map((cat) => (
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

      {/* Recommended Section */}
      {recommendedProducts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-100 rounded-lg">
                <Sparkles size={16} className="text-[#FF6B00]" />
              </div>
              <h2 className="text-lg font-bold">For You</h2>
            </div>
            <span className="text-xs font-bold text-[#FF6B00]">View All</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {recommendedProducts.map(product => (
              <div 
                key={`rec-${product.id}`}
                className="flex-shrink-0 w-72 bg-white border border-gray-100 p-3 rounded-3xl flex gap-4 items-center shadow-sm"
                onClick={() => trackClick(product.id)}
              >
                <img src={product.image} className="w-20 h-20 rounded-2xl object-cover shadow-md" alt="" />
                <div className="flex-1">
                  <h3 className="font-bold text-sm line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] font-bold text-gray-400">{product.rating}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[#FF6B00] font-black text-sm">₹{product.price}</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                        showSuccess("Added to cart!");
                      }}
                      className="bg-[#FF6B00] text-white p-1.5 rounded-xl"
                    >
                      <Zap size={14} fill="currentColor" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories Quick Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-red-100 rounded-lg">
            <Flame size={16} className="text-red-500" />
          </div>
          <h2 className="text-lg font-bold">Categories</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex-shrink-0 px-6 py-2.5 rounded-2xl font-bold text-sm transition-all ${activeCategory === 'all' ? 'bg-[#FF6B00] text-white shadow-lg shadow-orange-100' : 'bg-gray-50 text-gray-500'}`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-2xl font-bold text-sm transition-all ${activeCategory === cat.id ? 'bg-[#FF6B00] text-white shadow-lg shadow-orange-100' : 'bg-gray-50 text-gray-500'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
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
                {product.discount > 0 && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-sm">
                    {product.discount}% OFF
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm line-clamp-1 text-gray-800">{product.name}</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{product.description}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[#FF6B00] font-black text-base">₹{product.price}</span>
                    {product.discount > 0 && (
                      <span className="text-[10px] text-gray-300 line-through">₹{Math.round(product.price * 1.1)}</span>
                    )}
                  </div>
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
            <p className="text-gray-500 font-bold">No products match your filters</p>
            <button onClick={resetFilters} className="text-[#FF6B00] font-black text-sm underline">Clear All Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;