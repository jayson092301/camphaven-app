import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { IconButton } from "react-native-paper";
import { useFonts } from "expo-font";

export default function Register() {

    const router=useRouter();
    const [fontsLoaded] = useFonts({
        Italiano: require('../../assets/fonts/Italianno-Regular.ttf'),
      });

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
        </View>
    )
}