import React from "react";
import { Text, View, Alert, ScrollView} from "react-native";
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
        <ScrollView>
            <View style={{ backgroundColor: '#fff', }}>
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
                <View style={{ marginTop: 50, marginLeft: 20, marginRight: 20 }}>
                    <Text style={{ fontSize: 60, fontFamily: 'Italianno' }}>Welcome Back.</Text>
                    <Text style={{ fontSize: 80, fontFamily: 'Italianno' }}>You've been missed!</Text>
                </View>
                <View style={{ backgroundColor: '#D9D9D9', margin: 30 }}>
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
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <Text style={{ fontFamily: 'Italianno', fontSize: 30 }}>
                        Don't have an account?{' '}
                        <Text style={{ color: 'red' }} onPress={() => router.push('register')}>
                            Register
                        </Text>
                    </Text>
                </View>
                <View style={{
                    backgroundColor: '#000',
                    borderRadius: 20,
                    marginLeft: 80,
                    marginRight: 80,
                    marginBottom: 200,
                }}>
                    <Button
                        mode="outlined"
                        onPress={handleLogin}
                        labelStyle={{ color: '#E8CDB2', fontSize: 20, fontFamily: 'Italianno' }}
                    >
                        Log In
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
}