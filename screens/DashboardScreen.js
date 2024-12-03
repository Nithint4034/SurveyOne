import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export default function DashboardScreen() {
  const [selectedValue, setSelectedValue] = useState(null);

  const handleValueChange = (value) => {
    setSelectedValue(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select an option:</Text>

      <RNPickerSelect
        onValueChange={handleValueChange}
        items={[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ]}
        placeholder={{ label: 'Select a value...', value: null }}
        style={{
          inputIOS: styles.pickerInput,
          inputAndroid: styles.pickerInput,
        }}
      />

      <Text style={styles.selectedValue}>
        Selected Value: {selectedValue ? selectedValue : 'None'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  pickerInput: {
    height: 50,
    width: 200,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingLeft: 10,
  },
  selectedValue: {
    marginTop: 20,
    fontSize: 16,
  },
});
