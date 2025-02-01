import { Stack } from "expo-router";
import { Tabs } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';
import "../global.css";
import { TouchableOpacity, useColorScheme } from "react-native";
import { DataProvider } from "../contexts/DataContext";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { registerSheet } from 'react-native-actions-sheet';
// import { PurchasesProvider } from '../contexts/PurchasesContext';

// Register your sheets
registerSheet("collectionSheet");

export default function Layout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        {/* <PurchasesProvider> */}
          <DataProvider>
            <Stack
              screenOptions={{
                contentStyle: {
                  backgroundColor: isDark ? '#111827' : '#fff',
                },
                headerStyle: {
                  backgroundColor: isDark ? '#111827' : '#fff',
                },
                headerTitleStyle: {
                  color: isDark ? '#F3F4F6' : '#1F2937',
                },
                headerTintColor: isDark ? '#F3F4F6' : '#1F2937',
              }}
            >
              <Stack.Screen
                name="dashboard"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="scan"
                options={{
                  presentation: 'fullScreenModal',
                  title: 'Identify',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="tips"
                options={{
                  presentation: 'modal',
                  title: 'Tips',
                  headerShown: false,
                  href: null,
                }}
              />
              <Stack.Screen
                name="processing"
                options={{
                  presentation: 'fullScreenModal',
                  title: 'Processing',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="details"
                options={{
                  // presentation: 'fullScreenModal',
                  title: 'Details',
                  // headerLeft: () => (
                  //   <TouchableOpacity
                  //     className="ml-4"
                  //     onPress={() => router.back()}
                  //   >
                  //     <MaterialIcons name="close" size={24} color="#000" />
                  //   </TouchableOpacity>
                  // ),
                }}
              />
              <Stack.Screen
                name="car-not-found"
                options={{
                  // presentation: 'fullScreenModal',
                  title: 'Car Not Found',
                  // headerShown: false,
                }}
              />
              <Stack.Screen
                name="index"
                options={{
                  href: null,
                }}
              />
            </Stack>
          </DataProvider>
        {/* </PurchasesProvider> */}
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}