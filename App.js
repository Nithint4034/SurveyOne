import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ImageBackground } from 'react-native';
import LoginProvider from './context/LoginProvider';
import AppNavigator from './navigators/AppNavigator';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);

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
        <StatusBar backgroundColor="#4A4947" barStyle="light-content" />
      </ImageBackground>
    );
  }

  return (
    <LoginProvider>
      <NavigationContainer>
        <StatusBar backgroundColor="#4A4947" barStyle="light-content" />
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