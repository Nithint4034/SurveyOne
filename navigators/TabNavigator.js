import React from 'react';
import { View, Text, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from '../screens/MapScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import Demo from '../screens/Demo';

const Tab = createBottomTabNavigator();

const CustomHeaderTitlePro = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <View style={{ flexDirection: 'col', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center',marginLeft: 15 }}>
        <Image
          source={require('../assets/Log1.png')}
          style={{ width: 65, height: 45 }}
        />
        <Image
          source={require('../assets/Log2.png')}
          style={{ width: 42, height: 42, marginLeft: 20 }}
        />
      </View>
    </View>
    <View style={{ marginLeft: 35, alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4A4947' }}>Plot D2D Survey</Text>
      <Text style={{ fontSize: 14, color: 'gray' }}>Version - 0.0.1</Text>
    </View>
  </View>
);

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#B17457', // Active label color
        tabBarInactiveTintColor: 'gray', // Inactive label color
        tabBarLabelStyle: {
          fontSize: 14, // Increase font size
          fontWeight: 'bold', // Make label bold (optional)
        },
        tabBarStyle: {
          backgroundColor: '#FAF7F0', // Set the footer background color (tab bar)
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#FAF7F0', // Set the header background color
        },
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="map-outline" color={color} size={size} />
          ),
          tabBarLabel: 'Map',
          headerTitle: () => <CustomHeaderTitlePro />,
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="stats-chart-outline" color={color} size={size} />
          ),
          tabBarLabel: 'Dashboard',
          headerTitle: () => <CustomHeaderTitlePro />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          ),
          tabBarLabel: 'Profile',
          headerTitle: () => <CustomHeaderTitlePro />,
        }}
      />
      {/* <Tab.Screen
        name="Demo"
        component={Demo}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          ),
          tabBarLabel: 'Demo',
          headerTitle: () => <CustomHeaderTitlePro />,
        }}
      /> */}
    </Tab.Navigator>
  );
}

export default TabNavigator;
