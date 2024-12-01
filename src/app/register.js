import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { IconButton, Button } from "react-native-paper";
import { useFonts } from "expo-font";
import { TextInput} from "react-native-paper";



export default function Register() {

    const [text, setText] = React.useState("");
    const router=useRouter();
    const [fontsLoaded] = useFonts({Italiano: require('../../assets/fonts/Italianno-Regular.ttf'),});
    

    return(
        <View>
            <View style={{ marginLeft: 10,  }}>
                <IconButton
                    icon="arrow-left"  
                    size={20}
                    onPress={() => router.back()} 
                    />
            </View>
            <View style={{alignItems: 'center'}}>
                <Text style={{fontFamily:'Italianno', fontSize:40}}> Complete the following </Text>
            </View>
            <View style={{backgroundColor: '#D9D9D9', margin: 30}}>
                <TextInput
                    label="Full Name"
                    mode="outlined"
                    style={{margin:20, marginTop:50}}
                    value={text}
                    onChangeText={text => setText(text)}
                />
                <TextInput
                    label="Email Address"
                    mode="outlined"
                    style={{margin:20}}
                    value={text}
                    onChangeText={text => setText(text)}
                />
                <TextInput
                    label="Phone Number"
                    mode="outlined"
                    style={{margin:20}}
                    value={text}
                    onChangeText={text => setText(text)}
                />
                 <TextInput
                    label="Password"
                    mode="outlined"
                    secureTextEntry
                    style={{margin:20}}
                />
                <TextInput
                    label="University Name"
                    mode="outlined"
                    style={{margin:20, marginBottom:50}}
                    value={text}
                    onChangeText={text => setText(text)}
                />
            </View>
            <View style={{backgroundColor:'#000', borderRadius:20, marginLeft:80, marginRight:80, marginBottom:200}}>
                <Button mode="outlined" onPress={() => router.push('signin')} labelStyle={{ color: '#E8CDB2', fontSize: 20, fontFamily:'Italianno' }}>
                    Submit
                </Button>
            </View>
        </View>
    )
}