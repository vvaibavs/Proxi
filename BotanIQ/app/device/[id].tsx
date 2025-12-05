import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, useColorScheme, View, ActivityIndicator, Alert, Button, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";


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
    const [laptop, setLaptop] = useState(0)
    const [tv, setTv] = useState(0)
    const [tablet, setTablet] = useState(0)
    const [cellphone, setCellphone] = useState(0)

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
        const specResponse = await fetch(`${API_BASE_URL}/devices/${deviceID}/getSpecificTime`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        const specData = await specResponse.json()
        setLaptop(specData.specificTimes["laptop"])
        setTv(specData.specificTimes["tv"])
        setTablet(specData.specificTimes["tablet"])
        setCellphone(specData.specificTimes["cellphone"])

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

            if (label === "laptop" || label === "tv" || label === "tablet" || label === "cell phone") {

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

                const specTime = await fetch(`${API_BASE_URL}/devices/${deviceID}/getSpecificTime`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                const specData = await specTime.json()
                const normalizedLabel = label.replace(" ", "")
                console.log(specData.specificTimes[normalizedLabel])

                specData.specificTimes[normalizedLabel] += 1


                const updateSpec = await fetch(`${API_BASE_URL}/devices/${deviceID}/putSpecificTime`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        updatedTimes: specData.specificTimes
                    })
                })

                const updatedSpec = await updateSpec.json()
                await getTime();

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
            <SafeAreaProvider>
                <LinearGradient
                    colors={[theme.gradientStart, theme.gradientEnd]}
                    style={{ flex: 1 }}
                >
                    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#ffffff" />
                        <Text style={{ marginTop: 16, fontSize: 16, color: "#e0e7ff", opacity: 0.9 }}>
                            Loading device data...
                        </Text>
                    </SafeAreaView>
                </LinearGradient>
            </SafeAreaProvider>
        );
    }

    const formatSeconds = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };
    const chartData = [laptop, tv, tablet, cellphone].map(d => +(d / 60).toFixed(2)) // convert seconds to minutes
    const labels = ["Laptop", "TV", "Tablet", "Phone"];


    return (
            <SafeAreaProvider>
                <LinearGradient
                    colors={[theme.gradientStart, theme.gradientEnd]}
                    style={{ flex: 1 }}
                >
                    <SafeAreaView style={{ flex: 1 }}>
                        <ScrollView 
                            style={{ padding: 20 }}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* HEADER */}
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 30,
                            }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{
                                        fontSize: 36,
                                        fontWeight: "700",
                                        color: "#ffffff",
                                        marginBottom: 4,
                                    }}>
                                        Demo Device
                                    </Text>
                                    <Text style={{
                                        fontSize: 16,
                                        color: "#e0e7ff",
                                        opacity: 0.8,
                                    }}>
                                        Monitoring & Insights
                                    </Text>
                                </View>

                                <Pressable
                                    onPress={() => setSettingsVisible(true)}
                                    style={{
                                        padding: 12,
                                        borderRadius: 28,
                                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                                        borderWidth: 2,
                                        borderColor: "rgba(255, 255, 255, 0.3)",
                                    }}
                                >
                                    <Ionicons name="settings-outline" size={24} color="#ffffff" />
                                </Pressable>
                            </View>

                            {/* SCREEN TIME CARD */}
                            <View style={{
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                padding: 24,
                                borderRadius: 24,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 12,
                                elevation: 5,
                                marginBottom: 20,
                                borderWidth: 1,
                                borderColor: "rgba(59, 130, 246, 0.2)",
                            }}>
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 16,
                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        fontWeight: "700",
                                        color: theme.title,
                                    }}>
                                        Screen Time Today
                                    </Text>
                                    <View style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        backgroundColor: Colors.primary + "20",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                        <Ionicons name="time-outline" size={20} color={Colors.primary} />
                                    </View>
                                </View>

                                <LinearGradient
                                    colors={[Colors.primary + "15", Colors.primaryLight + "10"]}
                                    style={{
                                        height: 160,
                                        borderRadius: 20,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: 12,
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 48,
                                        fontWeight: "700",
                                        color: Colors.primary,
                                    }}>
                                        {convertSecondsToMinutes(time)}
                                    </Text>
                                </LinearGradient>

                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    paddingTop: 12,
                                    borderTopWidth: 1,
                                    borderTopColor: theme.borderColor,
                                }}>
                                    <Text style={{
                                        color: theme.text,
                                        fontSize: 14,
                                        opacity: 0.7,
                                    }}>
                                        Max Allowed:
                                    </Text>
                                    <Text style={{
                                        color: Colors.primary,
                                        fontSize: 16,
                                        fontWeight: "600",
                                    }}>
                                        {convertSecondsToMinutes(maxTime)}
                                    </Text>
                                </View>
                            </View>

                            {/* HISTORICAL CARD */}
                            <View style={{
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                padding: 24,
                                borderRadius: 24,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 12,
                                elevation: 5,
                                borderWidth: 1,
                                borderColor: "rgba(59, 130, 246, 0.2)",
                            }}>
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 16,
                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        fontWeight: "700",
                                        color: theme.title,
                                    }}>
                                        Historical Trends
                                    </Text>
                                    <View style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        backgroundColor: Colors.primary + "20",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                        <Ionicons name="bar-chart-outline" size={20} color={Colors.primary} />
                                    </View>
                                </View>

                                <View style={{
                                    backgroundColor: "#f8fafc",
                                    borderRadius: 16,
                                    paddingVertical: 16,
                                    paddingHorizontal: 8,
                                    alignItems: "center",
                                }}>
                                    <BarChart
                                        data={{
                                            labels,
                                            datasets: [{ data: chartData }]
                                        }}
                                        width={Dimensions.get("window").width - 96}
                                        height={220}
                                        fromZero={true}
                                        showValuesOnTopOfBars={true}
                                        chartConfig={{
                                            backgroundColor: "#f8fafc",
                                            backgroundGradientFrom: "#f8fafc",
                                            backgroundGradientTo: "#f8fafc",
                                            decimalPlaces: 1,
                                            color: (opacity = 1) => Colors.primary,
                                            labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
                                            barPercentage: 0.7,
                                        }}
                                        style={{
                                            borderRadius: 12,
                                        }}
                                    />
                                </View>
                            </View>
                        </ScrollView>

                        {/* SETTINGS MODAL */}
                        <Modal visible={settingsVisible} transparent animationType="fade">
                            <View style={{
                                flex: 1,
                                backgroundColor: "rgba(0,0,0,0.5)",
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <View style={{
                                    width: "85%",
                                    maxWidth: 400,
                                    padding: 28,
                                    backgroundColor: "#ffffff",
                                    borderRadius: 24,
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 10 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 20,
                                    elevation: 10,
                                }}>
                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: 20,
                                    }}>
                                        <Text style={{
                                            fontSize: 24,
                                            fontWeight: "700",
                                            color: theme.title,
                                        }}>
                                            Settings
                                        </Text>
                                        <Pressable onPress={() => setSettingsVisible(false)}>
                                            <Ionicons name="close-circle" size={28} color={theme.text} />
                                        </Pressable>
                                    </View>

                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: "600",
                                        color: theme.text,
                                        marginBottom: 8,
                                    }}>
                                        Set Max Screen Time (seconds)
                                    </Text>

                                    <TextInput
                                        value={settingsText}
                                        onChangeText={setSettingsText}
                                        keyboardType="numeric"
                                        placeholder="Enter seconds..."
                                        placeholderTextColor={theme.text + "60"}
                                        style={{
                                            backgroundColor: "#f8fafc",
                                            padding: 16,
                                            borderRadius: 12,
                                            marginBottom: 24,
                                            borderWidth: 1.5,
                                            borderColor: theme.borderColor,
                                            color: theme.title,
                                            fontSize: 16,
                                        }}
                                    />

                                    <Pressable
                                        onPress={() => {
                                            submitMaxTime();
                                            setSettingsVisible(false);
                                        }}
                                        style={{
                                            backgroundColor: Colors.primary,
                                            padding: 16,
                                            borderRadius: 12,
                                            alignItems: "center",
                                            marginBottom: 12,
                                            shadowColor: Colors.primary,
                                            shadowOffset: { width: 0, height: 4 },
                                            shadowOpacity: 0.3,
                                            shadowRadius: 8,
                                            elevation: 5,
                                        }}
                                    >
                                        <Text style={{
                                            color: "#fff",
                                            fontSize: 16,
                                            fontWeight: "600",
                                        }}>
                                            Save Settings
                                        </Text>
                                    </Pressable>

                                    <Pressable
                                        onPress={() => setSettingsVisible(false)}
                                        style={{
                                            padding: 12,
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text style={{
                                            color: Colors.primary,
                                            fontSize: 15,
                                            fontWeight: "500",
                                        }}>
                                            Cancel
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        </Modal>
                    </SafeAreaView>
                </LinearGradient>
            </SafeAreaProvider>
    );
}
