import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome5 } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiToHeaderMap = {
  survey_id: 'Survey ID',
  surveyor_name: 'Surveyor Name',
  created_at: 'Date & Time',
  district: 'District',
  taluka: 'Taluka',
  village: 'Village',
  q1: '1. Name of the Farmer / Beneficiary',
  q2: '2. Age years',
  q3: '3. Gender',
  q4: '4. Category',
  q5: '5. Highest Education Level',
  q6: '6. Phone Number',
  q7: '7. Landholding Size',
  q8: '8. Primary Occupation',
  q9: '9. Secondary Occupation (if any)',
  q10: '10. Total Agricultural Land Owned (in acre. Gunta)',
  q11: '11. Irrigated Land (in acres. Gunta)',
  q12: '12. Non-Irrigated Land (in acres  Gunta)',
  q13: '13. Have you adopted micro irrigation? (Tick the appropriate option)',
  q13_1: '13.1. If Drip',
  q13_2: '13.2. If Sprinkler',
  q14: '14. Have you taken Government subsidy for setting up Micro Irrigation?',
  q15: '15. Which year you submitted your application?',
  q16: '16. Month & Year of Installation',
  q17_1: '17.1. Crop1 (Primary crop taken MI)',
  q17_2: '17.2. Area1 (Acres  Gunta)',
  q17_3: '17.3. Crop2',
  q17_4: '17.4. Area2 (Acres  Gunta)',
  q17_5: '17.5. Other Crop',
  q17: '17.6. Other Area(Acres  Gunta)',
  q18: '18. Source of Irrigation (tick applicable)',
  q19: '19. How did you come to know about the PMKSY-PDMC Scheme?',
  q20: '20. Who Installed the MI System?',
  q21: '21. Name of the agency / vendor',
  q22: '22. What are the MI components received? (tick applicable)',
  q23: '23. Is the MI System Still in Use? If No  share the reason',
  q23_1: '23_1. If No  mention the reason',
  q24: '24. Did the MI agency or Government Department assist with the subsidy documentation? How was their response?',
  q25: '25. Have you received the MI subsidy approval communication?',
  q26: '26. How did you receive the communication? (tick applicable)',
  q27: '27. Did the MI or Dept take your signature after successful installation?',
  q28: '28. Have you received the MI subsidy payment approval message via SMS?',
  q29: '29. Did you get any training or booklet on MI operation and maintenance? If yes  please give details',
  q30: '30. Have you received any communication on MI System Warranty?',
  q31: '31. Has the MI company provided any service after installation?',
  q32: '32. Are you aware of the MI companys service person  center  or helpline number? Please share details.',
  q33: '33. When do you do the maintenance?',
  q34: '34. Did you face any problems while using the MI system? If yes  please explain.',
  q35: '35. Overall Satisfaction Level with MI System:',
  q36: '36. Has your water use reduced after using the MI system? If yes  how much?',
  q37: '37. Is there any reduction in labour cost per acre after using the MI system?',
  q37_1: '37.1. Crop 1 Before MI ₹',
  q37_2: '37.2. Crop 1 After MI ₹',
  q37_3: '37.3. Crop 2 Before MI ₹',
  q37_4: '37.4. Crop 2 After MI ₹',
  q38: '38. Has the nutrition management cost per acre reduced after MI system use?',
  q38_1: '38.1. Crop 1 Before MI ₹',
  q38_2: '38.2. Crop 1 After MI ₹',
  q38_3: '38.3. Crop 2 Before MI ₹',
  q38_4: '38.4. Crop 2 After MI ₹',
  q39: '39. Has the plant protection cost per acre reduced after MI system use?',
  q39_1: '39.1. Crop 1 Before MI ₹',
  q39_2: '39.2. Crop 1 After MI ₹',
  q39_3: '39.3. Crop 2 Before MI ₹',
  q39_4: '39.4. Crop 2 After MI ₹',
  q40: '40. Has the crop yield per acre increased after adopting the MI system?',
  q40_1: '40.1. Crop 1 Before MI ₹',
  q40_2: '40.2. Crop 1 After MI ₹',
  q40_3: '40.3. Crop 2 Before MI ₹',
  q40_4: '40.4. Crop 2 After MI ₹',
  q41: '41. Has your income per acre increased after adopting the MI system?',
  q41_1: '41.1. Crop 1 Before MI ₹',
  q41_2: '41.2. Crop 1 After MI ₹',
  q41_3: '41.3. Crop 2 Before MI ₹',
  q41_4: '41.4. Crop 2 After MI ₹',
  q42: '42. MI Financial Details – Total cost of MI system installed (₹ per acre)',
  q43: '43. MI Financial Details – Subsidy availed from the government (₹ per acre)',
  q44: '44. Have you taken any loan from a financial institution for MI? If yes  from where and how much (₹)',
  q45: '45. Has the adoption of MI influenced your standard of living?',
  q46: '46. Did MI Adoption Create New Employment in Your Area?',
  q47: '47. Has the adoption of MI helped in women empowerment?',
  q48: '48. Has any member of your family been training on MI Maintenance?',
  q49: '49. Have you observed any water saving after using the MI system? If yes  approx percentage reduction (%)',
  q50: '50. Have you observed any change in groundwater levels after MI adoption?',
  q51: '51. Would you recommend MI to other farmers under the current scheme?',
  q52: '52. Any issues from Dept or MI agency during approval? If yes  list them',
  q53: '53. Any Suggestions for Improving the MI Scheme?',
  q54: '54. Any Additional comments?',
  q55: '55. Have you attended any MI promotion activity organized by Government Departments? If yes  please provide the details.',
  q56: '56. Location',
  q57: '57. Photo URL'
};

