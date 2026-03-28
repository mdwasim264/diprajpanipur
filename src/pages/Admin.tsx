import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Trash2, Package, Tag, Image as ImageIcon } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const Admin = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    taste: 'Spicy',
    image: '',
    description: ''
  });
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubCats = onSnapshot(collection(db, "categories"), (snap) => {
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsubProducts(); unsubCats(); };
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "products"), {
        ...newProduct,
        price: Number(newProduct.price),
        createdAt: new Date().toISOString()
      });
      setNewProduct({ name: '', price: '', category: '', taste: 'Spicy', image: '', description: '' });
      showSuccess("Product added successfully!");
    } catch (err) {
      showError("Failed to add product");
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory) return;
    await addDoc(collection(db, "categories"), { name: newCategory, id: newCategory.toLowerCase().replace(/\s+/g, '-') });
    setNewCategory('');
    showSuccess("Category added!");
  };

  const deleteItem = async (col: string, id: string) => {
    await deleteDoc(doc(db, col, id));
    showSuccess("Deleted!");
  };

  return (
    <div className="p-6 space-y-8 pb-24">
      <h1 className="text-2xl font-black">Admin Dashboard</h1>

      {/* Add Category */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h2 className="font-bold flex items-center gap-2"><Tag size={18}/> Add Category</h2>
        <form onSubmit={handleAddCategory} className="flex gap-2">
          <input 
            placeholder="Category Name (e.g. Pani Puri)" 
            className="flex-1 p-3 bg-gray-50 rounded-xl border-none"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
          />
          <button className="bg-black text-white p-3 rounded-xl"><Plus/></button>
        </form>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <span key={cat.id} className="bg-gray-100 px-3 py-1 rounded-full text-xs flex items-center gap-2">
              {cat.name}
              <button onClick={() => deleteItem('categories', cat.id)} className="text-red-500"><X size={12}/></button>
            </span>
          ))}
        </div>
      </div>

      {/* Add Product */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h2 className="font-bold flex items-center gap-2"><Package size={18}/> Add New Product</h2>
        <form onSubmit={handleAddProduct} className="space-y-3">
          <input 
            placeholder="Product Name" 
            className="w-full p-3 bg-gray-50 rounded-xl border-none"
            value={newProduct.name}
            onChange={e => setNewProduct({...newProduct, name: e.target.value})}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <input 
              placeholder="Price (₹)" 
              type="number"
              className="w-full p-3 bg-gray-50 rounded-xl border-none"
              value={newProduct.price}
              onChange={e => setNewProduct({...newProduct, price: e.target.value})}
              required
            />
            <select 
              className="w-full p-3 bg-gray-50 rounded-xl border-none"
              value={newProduct.category}
              onChange={e => setNewProduct({...newProduct, category: e.target.value})}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <select 
            className="w-full p-3 bg-gray-50 rounded-xl border-none"
            value={newProduct.taste}
            onChange={e => setNewProduct({...newProduct, taste: e.target.value})}
          >
            <option value="Spicy">Spicy</option>
            <option value="Sweet">Sweet</option>
            <option value="Mix">Mix</option>
          </select>
          <input 
            placeholder="Image URL" 
            className="w-full p-3 bg-gray-50 rounded-xl border-none"
            value={newProduct.image}
            onChange={e => setNewProduct({...newProduct, image: e.target.value})}
            required
          />
          <textarea 
            placeholder="Description" 
            className="w-full p-3 bg-gray-50 rounded-xl border-none"
            value={newProduct.description}
            onChange={e => setNewProduct({...newProduct, description: e.target.value})}
          />
          <button type="submit" className="w-full bg-[#FF6B00] text-white py-4 rounded-2xl font-bold">
            Add Product
          </button>
        </form>
      </div>

      {/* Product List */}
      <div className="space-y-4">
        <h2 className="font-bold">Current Products ({products.length})</h2>
        {products.map(p => (
          <div key={p.id} className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center gap-4">
            <img src={p.image} className="w-12 h-12 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="font-bold text-sm">{p.name}</p>
              <p className="text-xs text-[#FF6B00]">₹{p.price}</p>
            </div>
            <button onClick={() => deleteItem('products', p.id)} className="text-red-500 p-2">
              <Trash2 size={18}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;