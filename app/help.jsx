import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Help() {
  const insets = useSafeAreaInsets();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = [
    {
      question: "How does car recognition work?",
      answer: "Our app uses advanced AI technology to analyze car images. Simply point your camera at any car, and our system will instantly identify the make, model, and year of the vehicle."
    },
    {
      question: "Do I need internet connection?",
      answer: "Yes, an internet connection is required for car recognition as our AI model runs in the cloud."
    },
    {
      question: "How accurate is the recognition?",
      answer: "Our AI model is highly accurate for most modern vehicles. However, accuracy may vary for rare, modified, or classic cars. Clear photos and good lighting will help improve recognition accuracy."
    },
    {
      question: "Can I save cars to collections?",
      answer: "Yes! You can create custom collections to organize cars you've identified. Simply tap the save button after scanning a car, then choose or create a collection to add it to."
    },
    {
      question: "How do I get the best scan results?",
      answer: "For best results:\n• Ensure good lighting\n• Capture the car's front or side view\n• Keep the camera steady\n• Avoid extreme angles\n• Make sure the car is clearly visible"
    },
    {
      question: "Is my data private?",
      answer: "Yes, we take privacy seriously. Your scan history and collections are stored securely and are only accessible to you. We don't share your personal data with third parties."
    },
    {
      question: "Can I use the app in dark conditions?",
      answer: "Yes, you can use the built-in flash feature for low-light conditions. However, for the most accurate results, we recommend scanning cars in well-lit environments."
    },
    {
      question: "How do I update the app?",
      answer: "The app will automatically check for updates when you're connected to the internet. You can also manually check for updates through your device's app store."
    },
    {
      question: "What if recognition fails?",
      answer: "If recognition fails, try:\n• Taking another photo from a different angle\n• Ensuring better lighting\n• Moving closer to the vehicle\n• Making sure the car is fully in frame"
    },
    {
      question: "Can I scan multiple cars at once?",
      answer: "Currently, the app works best when scanning one car at a time. For the most accurate results, focus on a single vehicle in each scan."
    }
  ];

  return (
    <ScrollView 
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerStyle={{
        paddingBottom: insets.bottom + 20
      }}
    >
      <View className="p-6">
        <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Frequently Asked Questions
        </Text>

        <View className="gap-y-3">
          {faqs.map((faq, index) => (
            <TouchableOpacity
              key={index}
              className={`bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden ${
                expandedIndex === index ? 'bg-violet-50 dark:bg-violet-900/50' : ''
              }`}
              onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <View className="flex-row items-center justify-between p-4">
                <Text className={`flex-1 font-medium ${
                  expandedIndex === index 
                    ? 'text-violet-700 dark:text-violet-300' 
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {faq.question}
                </Text>
                <MaterialIcons
                  name={expandedIndex === index ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                  size={24}
                  color={expandedIndex === index ? "#6D28D9" : "#94A3B8"}
                  className="ml-3"
                />
              </View>
              
              {expandedIndex === index && (
                <View className="px-4 pb-4">
                  <Text className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
} 