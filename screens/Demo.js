import React, { useState } from 'react';
import { View, Button, Image, Alert, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { FileSystem } from 'expo-file-system';

const ImagePickerComponent = () => {
  const [image, setImage] = useState(null);  // State to store the selected image URI
  const [imageSize, setImageSize] = useState(null);  // State to store the image file size

  const launchCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Camera permission is required to use this feature.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,  // Disable cropping or editing
      quality: 1,  // Highest quality
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      // Compress the image
      const compressedResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],  // Resize to a width of 800px
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Compress image to 70% quality
      );

      // Set the compressed image URI
      setImage(compressedResult.uri);

      // Get the file size of the compressed image
      const fileInfo = await FileSystem.getInfoAsync(compressedResult.uri);
      setImageSize(fileInfo.size);  // Store the file size in bytes
    } else {
      Alert.alert("No photo captured!");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Launch Camera" onPress={launchCamera} />
      
      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <Text style={styles.imageSize}>Size: {(imageSize / 1024).toFixed(2)} KB</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    marginTop: 20,
    width: 300,  // Adjust width as needed
    height: 400,  // Adjust height as needed
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageSize: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
  },
});

export default ImagePickerComponent;
