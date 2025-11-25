import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, useColorScheme, View, ActivityIndicator, Alert, Button } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native";


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
    const theme = Colors["light"];
    const { id } = useLocalSearchParams();
    const { token } = useAuth();

    const [deviceData, setDeviceData] = useState<Device | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [time, setTime] = useState(0)
    const [apiData, setApiData] = useState()
    const [maxTime, setMaxTime] = useState(999999999)
    const[exceeded, setExceeded] = useState(false)
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [settingsText, setSettingsText] = useState("")

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

        await getMaxTime()
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
        try {
            // 1. Fetch from your object detection API
            const detectionRes = await fetch("http://127.0.0.1:5000/last-detection");
            const detectionData = await detectionRes.json();

            // 2. Only run if object detected
            if (!detectionData.objects[0]) return;
            // console.log(apiData)
            // if(detectionData.object[0] == apiData) {
            //     console.log('same object')
            //     return;
            // }
            const label = detectionData.objects[0].label;

            if (label === "laptop" || label === "tv") {

                // 3. GET the latest time before updating
                const timeRes = await fetch(`${API_BASE_URL}/devices/${deviceID}/getTime`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const timeData = await timeRes.json();

                const updatedTime = timeData.time + 1;
                // setApiData(detectionData.object[0])
                // console.log(apiData)

                // 4. Update
                const updateRes = await fetch(`${API_BASE_URL}/devices/${deviceID}/putTime`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        screenTime: updatedTime
                    })
                });

                const updated = await updateRes.json();
                console.log("Updated time:", updated.device.screenTime);

                // 5. update local UI state
                setTime(updated.device.screenTime);
            }
        } catch (err) {
            console.error("Screen time update error:", err);
        }
    };

    const submitMaxTime = async () => {
        const updateRes = await fetch(`${API_BASE_URL}/devices/${deviceID}/setMaxTime`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                maxTime: parseInt(settingsText)
            })
        })
    }

    const getMaxTime = async () => {
        const response = await fetch(`${API_BASE_URL}/devices/${deviceID}/getMaxTime`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json()
        setMaxTime(data.maxTime)
    }


    useEffect(() => {
        if (deviceID && token) {
            getDeviceData();
        }
    }, [deviceID, token, maxTime]);


    useEffect(() => {
        if (deviceID && token) {
            const interval = setInterval(() => {
                screenTime();
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [deviceID, token]);
    useEffect(() => {
        if (deviceData && token) {
            getTime();
        }
    }, [deviceData, token]);

    useEffect(() => {
        if(time>maxTime) {
            setExceeded(true)
        }
    }, [time, maxTime])
    useEffect(() => {
        if(exceeded) {
            alert('the time has exceeded')
        }
    }, [exceeded])



    const convertSecondsToMinutes = (totalSeconds: any) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes} min ${seconds} sec`;
    };

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
                                Demo Device
                            </Text>
                            <Pressable onPress={() => setSettingsVisible(true)}>
                                <Ionicons name="settings-outline" size={28} color={theme.title} />
                            </Pressable>

                        </View>

                        {/* Data Visualization Section */}
                        <View className="space-y-6">
                            <Text className="text-xl font-semibold mb-4" style={{ color: theme.title }}>
                                Data
                            </Text>
                            {maxTime}
                            {/* Real-time Data Graph */}
                            <View
                                className="rounded-lg p-6 border-2"
                                style={{
                                    backgroundColor: theme.uiBackground,
                                    borderColor: theme.text + '40'
                                }}
                            >
                                <Text className="text-lg font-semibold mb-3" style={{ color: theme.title }}>
                                    Screen Time Today
                                </Text>
                                <View
                                    className="h-48 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: theme.background }}
                                >
                                    <Text style={{ color: theme.text }} className="text-3xl">
                                        {convertSecondsToMinutes(time)}
                                    </Text>
                                </View>
                            </View>

                            {/* Historical Data Graph */}
                            <View
                                className="rounded-lg p-6 border-2"
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
                        </View>
                    </View>
                    <Modal
                        visible={settingsVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setSettingsVisible(false)}
                    >
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: "rgba(0,0,0,0.3)",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <View
                                style={{
                                    width: "80%",
                                    padding: 20,
                                    borderRadius: 12,
                                    backgroundColor: theme.uiBackground
                                }}
                            >
                                <Text
                                    className="text-xl font-semibold mb-4"
                                    style={{ color: theme.title }}
                                >
                                    Settings
                                </Text>

                                {/* Whatever you want to put inside the modal */}
                                <Text>
                                    Set Max Time
                                </Text>
                                <TextInput
                                    value={settingsText}
                                    onChangeText={setSettingsText}>
                                </TextInput>
                                <Pressable
                                    onPress={submitMaxTime}
                                >
                                    submit
                                </Pressable>

                                <Pressable
                                    onPress={() => setSettingsVisible(false)}
                                    style={{
                                        marginTop: 10,
                                        padding: 10,
                                        alignSelf: "flex-end"
                                    }}
                                >
                                    <Text style={{ color: Colors.primary, fontSize: 16 }}>Close</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
