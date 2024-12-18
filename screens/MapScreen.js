import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { FontAwesome6 } from '@expo/vector-icons';


export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [markerCoordinate, setMarkerCoordinate] = useState(null);
  const [mapType, setMapType] = useState('standard');
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setLoading(false);
    })();
  }, []);


  useFocusEffect(
    React.useCallback(() => {
      setMarkerCoordinate(null);
      
    }, [])
  );

 const fetchMarkerLocation = async () => {
  setLoading(true);
  try {
    const response = await axios.get('https://nithint.pythonanywhere.com/locations/');

    if (response.status !== 200) {
      throw new Error('Failed to fetch marker data.');
    }

    const data = response.data;

    if (Array.isArray(data)) {
      setMarkers(
        data.map((item) => ({
          latitude: parseFloat(item.Latitude),
          longitude: parseFloat(item.Longitude),
          title: item.OwnerName || 'Unknown',
          description: item.PlotNo || 'No Plot Info',
        }))
      );
    } else {
      throw new Error('Invalid response format.');
    }
  } catch (error) {
    Alert.alert('Error', error.message || 'An error occurred while fetching marker data.');
  } finally {
    setLoading(false);
  }
};


  const handleMarkerDragEnd = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerCoordinate({ latitude, longitude });
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerCoordinate({ latitude, longitude });
  };

  const handleRefresh = () => {
    setMarkerCoordinate(null);
    fetchMarkerLocation();
  };

  const buttonStyle = {
    backgroundColor: mapType === 'satellite' ? '#B17457' : '#4A4947',
  };

  return (
    <View style={styles.container}>
      {/* Loader Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={loading}
        onRequestClose={() => { }}
      >
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </Modal>

      {location && (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          followsUserLocation={true}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0022,
            longitudeDelta: 0.0022,
          }}
          onPress={handleMapPress}
          mapType={mapType}
        >

          {markerCoordinate && (
            <Marker
              coordinate={markerCoordinate}
              draggable
              onDragEnd={handleMarkerDragEnd}
              onPress={() =>
                navigation.navigate('MapDetails', {
                  latitude: markerCoordinate.latitude,
                  longitude: markerCoordinate.longitude,
                })
              }
            />
          )}

{markers.map((marker, index) => (
  <Marker
    key={index}
    coordinate={{
      latitude: marker.latitude,
      longitude: marker.longitude,
    }}
    title={marker.title} // Display title
    description={marker.description} // Display description
  >
    <View>
      <FontAwesome6 name="location-dot" size={13} color="#C40C0C" />
    </View>
  </Marker>
))}


        </MapView>
      )}

      {/* Plus icon to add marker */}
      <TouchableOpacity
        style={[styles.plusButton, buttonStyle]}
        onPress={async () => {
          const isLocationEnabled = await Location.hasServicesEnabledAsync();
          if (!isLocationEnabled) {
            Alert.alert(
              'Location Disabled',
              'Turn on device location to add a marker at your current location.'
            );
            return;
          }

          if (location) {
            setMarkerCoordinate(location); // Set marker on press of the plus icon
          }
        }}
      >
        <Icon
          name="add" // Plus icon
          size={30}   // Icon size
          color="white" // Icon color
        />
      </TouchableOpacity>

      {/* Layer toggle button with conditional background color */}
      <TouchableOpacity
        style={[styles.layerButton, buttonStyle]}
        onPress={() => {
          // Toggle between standard and satellite map layers
          setMapType((prevType) => (prevType === 'standard' ? 'satellite' : 'standard'));
        }}
      >
        <Icon
          name="layers" // Layers icon
          size={30}   // Icon size
          color="white" // Icon color
        />
      </TouchableOpacity>

      {/* Refresh button to reset marker */}
      <TouchableOpacity
        style={[styles.refreshButton, buttonStyle]}
        onPress={handleRefresh}  // Reset marker when refresh button is pressed
      >
        <Icon
          name="refresh" // Refresh icon
          size={30}   // Icon size
          color="white" // Icon color
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  plusButton: {
    position: 'absolute',
    bottom: 70,
    right: 25,
    borderRadius: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  layerButton: {
    position: 'absolute',
    bottom: 140, // Adjust the position below the plus button
    right: 25,
    borderRadius: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    position: 'absolute',
    bottom: 210, // Adjust the position below the layer button
    right: 25,
    borderRadius: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
});
