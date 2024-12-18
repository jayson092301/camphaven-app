import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { Searchbar } from "react-native-paper";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import supabase from "../../../../supabase"; // Import supabase client

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [images, setImages] = useState([]); // State to store images
    const [filteredData, setFilteredData] = useState([]); // Filtered search results
    const [selected, setSelected] = useState(""); // Track the selected button
    const [fontsLoaded] = useFonts({
        Italiano: require("../../../../assets/fonts/Italianno-Regular.ttf"),
    });
    const router = useRouter();

    // Function to fetch data based on the type
    const fetchData = async (type) => {
        let tableMapping = {
            Room: { table: "room", foreignKey: "room_listing_id" },
            Apartment: { table: "apartment", foreignKey: "apartment_listing_id" },
            Dorm: { table: "dorm", foreignKey: "dorm_listing_id" },
        };
    
        // Default fetch for "All" types
        if (type === "All") {
            const types = ["Room", "Apartment", "Dorm"];
            const allData = [];
            for (let type of types) {
                const { table, foreignKey } = tableMapping[type] || {};
                if (table) {
                    try {
                        const { data: records, error: tableError } = await supabase.from(table).select("*");
                        if (tableError) throw tableError;
    
                        const imagePromises = records.map(async (record) => {
                            const { data: images, error: imageError } = await supabase
                                .from("tblimage")
                                .select("image_url, is_primary, image_id") 
                                .eq(foreignKey, record.listing_id);
    
                            if (imageError) console.error("Image fetch error:", imageError);
    
                            const primaryImage = images?.find((img) => img.is_primary) || images?.[0];
                            return {
                                ...record,
                                type: type, // Explicitly assign the type
                                image: primaryImage?.image_url || null,
                                image_id: primaryImage?.image_id,
                            };
                        });
    
                        const results = await Promise.all(imagePromises);
                        allData.push(...results);
                    } catch (error) {
                        console.error("Error fetching data:", error);
                    }
                }
            }
            setImages(allData);
            setFilteredData(allData); // Initialize filtered data
        } else {
            const { table, foreignKey } = tableMapping[type] || {};
            if (!table) return;
    
            try {
                const { data: records, error: tableError } = await supabase.from(table).select("*");
                if (tableError) throw tableError;
    
                const imagePromises = records.map(async (record) => {
                    const { data: images, error: imageError } = await supabase
                        .from("tblimage")
                        .select("image_url, is_primary, image_id")
                        .eq(foreignKey, record.listing_id);
    
                    if (imageError) console.error("Image fetch error:", imageError);
    
                    const primaryImage = images?.find((img) => img.is_primary) || images?.[0];
                    return {
                        ...record,
                        type: type,  // Explicitly assign the type for each record
                        image: primaryImage?.image_url || null,
                        image_id: primaryImage?.image_id,
                        listing_id: record.listing_id,
                    };
                });
    
                const results = await Promise.all(imagePromises);
                setImages(results);
                setFilteredData(results); // Initialize filtered data
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    };
    

    // Filter data based on search query
    useEffect(() => {
        const filtered = images.filter((item) =>
            item.title?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchQuery, images]);

    useEffect(() => {
        if (!selected) {
            fetchData("All"); // Default to "All" when no button is selected
        }
    }, [selected]);

    return (
        <View style={styles.container}>
            {/* Title */}
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Let's find the best place to live!</Text>
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
            <Text style={styles.subtitle}>Search for . . .</Text>

            {/* Buttons */}
            <View style={styles.buttonRow}>
                {["All", "Apartment", "Room", "Dorm"].map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[
                            styles.button,
                            selected === type && styles.buttonSelected,
                        ]}
                        onPress={() => {
                            setSelected(type);
                            fetchData(type);
                        }}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                selected === type && styles.buttonTextSelected,
                            ]}
                        >
                            {type}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Scrollable Content */}
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                        <View key={index} style={styles.cardContainer}>
                            {/* Image with TouchableOpacity */}
                            {item.image ? (
                                <TouchableOpacity
                                onPress={() => {
                                    // Navigate to the details page with the listing_id
                                        console.log('Item:', item);
                                        console.log(`/dashboard/details/${item.type}/${item.listing_id}`);
                                        router.push(`/dashboard/details/${item.type}/${item.listing_id}`);
                                }}
                            >
                                <Image source={{ uri: item.image }} style={styles.image} />
                            </TouchableOpacity>
                            ) : (
                                <Text style={styles.noImageText}>No images available</Text>
                            )}

                            {/* Details */}
                            <View style={styles.detailsContainer}>
                                <Text style={styles.titleText}>{item.title}</Text>
                                <Text style={styles.addressText}>{item.address}</Text>
                                <Text style={styles.priceText}>₱ {item.price}</Text>
                                <Text style={styles.amenitiesText}>
                                    {item.amenities
                                        ? Object.keys(JSON.parse(item.amenities))
                                              .filter((key) => JSON.parse(item.amenities)[key])
                                              .map((key, index, arr) => (
                                                  <Text key={index}>
                                                      {key}
                                                      {index < arr.length - 1 && " | "}
                                                  </Text>
                                              ))
                                        : "Amenities: None"}
                                </Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noDataText}>No data found</Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 20 },
    titleContainer: { alignItems: "center", marginBottom: 20 },
    titleText: { fontFamily: "Italianno", fontSize: 30 },
    searchContainer: { marginBottom: 20 },
    subtitle: { fontSize: 20, marginBottom: 10 },
    buttonRow: { flexDirection: "row", justifyContent: "space-between" },
    button: {
        width: 90,
        paddingVertical: 10,
        backgroundColor: "#ccc",
        borderRadius: 5,
        alignItems: "center",
        marginVertical: 5,
    },
    buttonSelected: { backgroundColor: "#000" },
    buttonText: { color: "#000", fontSize: 16 },
    buttonTextSelected: { color: "#E8CDB2" },
    scrollContainer: { flex: 1, marginTop: 10 },
    cardContainer: {
        marginVertical: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        overflow: "hidden",
        elevation: 3,
    },
    image: { width: "100%", height: 200 },
    detailsContainer: { padding: 10, backgroundColor: "#fff" },
    addressText: { fontSize: 16, color: "#555", marginBottom: 5 },
    priceText: { fontSize: 18, fontWeight: "600", color: "#007BFF", marginBottom: 5 },
    amenitiesText: { fontSize: 14, color: "#777" },
    noImageText: { textAlign: "center", color: "#999", fontSize: 16, marginVertical: 10 },
    noDataText: { textAlign: "center", fontSize: 18, color: "#999", marginTop: 20 },
});
