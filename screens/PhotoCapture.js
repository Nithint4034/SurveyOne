import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

export default function PhotoCapture({ onCapture, onClear }) {
  const [imageUri, setImageUri] = useState(null);

  const handleCapture = async () => {
    if (imageUri) {
      setImageUri(null);
      onClear();
      return;
    }

    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission required', 'Camera access is needed to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.3, // Lower quality (0.0-1.0)
        allowsEditing: false,
        aspect: [4, 3],
        base64: false,
        exif: false // Don't include extra metadata
      });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        onCapture(uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture image');
      console.error('Image capture error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {imageUri && (
        <Image 
          source={{ uri: imageUri }} 
          style={styles.image}
          resizeMode="cover"
        />
      )}
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleCapture}
      >
        <MaterialIcons 
          name={imageUri ? "camera" : "camera-alt"} 
          size={20} 
          color="white" 
        />
        <Text style={styles.buttonText}>
          {imageUri ? 'Retake Photo' : 'Take Photo'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '500',
  },
});