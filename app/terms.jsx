import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Terms() {
  const insets = useSafeAreaInsets();

  const sections = [
    {
      title: "Acceptance of Terms",
      content: [
        "By downloading, installing, or using WhatCar, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the app."
      ]
    },
    {
      title: "App License",
      content: [
        "WhatCar grants you a limited, non-exclusive, non-transferable, revocable license to:",
        "• Install and use the app on any device where you're signed in with your account",
        "• Access and use the app for personal, non-commercial purposes",
        "• Use the features and services provided within the app according to these terms"
      ]
    },
    {
      title: "User Responsibilities",
      content: [
        "You agree to:",
        "• Use the app in compliance with all applicable laws",
        "• Not modify, reverse engineer, or hack the app",
        "• Not use the app for illegal purposes",
        "• Not interfere with the app's security features",
        "• Keep your device secure and updated",
        "• Use the app responsibly and safely"
      ]
    },
    {
      title: "Car Recognition Service",
      content: [
        "• The car recognition feature is provided 'as is'",
        "• Results are based on AI analysis and may not be 100% accurate",
        "• We do not guarantee the accuracy of identifications",
        "• The service requires an internet connection",
        "• Service availability may vary based on location and conditions"
      ]
    },
    {
      title: "User Content",
      content: [
        "For photos you take using the app:",
        "• You retain ownership of your content",
        "• Photos are processed for identification only",
        "• We don't store or share your photos",
        "• You are responsible for the content you capture"
      ]
    },
    {
      title: "Intellectual Property",
      content: [
        "• The app, including its code, design, and content, is protected by copyright",
        "• All trademarks and logos are property of their respective owners",
        "• You may not copy, modify, or distribute app content",
        "• Car brands and models mentioned are properties of their respective manufacturers"
      ]
    },
    {
      title: "Limitations of Liability",
      content: [
        "WhatCar is not liable for:",
        "• Incorrect car identifications",
        "• Service interruptions",
        "• Data loss or device issues",
        "• Indirect or consequential damages",
        "• Issues arising from network connectivity"
      ]
    },
    {
      title: "Service Modifications",
      content: [
        "We reserve the right to:",
        "• Modify or discontinue features",
        "• Update the app and its services",
        "• Change terms and conditions",
        "• Implement new requirements",
        "Changes will be communicated through the app"
      ]
    },
    {
      title: "Termination",
      content: [
        "We may terminate or suspend access to the app:",
        "• For violations of these terms",
        "• To comply with legal requirements",
        "• For security reasons",
        "• At our discretion with reasonable cause"
      ]
    },
    {
      title: "Governing Law",
      content: [
        "These terms are governed by applicable laws. Any disputes shall be resolved in the appropriate jurisdiction."
      ]
    },
    {
      title: "Contact",
      content: [
        "For questions about these terms, please contact us through the Feedback section in the app."
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
      <View className="p-6">
        <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Terms of Use
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </Text>

        <View className="gap-y-8">
          {sections.map((section, index) => (
            <View key={index}>
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {section.title}
              </Text>
              <View className="gap-y-2">
                {section.content.map((text, i) => (
                  <Text key={i} className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {text}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
            By using WhatCar, you acknowledge that you have read and agree to these Terms of Use.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
} 