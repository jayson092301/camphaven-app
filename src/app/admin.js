import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useRouter } from "expo-router";

export default function Admin() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.title}>Admin Mode</Text>

            {/* Button */}
            <TouchableOpacity style={styles.button} onPress={() => router.push('adminLogin')}>
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    textInput: {
        width: 200,
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    button: {
        width: 200, // Set button width
        height: 60, // Set button height
        backgroundColor: "#000", // Button background color
        justifyContent: "center", // Center text vertically
        alignItems: "center", // Center text horizontally
        borderRadius: 10, // Rounded corners
    },
    buttonText: {
        color: "#E8CDB2", // Text color
        fontSize: 18, // Text size
    },
});
