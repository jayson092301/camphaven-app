import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Avatar } from "react-native-paper";
import { useRouter } from "expo-router";
import supabase from "../../../../supabase";

export default function Profile() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [school, setSchool] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false); // Toggle editing mode

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError || !user) {
                    throw new Error("User not logged in");
                }

                const { data: userDetails, error: userDetailsError } = await supabase
                    .from('users')
                    .select('name, email, phone_number, university_id')
                    .eq('email', user.email)
                    .single();

                if (userDetailsError) {
                    throw userDetailsError;
                }

                const { data: universityDetails, error: universityError } = await supabase
                    .from('universities')
                    .select('name')
                    .eq('university_id', userDetails.university_id)
                    .single();

                if (universityError) {
                    throw universityError;
                }

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

    const handleSave = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('users')
                .update({ name, phone_number: phone })
                .eq('email', email);

            if (error) {
                throw error;
            }

            Alert.alert("Success", "Your details have been updated.");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating user details:", error.message);
            Alert.alert("Error", "Failed to update details.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView>
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Profile Details</Text>
                <Avatar.Image size={200} source={require('../../../../assets/img/avatar.png')} />
            </View>
            
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Name:</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    editable={isEditing}
                />

                <Text style={styles.label}>Email:</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: '#eaeaea' }]}
                    value={email}
                    editable={false} // Email should not be editable
                />

                <Text style={styles.label}>Phone:</Text>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    editable={isEditing}
                />

                <Text style={styles.label}>School:</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: '#eaeaea' }]}
                    value={school}
                    editable={false} // School name is not directly editable
                />
            </View>
            
            <View style={styles.buttonContainer}>
                {isEditing ? (
                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={[styles.button]}
                    onPress={() => router.replace('/')}
                >
                    <Text style={styles.buttonText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    infoContainer: {
        marginVertical: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        width:100
    },
    buttonText: {
        color: '#E8CDB2',
        fontSize: 16,
        textAlign:"center"
    },
});
