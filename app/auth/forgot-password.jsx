import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { router } from 'expo-router';
import AuthService from '../../services/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      await AuthService.sendPasswordResetEmail(email);
      Alert.alert(
        'Success',
        'Password reset email sent. Please check your inbox.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.log('Error', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerTitle: "Reset Password",
          headerBackTitle: "Back",
          headerShown: false,
        }} 
      />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-white dark:bg-gray-900"
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="flex-1 px-5">
            {/* Title */}
            <View className="mb-8 mt-8">
              <Text className="text-3xl font-bold text-gray-900 dark:text-gray-100">Forgot Password?</Text>
              <Text className="text-gray-500 dark:text-gray-400 mt-2">
                Enter your email address and we'll send you instructions to reset your password.
              </Text>
            </View>

            {/* Form */}
            <View className="gap-y-4">
              {/* Email Input */}
              <View>
                <Text className="text-gray-700 dark:text-gray-300 mb-2">Email</Text>
                <View className="flex-row items-center border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800">
                  <MaterialIcons name="email" size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-2 text-gray-900 dark:text-gray-100"
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              {/* Reset Button */}
              <TouchableOpacity 
                className={`bg-primary py-4 rounded-xl items-center mt-4 ${loading ? 'opacity-50' : ''}`}
                onPress={handleResetPassword}
                disabled={loading}
              >
                <Text className="text-white font-semibold text-lg">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Text>
              </TouchableOpacity>

              {/* Back to Login */}
              <TouchableOpacity 
                className="mt-4 items-center"
                onPress={() => router.back()}
              >
                <Text className="text-primary">Back to Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
} 