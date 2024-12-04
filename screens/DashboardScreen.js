import React, { useEffect, useState, useCallback } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { useFocusEffect } from '@react-navigation/native';

const API_BASE_URL = 'https://nithint.pythonanywhere.com/dashboard/'; // Base URL without user-specific part
const USER_NAME_KEY = 'userName';

const DashboardScreen = () => {
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dailyCount, setDailyCount] = useState();
  const [totalCount, setTotalCount] = useState();
  const [dateDisplay, setDateDisplay] = useState("");
  const [userName, setUserName] = useState("");
  const [isUserNameLoaded, setIsUserNameLoaded] = useState(false);

  useEffect(() => {
    const retrieveUserName = async () => {
      try {
        const value = await AsyncStorage.getItem(USER_NAME_KEY);
        if (value) setUserName(value);
      } catch (error) {
        console.error("Error retrieving user name:", error);
      } finally {
        setIsUserNameLoaded(true);
      }
    };
    retrieveUserName();
  }, []);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDatedisplay = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const fetchData = async (selectedDate) => {
    try {
      const formattedDate = formatDate(selectedDate);
      const url = `${API_BASE_URL}${userName}/`; 
      
      const response = await axios.post(url, {
        Date: formattedDate,
      });
      
      if (response.data) {
        setDailyCount(response.data.dailyCount);
        setTotalCount(response.data.totalCount);
        setDateDisplay(formatDatedisplay(selectedDate));
      }
    } catch (error) {
      console.error('Error fetching data:', error.response?.status || error.message);
    }
  };

  const handleConfirm = async (selectedDate = new Date()) => {
    setDate(selectedDate);
    await fetchData(selectedDate);
    hideDatePicker();
  };

  useFocusEffect(
    useCallback(() => {
      if (isUserNameLoaded) {
        fetchData(date);
      }
    }, [date, isUserNameLoaded])
  );

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.countText}>Hello <Text style={styles.boldText}>{userName}</Text></Text>
      </View>
      <View style={styles.card}>
        <Button title="Date picker" color="#4A4947" onPress={showDatePicker} />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        {totalCount !== undefined ? (
          <View style={styles.countContainer}>
            <Text style={styles.countText}>
              Counts on "<Text style={styles.dateText}>{dateDisplay}</Text>":
              <Text style={styles.boldText}> {dailyCount}</Text>
            </Text>
            <Text style={styles.countText}>
              Total Count: <Text style={styles.boldText}>{totalCount}</Text>
            </Text>
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading today's counts...</Text>
          </View>
        )}
      </View>
      <LottieView
        source={require('../assets/dash.json')}
        autoPlay
        loop
        style={styles.mapLoadingAnimation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width: '90%',
    marginTop: 60,
    height: 150,
    justifyContent: 'space-between',
  },
  countContainer: {
    marginTop: 20,
    alignItems: 'center',
    flex: 1,
  },
  countText: {
    fontSize: 20,
    fontWeight: '400',
    // color:"#4A4947"
  },
  dateText: {
    fontWeight: '500',
    fontStyle: 'italic',
  },
  boldText: {
    fontWeight: 'bold',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  mapLoadingAnimation: {
    width: 600,
    height: 250,
    marginTop: '10%',
  },
  title: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
});

export default DashboardScreen;
