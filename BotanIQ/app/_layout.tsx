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
          headerStyle: { 
            backgroundColor: theme.gradientStart,
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 20,
          },
          tabBarStyle: {
            backgroundColor: theme.gradientStart,
            borderTopWidth: 0,
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
            elevation: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
          tabBarActiveTintColor: "#ffffff",
          tabBarInactiveTintColor: "rgba(255, 255, 255, 0.6)",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? "home" : "home-outline"} 
                size={size} 
                color={color} 
              />
            ),
          }}
        />

        <Tabs.Screen
          name="notifications"
          options={{
            title: "Alerts",
            headerShown: true,
            headerTitle: "Notifications",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? "notifications" : "notifications-outline"} 
                size={size} 
                color={color} 
              />
            ),
          }}
        />

        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            headerShown: true,
            headerTitle: "Dashboard",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? "grid" : "grid-outline"} 
                size={size} 
                color={color} 
              />
            ),
          }}
        />

        <Tabs.Screen
          name="device/[id]"
          options={{
            href: null,
            headerShown: true,
            headerTitle: "Device Details",
            headerStyle: {
              backgroundColor: theme.gradientStart,
            },
            headerTintColor: "#ffffff",
          }}
        />

        <Tabs.Screen
          name="signup"
          options={{
            href: null,
            headerShown: false,
          }}
        />
      </Tabs>
    </AuthProvider>
  );
}
