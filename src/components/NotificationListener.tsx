import { useEffect } from 'react';
import { rtdb } from '@/lib/firebase';
import { ref, onChildChanged, query, orderByChild, equalTo } from 'firebase/database';
import { useAuth } from '@/context/AuthContext';
import { showSuccess } from '@/utils/toast';

const NotificationListener = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const ordersRef = ref(rtdb, 'orders');
    const userOrdersQuery = query(ordersRef, orderByChild('userId'), equalTo(user.uid));

    // Listen for any changes in the user's orders
    const unsubscribe = onChildChanged(userOrdersQuery, (snapshot) => {
      const order = snapshot.val();
      if (order && order.status) {
        showSuccess(`Order Status Updated: Your order is now ${order.status}!`);
        
        // Play a subtle sound or trigger haptic if needed (browser permitting)
        if ('vibrate' in navigator) {
          navigator.vibrate(200);
        }
      }
    });

    return () => unsubscribe();
  }, [user]);

  return null; // This component doesn't render anything
};

export default NotificationListener;