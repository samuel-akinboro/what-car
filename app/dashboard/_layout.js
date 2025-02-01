import { Tabs } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';
import { View, TouchableOpacity, Text } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="flex-row bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800" 
      style={{paddingBottom: insets.bottom}}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        if (index === 1) {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => router.push("/scan")}
              className="flex-1 items-center"
            >
              <View className="bg-violet-500 dark:bg-violet-600 size-20 rounded-full items-center justify-center -mt-6">
                <MaterialIcons name="camera-alt" size={24} color="white" />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            className="flex-1 items-center py-2"
          >
            {options.tabBarIcon?.({ 
              color: isFocused 
                ? '#6366F1' 
                : '#94A3B8',
              size: 24 
            })}
            <Text 
              className={`text-xs mt-1 ${
                isFocused 
                  ? 'text-violet-500 dark:text-violet-400' 
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        }
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="garage"
        options={{
          title: "My Whips",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="directions-car" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
