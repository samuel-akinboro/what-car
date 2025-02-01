import { View, Text, TouchableOpacity, Switch, ScrollView } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import auth from '@react-native-firebase/auth';
import AuthService from '../services/auth';

export default function Settings() {
  const insets = useSafeAreaInsets();
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth().onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  const menuGroups = [
    {
      items: [
        {
          title: "My Premium Service",
          subtitle: "Status: Free",
          icon: "star",
          route: "/premium",
          disabled: true,
        },
      ]
    },
    {
      items: [
        // {
        //   title: "Edit Profile",
        //   icon: "person",
        //   route: "/profile"
        // },
        // Updated logout button with red color
        user ? {
          title: "Log Out",
          icon: "logout",
          textColor: "#EF4444", // Red text
          iconColor: "#EF4444", // Red icon
          onPress: async () => {
            try {
              await AuthService.signOut();
              router.replace('/');
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        } : {
          title: "Log In / Sign up",
          icon: "login",
          route: "/auth/login"
        },
        // {
        //   title: "Set Language",
        //   icon: "language",
        //   route: "/language"
        // },
      ]
    },
    // {
    //   items: [
    //     {
    //       title: "Autosave Photos to Album",
    //       type: "switch",
    //       value: autoSaveEnabled,
    //       onValueChange: setAutoSaveEnabled
    //     },
    //   ]
    // },
    {
      items: [
        {
          title: "Drop A Feedback",
          icon: "favorite",
          route: "/feedback"
        },
        {
          title: "FAQ & Help",
          icon: "help",
          route: "/help"
        },
        // {
        //   title: "Suggestion",
        //   icon: "lightbulb",
        //   route: "/suggestion"
        // },
        {
          title: "App Info",
          icon: "info",
          route: "/about"
        },
        // {
        //   title: "Tell Friends",
        //   icon: "share",
        //   route: "/share"
        // },
      ]
    },
    {
      items: [
        {
          title: "Privacy Policy",
          icon: "privacy-tip",
          route: "/privacy"
        },
        {
          title: "Terms of Use",
          icon: "description",
          route: "/terms"
        },
      ]
    },
  ];

  const renderMenuItem = (item) => {
    if (item.type === "switch") {
      return (
        <View className="flex-row items-center justify-between px-5 py-4 bg-white dark:bg-gray-800">
          <Text className="text-gray-900 dark:text-gray-100 text-lg">{item.title}</Text>
          <Switch
            value={item.value}
            onValueChange={item.onValueChange}
            trackColor={{ false: "#E2E8F0", true: "#C4B5FD" }}
            thumbColor={item.value ? "#8B5CF6" : "#94A3B8"}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        onPress={item.onPress || (() => router.push(item.route))}
        disabled={item.disabled}
        className="flex-row items-center justify-between px-5 py-4 bg-white dark:bg-gray-800"
      >
        <View className="flex-row items-center">
          {item.icon && (
            <MaterialIcons 
              name={item.icon} 
              size={24} 
              color={item.iconColor || "#4B5563"} 
              className="mr-3" 
            />
          )}
          <View>
            <Text 
              style={item.textColor ? { color: item.textColor } : {}} 
              className={`text-lg ${item.textColor ? '' : 'text-gray-900 dark:text-gray-100'}`}
            >
              {item.title}
            </Text>
            {item.subtitle && (
              <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1">{item.subtitle}</Text>
            )}
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#94A3B8" />
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-y-8 pb-8">
          {menuGroups.map((group, groupIndex) => (
            <View key={groupIndex} className="gap-y-[1px] bg-gray-200 dark:bg-gray-700">
              {group.items.map((item, itemIndex) => (
                <View key={itemIndex}>
                  {renderMenuItem(item)}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
