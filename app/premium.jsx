import { View, Text, TouchableOpacity, Switch, ScrollView } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';

export default function Premium() {
  const insets = useSafeAreaInsets();
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('free');

  return (
    <ScrollView 
      className="flex-1 bg-white dark:bg-gray-900" 
      style={{ paddingTop: insets.top }} 
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="px-5">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="self-end py-4"
        >
          <Text className="text-gray-400 dark:text-gray-500">Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 px-5 items-center">
        {/* Icon */}
        <View className="w-32 h-32 bg-violet-100 dark:bg-violet-900/50 rounded-full items-center justify-center mb-8">
          <MaterialIcons name="directions-car" size={64} color="#8B5CF6" />
        </View>

        <Text className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">Design Your Trial</Text>

        {/* Features List */}
        <View className="w-full gap-y-4 mb-8">
          {[
            "Enjoy your first 7 days, it's free",
            "Cancel from the app or your iCloud account",
            "Unlimited car identification",
            "Access to premium car details & specs"
          ].map((feature, index) => (
            <View key={index} className="flex-row items-center">
              <View className="w-6 h-6 bg-violet-500 rounded-full items-center justify-center mr-3">
                <MaterialIcons name="check" size={16} color="white" />
              </View>
              <Text className="text-gray-700 dark:text-gray-300 text-base flex-1">{feature}</Text>
            </View>
          ))}
        </View>

        {/* Pricing Options */}
        <View className="w-full gap-y-3 mb-6">
          {['free', 'weekly', 'monthly'].map((plan) => (
            <TouchableOpacity 
              key={plan}
              onPress={() => setSelectedPlan(plan)}
              className={`w-full ${
                selectedPlan === plan 
                  ? 'bg-violet-100 dark:bg-violet-900/50 border-violet-500' 
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700'
              } p-4 rounded-2xl border-2`}
            >
              <View className="flex-row items-center justify-between mb-1">
                <Text className={`${
                  selectedPlan === plan 
                    ? 'text-violet-500 dark:text-violet-300' 
                    : 'text-gray-900 dark:text-gray-100'
                } font-semibold`}>
                  {plan.charAt(0).toUpperCase() + plan.slice(1)} {plan !== 'free' ? 'Plan' : 'Trial'}
                </Text>
                {selectedPlan === plan && (
                  <MaterialIcons name="check-circle" size={20} color="#8B5CF6" />
                )}
              </View>
              <Text className="text-gray-500 dark:text-gray-400">
                {plan === 'free' ? '7 days' : plan === 'weekly' ? '$1.99/week' : '$0.99/month'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Price Info */}
        <Text className="text-gray-600 dark:text-gray-400 text-center mb-6">
          {selectedPlan === 'free' ? (
            <>7 days free, then just <Text className="font-semibold">$29.99</Text>/yr (~$2.50/mo)</>
          ) : selectedPlan === 'weekly' ? (
            <>Billed weekly at <Text className="font-semibold">$1.99</Text>/week</>
          ) : (
            <>Billed monthly at <Text className="font-semibold">$0.99</Text>/month</>
          )}
        </Text>

        {/* Continue Button */}
        <TouchableOpacity className="w-full bg-gray-900 dark:bg-gray-100 py-4 rounded-full items-center mb-6">
          <Text className="text-white dark:text-gray-900 text-lg font-semibold">
            {selectedPlan === 'free' ? 'Start Free Trial' : 'Continue'}
          </Text>
        </TouchableOpacity>

        {/* Reminder Toggle */}
        <View className="w-full flex-row items-center justify-between bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-full">
          <Text className="text-gray-700 dark:text-gray-300">Remind me before the trial ends</Text>
          <Switch
            value={reminderEnabled}
            onValueChange={setReminderEnabled}
            trackColor={{ false: "#E2E8F0", true: "#C4B5FD" }}
            thumbColor={reminderEnabled ? "#8B5CF6" : "#94A3B8"}
          />
        </View>

        {/* Footer Links */}
        <ScrollView horizontal className="flex-row gap-2 mt-6 pb-4" showsHorizontalScrollIndicator={false}>
          {["Terms of Use", "Privacy Policy", "Subscription Terms", "Restore"].map((text, index) => (
            <TouchableOpacity key={index} className="mr-2">
              <Text className="text-gray-400 dark:text-gray-500">
                {index > 0 && "| "}{text}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View className="h-8" style={{paddingBottom: insets.bottom}}></View>
    </ScrollView>
  );
} 