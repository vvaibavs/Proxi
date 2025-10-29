import { useState } from "react";
import { Text, View, StyleSheet, TextInput, useColorScheme, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { Link, router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function SignUp() {
    const colorScheme = useColorScheme()
    const theme = Colors["light"]
    const { signup, loading } = useAuth()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSignup = async () => {
        if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters long");
            return;
        }

        if (username.length < 3) {
            Alert.alert("Error", "Username must be at least 3 characters long");
            return;
        }

        setIsLoading(true);
        const result = await signup(username.trim(), password);
        setIsLoading(false);

        if (result.success) {
            router.replace("/dashboard");
        } else {
            Alert.alert("Signup Failed", result.error || "An error occurred");
            router.replace("/signup");
        }
    }

  return (
    <SafeAreaProvider style={{ backgroundColor: theme.background}}>
        <SafeAreaView>
            <Text className="text-3xl self-center m-3" style={{color: theme.title}}>
                Sign Up
            </Text>
            <View className="m-5" style={{}}>
                <Text style={{color: theme.text}}>Username</Text>
                <TextInput
                    className="rounded-md border-2 h-10 px-3"
                    placeholder="enter username"
                    value={username}
                    onChangeText={setUsername}
                    style={{color: theme.text, borderColor: theme.text}}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>
            <View className="m-5">
                <Text style={{color: theme.text}}>Password</Text>
                <TextInput
                    className="rounded-md border-2 h-10 px-3"
                    placeholder="enter password"
                    value={password}
                    onChangeText={setPassword}
                    style={{color: theme.text, borderColor: theme.text}}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>
            <View className="m-5">
                <Text style={{color: theme.text}}>Confirm Password</Text>
                <TextInput
                    className="rounded-md border-2 h-10 px-3"
                    placeholder="confirm password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    style={{color: theme.text, borderColor: theme.text}}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            <TouchableOpacity
                className="bg-blue-500 rounded-md p-3 m-5"
                onPress={handleSignup}
                disabled={isLoading || loading}
            >
                {isLoading || loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white text-center text-lg font-semibold">
                        Sign Up
                    </Text>
                )}
            </TouchableOpacity>

            <View className="items-center">
                <Link href="/" asChild>
                    <TouchableOpacity>
                        <Text style={{color: theme.text}}>Already have an account? Sign in</Text>
                    </TouchableOpacity>
                </Link>
            </View>

        </SafeAreaView>
    </SafeAreaProvider>
  );

}
