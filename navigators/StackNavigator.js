import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import AdminTabNavigator from './AdminTabNavigator'; // Make sure to create this file
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

const Stack = createStackNavigator();

function StackNavigator() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const userRole = await AsyncStorage.getItem('role');
        setRole(userRole);
      } catch (error) {
        console.error('Error fetching role:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="MapMain"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FAF7F0', 
        },
        headerTintColor: '#4A4947', 
      }}
    >
      {/* Remove header for Map screen */}
      <Stack.Screen 
        name="MapMain" 
        component={role === 'admin' ? AdminTabNavigator : TabNavigator} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}

export default StackNavigator;