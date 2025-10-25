import { View, Text, ScrollView, useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import { useLocalSearchParams } from "expo-router";

export default function DevicePage() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];
    const { id } = useLocalSearchParams();

    // Mock device data based on ID
    const getDeviceData = (deviceId: string) => {
        const devices = {
            "1": { name: "Living Room Sensor", type: "Temperature", status: "Online" },
            "2": { name: "Kitchen Monitor", type: "Humidity", status: "Online" },
            "3": { name: "Garden Controller", type: "Irrigation", status: "Offline" },
            "4": { name: "Greenhouse Panel", type: "Lighting", status: "Online" },
        };
        return devices[deviceId as keyof typeof devices] || { name: "Unknown Device", type: "Unknown", status: "Offline" };
    };

    const device = getDeviceData(id as string);

    return (
        <SafeAreaProvider style={{ backgroundColor: theme.background }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>
                    <View className="p-5">
                        {/* Header */}
                        <View className="mb-6">
                            <Text className="text-3xl font-bold mb-2" style={{ color: theme.title }}>
                                {device.name}
                            </Text>
                            <Text className="text-lg" style={{ color: theme.text }}>
                                {device.type} • Device ID: {id}
                            </Text>
                            <View className="flex-row items-center mt-2">
                                <View
                                    className={`w-3 h-3 rounded-full mr-2 ${
                                        device.status === 'Online' ? 'bg-green-500' : 'bg-red-500'
                                    }`}
                                />
                                <Text style={{ color: theme.text }}>
                                    {device.status}
                                </Text>
                            </View>
                        </View>

                        {/* Data Visualization Section */}
                        <View className="space-y-6">
                            <Text className="text-xl font-semibold mb-4" style={{ color: theme.title }}>
                                Data Visualization
                            </Text>

                            {/* Real-time Data Graph */}
                            <View
                                className="rounded-lg p-6 border-2 border-dashed"
                                style={{
                                    backgroundColor: theme.uiBackground,
                                    borderColor: theme.text + '40'
                                }}
                            >
                                <Text className="text-lg font-semibold mb-3" style={{ color: theme.title }}>
                                    Real-time Data
                                </Text>
                                <View
                                    className="h-48 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: theme.background }}
                                >
                                    <Text style={{ color: theme.text, opacity: 0.6 }}>
                                        📊 Graph will display real-time {device.type.toLowerCase()} data
                                    </Text>
                                </View>
                            </View>

                            {/* Historical Data Graph */}
                            <View
                                className="rounded-lg p-6 border-2 border-dashed"
                                style={{
                                    backgroundColor: theme.uiBackground,
                                    borderColor: theme.text + '40'
                                }}
                            >
                                <Text className="text-lg font-semibold mb-3" style={{ color: theme.title }}>
                                    Historical Trends
                                </Text>
                                <View
                                    className="h-48 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: theme.background }}
                                >
                                    <Text style={{ color: theme.text, opacity: 0.6 }}>
                                        📈 Historical data chart will appear here
                                    </Text>
                                </View>
                            </View>

                            {/* Data Summary Cards */}
                            <View className="flex-row space-x-4">
                                <View
                                    className="flex-1 rounded-lg p-4"
                                    style={{ backgroundColor: theme.uiBackground }}
                                >
                                    <Text className="text-sm font-medium mb-1" style={{ color: theme.text }}>
                                        Current Value
                                    </Text>
                                    <Text className="text-2xl font-bold" style={{ color: theme.title }}>
                                        --°C
                                    </Text>
                                </View>
                                <View
                                    className="flex-1 rounded-lg p-4"
                                    style={{ backgroundColor: theme.uiBackground }}
                                >
                                    <Text className="text-sm font-medium mb-1" style={{ color: theme.text }}>
                                        Average (24h)
                                    </Text>
                                    <Text className="text-2xl font-bold" style={{ color: theme.title }}>
                                        --°C
                                    </Text>
                                </View>
                            </View>

                            {/* Additional Metrics */}
                            <View
                                className="rounded-lg p-6 border-2 border-dashed"
                                style={{
                                    backgroundColor: theme.uiBackground,
                                    borderColor: theme.text + '40'
                                }}
                            >
                                <Text className="text-lg font-semibold mb-3" style={{ color: theme.title }}>
                                    Additional Metrics
                                </Text>
                                <View
                                    className="h-32 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: theme.background }}
                                >
                                    <Text style={{ color: theme.text, opacity: 0.6 }}>
                                        📋 Additional sensor data and analytics
                                    </Text>
                                </View>
                            </View>

                            {/* Backend Connection Status */}
                            <View
                                className="rounded-lg p-4 border"
                                style={{
                                    backgroundColor: theme.uiBackground,
                                    borderColor: theme.text + '20'
                                }}
                            >
                                <Text className="text-sm font-medium mb-2" style={{ color: theme.title }}>
                                    Backend Connection
                                </Text>
                                <View className="flex-row items-center">
                                    <View className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                                    <Text style={{ color: theme.text }}>
                                        Waiting for backend connection...
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
