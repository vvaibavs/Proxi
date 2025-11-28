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
    const [tooClose, setTooClose] = useState(false)

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
            if (!detectionData.screenType) return;
            setTooClose(detectionData.tooClose)
            // console.log(apiData)
            // if(detectionData.object[0] == apiData) {
            //     console.log('same object')
            //     return;
            // }
            const label = detectionData.screenType;

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

    const addNotification = async (notif: String) => {
        try {
            const updateRes = await fetch(`${API_BASE_URL}/setNotifications`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    notification: notif
                })
            })

            const data = await updateRes.json()
            console.log(data)
        } catch (err) {
            console.log(err)
        }
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
            alert('the time has exceeded')        }
            addNotification("time has been exceeded")
    }, [exceeded])

    useEffect(() => {
        if(tooClose) {
            alert('too close')
        }
    }, [tooClose])



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
                    <ScrollView style={{ padding: 20 }}>

                        {/* HEADER */}
                        <View className="flex-row justify-between items-center mb-6">
                            <View>
                                <Text className="text-4xl font-extrabold" style={{ color: theme.title }}>
                                    Demo Device
                                </Text>
                                <Text className="text-base opacity-60 mt-1" style={{ color: theme.text }}>
                                    Monitoring & Insights
                                </Text>
                            </View>

                            <Pressable
                                onPress={() => setSettingsVisible(true)}
                                style={{
                                    padding: 10,
                                    borderRadius: 50,
                                    backgroundColor: theme.uiBackground,
                                    shadowColor: "#000",
                                    shadowOpacity: 0.15,
                                    shadowRadius: 4,
                                }}
                            >
                                <Ionicons name="settings-outline" size={24} color={theme.title} />
                            </Pressable>
                        </View>

                        {/* SCREEN TIME CARD */}
                        <View
                            style={{
                                backgroundColor: theme.uiBackground,
                                padding: 20,
                                borderRadius: 20,
                                shadowColor: "#000",
                                shadowOpacity: 0.07,
                                shadowRadius: 10,
                                marginBottom: 20,
                            }}
                        >
                            <Text className="text-xl font-semibold mb-3" style={{ color: theme.title }}>
                                Screen Time Today
                            </Text>

                            <View
                                style={{
                                    backgroundColor: theme.background,
                                    height: 140,
                                    borderRadius: 16,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Text className="text-4xl font-bold" style={{ color: theme.text }}>
                                    {convertSecondsToMinutes(time)}
                                </Text>
                            </View>

                            <Text style={{ color: theme.text, opacity: 0.6, marginTop: 10 }}>
                                Max Allowed: {convertSecondsToMinutes(maxTime)}
                            </Text>
                        </View>

                        {/* HISTORICAL CARD */}
                        <View
                            style={{
                                backgroundColor: theme.uiBackground,
                                padding: 20,
                                borderRadius: 20,
                                shadowColor: "#000",
                                shadowOpacity: 0.07,
                                shadowRadius: 10,
                            }}
                        >
                            <Text className="text-xl font-semibold mb-3" style={{ color: theme.title }}>
                                Historical Trends
                            </Text>

                            <View
                                style={{
                                    backgroundColor: theme.background,
                                    height: 160,
                                    borderRadius: 16,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{ color: theme.text, opacity: 0.5 }}>
                                    Graph coming soon...
                                </Text>
                            </View>
                        </View>

                    </ScrollView>

                    {/* SETTINGS MODAL */}
                    <Modal visible={settingsVisible} transparent animationType="fade">
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: "rgba(0,0,0,0.4)",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <View
                                style={{
                                    width: "85%",
                                    padding: 25,
                                    backgroundColor: theme.uiBackground,
                                    borderRadius: 20,
                                }}
                            >
                                <Text className="text-2xl font-bold mb-4" style={{ color: theme.title }}>
                                    Settings
                                </Text>

                                <Text className="mb-2" style={{ color: theme.text }}>
                                    Set Max Screen Time (seconds)
                                </Text>

                                <TextInput
                                    value={settingsText}
                                    onChangeText={setSettingsText}
                                    keyboardType="numeric"
                                    placeholder="Enter seconds..."
                                    style={{
                                        backgroundColor: theme.background,
                                        padding: 12,
                                        borderRadius: 12,
                                        marginBottom: 20,
                                        borderWidth: 1,
                                        borderColor: "#ddd",
                                        color: theme.text,
                                    }}
                                />

                                <Pressable
                                    onPress={submitMaxTime}
                                    style={{
                                        backgroundColor: Colors.primary,
                                        padding: 14,
                                        borderRadius: 12,
                                        alignItems: "center",
                                        marginBottom: 10
                                    }}
                                >
                                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                                        Save
                                    </Text>
                                </Pressable>

                                <Pressable onPress={() => setSettingsVisible(false)}>
                                    <Text style={{ color: Colors.primary, fontSize: 16, textAlign: "center" }}>
                                        Close
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                </SafeAreaView>
            </SafeAreaProvider>
    );
}
