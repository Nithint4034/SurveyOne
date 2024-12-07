import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Modal, TextInput } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import * as ImageManipulator from 'expo-image-manipulator';

const MapDetailsScreen = ({ route, navigation }) => {
  const { latitude, longitude } = route.params || {};
  const [selectedImage, setSelectedImage] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [displayDate, setDisplayDate] = useState(''); // State for displayed date
  const [apiDate, setApiDate] = useState(''); // State for raw date to send to API
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const [selectedOption] = useState('');
  const [selectedOption1, setSelectedOption1] = useState('');
  const [selectedOption2, setSelectedOption2] = useState('');
  const [selectedOption3, setSelectedOption3] = useState('');
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);

  const [formDatas, setFormDatas] = useState({
    district: '',
    tehsil: '',
    villageName: '',
    sector: '',
    khasraNo: '',
    acquiredArea: '',
    landOwner: '',
    compensationAmount: '',
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

  const pickerOptions1 = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];

  const pickerOptions2 = [
    { label: 'Built', value: 'Built' },
    { label: 'Vacant', value: 'Vacant' },
  ];

  const pickerOptions3 = [
    { label: 'Enchrochment', value: 'Enchrochment' },
    { label: 'Vacant', value: 'Vacant' },
    { label: 'Unplanned', value: 'Unplanned' },
  ];

  const handleInputChange = (fieldName, value) => {
    setFormDatas((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleConfirm = (selectedDate) => {
    const rawDate = selectedDate.toISOString().split('T')[0];
    setApiDate(rawDate);
    setDisplayDate(`Compensation Date: ${rawDate}`);
    hideDatePicker();
  };



  const handleSubmit = async () => {
    if (!photo) {
      Alert.alert("Error", "Please capture a photo first.");
      return;
    }

    setLoading(true);
    try {
      const username = await AsyncStorage.getItem("userName");
      if (!username) {
        Alert.alert("Error", "Username not found in storage.");
        return;
      }
      const formData = new FormData();

      formData.append("username", username);
      formData.append("District", formDatas.district);
      formData.append("Tehsil", formDatas.tehsil);
      formData.append("Village", formDatas.villageName);
      formData.append("Sector", formDatas.sector);
      formData.append("Khasra", formDatas.khasraNo);
      formData.append("Area", formDatas.acquiredArea);
      formData.append("Compensation", formDatas.compensationAmount);
      formData.append("CompensationDate", apiDate);
      formData.append("LeaseArea", formDatas.leaseBackArea);
      formData.append("LeaseStatus", formDatas.leaseBackStatus);
      formData.append("PlotNo", formDatas.plotNo);
      formData.append("PlotSize", formDatas.plotSize);
      formData.append("Allotee", formDatas.allotteeName);
      formData.append("BuiltUp", selectedOption2);
      formData.append("Encroachment", selectedOption3);
      formData.append("Latitude", `${latitude}`);
      formData.append("Longitude", `${longitude}`);
      formData.append("Remarks", formDatas.remarks);

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
        setSuccessModalVisible(true);
        setFormDatas('')
        setSelectedImage(null)
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
      setTimeout(() => {
        setSuccessModalVisible(false); // Close the success modal after 2 seconds
        navigation.navigate('MapMain'); 
      }, 3000);
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
      allowsEditing: false, // Disable cropping
      quality: 0.5, // Capture the photo at full quality
    });
  
    if (!result.canceled) {
      const uri = result.assets[0].uri;
  
      try {
        // Compress the image further
        const compressedResult = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 600 } }], // Resize to a width of 600px
          { compress: 0.2, format: ImageManipulator.SaveFormat.JPEG } // Compress to 20% quality
        );
  
        // Update states with the original and compressed image URIs
        setPhoto(result.assets[0]); // Store the full photo object
        setSelectedImage(compressedResult.uri); // Store the compressed URI
      } catch (error) {
        Alert.alert("Error processing the image: " + error.message);
      }
    } else {
      Alert.alert("No photo captured!");
    }
  };

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

        <TextInput
          label="District"
          value={formDatas.district}
          onChangeText={(value) => handleInputChange('district', value)}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: {
              primary: '#4A4947',
              placeholder: '#888',
            },
          }}
        />
        <TextInput
          label="Tehsil"
          value={formDatas.tehsil}
          onChangeText={(value) => handleInputChange('tehsil', value)}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: {
              primary: '#4A4947',
              placeholder: '#888',
            },
          }}
        />
        <TextInput
          label="Village Name"
          value={formDatas.villageName}
          onChangeText={(value) => handleInputChange('villageName', value)}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: {
              primary: '#4A4947',
              placeholder: '#888',
            },
          }}
        />
        <TextInput
          label="Sector"
          value={formDatas.sector}
          onChangeText={(value) => handleInputChange('sector', value)}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: {
              primary: '#4A4947',
              placeholder: '#888',
            },
          }}
        />


        <Text style={styles.sectionTitle}>Land Details</Text>
        <TextInput
          label="Khsra No"
          value={formDatas.khasraNo}
          onChangeText={(value) => handleInputChange('khasraNo', value)}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: {
              primary: '#4A4947',
              placeholder: '#888',
            },
          }}
        />
        <TextInput
          label="Acquired Area In Hectare"
          value={formDatas.acquiredArea}
          onChangeText={(value) => handleInputChange('acquiredArea', value)}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: {
              primary: '#4A4947',
              placeholder: '#888',
            },
          }}
        />
        <TextInput
          label="Name of Land Owner"
          value={formDatas.landOwner}
          onChangeText={(value) => handleInputChange('landOwner', value)}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: {
              primary: '#4A4947',
              placeholder: '#888',
            },
          }}
        />
        <TextInput
          label="Compensation Amount"
          value={formDatas.compensationAmount}
          onChangeText={(value) => handleInputChange('compensationAmount', value)}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: {
              primary: '#4A4947',
              placeholder: '#888',
            },
          }}
        />

        <View style={styles.inputContainerCal}>
          <TextInput
            style={styles.inputCal}
            value={displayDate}
            placeholder="Compensation Date"
            editable={false}
          />
          <TouchableOpacity onPress={showDatePicker}>
            <FontAwesome name="calendar" size={24} color="gray" />
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        <Text style={styles.sectionTitle}>Lease Back</Text>
        <TextInput
          label="Lease Back Status"
          value={formDatas.leaseBackStatus}
          onChangeText={(value) => handleInputChange('leaseBackStatus', value)}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: {
              primary: '#4A4947',
              placeholder: '#888',
            },
          }}
        />
        <TextInput
          label="Lease Back Area"
          value={formDatas.leaseBackArea}
          onChangeText={(value) => handleInputChange('leaseBackArea', value)}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: {
              primary: '#4A4947',
              placeholder: '#888',
            },
          }}
        />

        <Text style={styles.sectionTitle}>Planning Details</Text>
        <TextInput
          label="Plot No"
          value={formDatas.plotNo}
          onChangeText={(value) => handleInputChange('plotNo', value)}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: {
              primary: '#4A4947',
              placeholder: '#888',
            },
          }}
        />
        <TextInput
          label="Plot Size SQM"
          value={formDatas.plotSize}
          onChangeText={(value) => handleInputChange('plotSize', value)}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: {
              primary: '#4A4947',
              placeholder: '#888',
            },
          }}
        />

        {/* Dropdown Selector Section */}
        <View style={styles.dropdownContainerDrop}>
          <Picker
            selectedValue={selectedOption1}
            onValueChange={(itemValue) => setSelectedOption1(itemValue)}
            mode="dropdown"
            style={styles.picker}
          >
            <Picker.Item label="Alotment Status" value="" />
            {pickerOptions1.map((option, index) => (
              <Picker.Item key={index} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>

        <TextInput
          label="Allottee Name"
          value={formDatas.allotteeName}
          onChangeText={(value) => handleInputChange('allotteeName', value)}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: {
              primary: '#4A4947',
              placeholder: '#888',
            },
          }}
        />

        <Text style={styles.sectionTitle}>Physical Condition</Text>
        <View style={styles.dropdownContainerDrop}>
          <Picker
            selectedValue={selectedOption}
            onValueChange={(itemValue) => setSelectedOption2(itemValue)}
            mode="dropdown"
            style={styles.picker}
          >
            <Picker.Item label="Built/Vacant" value="" />
            {pickerOptions2.map((option, index) => (
              <Picker.Item key={index} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>

        <View style={styles.dropdownContainerDrop}>
          <Picker
            selectedValue={selectedOption}
            onValueChange={(itemValue) => setSelectedOption3(itemValue)}
            mode="dropdown"
            style={styles.picker}
          >
            <Picker.Item label="Encroachment/Vacant/Unplanned" value="" />
            {pickerOptions3.map((option, index) => (
              <Picker.Item key={index} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>

        <TextInput
          label="Latitude"
          value={`${formDatas.latitude}`}  // Display autofilled latitude
          editable={false}
          mode="outlined"
          style={[styles.input, { color: 'gray' }]}
          theme={{
            colors: {
              primary: '#4A4947',
              placeholder: '#888',
            },
          }}
        />
        <TextInput
          label="Longitude"
          value={`${formDatas.longitude}`}  // Display autofilled longitude
          editable={false}
          mode="outlined"
          style={[styles.input, { color: 'gray' }]}
          theme={{
            colors: {
              primary: '#4A4947',
              placeholder: '#888',
            },
          }}
        />

        <Text style={styles.sectionTitle}>Add Photograph of Plot</Text>
        <View style={styles.container}>

          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.image} />
              <TouchableOpacity style={styles.deleteButton} onPress={confirmDeletePhoto}>
                <Ionicons name="trash" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addButton} onPress={launchCamera}>
              <Ionicons name="add" size={36} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        <TextInput
          label="Remarks"
          value={formDatas.remarks}
          onChangeText={(value) => handleInputChange('remarks', value)}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: {
              primary: '#4A4947',
              placeholder: '#888',
            },
          }}
        />

        <TouchableOpacity
          style={[
            styles.submitButton,
            // (loading || !photo) && styles.disabledButton,
          ]}
          onPress={handleSubmit}
        // disabled={loading || !photo}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Sending..." : "Submit"}
          </Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Success Modal */}
      <Modal
        transparent={true}
        visible={isSuccessModalVisible}
        animationType="fade"
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FontAwesome name="check-circle" size={50} color="green" />
            <Text style={styles.successMessage}>Sent Successfully!</Text>
          </View>
        </View>
      </Modal>

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
  containerInput: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#fff',
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
    height: 166,
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
  containerCal: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainerCal: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    height: 52,
    backgroundColor: '#fff',
    marginTop: 8
  },
  inputCal: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 5,
    backgroundColor: 'transparent',
    height: 52,
  },
  dropdownContainerDrop: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 0,
    paddingVertical: 5,
    marginBottom: 10,
    height: 52,
    backgroundColor: '#fff',
  },
  picker: {
    marginTop: -8
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 250,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successMessage: {
    marginTop: 10,
    fontSize: 18,
    color: 'green',
    fontWeight: 'bold',
  },
};

export default MapDetailsScreen;