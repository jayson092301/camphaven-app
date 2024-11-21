import { View } from "react-native";
import styles from "../.expo/Style";
import { Icon } from "react-native-paper";

export default function Signin () {
    return(
        <View style={styles.signIncont}>
            <View style={styles.Signincontainer}>
                <Icon
                source="arrow-left"
                size={20}
                />
            </View>
            <View>
                <Icon
                source="dots-vertical"
                size={20}
                />
            </View>
        </View>
    );
} 