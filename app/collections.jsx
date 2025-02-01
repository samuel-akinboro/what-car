import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack } from "expo-router";
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useData } from "../contexts/DataContext";

export default function Collections() {
  const insets = useSafeAreaInsets();
  const { collections: localCollections } = useData();
  const [user, setUser] = useState(null);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const {createCollection} = useData();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  // Fetch collections
  useEffect(() => {
    let unsubscribe;

    const fetchCollections = async () => {
      if (user) {
        try {
          console.log('Fetching collections for user:', user.uid);
          
          // Check if collections exist first
          const collectionsRef = firestore().collection('collections');
          const collectionsQuery = collectionsRef
            .where('userId', '==', user.uid)
            .orderBy('createdAt', 'desc');

          // Set up snapshot listener with error handling
          unsubscribe = collectionsQuery.onSnapshot(
            (snapshot) => {
              if (snapshot && snapshot.docs) {
                console.log('Snapshot received with', snapshot.docs.length, 'collections');
                const collectionsData = snapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data(),
                  cars: doc.data().cars || [] // Ensure cars array exists
                }));
                setCollections(collectionsData);
              } else {
                console.log('No collections found, setting empty array');
                setCollections([]);
              }
              setLoading(false);
            },
            (error) => {
              console.error('Firestore snapshot error:', error);
              setCollections([]);
              setLoading(false);
            }
          );

        } catch (error) {
          console.error('Error setting up collections listener:', error);
          setCollections([]);
          setLoading(false);
        }
      } else {
        console.log('No user logged in, using local collections');
        setCollections(localCollections);
        setLoading(false);
      }
    };

    fetchCollections();
    return () => {
      if (unsubscribe) {
        console.log('Cleaning up collections listener');
        unsubscribe();
      }
    };
  }, [user, localCollections]);

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Stack.Screen 
        options={{
          title: "Collections",
          headerRight: Platform.OS === 'ios' ? () => (
            <Pressable 
              className="p-2"
              onPress={() => setIsModalVisible(true)}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.7 : 1,
                }
              ]}
            >
              <MaterialIcons name="add" size={24} color="#6366F1" />
            </Pressable>
          ) : undefined
        }}
      />

      <ScrollView 
        className="flex-1 px-4"
        contentContainerStyle={{ 
          paddingBottom: insets.bottom + 20,
          paddingTop: 20
        }}
      >
        {loading ? (
          <View className="items-center justify-center py-8">
            <Text className="text-gray-500 dark:text-gray-400">Loading collections...</Text>
          </View>
        ) : collections.length > 0 ? (
          <View className="gap-4">
            {collections.map((collection) => (
              <TouchableOpacity 
                key={collection.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 flex-row items-center"
                onPress={() => router.push(`/collection/${collection.id}`)}
              >
                <View className="size-12 rounded-xl bg-violet-100 dark:bg-violet-900 items-center justify-center">
                  <Text className="text-3xl">{collection.icon}</Text>
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
                    {collection.name}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    {collection.cars?.length || 0} {collection.cars?.length === 1 ? 'car' : 'cars'}
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="items-center justify-center py-8">
            <MaterialIcons name="collections-bookmark" size={48} color="#CBD5E1" />
            <Text className="text-gray-500 dark:text-gray-400 mt-4 text-center">
              No collections yet
            </Text>
            <TouchableOpacity 
              className="mt-4 bg-violet-100 dark:bg-violet-900 px-6 py-3 rounded-full"
              onPress={() => setIsModalVisible(true)}
            >
              <Text className="text-violet-600 dark:text-violet-300 font-medium">Create Collection</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {Platform.OS === 'android' && (
        <TouchableOpacity
          className="absolute bottom-6 right-6 w-14 h-14 bg-violet-600 rounded-full items-center justify-center shadow-lg elevation-5"
          onPress={() => setIsModalVisible(true)}
          style={{
            elevation: 5,
          }}
        >
          <MaterialIcons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 bg-black/50 justify-center items-center p-4">
            <View className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl p-4">
              <Text className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">New Collection</Text>
              <TextInput
                className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl px-4 py-3 mb-4 text-gray-900 dark:text-gray-100"
                placeholder="Enter collection name"
                placeholderTextColor="#9CA3AF"
                value={newCollectionName}
                onChangeText={setNewCollectionName}
                autoFocus
              />
              <View className="flex-row gap-3">
                <TouchableOpacity 
                  className="flex-1 bg-gray-100 dark:bg-gray-700 py-3 rounded-xl items-center"
                  onPress={() => {
                    setIsModalVisible(false);
                    setNewCollectionName('');
                  }}
                >
                  <Text className="text-gray-600 dark:text-gray-300">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="flex-1 bg-violet-600 py-3 rounded-xl items-center"
                  onPress={() => {
                    if (newCollectionName.trim()) {
                      createCollection(newCollectionName.trim());
                      setIsModalVisible(false);
                      setNewCollectionName('');
                    }
                  }}
                >
                  <Text className="text-white font-medium">Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
} 