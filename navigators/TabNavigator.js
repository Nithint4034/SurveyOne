import { View, Text, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import QuestionsScreen from '../screens/QuestionsScreen';


const Tab = createBottomTabNavigator();

const CustomHeaderTitlePro = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <View style={{ marginLeft:10,flexDirection: 'row', alignItems: 'center' }}>
      <Image
        source={require('../assets/icon2.png')}
        style={{ width: 40, height: 50, marginRight: 10 }}
      />
      <Image
        source={require('../assets/icon1.png')}
        style={{ width: 50, height: 50 }}
      />
    </View>
    <View style={{ marginLeft: 35, alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4A4947' }}>PMKSY Survey User</Text>
      <Text style={{ fontSize: 14, color: 'gray' }}>Version - 1.0.1</Text>
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
        tabBarHideOnKeyboard: true, 
      }}
    >
      <Tab.Screen
  name="Survey"
  component={QuestionsScreen}
  options={{
    tabBarIcon: ({ color, size }) => (
      <Icon name="create-outline" color={color} size={size} />
    ),
    tabBarLabel: 'Survey',
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