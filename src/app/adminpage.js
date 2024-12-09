import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import {  useRouter } from "expo-router";

export default function Admi_Page() {
    const router = useRouter();
    return(
        <View style={{flex:1}}>
            <View style={{ marginLeft: 10 }}>
                <IconButton
                    icon="arrow-left"
                    size={20}
                    onPress={() => router.back()}
                />
            </View>
            <View style={{justifyContent:'center', alignItems:'center', flexDirection: 'column', marginTop:250}}>
                <View>
                    <TouchableOpacity style={styles.button} onPress={() => console.log('manage listing')}>
                        <Text style={styles.buttonText}>Manage Listing</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity style={styles.button} onPress={() => console.log('user management')}>
                        <Text style={styles.buttonText}>User Management</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
button: {
    width: 200, // Set button width
    height: 60, // Set button height
    backgroundColor: "#000", // Button background color
    justifyContent: "center", // Center text vertically
    alignItems: "center", // Center text horizontally
    borderRadius: 10, // Rounded corners
    margin:10
},
buttonText: {
    color: "#E8CDB2", // Text color
    fontSize: 18, // Text size
},

})