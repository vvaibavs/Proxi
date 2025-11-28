// import { Stack } from "expo-router";
// import "./globals.css"
// import { useColorScheme } from "react-native";
// import { Colors } from "../constants/colors";
// import { AuthProvider } from "../contexts/AuthContext";

// export default function RootLayout() {
//     const colorScheme  = useColorScheme()
//     console.log(colorScheme)
//     const theme = Colors[useColorScheme() ?? "light"]
//     console.log(theme)
//   return (
//     <AuthProvider>
//       <Stack screenOptions={{
//           headerStyle: {backgroundColor: theme.navBackground},
//           headerTintColor: theme.title
//       }}>
//           <Stack.Screen name="index"/>
//           <Stack.Screen name="signup"/>
//           <Stack.Screen name="dashboard"/>
//           <Stack.Screen name="device/[id]"/>
//           <Stack.Screen name="notifications"/>
//       </Stack>
//     </AuthProvider>
//   )
// }

import { Tabs } from "expo-router";
import "./globals.css";
import { useColorScheme } from "react-native";
import { Colors } from "../constants/colors";
import { AuthProvider } from "../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <AuthProvider>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: theme.navBackground },
          headerTintColor: theme.title,
          tabBarStyle: {
            backgroundColor: theme.navBackground,
            borderTopWidth: 0,
            height: 60,
          },
          tabBarActiveTintColor: theme.title,
          tabBarInactiveTintColor: theme.subtleText,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="notifications"
          options={{
            title: "Alerts",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="notifications-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="device/[id]"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="signup"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </AuthProvider>
  );
}
