import React, { useEffect, useState } from "react";
import { View, Text, Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { IconButton, Button, TextInput, Menu, Provider } from "react-native-paper";
import { useFonts } from "expo-font";
import supabase from "../../supabase";

export default function RegistrationForm() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [university, setUniversity] = useState("");  // Store selected university_id
    const [universities, setUniversities] = useState([]); // List of universities
    const [menuVisible, setMenuVisible] = useState(false); // For controlling the dropdown
    const [loading, setLoading] = useState(false); // For loading state
    const [fontsLoaded] = useFonts({
        Italiano: require('../../assets/fonts/Italianno-Regular.ttf'),
    });

    const router = useRouter();

    useEffect(() => {
        // Fetch universities from Supabase
        const fetchUniversities = async () => {
            try {
                const { data, error } = await supabase.from("universities").select("university_id, name"); // Fetch university_id and name
                if (error) {
                    throw error;
                }
                setUniversities(data);
            } catch (error) {
                Alert.alert("Error", "Failed to fetch universities: " + error.message);
            }
        };

        fetchUniversities();
    }, []);

    // Handle user registration
    const handleRegistration = async () => {
        if (!fullName || !email || !phoneNumber || !password || !university) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        setLoading(true); // Start loading
        try {
            // First, sign up the user with Supabase Authentication
            const { user, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (signUpError) {
                throw signUpError;
            }

            // Now insert the user data into the custom user table
            const { error: insertError } = await supabase
                .from("user")
                .insert([
                    {
                        user_id: user.id,
                        name: fullName,
                        email: email,
                        phone_number: phoneNumber,
                        university_id: university,
                        created_at: new Date(),
                    },
                ]);

            if (insertError) {
                throw insertError;
            }

            Alert.alert("Success", "Registration successful! Please log in.");
            // Redirect to Sign-In page after successful registration
            router.push("signin"); 

        } catch (error) {
            console.error(error);
            Alert.alert("Error", error.message || "An error occurred during registration.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }

    return (
        <Provider>
            <View style={{ flex: 1 }}>
                <View style={{ marginLeft: 10 }}>
                    <IconButton
                        icon="arrow-left"
                        size={20}
                        onPress={() => router.back()}
                    />
                </View>
                <View style={{ alignItems: "center" }}>
                    <Text style={{ fontFamily: "Italianno", fontSize: 40 }}>Complete the following</Text>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={{ backgroundColor: "#D9D9D9", margin: 20 }}>
                        <TextInput
                            label="Full Name"
                            mode="outlined"
                            style={{ margin: 10, marginTop: 50 }}
                            value={fullName}
                            onChangeText={setFullName}
                        />
                        <TextInput
                            label="Email Address"
                            mode="outlined"
                            style={{ margin: 10 }}
                            value={email}
                            onChangeText={setEmail}
                        />
                        <TextInput
                            label="Phone Number"
                            mode="outlined"
                            style={{ margin: 10 }}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                        />
                        <TextInput
                            label="Password"
                            mode="outlined"
                            secureTextEntry
                            style={{ margin: 10 }}
                            value={password}
                            onChangeText={setPassword}
                        />
                        {/* Dropdown for University */}
                        <Menu
                            visible={menuVisible}
                            onDismiss={() => setMenuVisible(false)}
                            anchor={
                                <TextInput
                                    label="University Name"
                                    mode="outlined"
                                    style={{ margin: 10, marginBottom: 50 }}
                                    value={university ? universities.find(u => u.university_id === university)?.name : ''}
                                    onFocus={() => setMenuVisible(true)} // Show menu on focus
                                />
                            }
                        >
                            {universities.map((univ) => (
                                <Menu.Item
                                    key={univ.university_id}
                                    onPress={() => {
                                        setUniversity(univ.university_id); // Set the university_id
                                        setMenuVisible(false); // Close the dropdown
                                    }}
                                    title={univ.name}
                                />
                            ))}
                        </Menu>
                    </View>
                </ScrollView>
                <View style={styles.submitContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleRegistration} disabled={loading}>
                        <Text style={styles.buttonText}>
                            {loading ? "Registering..." : "Submit"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    submitContainer: {
        alignItems: "center",
        margin: 20,
    },
    button: {
        width: "100%",
        paddingVertical: 12,
        backgroundColor: "#000",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#E8CDB2",
        fontSize: 18,
        fontWeight: "600",
    },
    scrollContainer: {
        paddingBottom: 20,
    },
});
