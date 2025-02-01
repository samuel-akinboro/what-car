import { View, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence,
  withTiming,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from "react";
import { Image as ExpoImage } from 'expo-image';
import { screenWidth, screenHeight } from "../utils/constant";
import Constants from 'expo-constants';
import Anthropic from '@anthropic-ai/sdk';
import * as FileSystem from 'expo-file-system';
import { useData } from "../contexts/DataContext";

export default function Processing() {
  const { imageUri } = useLocalSearchParams();
  const scanPosition = useSharedValue(0);
  const scanOpacity = useSharedValue(1);
  const { saveScan } = useData();

  useEffect(() => {
    // Start animations
    scanPosition.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1
    );

    scanOpacity.value = withRepeat(
      withSequence(
        withSpring(0.6),
        withSpring(1)
      ),
      -1,
      true
    );

    return () => {};
  }, []);

  const getMediaType = (uri) => {
    const extension = uri.split('.').pop().toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'heic':
        return 'image/heic';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/jpeg'; // fallback
    }
  };

  // Identify car
  const identifyCar = async (base64Image) => {
    try {
      const anthropic = new Anthropic({
        apiKey: process.env.EXPO_PUBLIC_CLAUDE_API_KEY,
      });

      const message = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        messages: [{
          role: "user",
          content: [
            {
              type: "text",
              text: "First verify if this is a car. If it's not a car, respond with exactly: 'NOT_A_CAR'. \
              If it is a car, identify it and provide the following details in JSON format: \
                { \
                  name: (make + model), \
                  category: (type of car e.g., 'Sports Car', 'SUV', etc.), \
                  manufacturer: (brand), \
                  specs: { \
                    engine: (engine configuration and displacement), \
                    power: (horsepower figure with 'hp' unit), \
                    torque: (torque figure with 'Nm' unit), \
                    transmission: (transmission type), \
                    acceleration: (0-100 km/h time with 's' unit), \
                    topSpeed: (top speed in 'km/h'), \
                    price: (base price in USD) \
                  }, \
                  productionYears: (format: '2023 - 2025' or 'Present' for ongoing), \
                  rarity: (a rating from 'Common', 'Uncommon', 'Rare', 'Very Rare', 'Ultra Rare'), \
                  description: (2-3 sentences about what makes this car special), \
                  alsoKnownAs: [alternative names or variants], \
                  year: (model year), \
                  matchAccuracy: (percentage of confidence in identification) \
                }"
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: getMediaType(imageUri),
                data: base64Image
              }
            }
          ]
        }]
      });

      const response = message.content[0].text;
      
      if (response.includes('NOT_A_CAR')) {
        router.replace({
          pathname: '/car-not-found',
          params: { imageUri }
        });
        return;
      }

      const carInfo = {...JSON.parse(response), images: [imageUri]};
      await saveScan(carInfo, imageUri, base64Image);
      router.replace({
        pathname: '/details',
        params: { carData: JSON.stringify(carInfo), isFresh: true }
      });

    } catch (error) {
      console.error('Error identifying car:', error);
      router.replace({
        pathname: '/car-not-found',
        params: { imageUri }
      });
    }
  };

  useEffect(() => {
    const processImage = async () => {
      try {
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        identifyCar(base64);
      } catch (error) {
        console.error('Error reading image:', error);
      }
    };

    processImage();
  }, [imageUri]);

  // Animated styles remain the same
  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: scanPosition.value * (screenHeight * 0.425),
    }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: scanOpacity.value,
  }));

  // Rest of your existing JSX remains exactly the same
  return (
    <>
      <View className="flex-1 bg-black">
        <TouchableOpacity 
          className="absolute top-12 left-4 z-10 p-2"
          onPress={() => router.back()}
        >
          <MaterialIcons name="close" size={24} color="white" />
        </TouchableOpacity>

        <View className="flex-1 justify-center items-center px-4">
          <View className="w-full aspect-square relative">
            <View className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-400" />
            <View className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-400" />
            <View className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-400" />
            <View className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-400" />

            <ExpoImage
              source={imageUri}
              style={{ width: '100%', aspectRatio: 1 }}
              className="w-full h-full"
              contentFit="contain"
            />

            <Animated.View
              style={[{
                position: 'absolute',
                left: 0,
                right: 0,
                height: 2,
                backgroundColor: '#60A5FA',
                shadowColor: '#60A5FA',
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.5,
                shadowRadius: 5,
              }, scanLineStyle]}
            />
          </View>
        </View>

        <Animated.View 
          className="absolute bottom-20 self-center"
          style={iconStyle}
        >
          <View className="bg-white/20 rounded-full p-4">
            <MaterialIcons name="directions-car" size={32} color="#60A5FA" />
          </View>
        </Animated.View>
      </View>
    </>
  );
} 