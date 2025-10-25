import { useState } from "react";
import { Text, View, StyleSheet, TextInput, useColorScheme, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { Link } from "expo-router";

export default function SignUp() {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme ?? "light"]

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

  return (
    <SafeAreaProvider style={{ backgroundColor: theme.background}}>
        <SafeAreaView>
            <Text className="text-3xl self-center m-3" style={{color: theme.title}}>
                Sign Up
            </Text>
            <View className="m-5" style={{}}>
                <Text style={{color: theme.text}}>Username</Text>
                <TextInput
                    className="rounded-md border-2 h-10"
                    placeholder="enter username"
                    onChangeText={newText => setUsername(newText)}
                    style={{color: theme.text}}
                >
                </TextInput>
            </View>
            <View className="m-5">
                <Text style={{color: theme.text}}>Password</Text>
                <TextInput
                    className="rounded-md border-2 h-10"
                    placeholder="enter password"
                    onChangeText={newText => setPassword(newText)}
                    style={{color: theme.text}}
                    secureTextEntry
                    ></TextInput>
            </View>
            <View className="m-5">
                <Text style={{color: theme.text}}>Confirm Password</Text>
                <TextInput
                    className="rounded-md border-2 h-10"
                    placeholder="confirm password"
                    onChangeText={newText => setConfirmPassword(newText)}
                    style={{color: theme.text}}
                    secureTextEntry
                    ></TextInput>
            </View>

            <TouchableOpacity className="bg-blue-500 rounded-md p-3 m-5">
                <Text className="text-white text-center text-lg font-semibold">
                    Sign Up
                </Text>
            </TouchableOpacity>

            <View className="items-center">
                <Link href="/">
                    <Text style={{color: theme.text}}>Already have an account? Sign in</Text>
                </Link>
            </View>

        </SafeAreaView>
    </SafeAreaProvider>
  );

}
