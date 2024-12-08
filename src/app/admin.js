import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";

export default function Admin() {
    const [password, setPassword] = useState(""); // Add state for password

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.title}>Admin Mode</Text>

            {/* Password Input */}
            <TextInput
                placeholder="Enter Password"
                secureTextEntry
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
            />

            {/* Button */}
            <TouchableOpacity style={styles.button} onPress={() => console.log("Password:", password)}>
                <Text style={styles.buttonText}>Press me</Text>
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
        backgroundColor: "#007BFF", // Button background color
        justifyContent: "center", // Center text vertically
        alignItems: "center", // Center text horizontally
        borderRadius: 10, // Rounded corners
    },
    buttonText: {
        color: "#fff", // Text color
        fontSize: 18, // Text size
    },
});
