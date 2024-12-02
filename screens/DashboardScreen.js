// // screens/DashboardScreen.js
// import React from 'react';
// import { View, Text } from 'react-native';

// function DashboardScreen() {
//   return (
//     <View>
//       <Text>Dashboard Screen</Text>
//     </View>
//   );
// }

// export default DashboardScreen;



import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Alert, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const CameraWithDelete = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const launchCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Camera access is needed to take photos.');
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });
  
    console.log('Camera result:', result); // Debugging the result
  
    if (!result.canceled) {
      const uri = result.assets && result.assets[0]?.uri; // Safely access the URI
      console.log('Image URI:', uri);
      setSelectedImage(uri); // Store the image URI
    } else {
      console.log('Camera was canceled');
    }
  };
  

  // Confirm and delete the photo
  const confirmDeletePhoto = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => setSelectedImage(null) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Image Preview */}
      {selectedImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.image} />
          <TouchableOpacity style={styles.deleteButton} onPress={confirmDeletePhoto}>
            <Ionicons name="trash" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        // Plus Button to Launch Camera
        <TouchableOpacity style={styles.addButton} onPress={launchCamera}>
          <Ionicons name="add" size={36} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  imageContainer: {
    position: 'relative',
    width: 200,
    height: 266, // 3:4 Aspect Ratio
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 20,
  },
  addButton: {
    width: 80,
    height: 80,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    elevation: 3,
  },
});

export default CameraWithDelete;
