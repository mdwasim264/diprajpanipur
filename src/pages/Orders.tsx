import React from 'react';
import { ClipboardList } from 'lucide-react';

const Orders = () => {
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
};

export default Orders;