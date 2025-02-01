import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

const Layout = ({ children }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
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
    />
  );
};

export default Layout;