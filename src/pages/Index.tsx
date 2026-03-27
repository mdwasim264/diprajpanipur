import React, { useState, useEffect } from 'react';
import { Search, Heart, Filter, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { showSuccess } from '@/utils/toast';

const CATEGORIES = [
  { id: 'pani-puri', name: 'Pani Puri', icon: 'https://res.cloudinary.com/demo/image/upload/v1652345678/pani_puri_cat.png' },
  { id: 'dahi-puri', name: 'Dahi Puri', icon: 'https://res.cloudinary.com/demo/image/upload/v1652345678/dahi_puri_cat.png' },
  { id: 'sev-puri', name: 'Sev Puri', icon: 'https://res.cloudinary.com/demo/image/upload/v1652345678/sev_puri_cat.png' },
  { id: 'combos', name: 'Special Combos', icon: 'https://res.cloudinary.com/demo/image/upload/v1652345678/combo_cat.png' },
];

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
    description: 'Perfect for 4 people. Includes Pani Puri, Sev Puri and Dahi Puri.'
  }
];

const Index = () => {
  const { addToCart } = useCart();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = PRODUCTS.filter(p => 
    (activeCategory === 'all' || p.category === activeCategory) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-bold">DP</div>
          <h1 className="text-xl font-bold text-[#212121]">DIPRAJ PANI PURI</h1>
        </div>
        <button className="p-2 rounded-full bg-[#FFF3E0] text-[#FF6B00]">
          <Heart size={24} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search your favorite puri..."
          className="w-full pl-10 pr-12 py-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#FF6B00] transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FF6B00]">
          <Filter size={20} />
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold">Categories</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex-shrink-0 px-6 py-2 rounded-full font-medium transition-all ${activeCategory === 'all' ? 'bg-[#FF6B00] text-white' : 'bg-[#FFF3E0] text-[#FF6B00]'}`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-6 py-2 rounded-full font-medium transition-all ${activeCategory === cat.id ? 'bg-[#FF6B00] text-white' : 'bg-[#FFF3E0] text-[#FF6B00]'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map((product) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={product.id}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
          >
            <div className="relative h-32">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-white/90 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#2E7D32]"></div>
                <span className="text-[10px] font-bold text-[#2E7D32]">VEG</span>
              </div>
              <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-gray-400">
                <Heart size={16} />
              </button>
            </div>
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm line-clamp-1">{product.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-500">{product.rating}</span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <span className="text-[#FF6B00] font-bold">₹{product.price}</span>
                  {product.discount > 0 && (
                    <span className="text-[10px] text-gray-400 line-through ml-1">₹{product.price + 10}</span>
                  )}
                </div>
                <button
                  onClick={() => {
                    addToCart(product);
                    showSuccess(`${product.name} added to cart!`);
                  }}
                  className="bg-[#FF6B00] text-white p-1.5 rounded-xl hover:scale-105 transition-transform"
                >
                  <span className="text-xs font-bold px-1">+ Add</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Index;