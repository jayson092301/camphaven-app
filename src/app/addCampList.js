import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { TextInput, Card, Checkbox, Menu, Provider } from "react-native-paper";
import supabase from "../../supabase";

export default function campList() {
    const [owner, setOwner] = useState(""); // State to store admin's name
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [listingTypeMenuVisible, setListingTypeMenuVisible] = useState(false);
    const [listingType, setListingType] = useState(null); // State for listing type
    const [address, setAddress] = useState("");
    const [universityMenuVisible, setUniversityMenuVisible] = useState(false); // State to control university dropdown visibility
    const [universities, setUniversities] = useState([]);
    const listingTypes = ["Room", "Apartment", "Dorm"];
    const [university, setUniversity] = useState(null); // State to store selected university
    const [amenities, setAmenities] = useState({
        WiFi: false,
        AirConditioning: false,
        Parking: false,
        Water: false,
    });

    const handleAmenityChange = (amenity) => {
        setAmenities({
            ...amenities,
            [amenity]: !amenities[amenity],
        });
    };

    const handlePriceChange = (text) => {
        const numericText = text.replace(/[^0-9.]/g, ""); // Replace any non-numeric characters
        setPrice(numericText);
    };

    // Fetch universities from Supabase
    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const { data, error } = await supabase.from("universities").select("university_id, name");
                if (error) {
                    throw error;
                }
                setUniversities(data);
            } catch (error) {
                Alert.alert("Error", "Failed to fetch universities: " + error.message);
            }
        };

        const fetchCurrentUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data, error } = await supabase
                        .from("users")
                        .select("name")
                        .eq("email", user.email)
                        .single();

                    if (error) {
                        throw error;
                    }

                    setOwner(data.name); // Set the admin's name in the owner field
                }
            } catch (error) {
                Alert.alert("Error", "Failed to fetch user details: " + error.message);
            }
        };

        fetchUniversities();
        fetchCurrentUser();
    }, []);

    return (
        <Provider>
            <View style={{ flex: 1 }}>
                <View>
                    <Text style={{ textAlign: 'center', margin: 20, fontSize: 24, fontWeight: 'bold' }}>Complete the Following</Text>
                </View>
                <ScrollView>
                    <View style={{ padding: 20, margin: 20, backgroundColor: '#D9D9D9', borderRadius: 10 }}>
                        <TextInput
                            placeholder="Name"
                            label="Owner"
                            mode="outlined"
                            style={{ margin: 10 }}
                            value={owner}
                            disabled // Make the input field read-only
                        />
                        <TextInput
                            placeholder="Title"
                            label="Title"
                            mode="outlined"
                            style={{ margin: 10 }}
                            value={title}
                            onChangeText={setTitle}
                        />
                        <TextInput
                            placeholder="Describe your place"
                            label="Description"
                            mode="outlined"
                            style={{ margin: 10 }}
                            value={description}
                            onChangeText={setDescription}
                        />
                        <TextInput
                            label="Price"
                            mode="outlined"
                            style={{ margin: 10 }}
                            value={price}
                            onChangeText={handlePriceChange}
                            keyboardType="numeric"
                        />
                        <Menu
                            visible={listingTypeMenuVisible}
                            onDismiss={() => setListingTypeMenuVisible(false)}
                            anchor={
                                <TextInput
                                    label="Listing Type"
                                    mode="outlined"
                                    style={{ margin: 10 }}
                                    value={listingType || ""}
                                    onFocus={() => setListingTypeMenuVisible(true)} // Show menu on focus
                                />
                            }
                        >
                            {listingTypes.map((type) => (
                                <Menu.Item
                                    key={type}
                                    onPress={() => {
                                        setListingType(type);
                                        setListingTypeMenuVisible(false);
                                    }}
                                    title={type}
                                />
                            ))}
                        </Menu>
                        <TextInput
                            placeholder="Address"
                            label="Address"
                            mode="outlined"
                            style={{ margin: 10 }}
                            value={address}
                            onChangeText={setAddress}
                        />
                        <Card style={{ padding: 20 }}>
                            <Text style={{ marginBottom: 10, fontWeight: "bold" }}>Select Amenities</Text>
                            {Object.keys(amenities).map((amenity) => (
                                <View key={amenity} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                                    <Checkbox
                                        status={amenities[amenity] ? "checked" : "unchecked"}
                                        onPress={() => handleAmenityChange(amenity)}
                                    />
                                    <Text>{amenity}</Text>
                                </View>
                            ))}
                        </Card>
                        <Menu
                            visible={universityMenuVisible}
                            onDismiss={() => setUniversityMenuVisible(false)}
                            anchor={
                                <TextInput
                                    label="Select University"
                                    mode="outlined"
                                    style={{ marginBottom: 15 }}
                                    value={university ? universities.find((u) => u.university_id === university)?.name : ""}
                                    onFocus={() => setUniversityMenuVisible(true)}
                                />
                            }
                        >
                            {universities.map((universityItem) => (
                                <Menu.Item
                                    key={universityItem.university_id}
                                    onPress={() => {
                                        setUniversity(universityItem.university_id);
                                        setUniversityMenuVisible(false);
                                    }}
                                    title={universityItem.name}
                                />
                            ))}
                        </Menu>
                    </View>
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => console.log('pressed')}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1, // Take up remaining space
        justifyContent: "center", // Center vertically
        alignItems: "center", // Center horizontally
    },
    button: {
        width: 350, // Set button width
        height: 50, // Set button height
        backgroundColor: "#000", // Button background color
        justifyContent: "center", // Center text vertically
        alignItems: "center", // Center text horizontally
        borderRadius: 10, // Rounded corners
        marginBottom: 60,
        marginTop: 10,
    },
    buttonText: {
        color: "#E8CDB2", // Text color
        fontSize: 18, // Text size
    },
});
