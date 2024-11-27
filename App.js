import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Login from './src/Login';
import styles from './.expo/Style';
import Signin from './src/Signin';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
    <View>
      <Login/>
      <StatusBar style="auto" />
    </View>
    </SafeAreaView>
  );
}


