import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Alert, Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { TextInput, Menu, Provider } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import supabase from "../../supabase";
import { router } from "expo-router";

export default function UploadImage() {
    const [lists, setLists] = useState([]); // State to hold the listing data
    const [list, setList] = useState(null); // State for selected listing
    const [listMenuVisible, setListMenuVisible] = useState(false); // State to control listing dropdown visibility
    const [image, setImage] = useState(null); // Selected image URI
    const [uploading, setUploading] = useState(false); // Uploading state

    // Request media library permissions
    useEffect(() => {
        const requestPermissions = async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission required", "Permission to access media library is required.");
            }
        };

        requestPermissions();
    }, []);

    // Fetch listings on component mount
    useEffect(() => {
        const fetchLists = async () => {
            try {
                const { data, error } = await supabase
                    .from("listings") // Replace with your table name
                    .select("listing_id, title");

                if (error) throw error;
                setLists(data || []);
            } catch (err) {
                console.error("Error fetching listings:", err);
                Alert.alert("Error", "Failed to fetch listings.");
            }
        };

        fetchLists();
    }, []);

    // Open image picker
    const pickImage = async () => {
        console.log('Attempting to pick an image...'); // Log to see if this function is triggered
        
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: [ImagePicker.MediaType.IMAGE], // Correct media type usage
            allowsEditing: true,
            quality: 1,
        });

        console.log('ImagePicker result:', result); // Debugging log

        if (!result.canceled) {
            setImage(result.assets[0].uri); // Save the selected image URI
        } else {
            console.log("Image selection was canceled");
        }
    };

    // Submit the selected image and listing to Supabase
    const handleSubmit = async () => {
        if (!image || !list) {
            Alert.alert("Error", "Please select an image and a listing.");
            return;
        }

        try {
            setUploading(true);

            // Fetch the image file as a blob
            const response = await fetch(image);
            if (!response.ok) throw new Error('Failed to fetch image');

            const blob = await response.blob();
            console.log("Image blob created:", blob);

            const fileName = `uploads/${Date.now()}.jpg`;

            // Upload the blob to Supabase storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("images") // Your bucket name
                .upload(fileName, blob, { contentType: "image/jpeg" });

            if (uploadError) {
                console.error("Upload error:", uploadError); // Log the full error
                throw uploadError;
            }

            // Retrieve public URL
            const { data: publicURLData, error: publicUrlError } = supabase.storage
                .from("images")
                .getPublicUrl(fileName);

            if (publicUrlError) throw publicUrlError;

            const imageUrl = publicURLData.publicUrl;

            // Insert image URL into database
            const { data: insertData, error: insertError } = await supabase
                .from("tblimage") // Your table name
                .insert([{ listing_id: list, image_url: imageUrl }]);

            if (insertError) throw insertError;

            Alert.alert("Success", "Image uploaded successfully!");
            router.push("adminpage");
        } catch (error) {
            console.error("Error during submission:", error);
            Alert.alert("Error", `Something went wrong: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Provider>
            <TouchableWithoutFeedback onPress={() => setListMenuVisible(false)}>
                <View style={styles.container}>
                    <View style={{ backgroundColor: "#D9D9D9", padding: 20, marginTop: 50 }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', margin: 50 }}>Upload Photo</Text>
                        <View style={styles.dropdownContainer}>
                            {/* Listing Dropdown */}
                            <Menu
                                visible={listMenuVisible}
                                onDismiss={() => setListMenuVisible(false)} // Close dropdown
                                anchor={
                                    <TouchableOpacity
                                        onPress={() => setListMenuVisible(true)}
                                        style={styles.inputWrapper}
                                    >
                                        <TextInput
                                            label="Listing Title"
                                            mode="outlined"
                                            value={list ? lists.find((l) => l.listing_id === list)?.title : "Select Listing"}
                                            style={styles.input}
                                            editable={false} // Prevent manual editing
                                        />
                                    </TouchableOpacity>
                                }
                            >
                                {lists.map((listItem) => (
                                    <Menu.Item
                                        key={listItem.listing_id}
                                        onPress={() => {
                                            setList(listItem.listing_id); // Set selected listing
                                            setListMenuVisible(false); // Close the dropdown
                                        }}
                                        title={listItem.title}
                                    />
                                ))}
                            </Menu>
                        </View>

                        {/* Image Picker Button */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
                                <Text style={styles.buttonText}>Pick Image</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Image Preview & Upload Button */}
                        {image ? (
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: image }} style={styles.image} />
                            </View>
                        ) : (
                            <Text style={styles.noImageText}>No image selected</Text>
                        )}
                    </View>
                    {/* Submit Listing Button */}
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit} // Trigger handleSubmit on click
                            disabled={uploading}
                        >
                            <Text style={styles.submitButtonText}>Submit Listing</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    dropdownContainer: {
        marginBottom: 20,
    },
    inputWrapper: {
        backgroundColor: "#fff",
    },
    input: {
        backgroundColor: "#fff",
    },
    buttonContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    pickButton: {
        width: 350,
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
    imageContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
    noImageText: {
        textAlign: "center",
        color: "#888",
        marginTop: 20,
        marginBottom: 50,
    },
    submitButton: {
        width: 200,
        height: 40,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        margin: 50,
    },
    submitButtonText: {
        color: "#E8CDB2",
        fontSize: 18,
    },
});
