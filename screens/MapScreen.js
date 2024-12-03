import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [markerCoordinate, setMarkerCoordinate] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setMarkerCoordinate(currentLocation.coords);  
    })();
  }, []);

  const handleMarkerDragEnd = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerCoordinate({ latitude, longitude });  
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}  // This will show the blue dot
          followsUserLocation={true}  // This will follow user's location as they move
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0022,  // Adjust for zoom level
            longitudeDelta: 0.0022, // Adjust for zoom level
          }}
        >
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
        </MapView>
      )}
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
});

