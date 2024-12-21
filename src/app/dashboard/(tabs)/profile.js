import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, Icon } from "react-native-paper";
import { useRouter } from "expo-router";

export default function Profile() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Details</Text>
                <Avatar.Image size={200} source={require('../../../../assets/img/avatar.png')} />
                <Text style={styles.userName}>Daniel Jayson</Text>
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Icon source="email" color="black" size={30} style={styles.icon} />
                    <Text style={styles.infoText}>Email Address</Text>
                </View>

                <View style={styles.infoItem}>
                    <Icon source="phone" color="black" size={30} style={styles.icon} />
                    <Text style={styles.infoText}>Phone</Text>
                </View>

                <View style={styles.infoItem}>
                    <Icon source="map-marker-radius-outline" color="black" size={30} style={styles.icon} />
                    <Text style={styles.infoText}>School</Text>
                </View>
            </View>

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
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D9D9D9',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingVertical: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: '100',
    },
    userName: {
        fontSize: 24,
        fontWeight: '500',
        marginTop: 10,
    },
    infoContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    icon: {
        marginRight: 10,
    },
    infoText: {
        fontSize: 18,
    },
    submitContainer: {
        alignItems: 'center',
        marginTop: 30,
    },
    button: {
        width: '80%',
        paddingVertical: 12,
        backgroundColor: '#000',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#E8CDB2',
        fontSize: 18,
        fontWeight: '600',
    },
});
