import { View, Text, TouchableOpacity, ScrollView, useColorScheme, Alert, Button, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { Link, router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";


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
        <SafeAreaView>
            <ScrollView>
                <View className="p-5">
                    <View className="flex-row justify-between items-center mb-6">
                        <View>
                            <Text className="text-3xl font-bold" style={{ color: theme.title }}>
                                Notifications
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row justify-between items-center mb-4">

                        <View
                            className="px-4 py-2 rounded-md"
                        >
                            {notifs?.map((n, i) => (
                                <View className="bg-blue-500 px-4 py-2 rounded-md m-4" key={i}>{n}</View>
                            ))}

                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    </SafeAreaProvider>
    )
}
