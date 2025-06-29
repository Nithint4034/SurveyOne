import React, { useEffect, useState, useCallback } from 'react';
import { View, Button, Text, StyleSheet, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { useFocusEffect } from '@react-navigation/native';

const API_BASE_URL = 'https://tomhudson.pythonanywhere.com/dashboard';
const ACCESS_TOKEN_KEY = 'accessToken';
const USER_NAME_KEY = 'username';

const DashboardScreen = () => {
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [countOnDate, setCountOnDate] = useState();
  const [totalCount, setTotalCount] = useState();
  const [dateDisplay, setDateDisplay] = useState("");
  const [userName, setUserName] = useState(USER_NAME_KEY);
  const [isUserNameLoaded, setIsUserNameLoaded] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const retrieveAuthData = async () => {
      try {
        // Get both username and access token
        const [username, token] = await AsyncStorage.multiGet([USER_NAME_KEY, ACCESS_TOKEN_KEY]);
        
        if (username[1]) setUserName(username[1]);
        if (token[1]) setAccessToken(token[1]);
      } catch (error) {
        console.error("Error retrieving auth data:", error);
        Alert.alert("Error", "Failed to load user data");
      } finally {
        setIsUserNameLoaded(true);
      }
    };
    retrieveAuthData();
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
    if (!accessToken) {
      console.error('No access token available');
      Alert.alert('Error', 'Authentication required. Please login again.');
      return;
    }

    try {
      const formattedDate = formatDate(selectedDate);
      
      const response = await axios.post(API_BASE_URL, {
        username: userName,
        date: formattedDate,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      
      if (response.data) {
        setCountOnDate(response.data.count_on_date);
        setTotalCount(response.data.total_count);
        setDateDisplay(formatDatedisplay(selectedDate));
      }
    } catch (error) {
      console.error('Error fetching data:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Your session has expired. Please login again.');
        // You might want to navigate to login screen here
      } else {
        Alert.alert('Error', 'Failed to fetch data. Please try again.');
      }
    }
  };

  const handleConfirm = async (selectedDate = new Date()) => {
    setDate(selectedDate);
    await fetchData(selectedDate);
    hideDatePicker();
  };

  useFocusEffect(
    useCallback(() => {
      if (isUserNameLoaded && accessToken) {
        fetchData(date);
      }
    }, [date, isUserNameLoaded, userName, accessToken])
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
              <Text style={styles.boldText}> {countOnDate}</Text>
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
        source={require('../assets/dash3.json')}
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