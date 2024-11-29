// navigators/StackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MapDetailsScreen from '../screens/MapDetailsScreen';
import TabNavigator from './TabNavigator';


const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="MapMain">
      {/* Remove header for Map screen */}
      <Stack.Screen 
        name="MapMain" 
        component={TabNavigator} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="MapDetails" 
        component={MapDetailsScreen} 
        options={{ title: 'Enter Plot Details' }}
      />
    </Stack.Navigator>
  );
}

export default StackNavigator;
