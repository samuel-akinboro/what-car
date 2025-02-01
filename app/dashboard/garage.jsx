import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from "../../contexts/DataContext";
import { Image as ExpoImage } from 'expo-image';
import CarCard from "../../components/CarCard";
import { useMemo } from 'react';
import { router } from "expo-router";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useFirestoreStats } from '../../hooks/useFirestoreStats';

export default function Garage() {
  const insets = useSafeAreaInsets();
  const { collections, stats, recentScans, getRelativeTime } = useData();
  const [user, setUser] = useState(null);
  const [firestoreScans, setFirestoreScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { stats: firestoreStats, loading: firestoreLoading, isAuthenticated } = useFirestoreStats();

  // Calculate average accuracy from recent scans
  const averageAccuracy = useMemo(() => {
    if (recentScans.length === 0) return "0%";
    const total = recentScans.reduce((sum, scan) => sum + parseFloat(scan.matchAccuracy), 0);
    return `${Math.round(total / recentScans.length)}%`;
  }, [recentScans]);

  // Get local scans
  const latestLocalScans = recentScans?.slice(0, 3) || [];

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  // Fetch Firestore scans when user changes
  useEffect(() => {
    let unsubscribe;

    const fetchScans = async () => {
      try {
        if (user) {
          unsubscribe = firestore()
            .collection('scans')
            .where('userId', '==', user.uid)
            .orderBy('createdAt', 'desc')
            .limit(3)
            .onSnapshot(snapshot => {
              if (snapshot && snapshot.docs) {
                const scans = snapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data(),
                  timestamp: doc.data().createdAt?.toDate(),
                }));
                setFirestoreScans(scans);
              } else {
                setFirestoreScans([]);
              }
              setLoading(false);
            }, error => {
              console.error('Firestore listener error:', error);
              setFirestoreScans([]);
              setLoading(false);
            });
        } else {
          setFirestoreScans([]);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching scans:', error);
        setFirestoreScans([]);
        setLoading(false);
      }
    };

    fetchScans();
    return () => unsubscribe?.();
  }, [user]);

  // Get the appropriate scans based on auth state
  const displayScans = user ? firestoreScans : latestLocalScans;

  // Use Firestore stats if authenticated, otherwise use local stats
  const displayStats = isAuthenticated ? firestoreStats : stats;
  
  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900" showsVerticalScrollIndicator={false} bounces={false}>
      {/* Header Section */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        className="px-5 pb-32 dark:bg-gray-900 dark:bg-none"
        style={{ paddingTop: insets.top, paddingBottom: 60, paddingHorizontal: 20 }}
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white/70 dark:text-gray-400 text-base">Identified & Saved</Text>
            <Text className="text-white dark:text-gray-100 text-2xl font-semibold mt-1">My Whips 📸</Text>
          </View>
          {/* <TouchableOpacity className="bg-white/20 p-2 rounded-full">
            <MaterialIcons name="search" size={24} color="white" />
          </TouchableOpacity> */}
        </View>

        {/* Quick Stats */}
        <View className="flex-row mt-6 gap-3">
          {[
            { 
              label: "This Week", 
              count: stats.weeklyScans || "0", 
              icon: "trending-up" 
            },
            { 
              label: "Accuracy Rate", 
              count: averageAccuracy, 
              icon: "check-circle" 
            },
            { 
              label: "Saved", 
              count: loading ? "..." : displayStats.totalSaved || "0", 
              icon: "bookmark" 
            },
          ].map((stat, index) => (
            <View key={index} className="flex-1 bg-white/10 dark:bg-gray-800 rounded-2xl p-3">
              <MaterialIcons name={stat.icon} size={20} color="white" />
              <Text className="text-white dark:text-gray-100 text-lg font-semibold mt-2">{stat.count}</Text>
              <Text className="text-white/60 dark:text-gray-400 text-xs">{stat.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Main Content */}
      <View className="bg-white dark:bg-gray-900 -mt-10 rounded-t-[32px] pt-6 px-5">
        {/* Time Filter */}
        {/* <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="mb-6"
        >
          {[
            "All Time", "This Week", "This Month", "Last Month"
          ].map((filter, index) => (
            <TouchableOpacity 
              key={index}
              className={`mr-3 px-4 py-2 rounded-full border ${
                index === 0 
                  ? "bg-violet-500 border-violet-500" 
                  : "bg-white border-gray-200"
              }`}
            >
              <Text className={index === 0 ? "text-white" : "text-gray-600"}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView> */}

        {/* Recent Identifications */}
        <View className="mb-6">
          <Text className="text-gray-900 dark:text-gray-100 text-lg font-semibold mb-4">Recent Identifications</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="space-x-4"
          >
            {loading && user ? (
              <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl w-[280px] mr-4 items-center justify-center">
                <Text className="text-gray-500 dark:text-gray-400">Loading...</Text>
              </View>
            ) : displayScans.length > 0 ? (
              displayScans.map((scan) => (
                <CarCard 
                  key={scan.id} 
                  car={{
                    ...(user ? {
                      ...scan.carData,
                      createdAt: scan.createdAt,
                      timestamp: scan.timestamp,
                      userEmail: scan.userEmail,
                      userId: scan.userId,
                      id: scan.id,
                    } : scan),
                    relativeTime: getRelativeTime(scan.timestamp)
                  }}
                  style="w-[280px]"
                />
              ))
            ) : (
              <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl w-[280px] mr-4 items-center justify-center">
                <MaterialIcons name="camera-alt" size={24} color="#8B5CF6" />
                <Text className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  {user ? 'No identifications yet' : 'No recent identifications'}
                </Text>
                <TouchableOpacity 
                  className="mt-2 bg-violet-100 dark:bg-violet-900 px-4 py-2 rounded-full"
                  onPress={() => router.push("/scan")}
                >
                  <Text className="text-violet-600 dark:text-violet-300">Start Scanning</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Saved Collections */}
        <View className="mb-24">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-900 dark:text-gray-100 text-lg font-semibold">Saved Collections</Text>
            {/* <TouchableOpacity className="flex-row items-center">
              <Text className="text-violet-500 mr-1">Sort by</Text>
              <MaterialIcons name="sort" size={20} color="#6366F1" />
            </TouchableOpacity> */}
          </View>
          
          <View className="gap-4">
            {collections.map((collection) => (
              <TouchableOpacity 
                key={collection.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 flex-row items-center"
                onPress={() => {
                  router.push(`/collection/${collection.id}`);
                }}
              >
                <View className="size-12 rounded-xl bg-violet-100 dark:bg-violet-900 items-center justify-center">
                  <Text className="text-3xl">{collection.icon}</Text>
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
                    {collection.name}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    {collection.cars.length} {collection.cars.length === 1 ? 'car' : 'cars'}
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
