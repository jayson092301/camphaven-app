import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function (){
    return(
        <View style={{alignItems:'center', justifyContent:'center'}}>
            <View>
                <Text style={{textAlign:'center', fontSize:24, fontWeight:'bold', margin:100}}>So, what's the move?</Text>
            </View>
            <View style={{backgroundColor: '#D9D9D9', padding:75, borderRadius: 10,}}>
                <TouchableOpacity style={styles.button} onPress={() => console.log('Press')}>
                    <Text style={styles.buttonText}>Add Camp Listing</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => console.log('Press')}>
                    <Text style={styles.buttonText}>Manage Renters</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => console.log('Press')}>
                    <Text style={styles.buttonText}>Manage Bookings</Text>
                </TouchableOpacity>
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