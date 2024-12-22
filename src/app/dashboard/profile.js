import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Avatar, Icon } from "react-native-paper";
import { useRouter } from "expo-router";
import supabase from "../../../supabase";

export default function Profile() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [school, setSchool] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                // Get the logged-in user's details
                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError || !user) {
                    throw new Error("User not logged in");
                }

                // Fetch user details from the database
                const { data: userDetails, error: userDetailsError } = await supabase
                    .from('users')
                    .select('name, email, phone_number, university_id')
                    .eq('email', user.email)
                    .single();

                if (userDetailsError) {
                    throw userDetailsError;
                }

                // Fetch the university name
                const { data: universityDetails, error: universityError } = await supabase
                    .from('universities')
                    .select('name')
                    .eq('university_id', userDetails.university_id)
                    .single();

                if (universityError) {
                    throw universityError;
                }

                // Update the state
                setName(userDetails.name);
                setEmail(userDetails.email);
                setPhone(userDetails.phone_number);
                setSchool(universityDetails.name);
            } catch (error) {
                console.error("Error fetching user details:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Details</Text>
                <Avatar.Image size={200} source={require('../../../assets/img/avatar.png')} />
                <Text style={styles.userName}>{name}</Text>
            </View>
            <ScrollView>
            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Icon source="email" color="black" size={30} style={styles.icon} />
                    <Text style={styles.infoText}>Email: {email}</Text>
                </View>

                <View style={styles.infoItem}>
                    <Icon source="phone" color="black" size={30} style={styles.icon} />
                    <Text style={styles.infoText}>Phone: {phone}</Text>
                </View>

                <View style={styles.infoItem}>
                    <Icon source="map-marker-radius-outline" color="black" size={30} style={styles.icon} />
                    <Text style={styles.infoText}>School: {school}</Text>
                </View>
            </View>
            </ScrollView>
            <View style={styles.submitContainer}>
                <TouchableOpacity style={styles.button} onPress={() => router.replace('/')}>
                    <Text style={styles.buttonText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5', // Light background for better contrast
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D9D9D9',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingVertical: 30,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // For Android shadow effect
    },
    headerText: {
        fontSize: 26,
        fontWeight: '400',
        color: 'black',
        marginBottom: 10,
    },
    userName: {
        fontSize: 22,
        fontWeight: '600',
        color: 'black',
        marginTop: 15,
    },
    infoContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    icon: {
        marginRight: 15,
        backgroundColor: '#E0E0E0', // Light gray background for icons
        borderRadius: 50,
        padding: 5,
    },
    infoText: {
        fontSize: 18,
        fontWeight: '400',
        color: '#333333',
        flexShrink: 1, // Allows text to wrap if needed
    },
    submitContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        width: '80%',
        paddingVertical: 14,
        backgroundColor: '#000', // Vibrant orange for the button
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonText: {
        color: '#E8CDB2',
        fontSize: 18,
        fontWeight: '700',
    },
});
