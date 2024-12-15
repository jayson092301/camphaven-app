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
    const [listingTypeMenuVisible, setListingTypeMenuVisible] = useState(false);
    const [listingType, setListingType] = useState(null); // State for listing type
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

    const listingTypes = ["Room", "Apartment", "Dorm"];

    // Fetch the owners from Supabase
    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const { data, error } = await supabase
                    .from("apartment_owners") // Assuming "apartment_owners" is the correct table name
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
        const numericText = text.replace(/[^0-9.]/g, ""); // Replace any non-numeric characters
        setPrice(numericText);
    };

    // Function to toggle amenity selection
    const handleAmenityChange = (amenity) => {
        setAmenities({
            ...amenities,
            [amenity]: !amenities[amenity],
        });
    };

    // Submit function to handle form submission
    const handleSubmit = async () => {
        if (!title || !description || !price || !address || !amenities || !owner || !university || !listingType) {
            Alert.alert("Error", "Please fill out all fields.");
            return;
        }
    
        try {
            // Step 1: Insert into the listings table
            const { data: listingData, error: listingError } = await supabase
                .from("listings")
                .insert([{
                    title,
                    description,
                    price,
                    address,
                    amenities: JSON.stringify(amenities), // Store amenities as a JSON string
                    owner_id: owner, // Store the selected owner ID
                    university_id: university, // Store university_id
                    status: 'available', // Default status
                }])
                .select();
    
            if (listingError) {
                throw listingError;
            }
    
            const listingId = listingData[0].id; // Get the ID of the inserted listing
    
            // Step 2: Call the database function to insert into the specific table
            const { error: insertError } = await supabase.rpc('insert_listing', {
                listing_type: listingType, // Room, Apartment, or Dorm
                title,
                description,
                price,
                address,
                amenities: JSON.stringify(amenities), // Store amenities as a JSON string
                safety_rating: null, // Optional, can be replaced with a real value if available
                owner_id: owner,
                status: 'available',
                university_id: university
            });
    
            if (insertError) {
                throw insertError;
            }
    
            Alert.alert("Success", "Listing created successfully!");
            router.push('image'); // Navigate to the image page
    
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };
    
    return (
        <ScrollView>
            <Provider>
                <View style={{ padding: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" }}>
                        Create Camp Listing
                    </Text>
                    <Card style={{ marginBottom: 20, padding: 20, backgroundColor: "#D9D9D9" }}>
                        {/* Listing Type Dropdown */}
                        <Menu
                            visible={listingTypeMenuVisible}
                            onDismiss={() => setListingTypeMenuVisible(false)}
                            anchor={
                                <TextInput
                                    label="Listing Type"
                                    mode="outlined"
                                    style={{ marginBottom: 15 }}
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
                            onChangeText={handlePriceChange}
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
                                    value={owner ? owners.find((o) => o.owner_id === owner)?.name : ""}
                                    onFocus={() => setOwnerMenuVisible(true)}
                                />
                            }
                        >
                            {owners.map((ownerItem) => (
                                <Menu.Item
                                    key={ownerItem.owner_id}
                                    onPress={() => {
                                        setOwner(ownerItem.owner_id);
                                        setOwnerMenuVisible(false);
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
                    </Card>

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

                    <View style={{ justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                        <TouchableOpacity
                            style={{
                                width: 200,
                                height: 40,
                                backgroundColor: "#000",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 10,
                            }}
                            onPress={handleSubmit}
                        >
                            <Text style={{ color: "#E8CDB2", fontSize: 18 }}>Submit Listing</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Provider>
        </ScrollView>
    );
}
