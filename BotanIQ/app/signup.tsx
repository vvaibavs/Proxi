import { useState } from "react";
import { Text, View, StyleSheet, TextInput, useColorScheme, TouchableOpacity, Alert, ActivityIndicator, Dimensions, ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { Link, router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

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
    <SafeAreaProvider>
        <LinearGradient
            colors={[theme.gradientStart, theme.gradientEnd]}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        {/* Header Section */}
                        <View style={styles.headerContainer}>
                            <View style={styles.logoCircle}>
                                <Text style={styles.logoText}>P</Text>
                            </View>
                            <Text style={[styles.titleText, { color: "#ffffff" }]}>
                                Create Account
                            </Text>
                            <Text style={[styles.subtitleText, { color: "#e0e7ff" }]}>
                                Join Proxi and get started
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

                            <View style={styles.inputContainer}>
                                <Text style={[styles.label, { color: theme.text }]}>Confirm Password</Text>
                                <TextInput
                                    style={[styles.input, { 
                                        color: theme.title, 
                                        borderColor: theme.borderColor,
                                        backgroundColor: theme.cardBackground || "#ffffff"
                                    }]}
                                    placeholder="Confirm password"
                                    placeholderTextColor={theme.text + "80"}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.button, (isLoading || loading) && styles.buttonDisabled]}
                                onPress={handleSignup}
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
                                            Sign Up
                                        </Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <View style={styles.signinContainer}>
                                <Link href="/" asChild>
                                    <TouchableOpacity>
                                        <Text style={[styles.signinText, { color: theme.text }]}>
                                            Already have an account?{" "}
                                            <Text style={{ color: Colors.primary, fontWeight: "600" }}>
                                                Sign in
                                            </Text>
                                        </Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        </View>
                    </View>
                </ScrollView>
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
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingVertical: 20,
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
    titleText: {
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
    signinContainer: {
        alignItems: "center",
        marginTop: 8,
    },
    signinText: {
        fontSize: 14,
        textAlign: "center",
    },
});
