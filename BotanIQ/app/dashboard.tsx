import { View, Text, TouchableOpacity, ScrollView, useColorScheme, Alert, Button, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { Link, router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
    const colorScheme = useColorScheme();
    const theme = Colors["light"];
    const { user, logout, token } = useAuth();
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        await logout();
                        router.replace("/");
                    }
                }
            ]
        );
    };
    const API_BASE_URL = 'http://localhost:3000/api';

    // Fetch user's devices
    const fetchDevices = async () => {
        if (!token) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/devices`, {
                method: "GET",
                headers: {
                    // token for authorization
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                setDevices(data.devices || []);
            } else {
                console.error("Failed to fetch devices:", data.error);
            }
        } catch (error) {
            console.error('Fetch devices error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load devices when component mounts
    useEffect(() => {
        fetchDevices();
    }, [token]);

    const addDevice = async () => {
        console.log("Add Device");
        if (!token) {
            Alert.alert("Error", "You must be logged in to add devices");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/addDevices`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    deviceId: "TEMP001",
                    deviceName: "Temperature Sensor 1",
                    deviceType: "Temperature",
                    location: "Greenhouse A"
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Device added successfully!");
                console.log("Device added:", data);
                // Refresh the devices list
                fetchDevices();
            } else {
                Alert.alert("Error", data.error || "Failed to add device");
                console.error("Add device error:", data);
            }
        } catch (error) {
            console.error('Add device error:', error);
            Alert.alert("Error", "Network error. Please check your connection.");
        }
    };

    return (
        <SafeAreaProvider style={{ backgroundColor: theme.background }}>
            <SafeAreaView>
                <ScrollView>
                    <View className="p-5">
                        <View className="flex-row justify-between items-center mb-6">
                            <View>
                                <Text className="text-3xl font-bold" style={{ color: theme.title }}>
                                    Dashboard
                                </Text>
                                {user && (
                                    <Text className="text-lg" style={{ color: theme.text }}>
                                        Welcome, {user.username}!
                                    </Text>
                                )}
                            </View>
                            <TouchableOpacity
                                onPress={handleLogout}
                                className="bg-red-500 px-4 py-2 rounded-md"
                            >
                                <Text className="text-white font-semibold">Logout</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-xl font-semibold" style={{ color: theme.title }}>
                                Connected Devices
                            </Text>
                            <TouchableOpacity
                                onPress={addDevice}
                                className="bg-blue-500 px-4 py-2 rounded-md"
                                disabled={loading}
                            >
                                <Text className="text-white font-semibold">
                                    {loading ? "Adding..." : "Add Device"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {loading ? (
                            <View className="items-center py-8">
                                <ActivityIndicator size="large" color={theme.text} />
                                <Text className="mt-2" style={{ color: theme.text }}>
                                    Loading devices...
                                </Text>
                            </View>
                        ) : devices.length === 0 ? (
                            <View className="items-center py-8">
                                <Text className="text-lg" style={{ color: theme.text }}>
                                    No devices connected
                                </Text>
                                <Text className="text-sm mt-2" style={{ color: theme.text }}>
                                    Tap "Add Device" to get started
                                </Text>
                            </View>
                        ) : (
                            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
                                {devices.map((device, index) => (
                                    <Link
                                    key={device.deviceId || index}
                                    href={`/device/${device.deviceId}`}
                                    asChild
                                    >
                                    <TouchableOpacity
                                        style={{
                                        backgroundColor: theme.uiBackground,
                                        borderColor: theme.text + "20",
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        padding: 16,
                                        marginBottom: 12,
                                        width: "48%", // ✅ makes two per row
                                        }}
                                    >
                                        <View style={{ justifyContent: "space-between" }}>
                                        <Text
                                            style={{
                                            color: theme.title,
                                            fontWeight: "600",
                                            fontSize: 16,
                                            marginBottom: 4,
                                            }}
                                        >
                                            {device.deviceName}
                                        </Text>
                                        
                                        </View>
                                    </TouchableOpacity>
                                    </Link>
                                ))}
                            </View>

                        )}


                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
