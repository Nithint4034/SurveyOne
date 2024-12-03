import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';  // Import MaterialIcons

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [markerCoordinate, setMarkerCoordinate] = useState(null);  // Initialize with null

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
        style={styles.plusButton} 
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
    bottom: 30,
    right: 25,
    backgroundColor: '#000',
    borderRadius: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
