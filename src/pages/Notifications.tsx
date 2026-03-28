import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, MessageSquare, Mail, Smartphone } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

const Notifications = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    orderUpdates: true,
    promotions: false,
    offers: true,
    newsletter: false
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 flex items-center gap-4 border-b">
        <button onClick={() => navigate('/profile')}><ChevronLeft size={24} /></button>
        <h1 className="text-xl font-bold">Notifications</h1>
      </div>

      <div className="p-6 space-y-8">
        <div className="space-y-6">
          {[
            { id: 'orderUpdates', label: 'Order Updates', desc: 'Get real-time status of your pani puri', icon: Smartphone },
            { id: 'offers', label: 'Exclusive Offers', desc: 'Discounts and special deals just for you', icon: Bell },
            { id: 'promotions', label: 'Promotions', desc: 'New product launches and events', icon: MessageSquare },
            { id: 'newsletter', label: 'Newsletter', desc: 'Weekly updates on our journey', icon: Mail },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4">
              <div className="flex gap-4">
                <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
              <Switch 
                checked={settings[item.id as keyof typeof settings]} 
                onCheckedChange={(val) => setSettings({...settings, [item.id]: val})}
              />
            </div>
          ))}
        </div>

        <div className="p-6 bg-[#FFF3E0] rounded-[2rem] space-y-2">
          <h4 className="font-bold text-[#FF6B00] text-sm">Pro Tip!</h4>
          <p className="text-xs text-orange-800 leading-relaxed">Keep "Order Updates" on to track your delivery in real-time and get the freshest experience!</p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;