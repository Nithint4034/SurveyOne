import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import PropTypes from 'prop-types';

const LocationPicker = ({ 
  onLocationChange = () => {}, 
  currentLocation = null 
}) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize location from props
 useEffect(() => {
  if (currentLocation) {
    const lat = parseFloat(currentLocation.latitude);
    const lng = parseFloat(currentLocation.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      setLocation({ latitude: lat, longitude: lng });
    }
  } else {
    setLocation(null); // Clear the local state when currentLocation is null
  }
}, [currentLocation]);

  const getCurrentLocation = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      
      const newLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude,
      };
      
      setLocation(newLocation);
      onLocationChange(newLocation);
    } catch (error) {
      console.error('Location error:', error);
      setErrorMsg(error.message);
      Alert.alert('Location Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.locationContainer}>
        <Text style={styles.coordinatesText}>
          {location 
            ? `Lat: ${location.latitude.toFixed(6)}, Long: ${location.longitude.toFixed(6)}` 
            : 'No location selected'}
        </Text>
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={getCurrentLocation}
          disabled={isLoading}
        >
          <MaterialIcons 
            name={isLoading ? 'hourglass-empty' : 'my-location'} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
    </View>
  );
};

LocationPicker.propTypes = {
  onLocationChange: PropTypes.func,
  currentLocation: PropTypes.shape({
    latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  coordinatesText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  button: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#B17457',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
  },
});

export default LocationPicker;