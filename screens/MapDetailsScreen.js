import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Alert, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from "@react-native-async-storage/async-storage";

const MapDetailsScreen = ({ route }) => {
  const { latitude, longitude } = route.params || {};
  const [selectedImage, setSelectedImage] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    district: '',
    tehsil: '',
    villageName: '',
    sector: '',
    khasraNo: '',
    acquiredArea: '',
    landOwner: '',
    compensationAmount: '',
    compensationDate: '',
    leaseBackStatus: '',
    leaseBackArea: '',
    plotNo: '',
    plotSize: '',
    allotmentStatus: '',
    allotteeName: '',
    landUse: '',
    physicalCondition: '',
    encroachmentStatus: '',
    latitude: latitude || '',
    longitude: longitude || '',
    photo: '',
    remarks: '',
  });

  console.log('form data', formData);

  const handleInputChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!photo) {
      Alert.alert("Error", "Please capture a photo first.");
      return;
    }

    setLoading(true); // Start loading
    try {
      const username = await AsyncStorage.getItem("userName");
        if (!username) {
          Alert.alert("Error", "Username not found in storage.");
          return;
        }
      const formData = new FormData();

      // Append all fields
      formData.append("username", username);
      formData.append("Date", "2024-12-05");
      formData.append("District", "tumakur");
      formData.append("Tehsil", "pava");
      formData.append("Village", "dvdsv");
      formData.append("Sector", "ddxf");
      formData.append("Khasra", "non");
      formData.append("Area", "100sqft");
      formData.append("Compensation", "1522");
      formData.append("CompensationDate", "2024-12-02");
      formData.append("LeaseArea", "250sqft");
      formData.append("LeaseStatus", "done");
      formData.append("PlotNo", "151");
      formData.append("PlotSize", "122");
      formData.append("Allotee", "nithin");
      formData.append("BuiltUp", "yes");
      formData.append("Encroachment", "no");
      formData.append("Latitude", "12.888");
      formData.append("Longitude", "21.555");
      formData.append("Remarks", "done");

      // Append the photo file
      formData.append("Photo", {
        uri: photo.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      const response = await axios.post(
        `https://nithint.pythonanywhere.com/land/${username}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        Alert.alert("Success", "Data sent successfully!");
        setSelectedImage(null)
        console.log("Response:", response.data);
      } else {
        Alert.alert("Warning", "Unexpected response received!");
        console.warn("Unexpected Response:", response.data);
      }
    } catch (error) {
      if (error.response) {
        Alert.alert("Error", `Server Error: ${error.response.status}`);
        console.error("Server Error Response:", error.response.data);
      } else if (error.request) {
        Alert.alert("Error", "No response received from the server.");
        console.error("No Response:", error.request);
      } else {
        Alert.alert("Error", `Unexpected error: ${error.message}`);
        console.error("Unexpected Error:", error.message);
      }
    } finally {
      setLoading(false); 
    }
  };


  const launchCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Camera permission is required to use this feature.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]); // Store the captured photo
      setSelectedImage(result.assets[0].uri);
    } else {
      Alert.alert("No photo captured!");
    }
  };


  // const launchCamerass = async () => {
  //   const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

  //   if (!permissionResult.granted) {
  //     Alert.alert('Permission Required', 'Camera access is needed to take photos.');
  //     return;
  //   }

  //   const result = await ImagePicker.launchCameraAsync({
  //     // Removed allowsEditing to prevent cropping
  //     aspect: [3, 4], // Aspect ratio for the camera
  //     quality: 1, // Set to 1 for high quality
  //   });

  //   console.log('Camera result:', result); // Debugging the result

  //   if (!result.canceled) {
  //     const uri = result.assets && result.assets[0]?.uri; // Safely access the URI
  //     console.log('Image URI:', uri);

  //     // Convert the image to JPG format
  //     const manipResult = await ImageManipulator.manipulateAsync(
  //       uri, 
  //       [],
  //       { format: ImageManipulator.SaveFormat.JPEG } // Convert to JPG
  //     );

  //     console.log('Manipulated Image URI:', manipResult.uri);
  //     setSelectedImage(manipResult.uri); // Store the converted image URI
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       photo: manipResult.uri, // Update formData with the selected JPG image URI
  //     }));
  //   } else {
  //     console.log('Camera was canceled');
  //   }
  // };



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
      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* General Info */}
        <TextInput
          style={styles.input}
          placeholder="District"
          value={formData.district}
          onChangeText={(value) => handleInputChange('district', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Tehsil"
          value={formData.tehsil}
          onChangeText={(value) => handleInputChange('tehsil', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Village Name"
          value={formData.villageName}
          onChangeText={(value) => handleInputChange('villageName', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Sector"
          value={formData.sector}
          onChangeText={(value) => handleInputChange('sector', value)}
        />

        {/* Land Details */}
        <Text style={styles.sectionTitle}>Land Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Khasra No"
          value={formData.khasraNo}
          onChangeText={(value) => handleInputChange('khasraNo', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Acquired Area In Hectare"
          value={formData.acquiredArea}
          onChangeText={(value) => handleInputChange('acquiredArea', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Name of Land Owner"
          value={formData.landOwner}
          onChangeText={(value) => handleInputChange('landOwner', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Compensation Amount"
          value={formData.compensationAmount}
          onChangeText={(value) => handleInputChange('compensationAmount', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Compensation Date"
          value={formData.compensationDate}
          onChangeText={(value) => handleInputChange('compensationDate', value)}
        />

        {/* Lease Back */}
        <Text style={styles.sectionTitle}>Lease Back</Text>
        <TextInput
          style={styles.input}
          placeholder="Lease Back Status"
          value={formData.leaseBackStatus}
          onChangeText={(value) => handleInputChange('leaseBackStatus', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Lease Back Area"
          value={formData.leaseBackArea}
          onChangeText={(value) => handleInputChange('leaseBackArea', value)}
        />

        {/* Planning Details */}
        <Text style={styles.sectionTitle}>Planning Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Plot No"
          value={formData.plotNo}
          onChangeText={(value) => handleInputChange('plotNo', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Plot Size SQM"
          value={formData.plotSize}
          onChangeText={(value) => handleInputChange('plotSize', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Alotment Status : Yes / No"
          value={formData.allotmentStatus}
          onChangeText={(value) => handleInputChange('allotmentStatus', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Allotee Name"
          value={formData.allotteeName}
          onChangeText={(value) => handleInputChange('allotteeName', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Landuse (Plot Type)"
          value={formData.landuse}
          onChangeText={(value) => handleInputChange('landuse', value)}
        />
        <Text style={styles.sectionTitle}>Physical Condition</Text>
        <TextInput
          style={styles.input}
          placeholder="Builtup / Vacant"
          value={formData.physicalCondition}
          onChangeText={(value) => handleInputChange('physicalCondition', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Encroachment / Vacant / Unplanned"
          value={formData.encroachmentStatus}
          onChangeText={(value) => handleInputChange('encroachmentStatus', value)}
        />

        <TextInput
          style={[styles.input, { color: 'gray' }]}
          placeholder="Latitude"
          value={`Latitude: ${formData.latitude}`}  // Display autofilled latitude
          editable={false}
        />
        <TextInput
          style={[styles.input, { color: 'gray' }]}
          placeholder="Longitude"
          value={`Longitude: ${formData.longitude}`}  // Display autofilled longitude
          editable={false}
        />
        <Text style={styles.sectionTitle}>Add Photograph of Plot</Text>
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

        <TextInput
          style={styles.input}
          placeholder="Remarks"
          value={formData.remarks}
          onChangeText={(value) => handleInputChange('remarks', value)}
        />
        {/* <Button title="Capture Photo" onPress={launchCamera} color="#6200EE" /> */}

        <TouchableOpacity
          style={[
            styles.submitButton,
            (loading || !photo) && styles.disabledButton, // Apply disabled styling
          ]}
          onPress={handleSubmit}
          disabled={loading || !photo} // Disable button when loading or photo is not selected
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Sending..." : "Submit"}
          </Text>
        </TouchableOpacity>

      </ScrollView>

    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 10,
  },
  formContainer: {
    paddingBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#4A4947',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: "#4A4947",
    fontSize: 20
  },
  dropdownInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#4A4947',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
  },
  optionButton: {
    padding: 10,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 166, // 3:4 Aspect Ratio
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A4947',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginBottom: 18,
    marginTop: -10
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#A9A9A9", 
  },
};

export default MapDetailsScreen;