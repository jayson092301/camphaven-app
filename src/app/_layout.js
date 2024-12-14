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
                <Stack.Screen name="admin"/>
                <Stack.Screen name="adminpage"/>
                <Stack.Screen name="admin_form"/>
                <Stack.Screen name="camp_listing"/>
                <Stack.Screen name="image"/>
            </Stack>
            <StatusBar style="auto" />
        </SafeAreaView>
    )
}