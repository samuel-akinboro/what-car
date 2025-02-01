import { createContext, useContext, useEffect, useState } from 'react';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';
import { REVENUECAT_API_KEY_IOS, REVENUECAT_API_KEY_ANDROID, ENTITLEMENT_ID } from '../config/purchases';
import auth from '@react-native-firebase/auth';

const PurchasesContext = createContext({});

export function PurchasesProvider({ children }) {
  const [customerInfo, setCustomerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Initialize RevenueCat
  useEffect(() => {
    const init = async () => {
      try {
        const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
        await Purchases.configure({ apiKey });
        console.log('RevenueCat configured successfully');
      } catch (error) {
        console.error('Error configuring RevenueCat:', error);
      }
    };

    init();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        // Identify the user in RevenueCat
        await Purchases.logIn(user.uid);
        updateCustomerInfo();
      } else {
        // Log out from RevenueCat
        await Purchases.logOut();
        setCustomerInfo(null);
      }
    });

    return unsubscribe;
  }, []);

  // Get customer info
  const updateCustomerInfo = async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    } catch (error) {
      console.error('Error fetching customer info:', error);
    }
  };

  // Check if user has premium access
  const isPremium = customerInfo?.entitlements.active[ENTITLEMENT_ID];

  // Purchase a package
  const purchasePackage = async (pack) => {
    try {
      setLoading(true);
      const { customerInfo: updated } = await Purchases.purchasePackage(pack);
      setCustomerInfo(updated);
      return updated;
    } catch (error) {
      if (!error.userCancelled) {
        console.error('Error purchasing package:', error);
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  // Restore purchases
  const restorePurchases = async () => {
    try {
      setLoading(true);
      const restored = await Purchases.restorePurchases();
      setCustomerInfo(restored);
      return restored;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PurchasesContext.Provider 
      value={{
        customerInfo,
        isPremium,
        loading,
        purchasePackage,
        restorePurchases,
        updateCustomerInfo
      }}
    >
      {children}
    </PurchasesContext.Provider>
  );
}

export const usePurchases = () => useContext(PurchasesContext); 