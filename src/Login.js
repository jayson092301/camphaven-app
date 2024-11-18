import * as React from 'react';
import { View, Image, Text } from "react-native";
import styles from "../.expo/Style";
import { Button } from "react-native-paper";


export default function Login() {
    return(
        <View>
            <View>
                <Image
                source={require('../assets/img/logo.png')}
                style={styles.logo}/>
            </View>
            <View style={{backgroundColor:'#fff', margin:10, borderTopLeftRadius: 100, borderTopRightRadius: 100}}>
                <View style={styles.btnlogin}>
                    <Button mode="outlined" onPress={() => console.log('Pressed')} labelStyle={{ color: '#E8CDB2', fontSize: 15 }}>
                        Log in
                    </Button>
                </View>
                <View>
                    <Text style={{ color: 'black', textAlign: 'center', margin:20, fontSize:15}}>or</Text>
                </View>
                <View style={styles.btnsignup}>
                    <Button mode="outlined" onPress={() => console.log('Pressed')} labelStyle={{ color: '#E8CDB2', fontSize: 15 }}>
                        Sign Up
                    </Button>
                </View>
            </View>
        </View>
    );
}