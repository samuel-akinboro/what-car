import { View, Text, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CarNotFound() {
  const { imageUri } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView 
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerStyle={{
        paddingTop: insets.top + 10,
        paddingBottom: insets.bottom + 20
      }}
    >
      <View className="px-6">
        {/* Image Preview */}
        <View className="w-full aspect-square rounded-3xl overflow-hidden mb-8 shadow-lg">
          <Image
            source={imageUri}
            className="w-full h-full"
            style={{
              width: '100%',
              height: '100%'
            }}
            contentFit="cover"
          />
        </View>

        {/* Content */}
        <View className="items-center">
          <View className="mb-6">
            <MaterialIcons name="search-off" size={60} color="#6B7280" />
          </View>

          <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 text-center">
            Not a Car
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-center mb-8">
            The image you provided doesn't appear to be a car. Please try again with a photo of a car.
          </Text>

          <View className="w-full gap-y-3">
            <TouchableOpacity
              className="bg-primary py-4 px-6 rounded-xl w-full"
              onPress={() => router.replace('/scan')}
            >
              <Text className="text-white text-center font-semibold text-lg">
                Try Another Photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white dark:bg-gray-800 border border-primary dark:border-violet-500 py-4 px-6 rounded-xl w-full"
              onPress={() => router.push('/tips')}
            >
              <Text className="text-primary dark:text-violet-400 text-center font-semibold text-lg">
                View Scanning Tips
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}