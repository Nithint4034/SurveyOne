import { View, Text, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import AdminDownload from '../screens/AdminDownload';

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
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4A4947' }}>KMEA Survey Admin</Text>
      <Text style={{ fontSize: 14, color: 'gray' }}>Version - 0.0.1</Text>
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