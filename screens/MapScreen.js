// screens/MapScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';

function MapScreen({ navigation }) {
  return (
    <View>
      <Text>Map Screen</Text>
      <Button
        title="Go to Map Details"
        onPress={() => navigation.navigate('MapDetails')}
      />
    </View>
  );
}

export default MapScreen;
