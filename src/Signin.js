import { Text, View } from "react-native";
import { Icon } from "react-native-paper";

export default function Signin(){
    return(
        <View style={{backgroundColor:'#fff',}}>
            <View style={{flexDirection:'row'}}>
                <View style={{marginRight:370}}>
                    <Icon
                    source="arrow-left"
                    size={20}/>
                </View>
                <View>
                    <Icon
                    source="dots-vertical"
                    size={20}
                />
                </View>
            </View>
            <View style={{marginTop:50}}>
                <Text style={{fontSize:40}}>Welcome Back.</Text>
                <Text style={{fontSize:50}}>You've been missed!</Text>
            </View>
        </View>
    );
}