import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import supabase from "../../supabase";

export default function AdminForm() {
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");

    const handleSubmit = async () => {
        if (!fullName || !email || !phoneNumber || !address) {
            Alert.alert("Error", "Please fill out all fields.");
            return;
        }

        try {
            const { data, error } = await supabase
                .from("apartment_owners")
                .insert([{ 
                    name: fullName, 
                    email, 
                    phone_number: phoneNumber, 
                    address
                }]);

            if (error) {
                throw error;
            }

            Alert.alert("Success", "Added landlord successfully!");
            router.push('camp_listing');
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Landlords Form</Text>
                <TextInput
                    label="Full Name"
                    mode="outlined"
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                />
                <TextInput
                    label="Email Address"
                    mode="outlined"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    label="Phone Number"
                    mode="outlined"
                    style={styles.input}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />
                <TextInput
                    label="Address"
                    mode="outlined"
                    style={styles.input}
                    value={address}
                    onChangeText={setAddress}
                />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => router.push('camp_listing')}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    formContainer: {
        marginTop: 50,
        backgroundColor: "#D9D9D9",
        borderRadius: 10,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
    },
    button: {
        width: 100,
        height: 40,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    buttonText: {
        color: "#E8CDB2",
        fontSize: 18,
    },
});
