import { View, Text, TouchableOpacity, ScrollView, useColorScheme, Alert, Button, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { Link, router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

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
    <SafeAreaProvider>
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View style={{ padding: 20 }}>
              {/* Header */}
              <View style={{ 
                flexDirection: "row", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginBottom: 30 
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ 
                    fontSize: 36, 
                    fontWeight: "700", 
                    color: "#ffffff",
                    marginBottom: 4
                  }}>
                    Dashboard
                  </Text>
                  {user && (
                    <Text style={{ 
                      fontSize: 16, 
                      color: "#e0e7ff",
                      opacity: 0.9
                    }}>
                      Welcome back, <Text style={{ fontWeight: "600" }}>{user.username}</Text>
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={handleLogout}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 12,
                    backgroundColor: Colors.error,
                    shadowColor: Colors.error,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={{ color: "#ffffff", fontWeight: "600", fontSize: 14 }}>
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Devices Section */}
              <View style={{ 
                flexDirection: "row", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginBottom: 20 
              }}>
                <Text style={{ 
                  fontSize: 24, 
                  fontWeight: "700", 
                  color: "#ffffff"
                }}>
                  Connected Devices
                </Text>

                <TouchableOpacity
                  onPress={addDevice}
                  disabled={loading}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 12,
                    backgroundColor: loading ? Colors.primaryLight : Colors.primary,
                    shadowColor: Colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5,
                    opacity: loading ? 0.7 : 1,
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={{ color: "#ffffff", fontWeight: "600", fontSize: 14 }}>
                    {loading ? "Adding..." : "Add Device"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Device List */}
              {loading ? (
                <View style={{ 
                  alignItems: "center", 
                  paddingVertical: 60,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 20,
                  marginTop: 10,
                }}>
                  <ActivityIndicator size="large" color="#ffffff" />
                  <Text style={{ 
                    marginTop: 16, 
                    color: "#e0e7ff",
                    fontSize: 16,
                    opacity: 0.9
                  }}>
                    Loading devices...
                  </Text>
                </View>
              ) : devices.length === 0 ? (
                <View style={{ 
                  alignItems: "center", 
                  paddingVertical: 60,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 20,
                  marginTop: 10,
                }}>
                  <Text style={{ 
                    fontSize: 20, 
                    fontWeight: "600", 
                    color: "#ffffff",
                    marginBottom: 8
                  }}>
                    No devices connected
                  </Text>
                  <Text style={{ 
                    fontSize: 14, 
                    color: "#e0e7ff",
                    opacity: 0.8,
                    textAlign: "center"
                  }}>
                    Tap "Add Device" to get started
                  </Text>
                </View>
              ) : (
                <View
                  style={{ 
                    flexDirection: "row", 
                    flexWrap: "wrap", 
                    justifyContent: "space-between" 
                  }}
                >
                  {devices.map((device, index) => (
                    <Link
                      key={device.deviceId || index}
                      href={`/device/${device.deviceId}`}
                      asChild
                    >
                      <TouchableOpacity
                        style={{
                          width: "48%",
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          borderRadius: 20,
                          padding: 20,
                          marginBottom: 16,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.1,
                          shadowRadius: 12,
                          elevation: 5,
                          borderWidth: 1,
                          borderColor: "rgba(59, 130, 246, 0.2)",
                        }}
                        activeOpacity={0.8}
                      >
                        <View style={{
                          width: 48,
                          height: 48,
                          borderRadius: 24,
                          backgroundColor: Colors.primary + "20",
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: 12,
                        }}>
                          <Text style={{
                            fontSize: 24,
                            color: Colors.primary,
                          }}>
                            📱
                          </Text>
                        </View>
                        <Text
                          style={{ 
                            fontSize: 18, 
                            fontWeight: "600", 
                            color: theme.title,
                            marginBottom: 8
                          }}
                        >
                          {device.deviceName}
                        </Text>
                        <Text style={{ 
                          fontSize: 14, 
                          color: Colors.primary,
                          fontWeight: "500"
                        }}>
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
      </LinearGradient>
    </SafeAreaProvider>
    );
}
