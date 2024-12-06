import React from "react";
import { Tabs } from "expo-router";
import { Icon } from "react-native-paper";

export default function Dashboard() {
    return(
        <Tabs screenOptions={{ headerShown: false
        }}>
            <Tabs.Screen name = 'index'
                options={{
                    title:'Home',
                    tabBarIcon: ({focused}) => < Icon source = {focused ? 'home-variant': 'home-variant-outline'} size={24} color= 'black'/>
                }}
            />
            <Tabs.Screen name = 'notif'
                options={{
                    title:'Notification',
                    tabBarIcon: ({focused}) => < Icon source = {focused ? 'bell':'bell-outline'} size={24} color= 'black'/>
                }}
            />
            <Tabs.Screen name = 'profile'
                options={{
                    title:'Profile',
                    tabBarIcon: ({focused}) => < Icon source = {focused ? 'account':'account-outline'} size={24} color= 'black'/>
                }}
            />
        </Tabs>
    )
}