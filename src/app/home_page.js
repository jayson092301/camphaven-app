import React from "react";
import { View, Text, Button } from "react-native";
import { IconButton, Searchbar } from "react-native-paper";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";

export default function HomePage() {

    const [searchQuery, setSearchQuery] = React.useState('');
    const [fontsLoaded] = useFonts({Italiano: require('../../assets/fonts/Italianno-Regular.ttf'),});
    const router = useRouter();

    return(
        <View>
            <View style = {{flexDirection: 'row', justifyContent:'space-between'}}>
                <View>
                    <IconButton
                        icon="menu"
                        iconColor={'#000'}
                        size={20}
                        onPress={() => console.log('tuplok')}
                    />
                </View>
                <View>
                    <IconButton
                        icon="account-circle-outline"
                        iconColor={'#000'}
                        size={20}
                        onPress={() => console.log('oplot')}
                    />
                </View>
            </View>
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
                   
                />
            </View>
        </View>
    )
}