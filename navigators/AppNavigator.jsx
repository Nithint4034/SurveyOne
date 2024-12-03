import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useLogin } from '../context/LoginProvider';
import Signin from '../screens/Signin';
import StackNavigator from './StackNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isLoggedIn, checkLoginStatus } = useLogin();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <Stack.Screen name="Main" component={StackNavigator} options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="Signin" component={Signin} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;