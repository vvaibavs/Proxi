import { useState } from "react";
import { Text, View, StyleSheet, TextInput, useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors"

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
    <SafeAreaProvider style={{ backgroundColor: theme.background}}>
        <SafeAreaView>
            <Text className="text-3xl self-center m-3" style={{color: theme.title}}>
                Log In
            </Text>
            <View className="m-5" style={{}}>
                <Text style={{color: theme.text}}>Username</Text>
                <TextInput
                    className="rounded-md border-2 h-10"
                    placeholder="enter username"
                    onChangeText={newText => setUsername(newText)}
                    style={{color: theme.text}}
                >
                </TextInput>
            </View>
            <View className="m-5">
                <Text style={{color: theme.text}}>Password</Text>
                <TextInput
                    className="rounded-md border-2 h-10"
                    placeholder="enter username"
                    onChangeText={newText => setPassword(newText)}
                    style={{color: theme.text}}

                    ></TextInput>
            </View>
            <Text>username:{username} password: {password}</Text>


        </SafeAreaView>
    </SafeAreaProvider>
  );

}
