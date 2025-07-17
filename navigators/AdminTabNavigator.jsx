import { View, Text, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import AdminDownload from '../screens/AdminDownload';

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
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4A4947' }}>PMKSY Survey Admin</Text>
      <Text style={{ fontSize: 14, color: 'gray' }}>Version - 1.0.0</Text>
    </View>
  </View>
);

function AdminTabNavigator() {
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
        },
        headerStyle: {
          backgroundColor: '#FAF7F0', 
        },
        tabBarHideOnKeyboard: true
      }}
    >
      <Tab.Screen
        name="Downloads"
        component={AdminDownload}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="download-outline" color={color} size={size} />
          ),
          tabBarLabel: 'Downloads',
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

export default AdminTabNavigator;