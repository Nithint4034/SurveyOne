import { View, Text, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import QuestionsScreen from '../screens/QuestionsScreen';

const Tab = createBottomTabNavigator();

const CustomHeaderTitlePro = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <View style={{ flexDirection: 'col', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
        <Image
          source={require('../assets/icon.jpg')}
          style={{ width: 50, height: 50 }}
        />
      </View>
    </View>
    <View style={{ marginLeft: 70, alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4A4947' }}>KMEA Survey User</Text>
      <Text style={{ fontSize: 14, color: 'gray' }}>Version - 0.0.1</Text>
    </View>
  </View>
);

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#B17457',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: '#FAF7F0',
          height: 60,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        headerStyle: {
          backgroundColor: '#FAF7F0',
        },
        keyboardHidesTabBar: true, // This hides the tab bar when keyboard appears
      }}
    >
      <Tab.Screen
        name="Map"
        component={QuestionsScreen}
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
    </Tab.Navigator>
  );
}

export default TabNavigator;