import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import questions from './questions';
import PhotoCapture from './PhotoCapture';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function QuestionsScreen() {
  const [answers, setAnswers] = useState({});

  const surveyorName = answers.surveyor_name;
  const village = answers.village;
  console.log(village);
  console.log(surveyorName);

  const serializedData = [];
  let headingCount = 0;
  let questionCount = 0;
  let passedFirstHeading = false;

  questions.forEach((item) => {
    if (item.type === 'heading') {
      headingCount++;
      serializedData.push({ ...item, serial: headingCount.toString(), showSerial: true });
      if (item.id === 'h1') {
        passedFirstHeading = true;
        questionCount = 0;
      }
    } else if (item.type === 'question') {
      if (passedFirstHeading) {
        questionCount++;
        serializedData.push({ ...item, serial: questionCount.toString(), showSerial: true });
      } else {
        serializedData.push({ ...item, serial: '', showSerial: false });
      }
    }
  });

  // Add the submit button as the last item in the list
  serializedData.push({
    id: 'submit_button',
    type: 'submit_button',
    showSerial: false
  });

  const handleAnswerChange = (id, value) => {
    // Convert empty strings to null
    const finalValue = value === '' ? null : value;
    setAnswers((prev) => ({ ...prev, [id]: finalValue }));
  };

  const submitSurveyData = async (surveyData) => {
    try {
      // Retrieve the access token from AsyncStorage
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await axios.post(
        'https://tomhudson.pythonanywhere.com/form',
        {
          survey_id: "SURV0012",
          surveyor_name: surveyorName,
          district: "Haridwar",
          taluka: "Roorkee",
          village: village,
          ...surveyData
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;

    } catch (error) {
      console.error('Error submitting survey:', error);
      throw error;
    }
  };

  // Then modify your handleSubmit function in the component:
  const handleSubmit = async () => {
    const payload = {};

    serializedData.forEach((item) => {
      if (item.type === 'question') {
        // Handle main questions
        const answer = answers[item.id] || null;
        const otherAnswer = answers[`${item.id}_other`] || null;

        payload[item.id] = answer === 'Other(Specify)' ? otherAnswer : answer;

        // Handle sub-questions if triggered
        if (item.subQuestions && answers[item.id] === item.subQuestions.triggerValue) {
          item.subQuestions.questions.forEach((subQ) => {
            if (subQ.text.includes('Before MI ₹')) {
              payload[`${subQ.id}_before`] = answers[`${subQ.id}_before`] || null;
              payload[`${subQ.id}_after`] = answers[`${subQ.id}_after`] || null;
            } else {
              payload[subQ.id] = answers[subQ.id] || null;
            }
          });
        }
      }
    });

    try {
      console.log('Submitting survey data:', payload);
      const response = await submitSurveyData(payload);
      console.log('Submission successful:', response);
      Alert.alert('Success', 'Answers submitted successfully!');
    } catch (error) {
      console.error('Submission failed:', error);
      Alert.alert('Error', 'Failed to submit answers. Please try again.');
    }
  };

  const renderBeforeAfterInputs = (subQ) => {
    return (
      <View style={styles.beforeAfterContainer}>
        <View style={styles.inputPair}>
          <Text style={styles.inputLabel}>Before MI ₹:</Text>
          <TextInput
            style={styles.numberInput}
            placeholder="Amount"
            keyboardType="numeric"
            value={answers[`${subQ.id}_before`] || ''}
            onChangeText={(text) => handleAnswerChange(`${subQ.id}_before`, text)}
          />
        </View>
        <View style={styles.inputPair}>
          <Text style={styles.inputLabel}>After MI ₹:</Text>
          <TextInput
            style={styles.numberInput}
            placeholder="Amount"
            keyboardType="numeric"
            value={answers[`${subQ.id}_after`] || ''}
            onChangeText={(text) => handleAnswerChange(`${subQ.id}_after`, text)}
          />
        </View>
      </View>
    );
  };

  const renderSubQuestions = (parentQuestion) => {
    if (!parentQuestion.subQuestions ||
      answers[parentQuestion.id] !== parentQuestion.subQuestions.triggerValue) {
      return null;
    }

    return parentQuestion.subQuestions.questions.map((subQ) => (
      <View key={subQ.id} style={[styles.questionContainer, styles.subQuestionContainer]}>
        <Text style={styles.questionText}>{subQ.text.replace(/Before MI ₹: ________ After MI ₹: ________/g, '')}</Text>
        {subQ.text.includes('Before MI ₹') ? (
          renderBeforeAfterInputs(subQ)
        ) : subQ.question_type === 'text' ? (
          <TextInput
            style={styles.input}
            placeholder="Answer"
            value={answers[subQ.id] || ''}
            onChangeText={(text) => handleAnswerChange(subQ.id, text)}
          />
        ) : (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={answers[subQ.id] || ''}
              onValueChange={(value) => handleAnswerChange(subQ.id, value)}
              style={styles.picker}
            >
              <Picker.Item label="Select an option..." value="" />
              {subQ.options.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        )}
      </View>
    ));
  };

  const renderItem = ({ item }) => {
    if (item.type === 'heading') {
      return (
        <Text style={styles.heading}>
          {item.showSerial ? `${item.serial}. ` : ''}
          {item.text}
        </Text>
      );
    }

    if (item.type === 'submit_button') {
      return (
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Submit Answers</Text>
        </TouchableOpacity>
      );
    }

    if (item.question_type === 'radio') {
      const selected = answers[item.id];

      return (
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {item.showSerial ? `${item.serial}. ` : ''}
            {item.text}
          </Text>

          <View style={styles.radioOptionsContainer}>
            {item.options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.radioOptionHorizontal}
                onPress={() => {
                  handleAnswerChange(item.id, option);
                  // Clear other fields when changing selection
                  if (option !== 'Other(Specify)') {
                    handleAnswerChange(`${item.id}_other`, null);
                  }
                }}
              >
                <View style={styles.radioCircle}>
                  {selected === option && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioLabel}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Show input field for "Other(Specify)" */}
          {selected === 'Other(Specify)' && (
            <TextInput
              style={styles.input}
              placeholder="Please specify"
              value={answers[`${item.id}_other`] || ''}
              onChangeText={(text) =>
                handleAnswerChange(`${item.id}_other`, text)
              }
            />
          )}

          {/* Render sub-questions if they exist and the trigger value is selected */}
          {renderSubQuestions(item)}
        </View>
      );
    }

    if (item.question_type === 'dropdown') {
      return (
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {item.showSerial ? `${item.serial}. ` : ''}
            {item.text}
          </Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={answers[item.id] || ''}
              onValueChange={(value) => handleAnswerChange(item.id, value)}
              style={styles.picker}
            >
              <Picker.Item label="Select an option..." value="" />
              {item.options.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
          {/* Render sub-questions if they exist and the trigger value is selected */}
          {renderSubQuestions(item)}
        </View>
      );
    }

    if (item.question_type === 'photo') {
      return (
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {item.showSerial ? `${item.serial}. ` : ''}
            {item.text}
          </Text>
          <PhotoCapture
            onCapture={(uri) => handleAnswerChange(item.id, uri)}
            onClear={() => handleAnswerChange(item.id, null)}
          />
        </View>
      );
    }

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {item.showSerial ? `${item.serial}. ` : ''}
          {item.text}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Answer"
          value={answers[item.id] || ''}
          onChangeText={(text) => handleAnswerChange(item.id, text)}
          keyboardType={['12', '8', '16', '17', '18'].includes(item.id) ? 'phone-pad' : 'default'}
        />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={serializedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        initialNumToRender={12}
        maxToRenderPerBatch={20}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: '#f2f2f2',
  },
  listContent: {
    paddingBottom: 20,
  },
  questionContainer: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  heading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  subQuestionContainer: {
    marginLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#ccc',
    paddingLeft: 8,
  },
  questionText: {
    fontSize: 13,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 13,
    backgroundColor: '#fff',
    marginTop: 6,
  },
  button: {
    backgroundColor: '#4A4947',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  radioOptionsContainer: {
    flexDirection: 'column',
    marginTop: 6,
  },
  radioOptionHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#4A4947',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#4A4947',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  picker: {
    height: 55,
    color: '#000',
    marginTop: -10,
    marginBottom: -10,
  },
  beforeAfterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  inputPair: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  inputLabel: {
    fontSize: 13,
    color: '#333',
    marginRight: 4,
    minWidth: 70,
  },
  numberInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 13,
    backgroundColor: '#fff',
  },
});