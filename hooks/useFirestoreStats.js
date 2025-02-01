import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export function useFirestoreStats() {
  const [user, setUser] = useState(null);
  const [firestoreStats, setFirestoreStats] = useState({
    totalSaved: 0,
  });
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  // Fetch Firestore stats when user changes
  useEffect(() => {
    let unsubscribe;

    const fetchStats = async () => {
      if (user) {
        try {
          // Set up real-time listener for collections
          unsubscribe = firestore()
            .collection('collections')
            .where('userId', '==', user.uid)
            .onSnapshot(async snapshot => {
              console.log('Collections snapshot received:', snapshot.size);
              let totalCars = 0;
              
              // Count total cars across all collections
              snapshot.docs.forEach(doc => {
                const collection = doc.data();
                const collectionCars = collection.cars?.length || 0;
                console.log(`Collection ${doc.id} has ${collectionCars} cars`);
                totalCars += collectionCars;
              });

              setFirestoreStats({
                totalSaved: totalCars,
              });
              setLoading(false);
            }, error => {
              console.error('Firestore listener error:', error);
              setLoading(false);
            });
            
        } catch (error) {
          console.error('Error in fetchStats:', error);
          setLoading(false);
        }
      } else {
        setFirestoreStats({ totalSaved: 0 });
        setLoading(false);
      }
    };

    fetchStats();
    return () => unsubscribe?.();
  }, [user]);

  return {
    stats: firestoreStats,
    loading,
    isAuthenticated: !!user
  };
} 