import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { router } from 'expo-router';
import AuthService from '../../services/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await AuthService.signInWithEmail(email, password);
      router.replace('/dashboard');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await AuthService.signInWithGoogle();
      router.replace('/dashboard');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setLoading(true);
      await AuthService.signInWithApple();
      router.replace('/dashboard');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
          headerTitle: "",
          headerBackTitle: "",
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerShadowVisible: false,
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
              <Text className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome back</Text>
              <Text className="text-gray-500 dark:text-gray-400 mt-2">Sign in to continue</Text>
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

              {/* Password Input */}
              <View>
                <Text className="text-gray-700 dark:text-gray-300 mb-2">Password</Text>
                <View className="flex-row items-center border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800">
                  <MaterialIcons name="lock" size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-2 text-gray-900 dark:text-gray-100"
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <MaterialIcons 
                      name={showPassword ? "visibility" : "visibility-off"} 
                      size={20} 
                      color="#6B7280" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity 
                className="self-end"
                onPress={() => router.push('/auth/forgot-password')}
              >
                <Text className="text-primary">Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity 
                className={`bg-primary py-4 rounded-xl items-center mt-4 ${loading ? 'opacity-50' : ''}`}
                onPress={handleEmailLogin}
                disabled={loading}
              >
                <Text className="text-white font-semibold text-lg">
                  {loading ? 'Signing in...' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Social Login */}
            <View className="mt-8">
              <Text className="text-gray-500 dark:text-gray-400 text-center mb-6">Or continue with</Text>
              
              <View className="gap-y-4">
                {/* Google */}
                <TouchableOpacity 
                  className={`flex-row items-center justify-center border border-gray-300 dark:border-gray-700 rounded-xl py-4 bg-white dark:bg-gray-800 ${loading ? 'opacity-50' : ''}`}
                  onPress={handleGoogleLogin}
                  disabled={loading}
                >
                  <MaterialIcons name="android" size={24} color="#EA4335" />
                  <Text className="text-gray-700 dark:text-gray-300 font-semibold ml-2">Continue with Google</Text>
                </TouchableOpacity>

                {/* Apple */}
                {Platform.OS === 'ios' && <TouchableOpacity 
                  className={`flex-row items-center justify-center border border-gray-300 dark:border-gray-700 rounded-xl py-4 bg-white dark:bg-gray-800 ${loading ? 'opacity-50' : ''}`}
                  onPress={handleAppleLogin}
                  disabled={loading}
                >
                  <MaterialIcons name="apple" size={24} color={Platform.OS === 'ios' ? "#000000" : "#FFFFFF"} />
                  <Text className="text-gray-700 dark:text-gray-300 font-semibold ml-2">Continue with Apple</Text>
                </TouchableOpacity>}
              </View>
            </View>

            {/* Sign Up Link */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-gray-500 dark:text-gray-400">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/register')}>
                <Text className="text-primary font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
} 