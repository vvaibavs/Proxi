import { View, Text, TouchableOpacity, ScrollView, useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { Link } from "expo-router";

export default function Dashboard() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    // Mock data for connected devices
    const connectedDevices = [
        { id: 1, name: "Living Room Sensor", type: "Temperature", status: "Online" },
        { id: 2, name: "Kitchen Monitor", type: "Humidity", status: "Online" },
        { id: 3, name: "Garden Controller", type: "Irrigation", status: "Offline" },
        { id: 4, name: "Greenhouse Panel", type: "Lighting", status: "Online" },
    ];

    return (
        <SafeAreaProvider style={{ backgroundColor: theme.background }}>
            <SafeAreaView>
                <ScrollView>
                    <View className="p-5">
                        <Text className="text-3xl font-bold mb-6" style={{ color: theme.title }}>
                            Dashboard
                        </Text>

                        <Text className="text-xl font-semibold mb-4" style={{ color: theme.title }}>
                            Connected Devices
                        </Text>

                        <View className="space-y-3">
                            {connectedDevices.map((device) => (
                                <Link
                                    key={device.id}
                                    href={`/device/${device.id}`}
                                    asChild
                                >
                                    <TouchableOpacity
                                        className="bg-white rounded-lg p-4 shadow-sm border"
                                        style={{
                                            backgroundColor: theme.uiBackground,
                                            borderColor: theme.text + '20'
                                        }}
                                    >
                                        <View className="flex-row justify-between items-center">
                                            <View className="flex-1">
                                                <Text
                                                    className="text-lg font-semibold mb-1"
                                                    style={{ color: theme.title }}
                                                >
                                                    {device.name}
                                                </Text>
                                                <Text
                                                    className="text-sm"
                                                    style={{ color: theme.text }}
                                                >
                                                    {device.type}
                                                </Text>
                                            </View>
                                            <View className="items-end">
                                                <View
                                                    className={`px-3 py-1 rounded-full ${
                                                        device.status === 'Online'
                                                            ? 'bg-green-100'
                                                            : 'bg-red-100'
                                                    }`}
                                                >
                                                    <Text
                                                        className={`text-xs font-medium ${
                                                            device.status === 'Online'
                                                                ? 'text-green-800'
                                                                : 'text-red-800'
                                                        }`}
                                                    >
                                                        {device.status}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </Link>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
