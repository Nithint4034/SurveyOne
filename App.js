import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ImageBackground } from 'react-native';
import LoginProvider from './context/LoginProvider';
import AppNavigator from './navigators/AppNavigator';

export default function App() {

  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (splash) {
    return (
      <ImageBackground
        source={require('./assets/UISplash.png')}
        style={styles.splashBackground}
        resizeMode="cover"
      >
        <StatusBar backgroundColor="#C1BAA1" barStyle="dark-content" />
      </ImageBackground>
    );
  }

  return (
    <LoginProvider>
      <NavigationContainer>
        <StatusBar backgroundColor="#C1BAA1" barStyle="dark-content" />
        <AppNavigator />
      </NavigationContainer>
    </LoginProvider>
  );
}

const styles = StyleSheet.create({
  splashBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});