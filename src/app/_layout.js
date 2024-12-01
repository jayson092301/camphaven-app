import { View, Text, SafeAreaView  } from "react-native";
import { Stack } from "expo-router";
import styles from "../../.expo/Style";
import { StatusBar } from "expo-status-bar";


export default function RootLayout () {
    return(
        <SafeAreaView style={styles.container}>
            <Stack
            screenOptions={{ headerShown: false
            }}>
                <Stack.Screen name="index"/>
                <Stack.Screen name="signin"/>
                <Stack.Screen name="register"/>
                <Stack.Screen name="dashboard"/>
            </Stack>
            <StatusBar style="auto" />
        </SafeAreaView>
    )
}