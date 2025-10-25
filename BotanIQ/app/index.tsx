import { Link } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";

export default function Index() {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme ?? "light"]

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const updateUsername = (event: any) => {
        // console.log(event.target.value)
        setUsername(event.target.value)
    }
    return (
        <SafeAreaProvider style={{ backgroundColor: theme.background }}>
            <SafeAreaView>
                <View className="items-center">
                    <Text className="text-3xl" style={{ color: theme.title }}>
                        Welcome to Proxi
                    </Text>
                    <Text className="text-xl" style={{ color: theme.text }}>
                        Sign into your account
                    </Text>
                </View>
                <View className="m-5" style={{}}>
                    <Text style={{ color: theme.text }}>Username</Text>
                    <TextInput
                        className="rounded-md border-2 h-10"
                        placeholder="enter username"
                        onChangeText={newText => setUsername(newText)}
                        style={{ color: theme.text }}
                    >
                    </TextInput>
                </View>
                <View className="m-5">
                    <Text style={{ color: theme.text }}>Password</Text>
                    <TextInput
                        className="rounded-md border-2 h-10"
                        placeholder="enter password"
                        onChangeText={newText => setPassword(newText)}
                        style={{ color: theme.text }}

                    ></TextInput>
                </View>


                <Link href="/dashboard" asChild>
                    <TouchableOpacity className="bg-blue-500 rounded-md p-3 m-5">
                        <Text className="text-white text-center text-lg font-semibold">
                            Sign In
                        </Text>
                    </TouchableOpacity>
                </Link>
                <View className="items-center">
                    <Link href="/signup">
                        <Text style={{ color: theme.text }}>Don't have an account? Sign up</Text>
                    </Link>
                </View>

            </SafeAreaView>
        </SafeAreaProvider>
    );

}
