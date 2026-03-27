import React, { useEffect, useState } from 'react';
import { rtdb } from '@/lib/firebase';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { useAuth } from '@/context/AuthContext';
import { ClipboardList, Clock, Package, Truck, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const STATUS_ICONS: Record<string, any> = {
  'Pending': Clock,
  'Accepted': Package,
  'Preparing': Utensils,
  'Out for Delivery': Truck,
  'Delivered': CheckCircle2,
};

const STATUS_COLORS: Record<string, string> = {
  'Pending': 'text-yellow-500 bg-yellow-50',
  'Accepted': 'text-blue-500 bg-blue-50',
  'Preparing': 'text-purple-500 bg-purple-50',
  'Out for Delivery': 'text-orange-500 bg-orange-50',
  'Delivered': 'text-green-500 bg-green-50',
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const ordersRef = ref(rtdb, 'orders');
    const userOrdersQuery = query(ordersRef, orderByChild('userId'), equalTo(user.uid));

    const unsubscribe = onValue(userOrdersQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderList = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          ...val
        })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(orderList);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) return <div className="p-4 text-center">Loading orders...</div>;

  if (!user || orders.length === 0) {
    return (
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
            <ClipboardList size={40} />
          </div>
          <h2 className="text-lg font-bold">No orders yet</h2>
          <p className="text-gray-500 text-sm">Your order history will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>
      
      <div className="space-y-4">
        {orders.map((order) => {
          const StatusIcon = STATUS_ICONS[order.status] || Clock;
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={order.id} 
              className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Order #{order.id.slice(-6)}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 ${STATUS_COLORS[order.status]}`}>
                  <StatusIcon size={14} />
                  <span className="text-[10px] font-bold uppercase">{order.status}</span>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-100 overflow-hidden">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-dashed">
                <div>
                  <p className="text-xs text-gray-500">{order.items.length} Items</p>
                  <p className="font-bold text-[#FF6B00]">₹{order.total}</p>
                </div>
                <button className="text-[#FF6B00] text-xs font-bold flex items-center gap-1">
                  View Details <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;