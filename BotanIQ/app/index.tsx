import { useState } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const updateUsername = (event: any) => {
        // console.log(event.target.value)
        setUsername(event.target.value)
    }
  return (
    <SafeAreaProvider>
        <SafeAreaView>
            <Text className="text-3xl self-center m-3">
                Log In
            </Text>
            <View className="m-5">
                <Text>Username</Text>
                <TextInput
                    className="rounded-md border-2 h-10"
                    placeholder="enter username"
                    onChangeText={newText => setUsername(newText)}
                >
                </TextInput>
            </View>
            <View className="m-5">
                <Text>Password</Text>
                <TextInput
                    className="rounded-md border-2 h-10"
                    placeholder="enter username"
                    onChangeText={newText => setPassword(newText)}

                    ></TextInput>
            </View>
            <Text>username:{username} password: {password}</Text>


        </SafeAreaView>
    </SafeAreaProvider>
  );

}
