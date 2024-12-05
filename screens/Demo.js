// import React, { useState } from "react";
// import { View, Button, Alert, StyleSheet } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function Demo() {
//   const [photo, setPhoto] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Function to launch the camera
//   const capturePhoto = async () => {
//     const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

//     if (permissionResult.granted === false) {
//       Alert.alert("Camera permission is required to use this feature.");
//       return;
//     }

//     const result = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setPhoto(result.assets[0]); // Store the captured photo
//     } else {
//       Alert.alert("No photo captured!");
//     }
//   };

//   const sendData = async () => {
//     if (!photo) {
//       Alert.alert("Error", "Please capture a photo first.");
//       return;
//     }
  
//     setLoading(true); // Start loading
//     try {
//         const username = await AsyncStorage.getItem("userName");
//         console.log('username', username);
        
//         if (!username) {
//           Alert.alert("Error", "Username not found in storage.");
//           return;
//         }
//       const formData = new FormData();
  
//       // Append all fields
//       formData.append("username", username);
//       formData.append("Date", "2024-12-05");
//       formData.append("District", "tumakur");
//       formData.append("Tehsil", "pava");
//       formData.append("Village", "dvdsv");
//       formData.append("Sector", "ddxf");
//       formData.append("Khasra", "non");
//       formData.append("Area", "100sqft");
//       formData.append("Compensation", "1522");
//       formData.append("CompensationDate", "2024-12-02");
//       formData.append("LeaseArea", "250sqft");
//       formData.append("LeaseStatus", "done");
//       formData.append("PlotNo", "151");
//       formData.append("PlotSize", "122");
//       formData.append("Allotee", "nithin");
//       formData.append("BuiltUp", "yes");
//       formData.append("Encroachment", "no");
//       formData.append("Latitude", "12.888");
//       formData.append("Longitude", "21.555");
//       formData.append("Remarks", "done");
  
//       // Append the photo file
//       formData.append("Photo", {
//         uri: photo.uri,
//         name: "photo.jpg",
//         type: "image/jpeg",
//       });
  
//       const response = await axios.post(
//         `https://nithint.pythonanywhere.com/land/${username}/`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
  
//       if (response.status >= 200 && response.status < 300) {
//         // Success response
//         Alert.alert("Success", "Data sent successfully!");
//         console.log("Response:", response.data);
//       } else {
//         // Unexpected success response
//         Alert.alert("Warning", "Unexpected response received!");
//         console.warn("Unexpected Response:", response.data);
//       }
//     } catch (error) {
//       if (error.response) {
//         // Server responded with a status code outside the 2xx range
//         Alert.alert("Error", `Server Error: ${error.response.status}`);
//         console.error("Server Error Response:", error.response.data);
//       } else if (error.request) {
//         // Request was made but no response received
//         Alert.alert("Error", "No response received from the server.");
//         console.error("No Response:", error.request);
//       } else {
//         // Something else happened
//         Alert.alert("Error", `Unexpected error: ${error.message}`);
//         console.error("Unexpected Error:", error.message);
//       }
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };
  
//   return (
//     <View style={styles.container}>
//       <Button title="Capture Photo" onPress={capturePhoto} color="#6200EE" />
//       <View style={styles.spacing} />
//       <Button
//         title={loading ? "Sending..." : "Send Data"}
//         onPress={sendData}
//         disabled={loading || !photo}
//         color="#6200EE"
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//     backgroundColor: "#f9f9f9",
//   },
//   spacing: {
//     height: 16,
//   },
// });


import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const MyPicker = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('java');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Choose a Language:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
          style={styles.picker}
          dropdownIconColor="#007bff"
        >
          <Picker.Item label="Java" value="java" />
          <Picker.Item label="JavaScript" value="javascript" />
          <Picker.Item label="Python" value="python" />
        </Picker>
      </View>
      <Text style={styles.selectedValue}>
        You selected: <Text style={styles.highlight}>{selectedLanguage}</Text>
      </Text>
    </View>
  );
};

export default function App() {
  return (
    <View style={styles.appContainer}>
      <MyPicker />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  container: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
    backgroundColor: '#f9f9f9',
  },
  selectedValue: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#007bff',
  },
});
