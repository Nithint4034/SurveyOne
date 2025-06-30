import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import PropTypes from 'prop-types'; // Add prop-types for type checking

const LocationPicker = ({ onLocationChange, currentLocation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize location from props
  useEffect(() => {
    if (currentLocation && (currentLocation.latitude && currentLocation.longitude)) {
      setLocation({
        latitude: parseFloat(currentLocation.latitude),
        longitude: parseFloat(currentLocation.longitude)
      });
    }
  }, [currentLocation]);

  const getCurrentLocation = async () => {
    setIsLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert('Permission Denied', 'Location permission is required to get your current coordinates.');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
      setLocation(coords);
      onLocationChange(coords);
      setErrorMsg(null);
    } catch (error) {
      setErrorMsg('Error getting location');
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Could not get your current location. Please try again.');
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
          style={styles.button} 
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

// Add prop type validation
LocationPicker.propTypes = {
  onLocationChange: PropTypes.func.isRequired,
  currentLocation: PropTypes.shape({
    latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })
};

LocationPicker.defaultProps = {
  currentLocation: null
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
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
  },
});

export default LocationPicker;