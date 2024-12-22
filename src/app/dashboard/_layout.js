import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from 'expo-router/drawer'

export default function DrawerLayout() {
    return(
        <GestureHandlerRootView style={{flex: 1}}>
            <Drawer>
                <Drawer.Screen
                name="(tabs)"
                options={{
                    drawerLabel:'Home',
                    title: 'Menu'
                }}/>
                <Drawer.Screen
                name="profile"
                options={{
                    drawerLabel:'Profile',
                    title: 'Details'
                }}/>
            </Drawer>
        </GestureHandlerRootView>
    )
}