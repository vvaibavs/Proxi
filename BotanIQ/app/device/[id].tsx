import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, useColorScheme, View, ActivityIndicator, Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

interface Device {
    deviceId: string;
    deviceName: string;
    deviceType: string;
    status: string;
    lastSeen: string;
    location: string;
    settings: Record<string, any>;
}

export default function DevicePage() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];
    const { id } = useLocalSearchParams();
    const { token } = useAuth();

    const [deviceData, setDeviceData] = useState<Device | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [time, setTime] = useState()
    const deviceID = id as string;
    const API_BASE_URL = 'http://localhost:3000/api';

    const getDeviceData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/devices/${deviceID}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch device data');
            }

            const data = await response.json();
            setDeviceData(data.device);
        } catch (err) {
            console.error('Error fetching device data:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch device data');
            Alert.alert('Error', 'Failed to load device data');
        } finally {
            setLoading(false);
        }
    };

    const getTime = async () => {
        const response = await fetch(`${API_BASE_URL}/devices/${deviceID}/getTime`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json()
        setTime(data.time)
        console.log(data)
    }

    const screenTime = async () => {

        // const response = await fetch("http://127.0.0.1:5000/last-detection")
        // const data = await response.json()
        // Console.log()
        // return data
        const id = '6923f03a64118c069446358e'
        const newTime = 567
        const response1 = await fetch(`${API_BASE_URL}/devices/${deviceID}/putTime`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                screenTime: newTime
            }),
        })

        const data1 = await response1.json();

    }

    useEffect(() => {
        if (deviceID && token) {
            getDeviceData();
        }
    }, [deviceID, token]);

    useEffect(() => {
        if (deviceData && token) {
            screenTime();
        }
    }, [deviceData, token]);
    useEffect(() => {
        if (deviceData && token) {
            getTime();
        }
    }, [deviceData, token]);


    if (loading) {
        return (
            <SafeAreaProvider style={{ backgroundColor: theme.background }}>
                <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text className="mt-4 text-lg" style={{ color: theme.text }}>
                        Loading device data...
                    </Text>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    // if (error || !deviceData) {
    //     return (
    //         <SafeAreaProvider style={{ backgroundColor: theme.background }}>
    //             <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //                 <Text className="text-lg text-center mb-4" style={{ color: theme.text }}>
    //                     {error || 'Device not found'}
    //                 </Text>
    //                 <Text
    //                     className="text-blue-500 underline"
    //                     onPress={getDeviceData}
    //                     style={{ color: Colors.primary }}
    //                     >
    //                     Try Again
    //                 </Text>
    //             </SafeAreaView>
    //         </SafeAreaProvider>
    //     );
    // }


    // useEffect(() => {
    //     // Console.log(ScreenTime())
    // })

    return (
        <SafeAreaProvider style={{ backgroundColor: theme.background }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>
                    <View className="p-5">
                        {/* Header */}
                        <View className="mb-6">
                            <Text className="text-3xl font-bold mb-2" style={{ color: theme.title }}>
                                {deviceData.deviceName}
                            </Text>
                            <Text className="text-lg" style={{ color: theme.text }}>
                                {deviceData.deviceType} • Device ID: {deviceData.deviceId}
                            </Text>
                            <View className="flex-row items-center mt-2">
                                <View
                                    className={`w-3 h-3 rounded-full mr-2 ${
                                        deviceData.status === 'Online' ? 'bg-green-500' :
                                        deviceData.status === 'Offline' ? 'bg-red-500' : 'bg-yellow-500'
                                    }`}
                                />
                                <Text style={{ color: theme.text }}>
                                    {deviceData.status}
                                </Text>
                            </View>
                            <Text className="text-sm mt-1" style={{ color: theme.text, opacity: 0.7 }}>
                                Last seen: {new Date(deviceData.lastSeen).toLocaleString()}
                            </Text>
                            <Text className="text-sm" style={{ color: theme.text, opacity: 0.7 }}>
                                Location: {deviceData.location}
                                {time}
                            </Text>
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
                                        {/* 📊 Graph will display real-time {device.type.toLowerCase()} data */}
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
                            {/* <View className="flex-row space-x-4">
                                <View
                                    className="flex-1 rounded-lg p-4"
                                    style={{ backgroundColor: theme.uiBackground }}
                                >
                                    <Text className="text-sm font-medium mb-1" style={{ color: theme.text }}>
                                        Device Type
                                    </Text>
                                    <Text className="text-2xl font-bold" style={{ color: theme.title }}>
                                        {deviceData.deviceType}
                                    </Text>
                                </View>
                                <View
                                    className="flex-1 rounded-lg p-4"
                                    style={{ backgroundColor: theme.uiBackground }}
                                >
                                    <Text className="text-sm font-medium mb-1" style={{ color: theme.text }}>
                                        Status
                                    </Text>
                                    <Text className="text-2xl font-bold" style={{ color: theme.title }}>
                                        {deviceData.status}
                                    </Text>
                                </View>
                            </View> */}

                            {/* Additional Metrics */}
                            {/* <View
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
                            </View> */}

                            {/* Device Settings */}
                            {/* {deviceData.settings && Object.keys(deviceData.settings).length > 0 && (
                                <View
                                    className="rounded-lg p-4 border"
                                    style={{
                                        backgroundColor: theme.uiBackground,
                                        borderColor: theme.text + '20'
                                    }}
                                >
                                    <Text className="text-sm font-medium mb-2" style={{ color: theme.title }}>
                                        Device Settings
                                    </Text>
                                    {Object.entries(deviceData.settings).map(([key, value]) => (
                                        <View key={key} className="flex-row justify-between items-center py-1">
                                            <Text style={{ color: theme.text }} className="capitalize">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                                            </Text>
                                            <Text style={{ color: theme.text, fontWeight: '500' }}>
                                                {String(value)}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )} */}

                            {/* Backend Connection Status */}
                    </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
