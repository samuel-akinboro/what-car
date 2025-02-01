import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from "react-native";
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import emailjs from '@emailjs/react-native';

export default function Feedback() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const sendEmail = async () => {
    // Basic validation
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await emailjs.init('YOUR_PUBLIC_KEY'); // Initialize with your public key

      await emailjs.send(
        process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID,  // Replace with your EmailJS service ID
        process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID, // Replace with your EmailJS template ID
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        {
          publicKey: process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY,
          // accessToken: process.env.EXPO_PUBLIC_EMAILJS_ACCESS_TOKEN,
        }
      );

      Alert.alert(
        'Success',
        'Thank you for your feedback!',
        [{ 
          text: 'OK',
          onPress: () => {
            setForm({ name: '', email: '', message: '' });
          }
        }]
      );
    } catch (error) {
      console.error('Email error:', error);
      Alert.alert('Error', 'Failed to send feedback. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          className="flex-1 bg-white dark:bg-gray-900"
          contentContainerStyle={{
            paddingBottom: insets.bottom + 20
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="p-6">
            <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Encourage Us
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 mb-8">
              We'd love to hear your thoughts about the app! Your feedback helps us improve.
            </Text>

            <View className="gap-y-6">
              <View>
                <Text className="text-gray-700 dark:text-gray-300 font-medium mb-2">Name</Text>
                <TextInput
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100"
                  placeholder="Your name"
                  placeholderTextColor="#9CA3AF"
                  value={form.name}
                  onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>

              <View>
                <Text className="text-gray-700 dark:text-gray-300 font-medium mb-2">Email</Text>
                <TextInput
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100"
                  placeholder="your@email.com"
                  placeholderTextColor="#9CA3AF"
                  value={form.email}
                  onChangeText={(text) => setForm(prev => ({ ...prev, email: text }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                />
              </View>

              <View>
                <Text className="text-gray-700 dark:text-gray-300 font-medium mb-2">Message</Text>
                <TextInput
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 min-h-[120px]"
                  placeholder="Share your thoughts..."
                  placeholderTextColor="#9CA3AF"
                  value={form.message}
                  onChangeText={(text) => setForm(prev => ({ ...prev, message: text }))}
                  multiline
                  textAlignVertical="top"
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
              </View>

              <TouchableOpacity
                className={`bg-violet-600 dark:bg-violet-500 rounded-xl py-4 items-center ${loading ? 'opacity-70' : ''}`}
                onPress={sendEmail}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-medium text-lg">
                    Send Feedback
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
} 