import { Home, ShoppingCart, ClipboardList, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

const BottomNav = () => {
  const location = useLocation();
  const { cart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { icon: Home, label: 'HOME', path: '/' },
    { icon: ShoppingCart, label: 'CART', path: '/cart', badge: cartCount },
    { icon: ClipboardList, label: 'ORDER', path: '/orders' },
    { icon: User, label: 'PROFILE', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around items-center z-50 pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center relative ${isActive ? 'text-[#FF6B00]' : 'text-gray-500'}`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            {item.badge > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF6B00] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;