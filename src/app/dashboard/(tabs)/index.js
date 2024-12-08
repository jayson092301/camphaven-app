import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";

export default function HomePage() {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [fontsLoaded] = useFonts({
        Italiano: require("../../../../assets/fonts/Italianno-Regular.ttf"),
    });
    const router = useRouter();

    const [selected, setSelected] = useState(""); // Track the selected button

    const handlePress = (type) => {
        setSelected(type); // Set the selected button type
        console.log(`${type} selected`);
    };

    return (
        <View style={styles.container}>
            {/* Title */}
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>
                    Let's find the best place to live!
                </Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                />
            </View>

            {/* Subtitle */}
            <View>
                <Text style={styles.subtitle}>Search for . . .</Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
                {["Apartment", "Room", "Dorm"].map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[
                            styles.button,
                            selected === type && styles.buttonSelected, // Apply selected style
                        ]}
                        onPress={() => handlePress(type)}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                selected === type && styles.buttonTextSelected, // Change text color if selected
                            ]}
                        >
                            {type}
                        </Text>
                    </TouchableOpacity>
                ))}
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
    titleContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    titleText: {
        fontFamily: "Italianno",
        fontSize: 30,
    },
    searchContainer: {
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        width: 120,
        paddingVertical: 10,
        backgroundColor: "#ccc", // Default button background color
        borderRadius: 5,
        alignItems: "center",
        marginVertical: 5,
    },
    buttonSelected: {
        backgroundColor: "#000", // Selected button background color
    },
    buttonText: {
        color: "#000", // Default button text color
        fontSize: 16,
    },
    buttonTextSelected: {
        color: "#E8CDB2", // Selected button text color
    },
});
