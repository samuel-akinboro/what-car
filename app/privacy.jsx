import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Privacy() {
  const insets = useSafeAreaInsets();

  const sections = [
    {
      title: "Information We Collect",
      content: [
        "When you use WhatCar, we collect:",
        "• Photos you take for car identification",
        "• Device information for app functionality",
        "• Usage data to improve our service",
        "• Email address (optional, for feedback only)"
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        "We use your information to:",
        "• Identify cars through our AI system",
        "• Save your car collections locally",
        "• Improve our recognition accuracy",
        "• Enhance app performance",
        "• Respond to your feedback"
      ]
    },
    {
      title: "Data Storage",
      content: [
        "• Car photos are processed in real-time and not stored on our servers",
        "• Your collections are stored securely on our servers",
        "• Scan history is kept securely on our servers",
        // "• You can delete your data anytime through app settings"
      ]
    },
    {
      title: "Data Sharing",
      content: [
        "We do not share your personal information with third parties. Your data is used only for:",
        "• Car identification processing",
        "• App functionality",
        "• Service improvements"
      ]
    },
    {
      title: "Camera Usage",
      content: [
        "WhatCar requires camera access to:",
        "• Capture car images for identification",
        "• Process real-time car recognition",
        "Photos are processed instantly and not stored on our servers."
      ]
    },
    // {
    //   title: "Your Rights",
    //   content: [
    //     "You have the right to:",
    //     "• Access your data",
    //     "• Delete your data",
    //     "• Clear scan history",
    //     "• Remove saved collections",
    //     "• Opt out of analytics"
    //   ]
    // },
    {
      title: "Data Security",
      content: [
        "We implement security measures to protect your data:",
        "• Secure data transmission",
        "• Local storage encryption",
        "• Regular security updates",
        "• Protected cloud processing"
      ]
    },
    {
      title: "Children's Privacy",
      content: [
        "WhatCar is not intended for children under 13. We do not knowingly collect information from children under 13 years of age."
      ]
    },
    {
      title: "Updates to Privacy Policy",
      content: [
        "We may update this privacy policy occasionally. We will notify you of any significant changes through the app."
      ]
    },
    {
      title: "Contact Us",
      content: [
        "If you have questions about our privacy policy, please contact us through the Feedback section in the app."
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
          Privacy Policy
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
            By using WhatCar, you agree to this privacy policy and our terms of service.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
} 