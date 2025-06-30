import React, { useState, useEffect } from 'react';
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
import LocationPicker from './LocationPicker';


export default function QuestionsScreen() {
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const surveyorName = answers.surveyor_name;
  const village = answers["1"];
  console.log(village);
  console.log(surveyorName);

  const extractSurveyMetadata = () => {
    return {
      surveyor_name: answers.surveyor_name,
      village: answers.village,
      district: answers.district,
      taluka: answers.taluka,
      village: answers.village,
      q1: answers["1"],
      q2: answers["2"],
      q3: answers["3"],
      q4: answers["4"],
      q5: answers["5"],
      q6: answers["6"],
      q7: answers["7"],
      q8: answers["8"],
      q9: answers["9"],
      q10: answers["10"],
      q11: answers["1"],
      q12: answers["1"],
      q13_1: answers["1"],
      q13_2: answers["1"],
      q14: answers["1"],
      q15: answers["1"],
      q16: answers["1"],
      q17: answers["1"],
      q17_1: answers["1"],
      q17_2: answers["1"],
      q17_3: answers["1"],
      q17_4: answers["1"],
      q18: answers["1"],
      q23: answers["1"],
      q23_1: answers["1"],
      q24: answers["1"],
      q25: answers["1"],
      q26: answers["1"],
      q27: answers["1"],
      q28: answers["1"],
      q29: answers["1"],
      q30: answers["1"],
      q31: answers["1"],
      q32: answers["1"],
      q33: answers["1"],
      q34: answers["1"],
      q35: answers["1"],
      q36: answers["1"],
      q37: answers["1"],
      q37_1: answers["1"],
      q37_2: answers["1"],
      q37_3: answers["1"],
      q37_4: answers["1"],
      q38: answers["1"],
      q38_1: answers["1"],
      q38_2: answers["1"],
      q38_3: answers["1"],
      q38_4: answers["1"],
      q39: answers["1"],
      q39_1: answers["1"],
      q39_2: answers["1"],
      q39_3: answers["1"],
      q39_4: answers["1"],
      q40: answers["1"],
      q40_1: answers["1"],
      q40_2: answers["1"],
      q40_3: answers["1"],
      q40_4: answers["1"],
      q41: answers["1"],
      q41_1: answers["1"],
      q41_2: answers["1"],
      q41_3: answers["1"],
      q41_4: answers["1"],
      q42: answers["1"],
      q43: answers["1"],
      q44: answers["1"],
      q45: answers["1"],
      q46: answers["1"],
      q47: answers["1"],
      q48: answers["1"],
      q49: answers["1"],
      q50: answers["1"],
      q51: answers["1"],
      q52: answers["1"],
      q53: answers["1"],
      q54: answers["1"],
      q55: answers["1"],
      q57: answers["1"],
    };
  };

  // Load username from AsyncStorage when component mounts
  useEffect(() => {
    const loadUsername = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        if (username) {
          setAnswers(prev => ({ ...prev, surveyor_name: username }));
        }
      } catch (error) {
        console.error('Error loading username:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsername();
  }, []);

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
    if (id === 'location' && typeof value === 'object') {
      setAnswers((prev) => ({
        ...prev,
        latitude: value.latitude.toString(),
        longitude: value.longitude.toString(),
        [id]: value // Store the complete location object
      }));
      return;
    }

    // Convert empty strings to null for all other fields
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

      // Get all the metadata fields
      const metadata = extractSurveyMetadata();

      const response = await axios.post(
        'https://tomhudson.pythonanywhere.com/form',
        {
          survey_id: "SURV0012",
          ...metadata,  // Spread all metadata fields
          ...surveyData  // Spread all the question answers
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
      // const response = await submitSurveyData(payload);
      // console.log('Submission successful:', response);

      // Reset form after successful submission
      const username = await AsyncStorage.getItem('username');

      // Create fresh empty state
      const freshState = {};

      // Only preserve surveyor_name if it exists
      if (username) {
        freshState.surveyor_name = username;
      }

      // Reset all answers including location
      setAnswers(freshState);

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
      <View key={subQ.id} style={[styles.subQuestionContainer]}>
        <Text style={styles.questionTextCrop}>{subQ.text.replace(/Before MI ₹: ________ After MI ₹: ________/g, '')}</Text>
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

    // For the surveyor_name field specifically
    if (item.id === 'surveyor_name') {
      return (
        <View style={styles.questionContainer}>
          <Text style={styles.questionTextCrop}>
            {item.showSerial ? `${item.serial}. ` : ''}
            {item.text}
          </Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={answers.surveyor_name || ''}
            editable={false}
          />
        </View>
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
          <Text style={styles.questionTextCrop}>
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
          <Text style={styles.questionTextCrop}>
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
          <Text style={styles.questionTextCrop}>
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

    if (item.question_type === 'location') {
      return (
        <View style={styles.questionContainer}>
          <Text style={styles.questionTextCrop}>
            {item.showSerial ? `${item.serial}. ` : ''}
            {item.text}
          </Text>
          <LocationPicker
            onLocationChange={(coords) => handleAnswerChange(item.id, coords)}
            currentLocation={answers[item.id]} // Pass the stored location back
          />
        </View>
      );
    }

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionTextCrop}>
          {item.showSerial ? `${item.serial}. ` : ''}
          {item.text}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Answer"
          value={answers[item.id] || ''}
          onChangeText={(text) => handleAnswerChange(item.id, text)}
          keyboardType={['2', '6', '10', '11', '12', '49'].includes(item.id) ? 'phone-pad' : 'default'}
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
    paddingTop: 10,
  },
  questionContainer: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
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
  questionTextCrop: {
    fontSize: 13,
    marginBottom: 4,
    color: '#333',
    fontWeight: "bold"
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
    marginBottom: 50,
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
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#666',
  },
});
