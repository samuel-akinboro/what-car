import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import AuthService from '../../services/auth';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEmailSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await AuthService.signUpWithEmail(email, password);
      router.replace('/dashboard');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
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

  const handleAppleSignUp = async () => {
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
              <Text className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create Account</Text>
              <Text className="text-gray-500 dark:text-gray-400 mt-2">Sign up to get started</Text>
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
                    placeholder="Create a password"
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

              {/* Confirm Password Input */}
              <View>
                <Text className="text-gray-700 dark:text-gray-300 mb-2">Confirm Password</Text>
                <View className="flex-row items-center border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800">
                  <MaterialIcons name="lock" size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-2 text-gray-900 dark:text-gray-100"
                    placeholder="Confirm your password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <MaterialIcons 
                      name={showConfirmPassword ? "visibility" : "visibility-off"} 
                      size={20} 
                      color="#6B7280" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity 
                className={`bg-primary py-4 rounded-xl items-center mt-4 ${loading ? 'opacity-50' : ''}`}
                onPress={handleEmailSignUp}
                disabled={loading}
              >
                <Text className="text-white font-semibold text-lg">
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Social Sign Up */}
            <View className="mt-8">
              <Text className="text-gray-500 dark:text-gray-400 text-center mb-6">Or sign up with</Text>
              
              <View className="gap-y-4">
                {/* Google */}
                <TouchableOpacity 
                  className={`flex-row items-center justify-center border border-gray-300 dark:border-gray-700 rounded-xl py-4 bg-white dark:bg-gray-800 ${loading ? 'opacity-50' : ''}`}
                  onPress={handleGoogleSignUp}
                  disabled={loading}
                >
                  <MaterialIcons name="android" size={24} color="#EA4335" />
                  <Text className="text-gray-700 dark:text-gray-300 font-semibold ml-2">Continue with Google</Text>
                </TouchableOpacity>

                {/* Apple */}
                {Platform.OS === 'ios' && <TouchableOpacity 
                  className={`flex-row items-center justify-center border border-gray-300 dark:border-gray-700 rounded-xl py-4 bg-white dark:bg-gray-800 ${loading ? 'opacity-50' : ''}`}
                  onPress={handleAppleSignUp}
                  disabled={loading}
                >
                  <MaterialIcons name="apple" size={24} color={Platform.OS === 'ios' ? "#000000" : "#FFFFFF"} />
                  <Text className="text-gray-700 dark:text-gray-300 font-semibold ml-2">Continue with Apple</Text>
                </TouchableOpacity>}
              </View>
            </View>

            {/* Terms and Privacy */}
            <Text className="text-gray-500 dark:text-gray-400 text-center text-sm mt-8 px-4">
              By signing up, you agree to our{' '}
              <Text className="text-primary" onPress={() => router.push('/terms')}>Terms of Service</Text> and{' '}
              <Text className="text-primary" onPress={() => router.push('/privacy')}>Privacy Policy</Text>
            </Text>

            {/* Sign In Link */}
            <View className="flex-row justify-center mt-6 mb-8">
              <Text className="text-gray-500 dark:text-gray-400">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text className="text-primary font-semibold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
} 