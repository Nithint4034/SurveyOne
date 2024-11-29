// App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigators/StackNavigator';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Image } from 'react-native';

export default function App() {
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    // Simulating a delay for splash screen
    const timer = setTimeout(() => {
      setSplash(false);
    }, 3000); // Adjust the duration as needed
    return () => clearTimeout(timer);
  }, []);

  if (splash) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#074173" barStyle="light-content" />
        <Image
          source={require("./assets/splash-icon.png")}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </View>
    );
  };

  return (
      <NavigationContainer>
        <StatusBar backgroundColor="#074173" barStyle="light-content" />
        <StackNavigator />
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  splashImage: {
    width: "100%",
    height: "200%",
    marginTop: 0,
  },
});