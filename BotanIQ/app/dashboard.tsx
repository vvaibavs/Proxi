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
                    deviceId: "random",
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="p-6">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-8">
              <View>
                <Text className="text-4xl font-bold tracking-tight" style={{ color: theme.title }}>
                  Dashboard
                </Text>
                {user && (
                  <Text className="text-lg mt-1 opacity-80" style={{ color: theme.text }}>
                    Welcome back, <Text className="font-semibold">{user.username}</Text>
                  </Text>
                )}
              </View>

              <TouchableOpacity
                onPress={handleLogout}
                className="px-4 py-2 rounded-xl shadow"
                style={{ backgroundColor: "#ef4444" }}
              >
                <Text className="text-white font-semibold">Logout</Text>
              </TouchableOpacity>
            </View>

            {/* Devices Section */}
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-2xl font-semibold" style={{ color: theme.title }}>
                Connected Devices
              </Text>

              <TouchableOpacity
                onPress={addDevice}
                disabled={loading}
                className="px-4 py-2 rounded-xl shadow"
                style={{ backgroundColor: loading ? "#93c5fd" : "#3b82f6" }}
              >
                <Text className="text-white font-semibold">
                  {loading ? "Adding..." : "Add Device"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Device List */}
            {loading ? (
              <View className="items-center py-10">
                <ActivityIndicator size="large" color={theme.text} />
                <Text className="mt-3 opacity-80" style={{ color: theme.text }}>
                  Loading devices...
                </Text>
              </View>
            ) : devices.length === 0 ? (
              <View className="items-center py-10">
                <Text className="text-xl font-medium" style={{ color: theme.text }}>
                  No devices connected
                </Text>
                <Text className="text-sm mt-2 opacity-70" style={{ color: theme.text }}>
                  Tap "Add Device" to get started
                </Text>
              </View>
            ) : (
              <View
                style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}
              >
                {devices.map((device, index) => (
                  <Link
                    key={device.deviceId || index}
                    href={`/device/${device.deviceId}`}
                    asChild
                  >
                    <TouchableOpacity
                      className="rounded-2xl p-5 mb-4 shadow"
                      style={{
                        width: "48%",
                        backgroundColor: theme.uiBackground,
                        borderWidth: 1,
                        borderColor: theme.text + "15",
                      }}
                    >
                      <Text
                        className="font-semibold text-lg mb-2"
                        style={{ color: theme.title }}
                      >
                        {device.deviceName}
                      </Text>

                      <Text className="opacity-60" style={{ color: theme.text }}>
                        View details →
                      </Text>
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
