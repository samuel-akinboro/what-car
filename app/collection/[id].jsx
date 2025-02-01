import { View, Text, ScrollView, TouchableOpacity, ActionSheetIOS, Alert, Platform, useColorScheme } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { useData } from "../../contexts/DataContext";
import CarCard from "../../components/CarCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function CollectionDetails() {
  const { id } = useLocalSearchParams();
  const { collections, getRelativeTime, deleteCollection } = useData();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState(null);
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  // Fetch collection data
  useEffect(() => {
    let unsubscribe;

    const fetchCollection = async () => {
      try {
        if (user) {
          unsubscribe = firestore()
            .collection('collections')
            .doc(id)
            .onSnapshot(doc => {
              if (doc.exists) {
                setCollection(doc.data());
              }
              setLoading(false);
            });
        } else {
          const localCollection = collections.find(c => c.id === id);
          setCollection(localCollection);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching collection:', error);
        setLoading(false);
      }
    };

    fetchCollection();
    return () => unsubscribe?.();
  }, [user, id, collections]);
  
  const handleDeletePress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Delete Collection'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
          title: `Delete "${collection.name}"?`,
          message: 'This action cannot be undone'
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            confirmDelete();
          }
        }
      );
    } else {
      // For Android, just show the confirmation dialog directly
      confirmDelete();
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Collection',
      `Are you sure you want to delete "${collection.name}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteCollection(id);
            router.back();
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white dark:bg-gray-900 items-center justify-center">
        <Text className="text-gray-500 dark:text-gray-400">Loading...</Text>
      </View>
    );
  }

  if (!collection) return null;

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Stack.Screen 
        options={{
          headerTitle: collection.name,
          headerRight: Platform.OS === 'ios' ? () => (
            <TouchableOpacity 
              onPress={handleDeletePress}
              className="pl-4"
            >
              <Ionicons 
                name="trash-outline" 
                size={24} 
                color={isDark ? 'red' : 'red'}
                className="text-gray-900 dark:text-gray-100" 
              />
            </TouchableOpacity>
          ) : null,
        }} 
      />
      
      <ScrollView 
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Collection Header */}
        <View className="flex-row items-center justify-between flex-1">
          <View className="py-4 mb-4 flex-row items-center">
            <View className="size-16 rounded-xl bg-violet-100 dark:bg-violet-900 items-center justify-center">
              <Text className="text-4xl">{collection.icon}</Text>
            </View>
            <View className="ml-4">
              <Text className="text-gray-900 dark:text-gray-100 text-2xl font-semibold" numberOfLines={1}>
                {collection.name}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400">
                {collection.cars?.length || 0} {collection.cars?.length === 1 ? 'car' : 'cars'}
              </Text>
            </View>
          </View>

          {Platform.OS === 'android' && <TouchableOpacity onPress={handleDeletePress}>
            <Ionicons 
              name="trash-outline" 
              size={24} 
              color={isDark ? 'red' : 'red'}
              className="text-gray-900 dark:text-gray-100" 
            />
          </TouchableOpacity>}
        </View>

        {/* Cars Grid */}
        <View className="gap-4">
          {collection.cars?.map((car) => (
            <CarCard 
              key={car.id}
              car={{
                ...car,
                relativeTime: getRelativeTime(car.timestamp)
              }}
              style="w-full"
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
} 