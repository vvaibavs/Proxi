import { Link, router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, useColorScheme, View, Alert, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

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
        <SafeAreaProvider>
            <LinearGradient
                colors={[theme.gradientStart, theme.gradientEnd]}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.container}>
                    <View style={styles.content}>
                        {/* Header Section */}
                        <View style={styles.headerContainer}>
                            <View style={styles.logoCircle}>
                                <Text style={styles.logoText}>P</Text>
                            </View>
                            <Text style={[styles.welcomeText, { color: "#ffffff" }]}>
                                Welcome to Proxi
                            </Text>
                            <Text style={[styles.subtitleText, { color: "#e0e7ff" }]}>
                                Sign into your account
                            </Text>
                        </View>

                        {/* Form Card */}
                        <View style={styles.card}>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label, { color: theme.text }]}>Username</Text>
                                <TextInput
                                    style={[styles.input, { 
                                        color: theme.title, 
                                        borderColor: theme.borderColor,
                                        backgroundColor: theme.cardBackground || "#ffffff"
                                    }]}
                                    placeholder="Enter username"
                                    placeholderTextColor={theme.text + "80"}
                                    value={username}
                                    onChangeText={setUsername}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.label, { color: theme.text }]}>Password</Text>
                                <TextInput
                                    style={[styles.input, { 
                                        color: theme.title, 
                                        borderColor: theme.borderColor,
                                        backgroundColor: theme.cardBackground || "#ffffff"
                                    }]}
                                    placeholder="Enter password"
                                    placeholderTextColor={theme.text + "80"}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.button, (isLoading || loading) && styles.buttonDisabled]}
                                onPress={handleLogin}
                                disabled={isLoading || loading}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={[Colors.primary, Colors.primaryDark]}
                                    style={styles.buttonGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    {isLoading || loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={styles.buttonText}>
                                            Sign In
                                        </Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <View style={styles.signupContainer}>
                                <Link href="/signup" asChild>
                                    <TouchableOpacity>
                                        <Text style={[styles.signupText, { color: theme.text }]}>
                                            Don't have an account?{" "}
                                            <Text style={{ color: Colors.primary, fontWeight: "600" }}>
                                                Sign up
                                            </Text>
                                        </Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    content: {
        width: "100%",
        maxWidth: 400,
        alignSelf: "center",
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.3)",
    },
    logoText: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#ffffff",
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: "700",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitleText: {
        fontSize: 16,
        opacity: 0.9,
        textAlign: "center",
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },
    input: {
        height: 52,
        borderRadius: 12,
        borderWidth: 1.5,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    button: {
        borderRadius: 12,
        marginTop: 8,
        marginBottom: 20,
        overflow: "hidden",
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonGradient: {
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "600",
    },
    signupContainer: {
        alignItems: "center",
        marginTop: 8,
    },
    signupText: {
        fontSize: 14,
        textAlign: "center",
    },
});
