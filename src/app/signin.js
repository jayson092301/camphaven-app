import React from "react";
import { Text, View, Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton, Button, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import supabase from "../../supabase"; // Ensure Supabase is configured correctly


export default function Signin() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [fontsLoaded] = useFonts({
        Italiano: require('../../assets/fonts/Italianno-Regular.ttf'),
    });
    const router = useRouter();

    // Handle Sign-In
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in both fields.");
            return;
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            Alert.alert("Success", "You have successfully logged in!");
            router.replace("dashboard");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", error.message);
        }
    };

    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }

    return (
            <View style={{ backgroundColor: '#fff', flex:1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ marginLeft: 10 }}>
                        <IconButton
                            icon="arrow-left"
                            size={20}
                            onPress={() => router.back()}
                        />
                    </View>
                    <View>
                        <IconButton
                            icon="dots-vertical"
                            size={20}
                            onPress={() => router.push('admin')}
                        />
                    </View>
                </View>
                <ScrollView>
                <View style={{ marginTop: 30, marginLeft: 20, marginRight: 20, marginBottom:70 }}>
                    <Text style={{ fontSize: 20, fontFamily: 'Italianno' }}>Welcome Back.</Text>
                    <Text style={{ fontSize: 45, fontFamily: 'Italianno', fontWeight:'bold' }}>You've been missed!</Text>
                </View>
                <View style={{ backgroundColor: '#D9D9D9', margin: 30, borderRadius:10 }}>
                    <TextInput
                        label="Email"
                        mode="outlined"
                        style={{ margin: 20, marginTop: 50 }}
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        label="Password"
                        mode="outlined"
                        secureTextEntry
                        style={{ margin: 20, marginBottom: 50 }}
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
                </ScrollView>
                <View style={styles.submitContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Log in</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center', marginTop: 10, marginBottom:20 }}>
                    <Text style={{ fontFamily: 'Italianno', fontSize: 20 }}>
                        Don't have an account?{' '}
                        <Text style={{ color: 'red', fontWeight:'bold' }} onPress={() => router.push('registrationForm')}>
                            Register
                        </Text>
                    </Text>
                </View>
            </View>
    );
}

const styles = StyleSheet.create({
    submitContainer: {
        alignItems: 'center',
        margin: 20
      },
      button: {
        width: '100%',
        paddingVertical: 12,
        backgroundColor: '#000',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonText: {
        color: '#E8CDB2',
        fontSize: 18,
        fontWeight: '600',
      },
})