import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';  // Import MaterialIcons

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [markerCoordinate, setMarkerCoordinate] = useState(null);  // Initialize with null
  const [mapType, setMapType] = useState('standard'); // State for map type

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

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
  };

  const buttonStyle = {
    backgroundColor: mapType === 'satellite' ? '#B17457' : '#4A4947',
  };

  return (
    <View style={styles.container}>
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
          onPress={handleMapPress}  // This listens for tap on map
          mapType={mapType} // Set the map type based on state
        >
          {/* Only render marker if markerCoordinate is set */}
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
        </MapView>
      )}

      {/* Plus icon to add marker */}
      <TouchableOpacity 
        style={[styles.plusButton, buttonStyle]} 
        onPress={() => {
          // This will create the marker at the user's current location
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
});
