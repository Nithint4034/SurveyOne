import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { FontAwesome } from '@expo/vector-icons';

export default function App() {
  const [date, setDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // Functions to handle date picker
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate) => {
    const formattedDate = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    setDate(formattedDate);
    hideDatePicker();
  };

  return (
    <View style={styles.containerCal}>
      <View style={styles.inputContainerCal}>
        <TextInput
          style={styles.inputCal}
          value={date}
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
    </View>
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  inputCal: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 5,
  },
});