const AdminDownload = () => {
  const [usernames, setUsernames] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('Error', 'Access token not found.');
          return;
        }

        const response = await fetch('https://tomhudson.pythonanywhere.com/users/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const data = await response.json();
        setUsernames(data.usernames || []);
        if (data.usernames.length > 0) {
          setSelectedUser(data.usernames[0]);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        Alert.alert('Error', 'Failed to load users.');
      }
    };

    fetchUsernames();
  }, []);

  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!selectedUser) return;
      setLoading(true);

      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('Error', 'Access token not found.');
          return;
        }

        const response = await fetch(`https://tomhudson.pythonanywhere.com/formdata/user/?username=${selectedUser}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const data = await response.json();
        setCsvData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching survey data:', err);
        Alert.alert('Error', 'Failed to load survey data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyData();
  }, [selectedUser]);

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';

    // Get all possible keys from the first item
    const allKeys = [];
    if (data.length > 0) {
      // First get the metadata fields
      const metaKeys = ['survey_id', 'surveyor_name', 'created_at', 'district', 'taluka', 'village'];
      allKeys.push(...metaKeys);

      // Then get all q1-q56 fields
      for (let i = 1; i <= 56; i++) {
        allKeys.push(`q${i}`);

        // Add sub-questions for specific questions
        if (i === 13 || i === 17 || i === 23 || i === 37 || i === 38 || i === 39 || i === 40 || i === 41) {
          const subKeys = Object.keys(data[0]).filter(k => k.startsWith(`q${i}_`));
          allKeys.push(...subKeys);
        }
      }

      // Finally add the photo field if it exists
      if (data[0].q57) {
        allKeys.push('q57');
      }
    }

    // Create headers row
    const headers = allKeys.map(key => {
      return apiToHeaderMap[key] || key;
    });

    // Process each row
    const csvRows = data.map(row => {
      return allKeys.map(key => {
        let value = row[key] ?? '';

        // Format dates
        if (key === 'created_at' && value) {
          value = new Date(value).toLocaleString();
        }

        // Handle photo URL - fix the path
        if (key === 'q57' && value) {
          // Remove duplicate 'uploads' from path if it exists
          value = value.replace('/media/uploads/uploads/', '/media/uploads/');
          value = `https://tomhudson.pythonanywhere.com${value}`;
        }

        // Escape commas and quotes
        if (typeof value === 'string') {
          value = value.replace(/"/g, '""');
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            value = `"${value}"`;
          }
        }

        return value;
      }).join(',');
    });

    return [headers.join(','), ...csvRows].join('\n');
  };

  const handleDownloadCSV = async () => {
    if (csvData.length === 0) {
      Alert.alert('No Data', 'There is no data to export.');
      return;
    }

    const csvContent = convertToCSV(csvData);
    console.log('Generated CSV:', csvContent); // For debugging

    const fileName = `survey_data_${selectedUser}_${new Date().toISOString().slice(0, 10)}.csv`;
    const fileUri = FileSystem.documentDirectory + fileName;

    try {
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Export Survey Data',
          UTI: 'public.comma-separated-values-text'
        });
      } else {
        Alert.alert('File Saved', `CSV saved to: ${fileUri}`);
      }
    } catch (error) {
      console.error('Error saving file:', error);
      Alert.alert('Error', 'There was an error saving the CSV file.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Survey Data Export</Text>
        <TouchableOpacity
          onPress={handleDownloadCSV}
          style={styles.downloadButton}
          disabled={loading || csvData.length === 0}
        >
          <FontAwesome5 name="file-download" size={18} color="#2196F3" />
          <Text style={styles.downloadButtonText}>Download CSV</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Select User:</Text>
        {usernames.length === 0 ? (
          <ActivityIndicator size="small" color="#2196F3" />
        ) : (
          <Picker
            selectedValue={selectedUser}
            style={styles.picker}
            onValueChange={value => setSelectedUser(value)}
            dropdownIconColor="#2196F3"
          >
            {usernames.map((name, idx) => (
              <Picker.Item key={idx} label={name} value={name} />
            ))}
          </Picker>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading survey data...</Text>
        </View>
      ) : csvData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No survey data available for selected user</Text>
        </View>
      ) : (
        <View style={styles.dataContainer}>
          <Text style={styles.dataSummary}>
            Showing {csvData.length} records for {selectedUser}
          </Text>
          <ScrollView horizontal style={styles.scrollView}>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                {Object.keys(apiToHeaderMap).map((key, index) => (
                  <View key={index} style={styles.headerCell}>
                    <Text style={styles.headerText}>{apiToHeaderMap[key]}</Text>
                  </View>
                ))}
              </View>
              <ScrollView>
                {csvData.map((item, rowIndex) => (
                  <View
                    key={rowIndex}
                    style={[
                      styles.tableRow,
                      rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow
                    ]}
                  >
                    {Object.keys(apiToHeaderMap).map((key, cellIndex) => {
                      let value = item[key] ?? '';
                      if (key === 'created_at' && value) {
                        value = new Date(value).toLocaleString();
                      }
                      if (key === 'q57' && value) {
                        // Fix the URL path before displaying
                        const fixedUrl = value.replace('/media/uploads/uploads/', '/media/uploads/');
                        return (
                          <TouchableOpacity
                            key={cellIndex}
                            style={styles.cell}
                            onPress={() => Linking.openURL(`https://tomhudson.pythonanywhere.com${fixedUrl}`)}
                          >
                            <Text style={styles.linkText}>View Photo</Text>
                          </TouchableOpacity>
                        );
                      }
                      return (
                        <View key={cellIndex} style={styles.cell}>
                          <Text style={styles.cellText}>{value}</Text>
                        </View>
                      );
                    })}
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  downloadButtonText: {
    marginLeft: 5,
    color: '#2196F3',
    fontWeight: '500',
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  picker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  dataContainer: {
    flex: 1,
  },
  dataSummary: {
    marginBottom: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  scrollView: {
    flex: 1,
  },
  table: {
    minWidth: 1500,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    paddingVertical: 10,
  },
  headerCell: {
    width: 200,
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: '#fff',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  evenRow: {
    backgroundColor: '#f8f9fa',
  },
  oddRow: {
    backgroundColor: '#fff',
  },
  cell: {
    width: 200,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cellText: {
    fontSize: 12,
    color: '#333',
  },
  linkText: {
    color: '#1e88e5',
    textDecorationLine: 'underline',
    fontSize: 12,
  },
});

export default AdminDownload;