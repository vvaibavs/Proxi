import { Stack } from "expo-router";
import "./globals.css"
import { useColorScheme } from "react-native";
import { Colors } from "../constants/colors"

export default function RootLayout() {
    const colorScheme  = useColorScheme()
    console.log(colorScheme)
    const theme = Colors[useColorScheme() ?? "light"]
    console.log(theme)
  return (
    <Stack screenOptions={{
        headerStyle: {backgroundColor: theme.navBackground},
        headerTintColor: theme.title
    }}>

    </Stack>
  )
}
