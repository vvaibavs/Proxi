// Updated Notification Page UI (React Native / Expo)
// Modern, functional, production-quality design

import { View, Text, TouchableOpacity, ScrollView, useColorScheme, ActivityIndicator, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

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
            <View style={styles.header}>
              <View>
                <Text style={styles.headerTitle}>Notifications</Text>
                <Text style={styles.headerSubtitle}>
                  {notifs.length} {notifs.length === 1 ? "alert" : "alerts"}
                </Text>
              </View>
              <View style={styles.iconContainer}>
                <Ionicons name="notifications" size={28} color="#ffffff" />
              </View>
            </View>

            {/* CLEAR ALL BUTTON */}
            {notifs.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={18} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
            )}

            {/* LOADING STATE */}
            {loading && (
              <View style={styles.emptyContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={styles.emptyText}>Loading notifications...</Text>
              </View>
            )}

            {/* EMPTY STATE */}
            {!loading && notifs.length === 0 && (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <Ionicons
                    name="mail-unread-outline"
                    size={48}
                    color="#ffffff"
                  />
                </View>
                <Text style={styles.emptyTitle}>No notifications yet</Text>
                <Text style={styles.emptySubtitle}>
                  You'll see alerts and updates here
                </Text>
              </View>
            )}

            {/* NOTIFICATION LIST */}
            <View style={{ marginTop: 8 }}>
              {notifs.map((n, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.notificationCard}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[Colors.primary + "20", Colors.primaryLight + "10"]}
                    style={styles.iconGradient}
                  >
                    <Ionicons name="alert-circle" size={24} color={Colors.primary} />
                  </LinearGradient>

                  <View style={{ flexShrink: 1, flex: 1 }}>
                    <Text style={styles.notificationTitle}>
                      Alert
                    </Text>
                    <Text style={styles.notificationText}>{n}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#e0e7ff",
    opacity: 0.8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginBottom: 15,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  clearButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 24,
    alignItems: "center",
    marginTop: 20,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyText: {
    marginTop: 16,
    color: "#e0e7ff",
    fontSize: 16,
    opacity: 0.9,
  },
  emptySubtitle: {
    color: "#e0e7ff",
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
  notificationCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 18,
    borderRadius: 20,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationTitle: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  notificationText: {
    color: "#1e293b",
    fontSize: 15,
    lineHeight: 22,
  },
});
