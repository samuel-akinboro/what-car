import { View, TouchableOpacity, Text, ScrollView, Dimensions } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

export default function ScanTips() {
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get('window');

  const tips = [
    {
      icon: "center-focus-strong",
      title: "Center the Car",
      description: "Position the vehicle in the middle of your frame for best results",
      color: "#818CF8"
    },
    {
      icon: "wb-sunny",
      title: "Good Lighting",
      description: "Ensure adequate lighting for accurate identification",
      color: "#F59E0B"
    },
    {
      icon: "straighten",
      title: "Multiple Angles",
      description: "Try different angles if first scan doesn't work",
      color: "#10B981"
    },
    {
      icon: "photo-camera",
      title: "Clear Shot",
      description: "Avoid obstacles between camera and vehicle",
      color: "#EC4899"
    }
  ];

  const bestPractices = [
    "Keep steady while scanning",
    "Avoid extreme angles",
    "Scan in daylight when possible",
    "Full car should be visible",
    "Clean lens for better results"
  ];

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        style={{ paddingTop: insets.top }}
      >
        <View className="px-6 pb-12">
          <View className="flex-row justify-between items-center py-4">
            <View>
              <Text className="text-white/70 text-base">Ready to</Text>
              <Text className="text-white text-3xl font-bold mt-1">
                Scan Cars 🚗
              </Text>
            </View>
            <TouchableOpacity className="bg-white/20 p-3 rounded-full">
              <MaterialIcons name="help-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <View className="px-6 -mt-6">
        <Animated.View 
          entering={FadeInDown.delay(200)}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 mb-8"
        >
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Tips
          </Text>
          <View className="gap-y-4">
            {tips.map((tip, index) => (
              <Animated.View 
                key={index}
                entering={FadeInRight.delay(400 + index * 100)}
                className="flex-row items-center bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl"
              >
                <View 
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: `${tip.color}20` }}
                >
                  <MaterialIcons name={tip.icon} size={24} color={tip.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 dark:text-gray-100 font-medium">{tip.title}</Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{tip.description}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(800)}
          className="bg-violet-50 dark:bg-violet-900/50 rounded-3xl p-6 mb-8"
        >
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Best Practices
          </Text>
          <View className="gap-y-3">
            {bestPractices.map((practice, index) => (
              <Animated.View 
                key={index}
                entering={FadeInRight.delay(1000 + index * 100)}
                className="flex-row items-center"
              >
                <View className="w-6 h-6 rounded-full bg-violet-200 dark:bg-violet-800 items-center justify-center mr-3">
                  <Text className="text-violet-700 dark:text-violet-300 font-medium">{index + 1}</Text>
                </View>
                <Text className="text-gray-600 dark:text-gray-400 flex-1">{practice}</Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
}
