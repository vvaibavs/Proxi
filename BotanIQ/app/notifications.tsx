import { View, Text, TouchableOpacity, ScrollView, useColorScheme, Alert, Button, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { Link, router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";


export default function Notification() {
    const colorScheme = useColorScheme();
    const theme = Colors["light"];
    const { user, logout, token } = useAuth();
    const [notifs, setNotifs] = useState([])

    const API_BASE_URL = 'http://localhost:3000/api';

    const getNotifications = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/getNotifications`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            const data = await response.json()
            const notific = await data.notifications
            setNotifs(notific)
        } catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getNotifications()
    },[token])

    return (
        <SafeAreaProvider style={{ backgroundColor: theme.background }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ padding: 20 }}>

                    {/* HEADER */}
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-4xl font-extrabold" style={{ color: theme.title }}>
                            Notifications
                        </Text>
                        <Ionicons name="notifications-outline" size={28} color={theme.title} />
                    </View>

                    {/* NOTIFICATION LIST */}
                    <View style={{ marginTop: 5 }}>
                        {notifs?.length === 0 && (
                            <View
                                style={{
                                    padding: 30,
                                    backgroundColor: theme.uiBackground,
                                    borderRadius: 18,
                                    alignItems: "center",
                                    shadowColor: "#000",
                                    shadowOpacity: 0.07,
                                    shadowRadius: 8,
                                }}
                            >
                                <Ionicons
                                    name="mail-unread-outline"
                                    size={42}
                                    color={theme.text}
                                    style={{ opacity: 0.5, marginBottom: 10 }}
                                />
                                <Text style={{ color: theme.text, opacity: 0.6, fontSize: 16 }}>
                                    No notifications yet
                                </Text>
                            </View>
                        )}

                        {notifs?.map((n, i) => (
                            <View
                                key={i}
                                style={{
                                    backgroundColor: theme.uiBackground,
                                    padding: 18,
                                    borderRadius: 16,
                                    marginBottom: 12,
                                    shadowColor: "#000",
                                    shadowOpacity: 0.08,
                                    shadowRadius: 6,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 12,
                                }}
                            >
                                <View
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        backgroundColor: Colors.primary,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        shadowColor: "#000",
                                        shadowOpacity: 0.1,
                                        shadowRadius: 5,
                                    }}
                                >
                                    <Ionicons name="alert-circle-outline" size={20} color="#fff" />
                                </View>

                                <Text
                                    style={{
                                        color: theme.text,
                                        fontSize: 16,
                                        flexShrink: 1,
                                        lineHeight: 22,
                                    }}
                                >
                                    {n}
                                </Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );

}
