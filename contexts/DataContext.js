import { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { StorageService } from '../services/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

const DataContext = createContext({});
const storage = new StorageService();

export function DataProvider({ children }) {
  const [recentScans, setRecentScans] = useState([]);
  const [savedCollection, setSavedCollection] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 20;
  const [collections, setCollections] = useState([
    {
      id: '1',
      name: 'Favorites',
      icon: '✨',
      cars: []
    }
  ]);
  const [stats, setStats] = useState({
    totalScans: 0,
    weeklyScans: 0,
    totalSaved: 0,
    newSaves: 0
  });
  const [user, setUser] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  // Listen for collections changes from Firestore when logged in
  useEffect(() => {
    let unsubscribe;

    const fetchCollections = async () => {
      if (user) {
        try {
          // Check if user has any collections
          const collectionsRef = firestore().collection('collections');
          const snapshot = await collectionsRef
            .where('userId', '==', user.uid)
            .get();

          // If no collections exist, create default "Favorites" collection
          if (snapshot.empty) {
            await collectionsRef.add({
              userId: user.uid,
              name: 'Favorites',
              icon: '✨',
              cars: [],
              createdAt: firestore.FieldValue.serverTimestamp()
            });
          }

          // Set up real-time listener
          unsubscribe = collectionsRef
            .where('userId', '==', user.uid)
            .onSnapshot(snapshot => {
              const collections = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
              }));
              setCollections(collections);
            });
        } catch (error) {
          console.error('Error fetching collections:', error);
        }
      } else {
        // Use local storage when not logged in
        const localCollections = await storage.getCollections();
        setCollections(localCollections);
      }
    };

    fetchCollections();
    return () => unsubscribe?.();
  }, [user]);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        await storage.initDatabase();
        setIsInitialized(true);
        
        // Load initial data immediately
        const [initialScans, savedScans, loadedCollections, stats] = await Promise.all([
          storage.getRecentScans(ITEMS_PER_PAGE, 0),
          storage.getSavedCollection(),
          storage.getCollections(),
          storage.getStats()
        ]);
        
        setRecentScans(initialScans);
        setSavedCollection(savedScans);
        setCollections(loadedCollections);
        setStats(stats);
        setHasMore(initialScans.length === ITEMS_PER_PAGE);
      } catch (error) {
        console.error('Error initializing database:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const loadInitialData = async () => {
    setPage(0);
    await loadData();
  };

  const loadData = async () => {
    if (!isInitialized) return;

    try {
      setIsLoading(true);
      const [scans, saved] = await Promise.all([
        storage.getRecentScans(ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
        storage.getSavedCollection()
      ]);
      
      if (page === 0) {
        setRecentScans(scans);
      } else {
        setRecentScans(prev => [...prev, ...scans]);
      }
      
      setSavedCollection(saved);
      setHasMore(scans.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (!hasMore || isLoading || !isInitialized) return;
    setPage(prev => prev + 1);
    await loadData();
  };

  const saveScan = async (carInfo, imageUri, base64Image) => {
    if (!isInitialized) throw new Error('Database not initialized');

    try {
      setIsLoading(true);
      const scanId = generateId();
      
      // Save the image locally
      const savedImageUri = await storage.saveImage(base64Image, scanId);
      
      // Create scan object
      const newScan = {
        id: scanId,
        timestamp: Date.now(),
        ...carInfo,
        images: [savedImageUri],
      };

      // Save scan data
      await storage.saveScan(newScan);
      
      // Refresh data
      await loadInitialData();
      
      return newScan;
    } catch (error) {
      console.error('Error saving scan:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSaved = async (scanId) => {
    if (!isInitialized) return false;

    try {
      setIsLoading(true);
      const result = await storage.toggleSavedScan(scanId);
      if (result) {
        await loadInitialData(); // Refresh data after toggle
      }
      return result;
    } catch (error) {
      console.error('Error toggling saved status:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const searchScans = async (query) => {
    try {
      setIsLoading(true);
      const results = await storage.searchScans(query);
      return results;
    } catch (error) {
      console.error('Error searching scans:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getRelativeTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const createCollection = useCallback(async (name) => {
    try {
      if (user) {
        console.log('Creating Firestore collection for user:', user.uid);
        
        // Create in Firestore with proper structure
        const newCollection = await firestore().collection('collections').add({
          userId: user.uid,
          name,
          icon: '📁',
          cars: [],
          createdAt: firestore.FieldValue.serverTimestamp()
        });
        
        console.log('Successfully created collection:', newCollection.id);
      } else {
        // Local storage logic remains the same
        const id = await storage.createCollection(name, '📁');
        const updatedCollections = await storage.getCollections();
        setCollections(updatedCollections);
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      Alert.alert('Error', 'Failed to create collection');
    }
  }, [user]);

  const addToCollection = useCallback(async (collectionId, car) => {
    // return console.log('car', JSON.stringify(car, null, 2));
    try {
      if (user) {
        console.log('Starting add to collection process...');
        console.log('Collection ID:', collectionId);
        
        // First get the collection to verify it exists
        const collectionRef = firestore().collection('collections').doc(collectionId);
        console.log('Getting collection doc...');
        const collectionDoc = await collectionRef.get();
        
        if (!collectionDoc.exists) {
          console.error('Collection not found:', collectionId);
          throw new Error('Collection not found');
        }
        console.log('Collection found:', collectionDoc.data());

        // Clean up the car data to prevent nesting
        const cleanCar = {
          ...car,
          addedAt: new Date().toISOString() // Use ISO string instead of serverTimestamp
        };

        console.log('Cleaned car data:', JSON.stringify(cleanCar, null, 2));

        try {
          console.log('Attempting to update collection...');
          await collectionRef.update({
            cars: firestore.FieldValue.arrayUnion(cleanCar)
          });
          console.log('Successfully updated collection');
        } catch (updateError) {
          console.error('Error during update:', updateError);
          throw updateError;
        }
        
      } else {
        // Local storage logic remains the same
        await storage.addToCollection(collectionId, car);
        const updatedCollections = await storage.getCollections();
        setCollections(updatedCollections);
      }
    } catch (error) {
      console.error('Final error in addToCollection:', error);
      Alert.alert('Error', 'Failed to add car to collection: ' + error.message);
    }
  }, [user]);

  const removeFromCollection = useCallback(async (collectionId, carId) => {
    try {
      if (user) {
        // Remove from Firestore
        const collectionRef = firestore().collection('collections').doc(collectionId);
        const collection = (await collectionRef.get()).data();
        const updatedCars = collection.cars.filter(car => car.id !== carId);
        await collectionRef.update({ cars: updatedCars });
      } else {
        // Remove from local storage
        await storage.removeFromCollection(collectionId, carId);
        const updatedCollections = await storage.getCollections();
        setCollections(updatedCollections);
      }
    } catch (error) {
      console.error('Error removing from collection:', error);
    }
  }, [user]);

  const totalSavedCars = useMemo(() => {
    const uniqueCarIds = new Set();
    collections.forEach(collection => {
      collection.cars.forEach(car => uniqueCarIds.add(car.id));
    });
    return uniqueCarIds.size;
  }, [collections]);

  // Add this helper function to check collection structure
  const validateCollection = useCallback(async (collectionId) => {
    if (!user) return true;
    
    try {
      const doc = await firestore().collection('collections').doc(collectionId).get();
      console.log('Collection data:', doc.data());
      return doc.exists;
    } catch (error) {
      console.error('Error validating collection:', error);
      return false;
    }
  }, [user]);

  const deleteCollection = useCallback(async (collectionId) => {
    try {
      // Don't allow deletion of Favorites collection
      if (collectionId === '1') {
        Alert.alert('Error', 'The Favorites collection cannot be deleted');
        return;
      }

      if (user) {
        // Delete from Firestore
        await firestore()
          .collection('collections')
          .doc(collectionId)
          .delete();
        
        console.log('Successfully deleted Firestore collection:', collectionId);
      } else {
        // Delete from local storage
        await storage.deleteCollection(collectionId);
        const updatedCollections = await storage.getCollections();
        setCollections(updatedCollections);
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      Alert.alert('Error', 'Failed to delete collection');
    }
  }, [user]);

  return (
    <DataContext.Provider value={{
      recentScans,
      savedCollection,
      isLoading,
      isInitialized,
      hasMore,
      saveScan,
      toggleSaved,
      loadMore,
      searchScans,
      getRelativeTime,
      loadData: loadInitialData,
      collections,
      createCollection,
      addToCollection,
      removeFromCollection,
      totalSavedCars,
      stats,
      deleteCollection,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext); 