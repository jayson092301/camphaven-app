import React, { useEffect } from "react";
import { View, Text, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { IconButton, Button, TextInput, Menu, Provider } from "react-native-paper";
import { useFonts } from "expo-font";
import supabase from "../../supabase"; // Ensure this points to your Supabase client initialization file.

export default function Register() {
    const [fullName, setFullName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [university, setUniversity] = React.useState("");  // Store selected university_id
    const [universities, setUniversities] = React.useState([]); // List of universities
    const [menuVisible, setMenuVisible] = React.useState(false); // For controlling the dropdown
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

    // Submit Handler
    const handleSubmit = async () => {
        if (!fullName || !email || !phoneNumber || !password || !university) {
            Alert.alert("Error", "Please fill out all fields.");
            return;
        }

        try {
            const { data, error } = await supabase
                .from("users")
                .insert([{ 
                    name: fullName, 
                    email, 
                    phone_number: phoneNumber, 
                    password, 
                    university_id: university // Store university_id in the users table
                }]);

            if (error) {
                throw error;
            }

            Alert.alert("Success", "User registered successfully!");
            router.push("signin");
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <Provider>
            <ScrollView>
                <View>
                    <View style={{ marginLeft: 10 }}>
                        <IconButton
                            icon="arrow-left"
                            size={20}
                            onPress={() => router.back()}
                        />
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ fontFamily: "Italianno", fontSize: 40 }}>
                            Complete the following
                        </Text>
                    </View>
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
                    <View
                        style={{
                            backgroundColor: "#000",
                            borderRadius: 20,
                            marginLeft: 80,
                            marginRight: 80,
                            marginBottom: 200,
                        }}
                    >
                        <Button
                            mode="outlined"
                            onPress={handleSubmit}
                            labelStyle={{
                                color: "#E8CDB2",
                                fontSize: 20,
                                fontFamily: "Italianno",
                            }}
                        >
                            Submit
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </Provider>
    );
}
