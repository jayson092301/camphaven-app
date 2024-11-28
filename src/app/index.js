import * as React from 'react';
import { View, Image, Text } from "react-native";
import styles from '../../.expo/Style';
import { Button } from "react-native-paper";
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';


export default function Login() {
    const [fontsLoaded] = useFonts({
        Italiano: require('../../assets/fonts/Italianno-Regular.ttf'),
      });
    const router = useRouter();
    return(
        <View style={{backgroundColor:'black'}}>
            <View>
                <View>
                    <Image
                    source={require('../../assets/img/logo.png')}
                    style={{height:200, width:450, marginBottom:200, marginTop: 100}}/>
                </View>
            </View>
            <View style={{backgroundColor:'#fff', borderTopLeftRadius: 100, borderTopRightRadius: 100}}>
                <View style={{backgroundColor:'#000', borderRadius:20, marginLeft:80, marginRight:80, marginTop: 80}}>
                    <Button mode="outlined" onPress={() => router.push('/signin')} labelStyle={{ color: '#E8CDB2', fontSize: 20, fontFamily:'Italianno' }}>
                        Log in
                    </Button>
                </View>
                <View>
                    <Text style={{ color: 'black', textAlign: 'center', margin:20, fontSize:15}}>or</Text>
                </View>
                <View style={{backgroundColor:'#000', borderRadius:20, marginLeft:80, marginRight:80, marginBottom:80}}>
                    <Button mode="outlined" onPress={() => router.push('/register')} labelStyle={{ color: '#E8CDB2', fontSize: 20, fontFamily:'Italianno' }}>
                        Sign Up
                    </Button>
                </View>
            </View>
        </View>
    );
}