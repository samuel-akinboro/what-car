import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import { useCallback, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { router } from 'expo-router';

const ITEMS_PER_PAGE = 15;

const RARITY_STYLES = {
  'Ultra Rare': 'bg-red-50/80 border-red-200 hover:border-red-300',
  'Very Rare': 'bg-orange-50/80 border-orange-200 hover:border-orange-300',
  'Rare': 'bg-yellow-50/80 border-yellow-200 hover:border-yellow-300',
  'Uncommon': 'bg-green-50/80 border-green-200 hover:border-green-300',
  'Common': 'bg-gray-50/80 border-gray-200 hover:border-gray-300'
};

export default function History() {
  const insets = useSafeAreaInsets();
  const { recentScans, getRelativeTime } = useData();
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  const displayedScans = recentScans?.slice(0, page * ITEMS_PER_PAGE) || [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Implement your refresh logic here
    setRefreshing(false);
    setPage(1);
  }, []);

  const loadMore = () => {
    if (loading) return;
    if (displayedScans.length >= recentScans?.length) return;
    setLoading(true);
    setPage(prev => prev + 1);
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-gradient-to-br from-violet-50 to-gray-50">
      {/* Header */}
      {/* <View className="px-4 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-semibold text-gray-900">History</Text>
          <TouchableOpacity 
            className="bg-violet-100 p-2 rounded-full"
            onPress={() => router.push("/scan")}
          >
            <MaterialIcons name="camera-alt" size={24} color="#8B5CF6" />
          </TouchableOpacity>
        </View>
        <Text className="text-gray-500 mt-1">Your recent car scans</Text>
      </View> */}

      {/* Main Content */}
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
          if (isCloseToBottom) loadMore();
        }}
        scrollEventThrottle={400}
      >
        <View className="p-4">
          {displayedScans.map((scan, index) => (
            <TouchableOpacity 
              key={scan.id}
              className={`mb-8 rounded-[32px] overflow-hidden ${
                expandedCard === scan.id ? 'scale-[1.02]' : ''
              } transition-all duration-200`}
              onPress={() => {
                router.push({
                  pathname: '/details',
                  params: { carData: JSON.stringify(scan) }
                })
              }}
            >
              {scan.images?.[0] ? (
                <View className="relative">
                  {/* Large Image */}
                  <ExpoImage
                    source={scan.images[0]}
                    style={{ width: '100%', height: 420 }}
                    className="rounded-[32px]"
                    contentFit="cover"
                  />
                  
                  {/* Dark Overlay - Added base darkness */}
                  <View className="absolute inset-0 rounded-[32px] bg-black/30" />
                  
                  {/* Gradient Overlay - For depth */}
                  <View className="absolute inset-0 rounded-[32px] bg-gradient-to-t from-black via-black/40 to-transparent" />

                  {/* Content Overlay */}
                  <View className="absolute inset-0 p-6 flex justify-end">
                    {/* Top Bar */}
                    <View className="absolute top-0 left-0 right-0 p-6 flex-row justify-between">
                      <View className={`px-4 py-2 rounded-full ${
                        scan.rarity === 'Ultra Rare' ? 'bg-red-500' :
                        scan.rarity === 'Very Rare' ? 'bg-orange-500' :
                        scan.rarity === 'Rare' ? 'bg-yellow-500' :
                        scan.rarity === 'Uncommon' ? 'bg-green-500' :
                        'bg-gray-500'
                      }`}>
                        <Text className="text-white font-bold tracking-wider text-xs">
                          {scan.rarity.toUpperCase()}
                        </Text>
                      </View>
                      
                      <View className="flex-row items-center">
                        <MaterialIcons name="verified" size={16} color="#22C55E" />
                        <Text className="text-white font-medium ml-1">
                          {scan.matchAccuracy}% MATCH
                        </Text>
                      </View>
                    </View>

                    {/* Car Info */}
                    <View>
                      {/* Name and Manufacturer */}
                      <Text className="text-white/60 text-lg mb-1">
                        {scan.manufacturer}
                      </Text>
                      <Text className="text-white text-4xl font-bold mb-6" numberOfLines={1}>
                        {scan.name}
                      </Text>

                      {/* Stats Grid */}
                      <View className="flex-row -mx-2">
                        <View className="flex-1 px-2">
                          <Text className="text-white/60 text-xs tracking-wider mb-1">
                            TOP SPEED
                          </Text>
                          <Text className="text-white text-2xl font-medium">
                            {scan.specs?.topSpeed || '--'}
                            <Text className="text-white/60 text-lg"> mph</Text>
                          </Text>
                        </View>

                        <View className="flex-1 px-2 border-l border-white/20">
                          <Text className="text-white/60 text-xs tracking-wider mb-1">
                            0-60 MPH
                          </Text>
                          <Text className="text-white text-2xl font-medium">
                            {scan.specs?.acceleration || '--'}
                            <Text className="text-white/60 text-lg"> sec</Text>
                          </Text>
                        </View>

                        <View className="flex-1 px-2 border-l border-white/20">
                          <Text className="text-white/60 text-xs tracking-wider mb-1">
                            POWER
                          </Text>
                          <Text className="text-white text-2xl font-medium">
                            {scan.specs?.power || '--'}
                            <Text className="text-white/60 text-lg"> hp</Text>
                          </Text>
                        </View>
                      </View>

                      {/* Timestamp */}
                      <View className="mt-6 flex-row items-center">
                        <MaterialIcons name="schedule" size={14} color="rgba(255,255,255,0.6)" />
                        <Text className="text-white/60 text-sm ml-1">
                          Scanned {getRelativeTime(scan.timestamp)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ) : (
                <View className="w-full h-[420px] bg-gray-900 rounded-[32px] items-center justify-center">
                  <MaterialIcons name="directions-car" size={48} color="#8B5CF6" />
                </View>
              )}
            </TouchableOpacity>
          ))}

          {/* Updated loading state with pulsing animation */}
          {loading && (
            <View className="py-4 items-center">
              <View className="w-8 h-8 bg-violet-500 rounded-full animate-pulse" />
            </View>
          )}

          {/* Updated empty state with more engaging design */}
          {displayedScans.length === 0 && (
            <View className="py-20 items-center">
              <View className="bg-violet-100 p-6 rounded-full mb-4">
                <MaterialIcons name="camera-alt" size={48} color="#8B5CF6" />
              </View>
              <Text className="text-xl font-semibold text-gray-900 mb-2">No Cars Scanned Yet</Text>
              <Text className="text-gray-500 mb-6 text-center px-8">
                Start scanning cars to build your collection and see them appear here
              </Text>
              <TouchableOpacity 
                className="bg-violet-600 px-8 py-4 rounded-full flex-row items-center"
                onPress={() => router.push("/scan")}
              >
                <MaterialIcons name="add-a-photo" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">Start Scanning</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
} 