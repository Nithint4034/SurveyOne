import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, Alert, Platform, KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import questions from './questions';
import PhotoCapture from './PhotoCapture';
import LocationPicker from './LocationPicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

export default function QuestionsScreen() {
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    (async () => {
      const username = await AsyncStorage.getItem('username');
      setAnswers(prev => ({ ...prev, surveyor_name: username || '' }));
      setIsLoading(false);
    })();
  }, []);

  const serializedData = useMemo(() => {
    const data = [];
    let headingCount = 0, questionCount = 0, passedH1 = false;

    for (const item of questions) {
      if (item.type === 'heading') {
        headingCount++;
        data.push({ ...item, serial: headingCount.toString(), showSerial: true });
        if (item.id === 'h1') {
          passedH1 = true;
          questionCount = 0;
        }
      } else {
        const serial = passedH1 && item.type === 'question' ? (++questionCount).toString() : '';
        data.push({ ...item, serial, showSerial: passedH1 });
      }
    }
    data.push({ id: 'submit_button', type: 'submit_button', showSerial: false });
    return data;
  }, []);

  const extractSurveyMetadata = () => {
    const metaFields = ['surveyor_name', 'village', 'district', 'taluka', 'latitude', 'longitude'];
    const meta = {};

    for (const key of metaFields) {
      meta[key] = answers[key] ?? null;
    }

    // Add question answers dynamically as q1, q2, ..., qN
    for (const key in answers) {
      if (/^\d+$/.test(key)) {
        meta[`q${key}`] = answers[key];
      } else if (/^q\d+(_[a-z0-9]+)?$/.test(key)) {
        meta[key] = answers[key];
      }
    }

    return meta;
  };


  const handleAnswerChange = (id, value) => {
    setAnswers(prev => ({
      ...prev,
      [id]: typeof value === 'string' && value === '' ? null : value,
      ...(id === 'location' && typeof value === 'object' ? {
        latitude: value.latitude?.toString() || null,
        longitude: value.longitude?.toString() || null
      } : {})
    }));
  };

  const processImage = async (uri) => {
    const processedImage = await manipulateAsync(
      uri,
      [],
      {
        compress: 0.7,
        format: SaveFormat.JPEG,
      }
    );

    const base64Data = await FileSystem.readAsStringAsync(processedImage.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return {
      base64Data,
      filename: `photo_${Date.now()}.jpg`,
    };
  };


  const submitSurveyData = async (payload) => {
    console.log('Submitting survey data:', payload);
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (!accessToken) throw new Error('No access token found');

    const processed = { ...payload };

    for (const key in payload) {
      if (key.startsWith('q') && payload[key]?.startsWith?.('file:')) {
        const img = await processImage(payload[key]);
        processed[key] = img.base64Data;
        processed[`${key}_filename`] = img.filename;
      }
    }

    const formData = new FormData();

    // Add meta fields
    const metadata = extractSurveyMetadata();
    for (const key in metadata) {
      if (metadata[key] !== null) {
        formData.append(key, metadata[key]);
      }
    }

    // Add answers
    for (const key in payload) {
      const val = payload[key];

      if (typeof val === 'string' && val.startsWith('file:')) {
        // It's an image URI
        const uriParts = val.split('/');
        const name = uriParts[uriParts.length - 1];
        formData.append(key, {
          uri: val,
          type: 'image/jpeg',
          name,
        });
      } else if (val !== null && val !== undefined) {
        formData.append(key, val);
      }
    }

    const response = await axios.post(
      'https://tomhudson.pythonanywhere.com/form',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        }
      }
    );


    return response.data;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = {};

      for (const item of serializedData) {
        if (item.type === 'question') {
          const val = answers[item.id] || null;
          const otherVal = answers[`${item.id}_other`] || null;
          payload[item.id] = val === 'Other(Specify)' ? otherVal : val;

          if (item.subQuestions && val === item.subQuestions.triggerValue) {
            for (const subQ of item.subQuestions.questions) {
              if (subQ.text.includes('Before MI ₹')) {
                payload[`${subQ.id}_before`] = answers[`${subQ.id}_before`] || null;
                payload[`${subQ.id}_after`] = answers[`${subQ.id}_after`] || null;
              } else {
                payload[subQ.id] = answers[subQ.id] || null;
              }
            }
          }
        }
      }

      await submitSurveyData(payload);
      const username = await AsyncStorage.getItem('username');
      setAnswers({ surveyor_name: username || '' });
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      Alert.alert('Success', 'Survey submitted successfully!');
    } catch (error) {
      console.error('Survey submit error:', error);
      Alert.alert('Error', 'Survey submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBeforeAfterInputs = (subQ) => (
    <View style={styles.beforeAfterContainer}>
      {['before', 'after'].map((type) => (
        <View style={styles.inputPair} key={type}>
          <Text style={styles.inputLabel}>{`${type === 'before' ? 'Before' : 'After'} MI ₹:`}</Text>
          <TextInput
            style={styles.numberInput}
            keyboardType="numeric"
            placeholder="Amount"
            value={answers[`${subQ.id}_${type}`] || ''}
            onChangeText={(text) => handleAnswerChange(`${subQ.id}_${type}`, text)}
          />
        </View>
      ))}
    </View>
  );

  const renderSubQuestions = (item) => {
    if (!item.subQuestions || answers[item.id] !== item.subQuestions.triggerValue) return null;
    return item.subQuestions.questions.map((subQ) => (
      <View key={subQ.id} style={styles.subQuestionContainer}>
        <Text style={styles.questionTextCrop}>
          {subQ.text.replace(/Before MI ₹:.*After MI ₹:.*/g, '')}
        </Text>
        {subQ.text.includes('Before MI ₹') ? renderBeforeAfterInputs(subQ) : (
          subQ.question_type === 'text' ? (
            <TextInput
              style={styles.input}
              value={answers[subQ.id] || ''}
              placeholder="Answer"
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
                {subQ.options.map(opt => <Picker.Item key={opt} label={opt} value={opt} />)}
              </Picker>
            </View>
          )
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
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
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
            {item.options.map(option => (
              <TouchableOpacity
                key={option}
                style={styles.radioOptionHorizontal}
                onPress={() => {
                  handleAnswerChange(item.id, option);
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
          {selected === 'Other(Specify)' && (
            <TextInput
              style={styles.input}
              placeholder="Please specify"
              value={answers[`${item.id}_other`] || ''}
              onChangeText={(text) => handleAnswerChange(`${item.id}_other`, text)}
            />
          )}
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
              {item.options.map(option => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
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
            currentLocation={answers[item.id]}
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
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        ref={flatListRef}
        data={serializedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        initialNumToRender={10}
        maxToRenderPerBatch={15}
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




































// const extractSurveyMetadata = () => {
//   return {
//     surveyor_name: answers.surveyor_name,
//     village: answers.village,
//     district: answers.district,
//     taluka: answers.taluka,
//     village: answers.village,
//     q1: answers["1"],
//     q2: answers["2"],
//     q3: answers["3"],
//     q4: answers["4"],
//     q5: answers["5"],
//     q6: answers["6"],
//     q7: answers["7"],
//     q8: answers["8"],
//     q9: answers["9"],
//     q10: answers["10"],
//     q11: answers["11"],
//     q12: answers["12"],
//     q13_1: answers[""],
//     q13_2: answers[""],
//     q14: answers["14"],
//     q15: answers["15"],
//     q16: answers["16"],
//     q17: answers["17"],
//     q17_1: answers[""],
//     q17_2: answers[""],
//     q17_3: answers[""],
//     q17_4: answers[""],
//     q18: answers["18"],
//     q19: answers["19"],
//     q20: answers["20"],
//     q21: answers["21"],
//     q22: answers["22"],
//     q23: answers["23"],
//     q23_1: answers[""],
//     q24: answers["24"],
//     q25: answers["25"],
//     q26: answers["26"],
//     q27: answers["27"],
//     q28: answers["28"],
//     q29: answers["29"],
//     q30: answers["30"],
//     q31: answers["31"],
//     q32: answers["32"],
//     q33: answers["33"],
//     q34: answers["34"],
//     q35: answers["35"],
//     q36: answers["36"],
//     q37: answers["37"],
//     q37_1: answers["1"],
//     q37_2: answers["1"],
//     q37_3: answers["1"],
//     q37_4: answers["1"],
//     q38: answers["38"],
//     q38_1: answers[""],
//     q38_2: answers[""],
//     q38_3: answers[""],
//     q38_4: answers[""],
//     q39: answers["39"],
//     q39_1: answers[""],
//     q39_2: answers[""],
//     q39_3: answers[""],
//     q39_4: answers[""],
//     q40: answers["40"],
//     q40_1: answers[""],
//     q40_2: answers[""],
//     q40_3: answers[""],
//     q40_4: answers[""],
//     q41: answers["41"],
//     q41_1: answers[""],
//     q41_2: answers[""],
//     q41_3: answers[""],
//     q41_4: answers[""],
//     q42: answers["42"],
//     q43: answers["43"],
//     q44: answers["44"],
//     q45: answers["45"],
//     q46: answers["46"],
//     q47: answers["47"],
//     q48: answers["48"],
//     q49: answers["49"],
//     q50: answers["50"],
//     q51: answers["51"],
//     q52: answers["52"],
//     q53: answers["53"],
//     q54: answers["54"],
//     q55: answers["55"],
//     q56: answers["56"],
//     q57: answers["57"],
//   };
// };