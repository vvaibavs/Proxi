import { Link, router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, useColorScheme, View, Alert, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";

export default function Index() {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme ?? "light"]
    const { login, loading } = useAuth()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert("Error", "Please enter both username and password");
            return;
        }

        setIsLoading(true);
        const result = await login(username.trim(), password);
        setIsLoading(false);

        if (result.success) {
            router.replace("/dashboard");
        } else {
            Alert.alert("Login Failed", result.error || "An error occurred");
        }
    }
    return (
        <SafeAreaProvider style={{ backgroundColor: theme.background }}>
            <SafeAreaView>
                <View className="items-center">
                    <Text className="text-3xl" style={{ color: theme.title }}>
                        Welcome to Proxi
                    </Text>
                    <Text className="text-xl" style={{ color: theme.text }}>
                        Sign into your account
                    </Text>
                </View>
                <View className="m-5" style={{}}>
                    <Text style={{ color: theme.text }}>Username</Text>
                    <TextInput
                        className="rounded-md border-2 h-10 px-3"
                        placeholder="enter username"
                        value={username}
                        onChangeText={setUsername}
                        style={{ color: theme.text, borderColor: theme.text }}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>
                <View className="m-5">
                    <Text style={{ color: theme.text }}>Password</Text>
                    <TextInput
                        className="rounded-md border-2 h-10 px-3"
                        placeholder="enter password"
                        value={password}
                        onChangeText={setPassword}
                        style={{ color: theme.text, borderColor: theme.text }}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                <TouchableOpacity
                    className="bg-blue-500 rounded-md p-3 m-5"
                    onPress={handleLogin}
                    disabled={isLoading || loading}
                >
                    {isLoading || loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white text-center text-lg font-semibold">
                            Sign In
                        </Text>
                    )}
                </TouchableOpacity>
                <View className="items-center">
                    <Link href="/signup" asChild>
                        <TouchableOpacity>
                            <Text style={{ color: theme.text }}>Don't have an account? Sign up</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

            </SafeAreaView>
        </SafeAreaProvider>
    );

}
