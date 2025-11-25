import { Stack } from "expo-router";
import "./globals.css"
import { useColorScheme } from "react-native";
import { Colors } from "../constants/colors";
import { AuthProvider } from "../contexts/AuthContext";

export default function RootLayout() {
    const colorScheme  = useColorScheme()
    console.log(colorScheme)
    const theme = Colors[useColorScheme() ?? "light"]
    console.log(theme)
  return (
    <AuthProvider>
      <Stack screenOptions={{
          headerStyle: {backgroundColor: theme.navBackground},
          headerTintColor: theme.title
      }}>
          <Stack.Screen name="index"/>
          <Stack.Screen name="signup"/>
          <Stack.Screen name="dashboard"/>
          <Stack.Screen name="device/[id]"/>
          <Stack.Screen name="notifications"/>
      </Stack>
    </AuthProvider>
  )
}
