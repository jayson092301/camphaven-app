import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { TextInput, Checkbox, Card, Menu, Provider } from "react-native-paper";
import supabase from "../../supabase"; // Import your supabase client
import { router } from "expo-router";

export default function CampListing() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [address, setAddress] = useState("");
    const [amenities, setAmenities] = useState({
        WiFi: false,
        AirConditioning: false,
        Parking: false,
        Water: false,
    });
    const [owners, setOwners] = useState([]); // State to hold the owner data
    const [owner, setOwner] = useState(null); // State for selected owner
    const [ownerMenuVisible, setOwnerMenuVisible] = useState(false); // State to control owner dropdown visibility
    const [universityMenuVisible, setUniversityMenuVisible] = useState(false); // State to control university dropdown visibility
    const [universities, setUniversities] = useState([]);
    const [university, setUniversity] = useState(null); // State to store selected university

    // Fetch the owners from Supabase
    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const { data, error } = await supabase
                    .from("apartment_owners")  // Assuming "apartment_owners" is the correct table name
                    .select("owner_id, name");

                if (error) {
                    console.error("Error fetching owners:", error);
                } else {
                    setOwners(data);
                }
            } catch (err) {
                console.error("Error:", err);
            }
        };

        fetchOwners();
    }, []);

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

        fetchUniversities();
    }, []);

    // Function to handle price input and ensure only numbers are entered
    const handlePriceChange = (text) => {
        const numericText = text.replace(/[^0-9]/g, ''); // Replace any non-numeric characters
        setPrice(numericText);
    };

    // Function to toggle amenity selection
    const handleAmenityChange = (amenity) => {
        setAmenities({
            ...amenities,
            [amenity]: !amenities[amenity],
        });
    };

    // Submit function to handle form submission (this could be adapted for Supabase)
    const handleSubmit = async () => {
        if (!title || !description || !price || !address || !amenities || !owner || !university) {
            Alert.alert("Error", "Please fill out all fields.");
            return;
        }

        try {
            const { data, error } = await supabase
                .from("listings")
                .insert([{
                    title,
                    description,
                    price,
                    address,
                    amenities: JSON.stringify(amenities),  // Store amenities as a JSON string
                    owner_id: owner,  // Store the selected owner ID
                    university_id: university, // Store university_id
                    status: 'available', // Set default status as 'available'
                }]);

            if (error) {
                throw error;
            }

            Alert.alert("Success", "Listing created successfully!");
            router.push('image')

        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <ScrollView>
            <Provider>
                <View style={{ padding: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>Create Camp Listing</Text>
                    <Card style={{ marginBottom: 20, padding: 20, backgroundColor: "#D9D9D9" }}>
                        <TextInput
                            label="Boarding house name"
                            mode="outlined"
                            style={{ marginBottom: 15 }}
                            value={title}
                            onChangeText={setTitle}
                        />
                        <TextInput
                            label="Description"
                            mode="outlined"
                            style={{ marginBottom: 15 }}
                            value={description}
                            onChangeText={setDescription}
                        />
                        <TextInput
                            label="Price"
                            mode="outlined"
                            style={{ marginBottom: 15 }}
                            value={price}
                            onChangeText={handlePriceChange}  // Using the new function here
                            keyboardType="numeric"
                        />
                        <TextInput
                            label="Address"
                            mode="outlined"
                            style={{ marginBottom: 15 }}
                            value={address}
                            onChangeText={setAddress}
                        />
                        {/* Dropdown for selecting Owner */}
                        <Menu
                            visible={ownerMenuVisible}
                            onDismiss={() => setOwnerMenuVisible(false)}
                            anchor={
                                <TextInput
                                    label="Owner Name"
                                    mode="outlined"
                                    style={{ marginBottom: 15 }}
                                    value={owner ? owners.find(o => o.owner_id === owner)?.name : ''}
                                    onFocus={() => setOwnerMenuVisible(true)} // Show menu on focus
                                />
                            }
                        >
                            {owners.map((ownerItem) => (
                                <Menu.Item
                                    key={ownerItem.owner_id}
                                    onPress={() => {
                                        setOwner(ownerItem.owner_id); // Set the owner_id
                                        setOwnerMenuVisible(false); // Close the dropdown
                                    }}
                                    title={ownerItem.name}
                                />
                            ))}
                        </Menu>

                        {/* Dropdown for selecting University */}
                        <Menu
                            visible={universityMenuVisible}
                            onDismiss={() => setUniversityMenuVisible(false)}
                            anchor={
                                <TextInput
                                    label="Select University"
                                    mode="outlined"
                                    style={{ marginBottom: 15 }}
                                    value={university ? universities.find(u => u.university_id === university)?.name : ''}
                                    onFocus={() => setUniversityMenuVisible(true)} // Show menu on focus
                                />
                            }
                        >
                            {universities.map((universityItem) => (
                                <Menu.Item
                                    key={universityItem.university_id}
                                    onPress={() => {
                                        setUniversity(universityItem.university_id); // Set the university_id
                                        setUniversityMenuVisible(false); // Close the dropdown
                                    }}
                                    title={universityItem.name}
                                    right={<TextInput.Icon icon="menu-down" onPress={() => setMenuVisible(true)} />}
                                />
                            ))}
                        </Menu>
                    </Card>

                    <Card style={{ padding: 20 }}>
                        <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>Select Amenities</Text>
                        {['WiFi', 'AirConditioning', 'Parking', 'Water'].map((amenity) => (
                            <View key={amenity} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <Checkbox
                                    status={amenities[amenity] ? 'checked' : 'unchecked'}
                                    onPress={() => handleAmenityChange(amenity)}
                                />
                                <Text>{amenity}</Text>
                            </View>
                        ))}
                    </Card>

                    {/* Centered Button */}
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <TouchableOpacity
                            style={{
                                width: 200,
                                height: 40,
                                backgroundColor: "#000",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 10,
                            }}
                            onPress={() => router.push('image')}  // Updated to use submitListing
                        >
                            <Text style={{ color: "#E8CDB2", fontSize: 18 }}>Submit Listing</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Provider>
        </ScrollView>
    );
}
