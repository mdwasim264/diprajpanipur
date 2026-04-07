import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Leaderboard from './pages/Leaderboard';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Onboarding from './pages/Onboarding';
import Checkout from './pages/Checkout';
import Addresses from './pages/Addresses';
import Payments from './pages/Payments';
import Notifications from './pages/Notifications';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './components/theme-provider';
import BottomNav from './components/BottomNav';
import { Toaster } from 'sonner';
import NotificationListener from './components/NotificationListener';
import SplashScreen from './components/SplashScreen';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <ThemeProvider defaultTheme="system" attribute="class">
          <AnimatePresence>
            {showSplash && <SplashScreen />}
          </AnimatePresence>
          
          <Router>
            <div className="min-h-screen bg-background text-foreground pb-20 transition-colors duration-300">
              <NotificationListener />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/addresses" element={<Addresses />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/notifications" element={<Notifications />} />
              </Routes>
              <BottomNav />
              <Toaster position="top-center" richColors />
            </div>
          </Router>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;