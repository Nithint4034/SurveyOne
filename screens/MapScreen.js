// // screens/MapScreen.js
// import React from 'react';
// import { View, Text, Button } from 'react-native';

// function MapScreen({ navigation }) {
//   return (
//     <View>
//       <Text>Map Screen</Text>
      // <Button
      //   title="Go to Map Details"
      //   onPress={() => navigation.navigate('MapDetails')}
      // />
//     </View>
//   );
// }

// export default MapScreen;


import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
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
      setMarkerCoordinate(currentLocation.coords);  // Set initial marker position
    })();
  }, []);

  const handleMarkerDragEnd = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerCoordinate({ latitude, longitude });  // Update marker position when dragged
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={markerCoordinate}  // Use updated marker coordinates
            draggable
            onDragEnd={handleMarkerDragEnd}  // Handle marker drag event
            onPress={() =>
              navigation.navigate('MapDetails', {
                latitude: markerCoordinate.latitude,
                longitude: markerCoordinate.longitude,
              })  // Pass the latitude and longitude to MapDetails
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
