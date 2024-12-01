import React from "react";
import { View, Text, Button } from "react-native";
import { IconButton, Searchbar } from "react-native-paper";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";

export default function HomePage() {

    const [searchQuery, setSearchQuery] = React.useState('');
    const [fontsLoaded] = useFonts({Italiano: require('../../../../assets/fonts/Italianno-Regular.ttf'),});
    const router = useRouter();

    return(
        <View>
            <View style = {{alignItems:'center', }}>
                <Text style =  {{fontFamily: 'Italianno', fontSize:30}}>  
                Lets find best place to live!
                </Text>
            </View>
            <View style={{margin:20}}>
                <Searchbar
                    placeholder="Search"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                />
            </View>
            <View>
                <Text>
                    Category
                </Text>
            </View>
            <View>
                <Button
                    title="Learn More"
                    color="#000"
                    onPress={() => console.log('hello')}
                   
                />
            </View>
        </View>
    )
}