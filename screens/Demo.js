import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { FontAwesome } from '@expo/vector-icons';

export default function App() {
  const [date, setDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false); // State for success modal

  // Functions to handle date picker
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate) => {
    const formattedDate = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    setDate(formattedDate);
    hideDatePicker();
  };

  const showSuccessModal = () => {
    setSuccessModalVisible(true);
    setTimeout(() => {
      setSuccessModalVisible(false); // Close the success modal after 2 seconds
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Input and Date Picker */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={date}
          placeholder="Compensation Date"
          editable={false}
        />
        <TouchableOpacity onPress={showDatePicker}>
          <FontAwesome name="calendar" size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Button to trigger Success Modal */}
      <TouchableOpacity style={styles.successButton} onPress={showSuccessModal}>
        <Text style={styles.buttonText}>Show Success</Text>
      </TouchableOpacity>

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

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
            <Text style={styles.successMessage}>Success!</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 5,
  },
  successButton: {
    marginTop: 20,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
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
});
