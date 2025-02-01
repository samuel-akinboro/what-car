import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

export default function About() {
  const insets = useSafeAreaInsets();
  const version = Constants.expoConfig.version || '1.0.0';

  const sections = [
    {
      title: "App Details",
      items: [
        { label: "Version", value: version },
        { label: "Build", value: Constants.expoConfig.ios?.buildNumber || '1' },
      ]
    },
    {
      title: "Key Features",
      items: [
        {
          icon: "auto-awesome",
          label: "AI-Powered Recognition",
          description: "Instantly identify any car model"
        },
        {
          icon: "collections",
          label: "Smart Collections",
          description: "Organize your favorite cars"
        },
        // {
        //   icon: "offline-bolt",
        //   label: "Offline Support",
        //   description: "Works without internet"
        // },
        // {
        //   icon: "speed",
        //   label: "Lightning Fast",
        //   description: "Get results in milliseconds"
        // },
        {
          icon: "history",
          label: "Search History",
          description: "Track all your car identifications"
        },
        {
          icon: "photo-camera",
          label: "Multi-Angle Detection",
          description: "Recognize cars from any angle"
        },
        {
          icon: "auto-stories",
          label: "Detailed Specs",
          description: "Access comprehensive car details"
        },
        // {
        //   icon: "dark-mode",
        //   label: "Dark Mode",
        //   description: "Comfortable viewing at night"
        // },
        // {
        //   icon: "share",
        //   label: "Easy Sharing",
        //   description: "Share discoveries with friends"
        // },
        {
          icon: "update",
          label: "Regular Updates",
          description: "New features and car models"
        }
      ]
    }
  ];

  return (
    <ScrollView 
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerStyle={{
        paddingBottom: insets.bottom + 20
      }}
    >
      <View className="items-center py-12 bg-primary dark:bg-violet-900">
        <View className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl items-center justify-center mb-4 shadow-lg">
          <MaterialIcons name="directions-car" size={48} color="white" />
        </View>
        <Text className="text-3xl font-bold text-white">WhatCar</Text>
        <Text className="text-white/80 mt-1">Version {version}</Text>
      </View>

      <View className="px-6 py-8 -mt-6 bg-white dark:bg-gray-900 rounded-t-3xl">
        <Text className="text-gray-600 dark:text-gray-400 text-center text-lg leading-relaxed mb-12">
          Your personal car expert powered by artificial intelligence. 
          Point your camera at any car and instantly get detailed information 
          about its make, model, and features.
        </Text>

        {sections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="mb-10">
            <Text className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {section.title}
            </Text>
            
            <View className="gap-y-4">
              {section.items.map((item, itemIndex) => {
                if (item.value) {
                  return (
                    <View key={itemIndex} className="flex-row justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                      <Text className="text-gray-600 dark:text-gray-400">{item.label}</Text>
                      <Text className="text-gray-900 dark:text-gray-100 font-medium">{item.value}</Text>
                    </View>
                  );
                }

                return (
                  <View
                    key={itemIndex}
                    className="flex-row items-start bg-gray-50 dark:bg-gray-800 p-4 rounded-xl"
                  >
                    <View className="w-10 h-10 bg-violet-100 dark:bg-violet-900 rounded-full items-center justify-center">
                      <MaterialIcons 
                        name={item.icon} 
                        size={24} 
                        color={item.iconColor || "#6366F1"} 
                      />
                    </View>
                    <View className="flex-1 ml-4">
                      <Text className="text-gray-900 dark:text-gray-100 font-medium">{item.label}</Text>
                      <Text className="text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
} 