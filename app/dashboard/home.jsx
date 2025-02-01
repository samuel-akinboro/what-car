import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link, router } from "expo-router";
import { useData } from "../../contexts/DataContext";
import { Image as ExpoImage } from 'expo-image';
import CarCard from "../../components/CarCard";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useFirestoreStats } from '../../hooks/useFirestoreStats';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

// Option 1: Time-based greeting
const getTimeBasedInfo = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return { message: "Morning drive awaits", icon: "wb-sunny" };
  } else if (hour >= 12 && hour < 17) {
    return { message: "Afternoon adventure time", icon: "light-mode" };
  } else if (hour >= 17 && hour < 20) {
    return { message: "Perfect for sunset drives", icon: "wb-twilight" };
  } else {
    return { message: "Night cruising time", icon: "nights-stay" };
  }
};

// Option 2: Random driving tips
const getDrivingTip = () => {
  const tips = [
    { message: "Remember to check tire pressure", icon: "tire-repair" },
    { message: "Drive safe, arrive happy", icon: "verified" },
    { message: "Time for new adventures", icon: "explore" },
    { message: "Ready for the road ahead", icon: "directions-car" },
    { message: "Keep the journey smooth", icon: "moving" }
  ];
  
  return tips[Math.floor(Math.random() * tips.length)];
};

