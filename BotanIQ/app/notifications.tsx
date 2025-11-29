// Updated Notification Page UI (React Native / Expo)
// Modern, functional, production-quality design

import { View, Text, TouchableOpacity, ScrollView, useColorScheme, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function Notification() {
  const colorScheme = useColorScheme();
  const theme = Colors["light"];
  const { token } = useAuth();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://localhost:3000/api";

  const getNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getNotifications`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setNotifs(data.notifications || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotifications();
  }, [token]);

  return (
    <SafeAreaProvider style={{ backgroundColor: theme.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ padding: 20 }}>
          {/* HEADER */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <Text style={{ fontSize: 34, fontWeight: "800", color: theme.title }}>Notifications</Text>

            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={28} color={theme.title} />
            </TouchableOpacity>
          </View>

          {/* CLEAR ALL BUTTON */}
          {notifs.length > 0 && (
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", alignSelf: "flex-end", marginBottom: 15 }}
            >
              <Ionicons name="trash-outline" size={18} color={Colors.primary} style={{ marginRight: 4 }} />
              <Text style={{ color: Colors.primary, fontSize: 15, fontWeight: "500" }}>Clear All</Text>
            </TouchableOpacity>
          )}

          {/* LOADING STATE */}
          {loading && (
            <View style={{ marginTop: 40, alignItems: "center" }}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={{ marginTop: 10, color: theme.text, opacity: 0.7 }}>Loading notifications...</Text>
            </View>
          )}

          {/* EMPTY STATE */}
          {!loading && notifs.length === 0 && (
            <View
              style={{
                padding: 30,
                backgroundColor: theme.uiBackground,
                borderRadius: 18,
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.07,
                shadowRadius: 8,
                marginTop: 20,
              }}
            >
              <Ionicons
                name="mail-unread-outline"
                size={42}
                color={theme.text}
                style={{ opacity: 0.5, marginBottom: 12 }}
              />

              <Text style={{ color: theme.text, opacity: 0.6, fontSize: 16 }}>No notifications yet</Text>
            </View>
          )}

          {/* NOTIFICATION LIST */}
          <View style={{ marginTop: 8 }}>
            {notifs.map((n, i) => (
              <TouchableOpacity
                key={i}
                style={{
                  backgroundColor: theme.uiBackground,
                  padding: 18,
                  borderRadius: 16,
                  marginBottom: 14,
                  shadowColor: "#000",
                  shadowOpacity: 0.08,
                  shadowRadius: 6,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                {/* ICON */}
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

                {/* TEXT */}
                <View style={{ flexShrink: 1 }}>
                  <Text style={{ color: theme.title, fontSize: 16, fontWeight: "600", marginBottom: 3 }}>
                    Alert
                  </Text>
                  <Text style={{ color: theme.text, fontSize: 15, lineHeight: 20 }}>{n}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
