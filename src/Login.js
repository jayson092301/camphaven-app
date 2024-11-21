import * as React from 'react';
import { View, Image, Text } from "react-native";
import styles from "../.expo/Style";
import { Button } from "react-native-paper";


export default function Login() {
    return(
        <View style={{backgroundColor:'black'}}>
            <View>
                <View>
                    <Image
                    source={require('../assets/img/logo.png')}
                    style={{height:200, width:500, marginBottom:200, marginTop: 100}}/>
                </View>
            </View>
            <View style={{backgroundColor:'#fff', borderTopLeftRadius: 100, borderTopRightRadius: 100}}>
                <View style={{backgroundColor:'#000', borderRadius:20, marginLeft:80, marginRight:80, marginTop: 80}}>
                    <Button mode="outlined" onPress={() => console.log('Pressed')} labelStyle={{ color: '#E8CDB2', fontSize: 15 }}>
                        Log in
                    </Button>
                </View>
                <View>
                    <Text style={{ color: 'black', textAlign: 'center', margin:20, fontSize:15}}>or</Text>
                </View>
                <View style={{backgroundColor:'#000', borderRadius:20, marginLeft:80, marginRight:80,}}>
                    <Button mode="outlined" onPress={() => console.log('Pressed')} labelStyle={{ color: '#E8CDB2', fontSize: 15 }}>
                        Sign Up
                    </Button>
                </View>
            </View>
        </View>
    );
}