export default function Home() {
  const insets = useSafeAreaInsets();
  const { recentScans, getRelativeTime, stats } = useData();
  const [user, setUser] = useState(null);
  const [firestoreScans, setFirestoreScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { stats:firestoreStats, isAuthenticated } = useFirestoreStats();
  const DRIVING_TIPS = [
    { message: "Remember to check tire pressure", icon: "tire-repair" },
    { message: "Drive safe, arrive happy", icon: "verified" },
    { message: "Time for new adventures", icon: "explore" },
    { message: "Ready for the road ahead", icon: "directions-car" },
    { message: "Keep the journey smooth", icon: "moving" }
  ];
  const [tipIndex, setTipIndex] = useState(0);

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
          // Set up real-time listener for Firestore
          unsubscribe = firestore()
            .collection('scans')
            .where('userId', '==', user.uid)
            .orderBy('createdAt', 'desc')
            .limit(10)
            .onSnapshot(snapshot => {
              // Check if snapshot exists and has docs
              if (snapshot && snapshot.docs) {
                const scans = snapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data(),
                  timestamp: doc.data().createdAt?.toDate(),
                }));
                setFirestoreScans(scans);
              } else {
                // Handle case when no collection/documents exist
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

  // Option 1: Time-based
  const timeInfo = getTimeBasedInfo();
  
  // OR Option 2: Random tip
  const tip = getDrivingTip();

  // Recent Scans Section
  const renderRecentScans = () => (
    <View className="mt-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-gray-900 text-lg font-semibold dark:text-gray-100">Recent Scans</Text>
        <TouchableOpacity onPress={() => router.push("/history")}>
          <Text className="text-violet-500">See all</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-4">
        {loading && user ? (
          // Loading state (only show when logged in)
          <View className="bg-gray-50 p-4 rounded-2xl w-48 mr-4 items-center justify-center">
            <Text className="text-gray-500">Loading...</Text>
          </View>
        ) : displayScans.length > 0 ? (
          // Show scans
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
                } : scan), // Only spread carData for Firestore scans
                relativeTime: getRelativeTime(scan.timestamp),
              }}
            />
          ))
        ) : (
          // Empty state
          <View className="bg-gray-50 p-4 rounded-2xl w-48 mr-4 items-center justify-center dark:bg-gray-800">
            <MaterialIcons name="camera-alt" size={24} color="#8B5CF6" />
            <Text className="text-gray-500 text-sm mt-2 dark:text-gray-400">
              {user ? 'No scans yet' : 'No recent scans'}
            </Text>
            <TouchableOpacity 
              className="mt-2 bg-violet-100 px-4 py-2 rounded-full dark:bg-violet-900"
              onPress={() => router.push("/scan")}
            >
              <Text className="text-violet-600 dark:text-violet-100">Start Scanning</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((current) => (current + 1) % DRIVING_TIPS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView className="flex-1 bg-[#6366F1] dark:bg-gray-900" showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        className="dark:bg-gray-900 dark:bg-none"
        style={{ paddingTop: insets.top, paddingHorizontal: 20, paddingBottom: 60 }}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-white/70 dark:text-gray-400 text-base">Welcome back</Text>
            <Text numberOfLines={1} className="text-white dark:text-gray-100 text-2xl font-semibold mt-1 max-w-[90%]">
              {user?.displayName || user?.email || 'Car Enthusiast'} 🚗
            </Text>
          </View>
          <TouchableOpacity className="bg-white/20 dark:bg-gray-800 p-2 rounded-full" onPress={() => router.push("/settings")}>
            <MaterialIcons name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        {/* Random Tip */}
        <View className="mt-6 bg-white/10 dark:bg-gray-800 rounded-2xl p-4 overflow-hidden">
          <Animated.View 
            key={tipIndex}
            entering={FadeIn.duration(800)}
            exiting={FadeOut.duration(800)}
            className="flex-row items-center"
          >
            <MaterialIcons name={DRIVING_TIPS[tipIndex].icon} size={24} color="white" />
            <Text className="text-white dark:text-gray-100 ml-2 flex-1">{DRIVING_TIPS[tipIndex].message}</Text>
            <View className="flex-row gap-1">
              {DRIVING_TIPS.map((_, index) => (
                <View 
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full ${
                    index === tipIndex ? 'bg-white dark:bg-gray-100' : 'bg-white/30 dark:bg-gray-600'
                  }`}
                />
              ))}
            </View>
          </Animated.View>
        </View>
        
        {/* Stats Row */}
        <View className="flex-row mt-6 gap-4">
          <View className="flex-1 bg-white/10 dark:bg-gray-800 rounded-2xl p-4">
            <Text className="text-white/70 dark:text-gray-400 text-sm">Cars Identified</Text>
            <Text className="text-white dark:text-gray-100 text-2xl font-semibold mt-1">
              {stats.totalScans}
            </Text>
            <Text className="text-white/50 dark:text-gray-500 text-xs mt-1">
              +{stats.weeklyScans} this week
            </Text>
          </View>
          <View className="flex-1 bg-white/10 dark:bg-gray-800 rounded-2xl p-4">
            <Text className="text-white/70 dark:text-gray-400 text-sm">Saved Cars</Text>
            <Text className="text-white dark:text-gray-100 text-2xl font-semibold mt-1">
              {isAuthenticated ? firestoreStats.totalSaved : stats.totalSaved}
            </Text>
            <Text className="text-white/50 dark:text-gray-500 text-xs mt-1">
              {stats.newSaves} new saves
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Main Content Card */}
      <View className="bg-white dark:bg-gray-900 -mt-10 rounded-t-[32px] pt-6 px-5">
        {/* Quick Actions */}
        <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5">
          <Text className="text-gray-900 dark:text-gray-100 text-lg font-semibold mb-4">Quick Actions</Text>
          <View className="flex-row justify-between">
            {[
              { icon: "camera", label: "Scan Car", color: "#EC4899", onPress: () => router.push("/scan") },
              { icon: "history", label: "History", color: "#6366F1", onPress: () => router.push("/history") },
              { icon: "bookmark", label: "Saved", color: "#3B82F6", onPress: () => router.push("/collections") },
              { 
                icon: "share", 
                label: "Share", 
                color: "#10B981", 
                onPress: () => Alert.alert(
                  'Coming Soon',
                  'Sharing feature will be available in the next update!',
                  [{ text: 'OK', style: 'default' }]
                )
              }
            ].map((item, index) => (
              <TouchableOpacity key={index} className="items-center" onPress={item.onPress}>
                <View className={`w-14 h-14 rounded-xl items-center justify-center mb-2`}
                  style={{ backgroundColor: `${item.color}15` }}>
                  <MaterialIcons name={item.icon} size={24} color={item.color} />
                </View>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {renderRecentScans()}

        {/* Trending Cars */}
        <View className="mt-6 mb-24">
          <Text className="text-gray-900 dark:text-gray-100 text-lg font-semibold mb-4">Trending Cars</Text>
          <View className="gap-4">
            {[
              { name: "Cybertruck", views: "12.5k views", trend: "+126%" },
              { name: "Porsche Taycan", views: "8.2k views", trend: "+82%" },
              { name: "Ford Mustang", views: "6.8k views", trend: "+45%" },
            ].map((item, index) => (
              <View key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl flex-row items-center">
                <View className="bg-gray-200 dark:bg-gray-700 w-12 h-12 rounded-xl items-center justify-center mr-4">
                  <Text className="text-gray-600 dark:text-gray-400 font-bold">{index + 1}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 dark:text-gray-100 font-semibold">{item.name}</Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">{item.views}</Text>
                </View>
                <Text className="text-green-500 dark:text-green-400 font-semibold">{item.trend}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}