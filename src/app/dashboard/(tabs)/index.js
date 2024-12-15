import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Searchbar } from "react-native-paper";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import supabase from "../../../../supabase"; // Import supabase client

export default function HomePage() {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [images, setImages] = useState([]); // State to store images
    const [fontsLoaded] = useFonts({
        Italiano: require("../../../../assets/fonts/Italianno-Regular.ttf"),
    });
    const router = useRouter();
    const [selected, setSelected] = useState(""); // Track the selected button

    // Function to fetch images based on the selected type (Apartment, Room, Dorm)
    const fetchImages = async (listingId) => {
        const { data, error } = await supabase
            .from("tblimage")
            .select("image_id, image_url, upload_date, is_primary")
            .eq("listing_id", listingId); // Fetch images based on listing_id

        if (error) {
            console.error("Error fetching images:", error);
        } else {
            setImages(data); // Set the fetched images to state
        }
    };

    // Map type to the corresponding integer listing_id
    const handlePress = (type) => {
        setSelected(type); // Set the selected button type
        console.log(`${type} selected`);

        // Map the selected type to the corresponding listing_id
        let listingId = 0;
        if (type === "Room") {
            listingId = 1;  // Map "Room" to listing_id = 1
        } else if (type === "Apartment") {
            listingId = 2;  // Map "Apartment" to listing_id = 2
        } else if (type === "Dorm") {
            listingId = 3;  // Map "Dorm" to listing_id = 3
        }

        fetchImages(listingId); // Fetch images based on the listing_id (integer)
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

            {/* Display Images */}
            <View style={styles.imageContainer}>
                {images.length > 0 ? (
                    images.map((image) => (
                        <View key={image.image_id} style={styles.imageItem}>
                            <Image
                                source={{ uri: image.image_url }} // Display image from Supabase URL
                                style={styles.image}
                            />
                            {image.is_primary && (
                                <Text style={styles.primaryLabel}>Primary</Text>
                            )}
                        </View>
                    ))
                ) : (
                    <Text>No images found</Text>
                )}
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
    imageContainer: {
        marginTop: 20,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    imageItem: {
        margin: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    primaryLabel: {
        marginTop: 5,
        color: "green",
        fontWeight: "bold",
    },
});
