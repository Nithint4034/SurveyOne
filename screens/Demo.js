import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Correct import

const Demo = () => {
  const [selectedState, setSelectedState] = useState('');

  const states = ['California', 'Texas', 'Florida', 'New York', 'Illinois'];

  return (
    <View style={styles.container}>
      
      <Picker
        selectedValue={selectedState}
        onValueChange={(itemValue) => setSelectedState(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select State" value="" />
        {states.map((state, index) => (
          <Picker.Item key={index} label={state} value={state} />
        ))}
      </Picker>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f9',
    padding: 20,
  },
  picker: {
    height: 50,
    width: 350,
    borderColor: '#888',  // Adding a border color
    borderWidth: 2,        // Setting the border width
    borderRadius: 50,      // Round corners for the borde
    marginBottom: 20,
    backgroundColor: '#fff', // Giving a white background for the picker
    paddingHorizontal: 10,    // Optional padding inside the picker
  },
  selectedText: {
    fontSize: 16,
    marginTop: 20,
    color: '#333',  // Setting the color of the text
  },
});

export default Demo;
