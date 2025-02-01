import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from "react-native";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { 
  FadeIn,
  FadeInDown,
  BounceIn,
  SlideInDown
} from 'react-native-reanimated';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ImageView from "react-native-image-viewing";
import { Image as ExpoImage } from 'expo-image';
import { screenWidth } from "../utils/constant";
import { router, useLocalSearchParams } from "expo-router";
import { formatPrice } from "../utils/format";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { useData } from '../contexts/DataContext';
import auth from '@react-native-firebase/auth';
import ScanService from '../services/scanService';

const THUMB_SIZE = 80;

export default function Details() {
  const { carData, isFresh } = useLocalSearchParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const scrollRef = useRef(null);
  const insets = useSafeAreaInsets();
  const { collections, addToCollection, removeFromCollection, createCollection } = useData();
  const [isInCollection, setIsInCollection] = useState(false);
  const [user, setUser] = useState(null);
  const [scanId, setScanId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  // Check if car is saved in any collection
  useEffect(() => {
    if(!isFresh) {
      const carInfo = JSON.parse(carData);
      const isSaved = collections.some(collection => 
        collection.cars.some(car => car.id === carInfo.id)
      );
      setIsInCollection(isSaved);
    }
  }, [carData, collections]);

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const page = Math.round(contentOffset / screenWidth);
    setCurrentPage(page);
  };

  const carInfo = JSON.parse(carData);

  // Convert image URLs to format required by ImageView
  const images = carInfo.images.map(uri => ({ uri }));

  // Add this useEffect to trigger animations after component mount
  useEffect(() => {
    // Small delay to ensure component is mounted
    setTimeout(() => setIsReady(true), 100);
  }, []);

  const handlePresentModal = useCallback(() => {
    SheetManager.show("collectionsSheet");
  }, []);

  // Define snap points
  const snapPoints = useMemo(() => ['60%', '90%'], []);

  // Backdrop component
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  // Handle sheet changes
  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      // Sheet is closed
      bottomSheetRef.current?.close();
    }
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  // Save scan only if it's a fresh scan (not from history)
  useEffect(() => {
    const saveScan = async () => {
      // Only save if user is logged in, has image, and is not from history
      if (user && carData && isFresh) {
        try {
          const carInfo = JSON.parse(carData);
          const scanId = await ScanService.saveScan(carInfo, carInfo.images[0]);
          setScanId(scanId);
          console.log('Scan saved successfully with ID:', scanId);
        } catch (error) {
          console.error('Error saving scan:', error);
          Alert.alert('Error', 'Failed to save scan');
        }
      }
    };

    saveScan();
  }, [user, carData, isFresh]);

  if (!isReady) {
    return (
      <View className="flex-1 bg-white">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Main Image Carousel */}
          <View className="w-full aspect-square relative">
            <ScrollView 
              ref={scrollRef}
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {carInfo.images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.9}
                  onPress={() => {
                    setImageIndex(index);
                    setIsImageViewVisible(true);
                  }}
                >
                  <ExpoImage
                    source={image}
                    style={{ width: screenWidth, aspectRatio: 1}}
                    contentFit="contain"
                    className="bg-gray-100"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {/* Pagination Dots */}
            {/* <View className="absolute bottom-4 flex-row justify-center w-full gap-2">
              {carInfo.images.map((_, index) => (
                <TouchableOpacity 
                  key={index} 
                  onPress={() => {
                    scrollRef.current?.scrollTo({
                      x: index * width,
                      animated: true
                    });
                    setCurrentPage(index);
                  }}
                >
                  <View 
                    className={`w-2 h-2 rounded-full ${
                      index === currentPage ? 'bg-white' : 'bg-white/50'
                    }`} 
                  />
                </TouchableOpacity>
              ))}
            </View> */}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">      
      <ScrollView className="flex-1 bg-white dark:bg-gray-900" showsVerticalScrollIndicator={false}>
        {/* Main Image Carousel */}
        <Animated.View 
          entering={FadeIn}
          className="w-full aspect-square relative"
        >
          <ScrollView 
            ref={scrollRef}
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {carInfo.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.9}
                onPress={() => {
                  setImageIndex(index);
                  setIsImageViewVisible(true);
                }}
              >
                <ExpoImage
                  source={image}
                  style={{ width: screenWidth, aspectRatio: 1 }}
                  contentFit="cover"
                  className="bg-gray-100"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Pagination Dots */}
          <View className="absolute bottom-4 flex-row justify-center w-full gap-2">
            {carInfo.images.map((_, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => {
                  scrollRef.current?.scrollTo({
                    x: index * width,
                    animated: true
                  });
                  setCurrentPage(index);
                }}
              >
                <View 
                  className={`w-2 h-2 rounded-full ${
                    index === currentPage ? 'bg-white' : 'bg-white/50'
                  }`} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Car Information */}
        <View className="px-4 pt-6">
          {/* Title Section */}
          <Animated.View 
            entering={FadeInDown.duration(300).delay(100)}
            className="mb-6"
          >
            <Text className="text-3xl font-bold text-gray-900 dark:text-gray-100">{carInfo.name}</Text>
            <Text className="text-lg text-gray-500 dark:text-gray-400 mt-1">{carInfo.category}</Text>
          </Animated.View>

          {/* Key Stats Row */}
          <Animated.View 
            entering={FadeInDown.duration(300).delay(200)}
            className="flex-row gap-3 mb-6"
          >
            <View className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
              <MaterialIcons name="speed" size={24} color="#4B5563" />
              <Text className="text-gray-500 dark:text-gray-400 text-sm mt-2">Power</Text>
              <Text className="text-gray-900 dark:text-gray-100 font-semibold">{carInfo.specs.power}</Text>
            </View>
            <View className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
              <MaterialIcons name="timer" size={24} color="#4B5563" />
              <Text className="text-gray-500 dark:text-gray-400 text-sm mt-2">0-100 km/h</Text>
              <Text className="text-gray-900 dark:text-gray-100 font-semibold">{carInfo.specs.acceleration}</Text>
            </View>
            <View className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
              <MaterialIcons name="attach-money" size={24} color="#4B5563" />
              <Text className="text-gray-500 dark:text-gray-400 text-sm mt-2">Price</Text>
              <Text className="text-gray-900 dark:text-gray-100 font-semibold">{formatPrice(carInfo.specs.price)}</Text>
            </View>
          </Animated.View>

          {/* Manufacturer & Production Info */}
          <Animated.View 
            entering={FadeInDown.duration(300).delay(300)}
            className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-6"
          >
            <View className="flex-row items-center mb-4">
              <MaterialIcons name="business" size={24} color="#4B5563" />
              <View className="ml-3">
                <Text className="text-gray-500 dark:text-gray-400">Manufacturer</Text>
                <Text className="text-gray-900 dark:text-gray-100 font-semibold">{carInfo.manufacturer}</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <MaterialIcons name="date-range" size={24} color="#4B5563" />
              <View className="ml-3">
                <Text className="text-gray-500 dark:text-gray-400">Production Years</Text>
                <Text className="text-gray-900 dark:text-gray-100">{carInfo.productionYears}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Rarity & Match Accuracy */}
          <Animated.View 
            entering={FadeInDown.duration(300).delay(400)}
            className="flex-row gap-4 mb-6"
          >
            <View className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
              <MaterialIcons name="star" size={24} color="#4B5563" />
              <Text className="text-gray-500 dark:text-gray-400 mt-2">Rarity</Text>
              <Text className="text-gray-900 dark:text-gray-100 font-semibold">{carInfo.rarity}</Text>
            </View>
            <View className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
              <MaterialIcons name="check-circle" size={24} color="#4B5563" />
              <Text className="text-gray-500 dark:text-gray-400 mt-2">Match Accuracy</Text>
              <Text className="text-gray-900 dark:text-gray-100 font-semibold">{carInfo.matchAccuracy}</Text>
            </View>
          </Animated.View>

          {/* Description */}
          <Animated.View 
            entering={FadeInDown.duration(300).delay(500)}
            className="mb-6"
          >
            <Text className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">About</Text>
            <Text className="text-gray-600 dark:text-gray-400 leading-relaxed">{carInfo.description}</Text>
          </Animated.View>

          {/* Detailed Specifications */}
          <Animated.View 
            entering={FadeInDown.duration(300).delay(600)}
            className="mb-6"
          >
            <Text className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Specifications</Text>
            <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              {Object.entries(carInfo.specs || {}).map(([key, value], index) => (
                <View 
                  key={key}
                  className={`flex-row justify-between py-3 ${
                    index !== 0 ? 'border-t border-gray-200 dark:border-gray-700' : ''
                  }`}
                >
                  <Text className="text-gray-500 dark:text-gray-400 capitalize">{key.replace(/_/g, ' ')}</Text>
                  <Text className="text-gray-900 dark:text-gray-100 font-medium">
                    {key === 'price' ? formatPrice(value) : value}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Also Known As */}
          <Animated.View 
            entering={FadeInDown.duration(300).delay(700)}
            className="mb-6"
          >
            <Text className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Also Known As</Text>
            <View className="flex-row flex-wrap gap-2">
              {carInfo.alsoKnownAs?.map((name, index) => (
                <View key={index} className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                  <Text className="text-gray-600 dark:text-gray-400">{name}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Similar Images */}
          <Animated.View 
            entering={FadeInDown.duration(300).delay(800)}
            className="mb-8"
          >
            <Text className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Similar Images</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              {carInfo.images.map((image, index) => (
                <TouchableOpacity 
                  key={index}
                  className="mr-3"
                  onPress={() => {
                    setImageIndex(index);
                    setIsImageViewVisible(true);
                  }}
                >
                  <ExpoImage
                    source={image}
                    style={{
                      width: THUMB_SIZE * 1.5,
                      height: THUMB_SIZE,
                    }}
                    className="rounded-lg bg-gray-100 dark:bg-gray-800"
                    contentFit="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View 
        className="flex-row gap-4 p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
        style={{ paddingBottom: insets.bottom + 10 }}
      >
        <TouchableOpacity 
          className={`flex-1 py-4 rounded-xl items-center ${
            isInCollection ? 'bg-violet-100 dark:bg-violet-900/50' : 'bg-gray-100 dark:bg-gray-800'
          }`}
          onPress={handlePresentModal}
        >
          <Ionicons 
            name={isInCollection ? "heart" : "heart-outline"} 
            size={24} 
            color={isInCollection ? "#8B5CF6" : "#4B5563"} 
          />
          <Text className={isInCollection ? "text-violet-600 dark:text-violet-400 mt-1" : "text-gray-600 dark:text-gray-400 mt-1"}>
            {isInCollection ? 'Saved' : 'Save'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="flex-1 bg-gray-100 dark:bg-gray-800 py-4 rounded-xl items-center" 
          onPress={() => router.replace('/scan')}
        >
          <MaterialIcons name="camera" size={24} color="#4B5563" />
          <Text className="text-gray-600 dark:text-gray-400 mt-1">New</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="flex-1 bg-gray-100 dark:bg-gray-800 py-4 rounded-xl items-center"
          onPress={() => Alert.alert(
            'Coming Soon',
            'Sharing feature will be available in the next update!',
            [{ text: 'OK', style: 'default' }]
          )}
        >
          <MaterialIcons name="share" size={24} color="#4B5563" />
          <Text className="text-gray-600 dark:text-gray-400 mt-1">Share</Text>
        </TouchableOpacity>
      </View>

      {/* Collections Action Sheet */}
      <ActionSheet 
        id="collectionsSheet"
        containerStyle={{
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}
        indicatorStyle={{
          width: 40,
          backgroundColor: '#CBD5E1'
        }}
        gestureEnabled={true}
      >
        <View className="p-4 pb-8 bg-white dark:bg-gray-900">
          <Text className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Save to Collection</Text>
          
          {/* Collections List */}
          <ScrollView className="max-h-[400px]" showsVerticalScrollIndicator={false}>
            {collections.map((collection) => {
              const isCarInCollection = collection.cars.some(
                car => car.id === JSON.parse(carData).id
              );
              
              return (
                <TouchableOpacity
                  key={collection.id}
                  className={`flex-row items-center p-4 rounded-xl mb-2 ${
                    isCarInCollection 
                      ? 'bg-violet-50 dark:bg-violet-900/50 border border-violet-100 dark:border-violet-800' 
                      : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                  onPress={() => {
                    console.log('carData', carData);
                    const carInfo = isFresh ? {...JSON.parse(carData), id: scanId} : JSON.parse(carData);
                    if (isCarInCollection) {
                      removeFromCollection(collection.id, carInfo.id);
                      setIsInCollection(false);
                    } else {
                      addToCollection(collection.id, carInfo);
                      setIsInCollection(true);
                    }
                    SheetManager.hide("collectionsSheet");
                  }}
                >
                  <View className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 items-center justify-center mr-3">
                    <Text className="text-lg">{collection.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 dark:text-gray-100 font-medium">{collection.name}</Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-sm">
                      {collection.cars.length} cars
                    </Text>
                  </View>
                  {isCarInCollection && (
                    <MaterialIcons name="check-circle" size={20} color="#8B5CF6" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Create New Collection Button */}
          <TouchableOpacity
            className="flex-row items-center p-4 rounded-xl bg-violet-50 dark:bg-violet-900/50 mt-2"
            onPress={() => setIsModalVisible(true)}
          >
            <View className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-800 items-center justify-center mr-3">
              <MaterialIcons name="add" size={24} color="#8B5CF6" />
            </View>
            <Text className="text-violet-600 dark:text-violet-400 font-medium">Create New Collection</Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>

      {/* Image Viewer */}
      <ImageView
        images={images}
        imageIndex={imageIndex}
        visible={isImageViewVisible}
        onRequestClose={() => setIsImageViewVisible(false)}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
      />

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl p-4">
            <Text className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">New Collection</Text>
            <TextInput
              className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 mb-4 text-gray-900 dark:text-gray-100"
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
                <Text className="text-gray-600 dark:text-gray-400">Cancel</Text>
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
      </Modal>
    </View>
  );
} 