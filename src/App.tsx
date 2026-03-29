import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Index from "./pages/Index";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import Checkout from "./pages/Checkout";
import Addresses from "./pages/Addresses";
import Payments from "./pages/Payments";
import Notifications from "./pages/Notifications";
import ProductDetails from "./pages/ProductDetails";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";
import NotificationListener from "./components/NotificationListener";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster position="top-center" expand={true} richColors />
          <BrowserRouter>
            <NotificationListener />
            <PWAInstallPrompt />
            <div className="min-h-screen bg-[#FFFFFF] pb-20">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/addresses" element={<Addresses />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BottomNav />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;