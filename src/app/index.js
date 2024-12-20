import * as React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';

export default function Login() {
    const [fontsLoaded] = useFonts({
        Italiano: require('../../assets/fonts/Italianno-Regular.ttf'),
    });
    
    const router = useRouter();

    if (!fontsLoaded) {
        return null; // Show nothing until fonts are loaded
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../../assets/img/logo.png')}
                    style={styles.logo}
                />
            </View>

            <View style={styles.formContainer}>
                <TouchableOpacity style={styles.button} onPress={() => router.push('signin')}>
                    <Text style={styles.buttonText}>Log in</Text>
                </TouchableOpacity>
                
                <Text style={styles.orText}>or</Text>
                
                <TouchableOpacity 
                    style={styles.signupButton} 
                    onPress={() => router.push('registrationForm')}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'flex-start',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    logo: {
        height: 200,
        width: 450,
        marginBottom: 200,
    },
    formContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 100,
        borderTopRightRadius: 100,
        padding: 20,
        flex: 1,
        justifyContent: 'center',
    },
    button: {
        width: "100%",
        paddingVertical: 12,
        backgroundColor: "#000",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#E8CDB2",
        fontSize: 18,
        fontWeight: "600",
    },
    orText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 15,
        marginVertical: 10,
    },
    signupButton: {
        width: "100%",
        paddingVertical: 12,
        backgroundColor: "#000",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    }
});
