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

export default function QuestionsScreen() {
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const flatListRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [talukaOptions, setTalukaOptions] = useState([]);

  // const requiredFields = ['6', 'surveyor_name', 'district', 'taluka', 'village', '1', '2', '3', '18', '26', '56', '57'];
  const requiredFields = []

  const districtTalukaMap = {
    'Chitradurga': ['Challekere', 'Hiriyur', 'Holalkere', 'Chitradurga', 'Hosadurga', 'Molakalmuru'],
    'Shivamogga': ['Shikaripura', 'Shimoga', 'Sagar', 'Hosanagara', 'Bhadravati', 'Sorab', 'Thirthahalli'],
    'Udupi': ['Udupi', 'Karkala', 'Kundapura', 'Brahmavar', 'Byandur', 'Hebri', 'Kaapu'],
    'Mandya': ['K R Pet', 'Nagamangala', 'Malavalli', 'Maddur', 'Mandya', 'Pandavapura', 'Srirangapatna'],
    'Chikkaballapur': ['Gauribidanur', 'Chintamani', 'Bagepalli', 'Sidlaghatta', 'Chikkaballapur', 'Gudibande', 'Manchenhalli'],
    'Bidar': ['Bhalki', 'Basavakalyan', 'Bidar', 'Aurad', 'Humnabad', 'Kamalanagar', 'Chitaguppa', 'Hulasuru'],
    'Kalaburagi': ['Aland', 'Chincholi', 'Sedam', 'Afzalpur', 'Gulbarga', 'Kalagi', 'Chittapur', 'Jevargi', 'Yadrami', 'Kamalapura', 'Sahabada'],
    'Uttara Kannada': ['Mundgod', 'Haliyal', 'Sirsi', 'Siddapur', 'Bhatkal', 'Yellapur', 'Joida', 'Ankola', 'Honnavar', 'Kumta', 'Karwar', 'Dandeli'],
    'Vijayapura': ['Indi', 'Basavan Bagevadi', 'Sindagi', 'Muddebihal', 'Bijapur', 'Thikota', 'Devara Hippargi', 'Babaleshwar', 'Talikote', 'Chadachan', 'Kolhara', 'Nidagundi', 'Alamela'],
    'Belagavi': ['Ramadurg', 'Athani', 'Khanapur', 'Savdatti', 'Raibag', 'Bailhongal', 'Belgaum', 'Chikkodi', 'Hukkeri', 'Kittur', 'Gokak', 'Kagavada', 'Mudalagi', 'Nippani', 'Yaragatti']
  };

  useEffect(() => {
    if (answers.district && districtTalukaMap[answers.district]) {
      setTalukaOptions(districtTalukaMap[answers.district]);
      setAnswers((prev) => ({ ...prev, taluka: '' })); // reset taluka when district changes
    } else {
      setTalukaOptions([]);
    }
  }, [answers.district]);


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
    if (id === '6') {
      const numeric = value.replace(/\D/g, '');
      const trimmed = numeric.slice(0, 10);
      setAnswers(prev => ({ ...prev, [id]: trimmed }));
      setErrors(prev => ({
        ...prev,
        [id]: trimmed.length === 10 ? null : 'Phone number must be 10 digits',
      }));
    } else if (
      value &&
      typeof value === 'object' &&
      'latitude' in value &&
      'longitude' in value
    ) {
      const latLngString = `${value.latitude},${value.longitude}`;
      setAnswers(prev => ({ ...prev, [id]: latLngString }));
    } else {
      setAnswers(prev => ({ ...prev, [id]: value }));
    }
  };

  const submitSurveyData = async (payload) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (!accessToken) throw new Error('No access token found');

    const formData = new FormData();

    // Append meta fields
    const metadata = extractSurveyMetadata();
    for (const key in metadata) {
      if (metadata[key] !== null) {
        formData.append(key, metadata[key]);
      }
    }

    // Append answers (including image file if present)
    for (const key in payload) {
      const val = payload[key];

      if (typeof val === 'string' && val.startsWith('file://')) {
        const name = val.split('/').pop();
        formData.append(key, {
          uri: val,
          type: 'image/jpeg',
          name: name || `photo_${Date.now()}.jpg`,
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
        },
      }
    );

    return response.data;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Validate required fields
      const currentErrors = {};
      for (const field of requiredFields) {
        const value = answers[field];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          Alert.alert('Missing Answer', `Please fill in the required field: ${field}`);
          setIsSubmitting(false);
          return;
        }

        if (field === '6' && value.length !== 10) {
          Alert.alert('Invalid Phone Number', 'Phone number must be exactly 10 digits.');
          setIsSubmitting(false);
          return;
        }
      }

      if (Object.keys(currentErrors).length > 0) {
        setErrors(currentErrors);
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        setIsSubmitting(false);
        return;
      }

      // Clear previous errors
      setErrors({});

      // Build the payload
      const payload = {
        surveyor_name: answers.surveyor_name || '',
        village: answers.village || null,
        district: answers.district || null,
        taluka: answers.taluka || null,
      };

      // Handle location
      if (answers['60']) {
        const [latitude, longitude] = answers['60'].split(',');
        payload.latitude = latitude;
        payload.longitude = longitude;
      }

      // Process all questions
      for (const item of serializedData) {
        if (item.type !== 'question') continue;

        const val = answers[item.id];
        const otherVal = answers[`${item.id}_other`];

        // Skip question 21 as we'll handle it separately
        if (item.id === '21') continue;

        // Handle main question
        if (item.question_type === 'multi-select') {
          payload[item.id] = val ? JSON.stringify(val) : '[]';
        } else if (item.question_type === 'radio' && val === 'Other(Specify)') {
          payload[item.id] = otherVal || null;
        } else {
          payload[item.id] = val || null;
        }

        // Handle subQuestionsByValue
        if (item.subQuestionsByValue && val) {
          const subQList = item.subQuestionsByValue[val];
          if (subQList) {
            for (const subQ of subQList) {
              const subVal = answers[subQ.id];

              if (subQ.question_type === 'multi-select') {
                payload[subQ.id] = subVal ? JSON.stringify(subVal) : '[]';
              } else if (subQ.question_type === 'radio' && subVal === 'Other(Specify)') {
                payload[subQ.id] = answers[`${subQ.id}_other`] || null;
              } else {
                payload[subQ.id] = subVal || null;
              }
            }
          }
        }

        // Handle old-style subQuestions
        if (item.subQuestions) {
          const trigger = item.subQuestions.triggerValue;
          const triggered = (
            item.question_type === 'multi-select'
              ? Array.isArray(val) && val.includes(trigger)
              : val === trigger
          );

          if (triggered) {
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

      // Handle question 21 specifically
      const miCrops = [];
      if (answers['21_crop1']) miCrops.push(answers['21_crop1']);
      if (answers['21_crop2']) miCrops.push(answers['21_crop2']);
      if (answers['21_other_crop']) miCrops.push(answers['21_other_crop']);

      payload['21'] = miCrops.length > 0 ? JSON.stringify(miCrops) : null;

      // Include all crop-related fields
      const cropFields = {
        // Pre-MI Crop 1
        'q21_crop1': answers['21_crop1'],
        'q21_labour_cost1': answers['21_labour_cost1'],
        'q21_nutrition_cost1': answers['21_nutrition_cost1'],
        'q21_plant_protection1': answers['21_plant_protection1'],
        'q21_land_prep1': answers['21_land_prep1'],
        'q21_yield1': answers['21_yield1'],
        'q21_income1': answers['21_income1'],
        'q21_hours_irrigation1': answers['21_hours_irrigation1'],
        'q21_pump_capacity1': answers['21_pump_capacity1'],

        // Pre-MI Crop 2
        'q21_crop2': answers['21_crop2'],
        'q21_labour_cost2': answers['21_labour_cost2'],
        'q21_nutrition_cost2': answers['21_nutrition_cost2'],
        'q21_plant_protection2': answers['21_plant_protection2'],
        'q21_land_prep2': answers['21_land_prep2'],
        'q21_yield2': answers['21_yield2'],
        'q21_income2': answers['21_income2'],
        'q21_hours_irrigation2': answers['21_hours_irrigation2'],
        'q21_pump_capacity2': answers['21_pump_capacity2'],

        // MI Crops
        'q21_mi_crop1': answers['21_crop1'],  // Same as pre-MI crop1
        'q21_mi_area1': answers['21_area1'],
        'q21_mi_crop2': answers['21_crop2'],  // Same as pre-MI crop2
        'q21_mi_area2': answers['21_area2'],
        'q21_mi_other_crop': answers['21_other_crop'],
        'q21_mi_other_area': answers['21_other_area']
      };

      // Add only non-empty crop fields to payload
      Object.entries(cropFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          payload[key] = value;
        }
      });

      // Handle photo upload if present
      if (answers['61']) {
        payload.photo = {
          uri: answers['61'],
          type: 'image/jpeg',
          name: `survey_photo_${Date.now()}.jpg`
        };
      }

      // Clean the payload by removing null/empty values
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => {
          if (value === null || value === undefined) return false;
          if (typeof value === 'string' && value.trim() === '') return false;
          if (typeof value === 'object' && Object.keys(value).length === 0) return false;
          return true;
        })
      );

      console.log('Final payload:', cleanPayload);

      // Submit the data
      const response = await submitSurveyData(cleanPayload);
      console.log('Submission response:', response);

      // Reset form after successful submission
      const username = await AsyncStorage.getItem('username');
      setAnswers({
        surveyor_name: username || '',
        '60': null, // Reset location
      });

      Alert.alert('Success', 'Survey submitted successfully!');
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });

    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'Failed to submit survey. Please try again.');
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
    // Handle subQuestionsByValue if defined
    if (item.subQuestionsByValue) {
      const subQList = item.subQuestionsByValue[answers[item.id]];
      if (!subQList) return null;

      return subQList.map((subQ) => (
        <View key={subQ.id} style={styles.subQuestionContainer}>
          <Text style={styles.questionTextCrop}>
            {subQ.text}
          </Text>

          {subQ.question_type === 'multi-select' ? (
            subQ.options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.checkboxContainer}
                onPress={() => {
                  const current = answers[subQ.id] || [];
                  const updated = current.includes(option)
                    ? current.filter((o) => o !== option)
                    : [...current, option];

                  handleAnswerChange(subQ.id, updated);

                  if (!updated.includes('Other(Specify)')) {
                    handleAnswerChange(`${subQ.id}_other`, null);
                  }
                }}
              >
                <View style={styles.checkbox}>
                  {answers[subQ.id]?.includes(option) && (
                    <Text style={styles.checkboxTick}>✔</Text>
                  )}
                </View>
                <Text style={styles.checkboxLabel}>{option}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={answers[subQ.id] || ''}
                onValueChange={(value) => handleAnswerChange(subQ.id, value)}
                style={styles.picker}
              >
                <Picker.Item label="Select an option..." value="" />
                {subQ.options.map((opt) => (
                  <Picker.Item key={opt} label={opt} value={opt} />
                ))}
              </Picker>
            </View>
          )}

          {/* Optional "Other(Specify)" input for multi-select */}
          {answers[subQ.id]?.includes?.('Other(Specify)') && (
            <TextInput
              style={styles.input}
              placeholder="Please specify"
              value={answers[`${subQ.id}_other`] || ''}
              onChangeText={(text) => handleAnswerChange(`${subQ.id}_other`, text)}
            />
          )}
        </View>
      ));
    }

    // Fallback to old subQuestions logic
    if (!item.subQuestions || answers[item.id] !== item.subQuestions.triggerValue) return null;

    return item.subQuestions.questions.map((subQ) => (
      <View key={subQ.id} style={styles.subQuestionContainer}>
        <Text style={styles.questionTextCrop}>
          {subQ.text}
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
            {requiredFields.includes(item.id) && <Text style={styles.redStar}> *</Text>}
          </Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={answers.surveyor_name || ''}
            editable={false}
          />
        </View>
      );
    }

    if (item.id === '21') {
      return (
        <View style={styles.questionContainer}>
          <Text style={styles.questionTextCrop}>
            {item.showSerial ? `${item.serial}. ` : ''}{item.text}
            {requiredFields.includes(item.id) && <Text style={styles.redStar}> *</Text>}
          </Text>

          {/* Pre MI Crop 1 Section */}
          <Text style={styles.sectionHeading}>Pre MI Crop 1</Text>
          <Text style={styles.subLabel}>Crop Type</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={answers['21_crop1'] || ''}
              onValueChange={(value) => handleAnswerChange('21_crop1', value)}
              style={styles.picker}
            >
              <Picker.Item label="Select crop..." value="" />
              {item.options?.map(option => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>

          <Text style={styles.subLabel}>Labour Cost (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={answers['21_labour_cost1'] || ''}
            onChangeText={(text) => handleAnswerChange('21_labour_cost1', text)}
            keyboardType="numeric"
          />

          <Text style={styles.subLabel}>Nutrition Management (Fertilizers) (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={answers['21_nutrition_cost1'] || ''}
            onChangeText={(text) => handleAnswerChange('21_nutrition_cost1', text)}
            keyboardType="numeric"
          />

          <Text style={styles.subLabel}>Plant Protection (Pesticide & Weedicides) (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={answers['21_plant_protection1'] || ''}
            onChangeText={(text) => handleAnswerChange('21_plant_protection1', text)}
            keyboardType="numeric"
          />

          <Text style={styles.subLabel}>Land Preparation & Harvesting (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={answers['21_land_prep1'] || ''}
            onChangeText={(text) => handleAnswerChange('21_land_prep1', text)}
            keyboardType="numeric"
          />

          <Text style={styles.subLabel}>Yield (Quintal)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter yield"
            value={answers['21_yield1'] || ''}
            onChangeText={(text) => handleAnswerChange('21_yield1', text)}
            keyboardType="numeric"
          />

          <Text style={styles.subLabel}>Income (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter income"
            value={answers['21_income1'] || ''}
            onChangeText={(text) => handleAnswerChange('21_income1', text)}
            keyboardType="numeric"
          />

          <Text style={styles.subLabel}>Hours per Irrigation</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter hours"
            value={answers['21_hours_irrigation1'] || ''}
            onChangeText={(text) => handleAnswerChange('21_hours_irrigation1', text)}
            keyboardType="numeric"
          />

          <Text style={styles.subLabel}>Pump Capacity (HP)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter HP"
            value={answers['21_pump_capacity1'] || ''}
            onChangeText={(text) => handleAnswerChange('21_pump_capacity1', text)}
            keyboardType="numeric"
          />

          {/* Pre MI Crop 2 Section */}
          <Text style={[styles.sectionHeading, { marginTop: 20 }]}>Pre MI Crop 2</Text>
          <Text style={styles.subLabel}>Crop Type</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={answers['21_crop2'] || ''}
              onValueChange={(value) => handleAnswerChange('21_crop2', value)}
              style={styles.picker}
            >
              <Picker.Item label="Select crop..." value="" />
              {item.options?.map(option => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>

          <Text style={styles.subLabel}>Labour Cost (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={answers['21_labour_cost2'] || ''}
            onChangeText={(text) => handleAnswerChange('21_labour_cost2', text)}
            keyboardType="numeric"
          />

          <Text style={styles.subLabel}>Nutrition Management (Fertilizers) (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={answers['21_nutrition_cost2'] || ''}
            onChangeText={(text) => handleAnswerChange('21_nutrition_cost2', text)}
            keyboardType="numeric"
          />

          <Text style={styles.subLabel}>Plant Protection (Pesticide & Weedicides) (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={answers['21_plant_protection2'] || ''}
            onChangeText={(text) => handleAnswerChange('21_plant_protection2', text)}
            keyboardType="numeric"
          />

          <Text style={styles.subLabel}>Land Preparation & Harvesting (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={answers['21_land_prep2'] || ''}
            onChangeText={(text) => handleAnswerChange('21_land_prep2', text)}
            keyboardType="numeric"
          />

          <Text style={styles.subLabel}>Yield (Quintal)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter yield"
            value={answers['21_yield2'] || ''}
            onChangeText={(text) => handleAnswerChange('21_yield2', text)}
            keyboardType="numeric"
          />

          <Text style={styles.subLabel}>Income (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter income"
            value={answers['21_income2'] || ''}
            onChangeText={(text) => handleAnswerChange('21_income2', text)}
            keyboardType="numeric"
          />

          <Text style={styles.subLabel}>Hours per Irrigation</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter hours"
            value={answers['21_hours_irrigation2'] || ''}
            onChangeText={(text) => handleAnswerChange('21_hours_irrigation2', text)}
            keyboardType="numeric"
          />

          <Text style={styles.subLabel}>Pump Capacity (HP)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter HP"
            value={answers['21_pump_capacity2'] || ''}
            onChangeText={(text) => handleAnswerChange('21_pump_capacity2', text)}
            keyboardType="numeric"
          />

          {/* MI Crop Section */}
          <Text style={styles.sectionHeading}>MI Crops</Text>

          <Text style={styles.subLabel}>Crop1 (Primary crop taken MI)</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={answers['21_crop1'] || ''}
              onValueChange={(value) => handleAnswerChange('21_crop1', value)}
              style={styles.picker}
            >
              <Picker.Item label="Select crop..." value="" />
              {item.options?.map(option => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>

          <Text style={styles.subLabel}>Area1 (Acres, Gunta)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter area"
            value={answers['21_area1'] || ''}
            onChangeText={(text) => handleAnswerChange('21_area1', text)}
            keyboardType="numeric"
          />

          <Text style={styles.subLabel}>Crop2</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={answers['21_crop2'] || ''}
              onValueChange={(value) => handleAnswerChange('21_crop2', value)}
              style={styles.picker}
            >
              <Picker.Item label="Select crop..." value="" />
              {item.options?.map(option => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>

          <Text style={styles.subLabel}>Area2 (Acres, Gunta)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter area"
            value={answers['21_area2'] || ''}
            onChangeText={(text) => handleAnswerChange('21_area2', text)}
            keyboardType="numeric"
          />

          <Text style={styles.subLabel}>Other Crop</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter other crop"
            value={answers['21_other_crop'] || ''}
            onChangeText={(text) => handleAnswerChange('21_other_crop', text)}
          />

          <Text style={styles.subLabel}>Other Area (Acres, Gunta)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter area"
            value={answers['21_other_area'] || ''}
            onChangeText={(text) => handleAnswerChange('21_other_area', text)}
            keyboardType="numeric"
          />
        </View>
      );
    }


    if (item.type === 'submit_button') {
      return (
        <TouchableOpacity
          style={[styles.button, isSubmitting && { backgroundColor: '#999' }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Submitting...' : 'Submit Answers'}
          </Text>
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
            {requiredFields.includes(item.id) && <Text style={styles.redStar}> *</Text>}
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
            {requiredFields.includes(item.id) && <Text style={styles.redStar}> *</Text>}
          </Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={answers[item.id] || ''}
              onValueChange={(value) => handleAnswerChange(item.id, value)}
              style={styles.picker}
            >
              <Picker.Item label="Select an option..." value="" />
              {(item.id === 'taluka' ? talukaOptions : item.options).map(option => (
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
            {requiredFields.includes(item.id) && <Text style={styles.redStar}> *</Text>}
          </Text>
          <PhotoCapture
            onCapture={(photo) => handleAnswerChange(item.id, photo)}
            onClear={() => handleAnswerChange(item.id, null)}
            value={answers[item.id]}
          />
        </View>
      );
    }

    if (item.question_type === 'multi-select') {
      const selectedOptions = answers[item.id] || [];

      const toggleOption = (option) => {
        let updated = [...selectedOptions];
        if (updated.includes(option)) {
          updated = updated.filter(o => o !== option);
        } else {
          updated.push(option);
        }
        handleAnswerChange(item.id, updated);

        // If deselecting 'Other(Specify)', also clear its value
        if (option === 'Other(Specify)' && selectedOptions.includes('Other(Specify)')) {
          handleAnswerChange(`${item.id}_other`, null);
        }
      };


      return (
        <View style={styles.questionContainer}>
          <Text style={styles.questionTextCrop}>
            {item.showSerial ? `${item.serial}. ` : ''}{item.text}
            {requiredFields.includes(item.id) && <Text style={styles.redStar}> *</Text>}
          </Text>

          {item.options.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.checkboxContainer}
              onPress={() => toggleOption(option)}
            >
              <View style={styles.checkbox}>
                {selectedOptions.includes(option) && <Text style={styles.checkboxTick}>✔</Text>}
              </View>
              <Text style={styles.checkboxLabel}>{option}</Text>
            </TouchableOpacity>
          ))}

          {selectedOptions.includes('Other(Specify)') && (
            <TextInput
              style={styles.input}
              placeholder="Please specify"
              value={answers[`${item.id}_other`] || ''}
              onChangeText={(text) => handleAnswerChange(`${item.id}_other`, text)}
            />
          )}
        </View>
      );
    }

    if (item.question_type === 'location') {
      return (
        <View style={styles.questionContainer}>
          <Text style={styles.questionTextCrop}>
            {item.showSerial ? `${item.serial}. ` : ''}
            {item.text}
            {requiredFields.includes(item.id) && <Text style={styles.redStar}> *</Text>}
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
          {requiredFields.includes(item.id) && <Text style={styles.redStar}> *</Text>}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Answer"
          value={answers[item.id] || ''}
          onChangeText={(text) => handleAnswerChange(item.id, text)}
          keyboardType={['2', '6', '10', '11', '12', '49', '43', '44', '49'].includes(item.id) ? 'phone-pad' : 'default'}
          maxLength={item.id === '6' ? 10 : undefined}
        />
        {errors[item.id] && (
          <Text style={styles.errorText}> {errors[item.id]} *</Text>
        )}
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#4A4947',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxTick: {
    fontSize: 12,
    color: '#4A4947',
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  redStar: {
    color: 'red',
    fontWeight: 'bold',
  },
  subLabel: {
    fontSize: 13,
    marginTop: 10,
    marginBottom: 4,
    fontWeight: '500',
    color: '#555',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
    color: '#333',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
  },
});