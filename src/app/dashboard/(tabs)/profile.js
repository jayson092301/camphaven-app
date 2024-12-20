import React from "react";
import { View, Text } from "react-native";
import { Avatar, Icon } from "react-native-paper";

export default function Profile() {
    return(
        <View>
            <View style={{justifyContent:'center', alignItems:'center', backgroundColor: '#D9D9D9', borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}>
                <View style={{margin:10}}>
                    <Text style={{fontSize:24, fontWeight:'100'}}>Details</Text>
                </View>
                <View>
                    <Avatar.Image size={200} source={require('../../../../assets/img/avatar.png')} />
                </View>
                <View style={{margin:10}}>
                    <Text style={{fontSize:24, fontWeight:'500'}}>Daniel Jayson</Text>
                </View>
            </View>
            <View>
                <View style={{margin:10}}>
                    <View>
                        <View>
                            <Icon
                                source="email"
                                color='black'
                                size={30}
                                style={{margin:10}}
                            />
                        </View>
                        <View>
                            <Text> Email Address</Text>
                        </View>
                    </View>
                </View>
                <View style={{margin:10}}>
                <View>
                    <View>
                        <Icon
                            source="phone"
                            color='black'
                            size={30}
                            style={{margin:10}}
                        />
                    </View>
                    <View>
                        <Text> Phone Number</Text>
                    </View>
                </View>
                </View>

            </View>
        </View>
    )
}