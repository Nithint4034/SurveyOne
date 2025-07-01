import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export default function PhotoCapture({ onCapture, onClear }) {
  const [imageUri, setImageUri] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
        quality: 0.7, // Medium quality (better for conversion)
        allowsEditing: false,
        aspect: [4, 3],
        base64: false,
        exif: false
      });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        
        // Process and send the image
        await processAndSendImage(uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture image');
      console.error('Image capture error:', error);
    }
  };

  const processAndSendImage = async (uri) => {
    setIsProcessing(true);
    try {
      // Convert to JPG and compress
      const processedImage = await manipulateAsync(
        uri,
        [],
        { 
          compress: 0.7, // Adjust compression (0-1)
          format: SaveFormat.JPEG 
        }
      );

      // Read the file as base64 string
      const base64Data = await FileSystem.readAsStringAsync(processedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Create the data URI
      const dataUri = `data:image/jpeg;base64,${base64Data}`;
      
      // Call the onCapture callback with the processed image
      onCapture({
        uri: processedImage.uri,
        dataUri,
        base64Data,
        type: 'image/jpeg',
        name: `photo_${Date.now()}.jpg`
      });

    } catch (error) {
      Alert.alert('Error', 'Failed to process image');
      console.error('Image processing error:', error);
    } finally {
      setIsProcessing(false);
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
        style={[styles.button, isProcessing && styles.disabledButton]}
        onPress={handleCapture}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <Text style={styles.buttonText}>Processing...</Text>
        ) : (
          <>
            <MaterialIcons 
              name={imageUri ? "camera" : "camera-alt"} 
              size={20} 
              color="white" 
            />
            <Text style={styles.buttonText}>
              {imageUri ? 'Retake Photo' : 'Take Photo'}
            </Text>
          </>
        )}
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
    backgroundColor: '#B17457',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '500',
  },
});