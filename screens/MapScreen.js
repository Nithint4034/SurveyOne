import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [markerCoordinate, setMarkerCoordinate] = useState(null);
  const [mapType, setMapType] = useState('standard');
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [watching, setWatching] = useState(false);
  const mapRef = useRef(null);

  // Check if the Plus button should be disabled
  const isMarkerVisible = markerCoordinate !== null;

  useEffect(() => {
    if (!watching) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLoading(false);
          return;
        }

        const locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 10000, // update every 10 seconds
            distanceInterval: 10, // update when the user moves 10 meters
          },
          (newLocation) => {
            setLocation(newLocation.coords);
          }
        );

        setWatching(locationSubscription); // Store the subscription to stop it later

        return () => locationSubscription.remove(); // Cleanup on unmount
      })();
    }
  }, [watching]);

  useEffect(() => {
    if (location) {
      fetchMarkerLocation();
    }
  }, [mapLoading]);

  useFocusEffect(
    React.useCallback(() => {
      fetchMarkerLocation();
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
        onRequestClose={() => {}}
      >
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </Modal>

      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          onMapReady={() => setMapLoading(false)}
          followsUserLocation={true}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          }}
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
              title={marker.title}
              description={marker.description}
              pinColor="#f4d03f"
            />
          ))}
        </MapView>
      )}

      <TouchableOpacity
        style={[styles.plusButton, buttonStyle, { opacity: isMarkerVisible ? 0.5 : 1 }]}  // Reduce opacity when disabled
        onPress={async () => {
          if (isMarkerVisible) return; // Don't add a marker if there's already one

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
        disabled={isMarkerVisible}  // Disable button if a marker is already placed
      >
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Layer toggle button with conditional background color */}
      <TouchableOpacity
        style={[styles.layerButton, buttonStyle]}
        onPress={() => {
          setMapType((prevType) => (prevType === 'standard' ? 'satellite' : 'standard'));
        }}
      >
        <Icon name="layers" size={30} color="white" />
      </TouchableOpacity>

      {/* Refresh button to reset marker */}
      <TouchableOpacity
        style={[styles.refreshButton, buttonStyle]}
        onPress={handleRefresh}
      >
        <Icon name="refresh" size={30} color="white" />
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
    bottom: 140,
    right: 25,
    borderRadius: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    position: 'absolute',
    bottom: 210,
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
