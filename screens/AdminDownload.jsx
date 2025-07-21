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
  q12: '12. Non-Irrigated Land (in acres. Gunta)',
  q13: '13. Source of Irrigation (tick applicable)',
  q14: '14. What is Borewell water Depth (feet)',
  q15: '15. Have you adopted micro irrigation? (Tick the appropriate option)',
  q15_1: 'If Drip',
  q15_2: 'If Sprinkler',
  q15_3: 'If Both',
  q16: '16. Have you taken Government subsidy for setting up Micro Irrigation?',
  q17: '17. Which year you submitted your application?',
  q18: '18. Month & Year of Installation',
  q19: '19. What among the below documents did you submit during MI subsidy application time? (Tick applicable)',
  q20: '20. Has water saving from MI helped you to expand your irrigated land? If yes, how much in acres',

  // Pre MI Crop1
  q21_1: '21 Pre MI Crop 1',
  q21_7: 'Labour Cost',
  q64: 'Spacing Eg:-(1.2*0.6)',
  q21_17: 'Fertilizer Cost',
  q21_20: 'Pesticide & Weedicides Cost',
  q21_9: 'Land Preparation & Harvesting Cost',
  q21_26: 'Yield',
  q21_5: 'Income',
  q21_3: 'Hours for irrigating one acre of crop',
  q21_22: 'Pump Capacity',

  // Pre-MI Crop 2
  q21_2: '21 Pre MI Crop 2',
  q21_8: 'Labour Cost',
  q65: 'Spacing Eg:-(1.2*0.6)',
  q21_18: 'Fertilizer Cost',
  q21_21: 'Pesticide & Weedicides Cost',
  q21_10: 'Land Preparation & Harvesting Cost',
  q21_27: 'Yield',
  q21_6: 'Income',
  q21_4: 'Hours for irrigating one acre of crop',
  q21_23: 'Pump Capacity',

  // MI Crops
  q21_13: 'Crop1 (Primary crop taken under MI) Deactivate Drop down and give option to write',
  q21_11: 'Area1 (Acres, Gunta)',
  q21_24: 'Spacing Eg:-(1.2*0.6)',
  q21_14: 'Crop2 Deactivate Drop down and give option to write',
  q21_12: 'Area2 (Acres, Gunta)',
  q21_25: 'Spacing Eg:-(1.2*0.6)',
  q21_16: 'Other Crop',
  q21_15: 'Other Crop Area(Acres, Gunta)',
  q21_19: 'Spacing Eg:-(1.2*0.6)',

  q22: '22. Is there any reduction in labour cost per acre after using the MI system?',
  q22_1: 'Crop 1 Before MI ₹',
  q22_2: 'Crop 1 After MI ₹',
  q22_3: 'Crop 2 Before MI ₹',
  q22_4: 'Crop 2 After MI ₹',

  q23: '23. Has the Fertilizer cost per acre reduced after MI system use?',
  q23_1: 'Crop 1 Before MI ₹',
  q23_2: 'Crop 1 After MI ₹',
  q23_3: 'Crop 2 Before MI ₹',
  q23_4: 'Crop 2 After MI ₹',

  q24: '24. Has the plant pesticide & weedicide cost per acre reduced after MI system use?',
  q24_1: 'Crop 1 Before MI ₹',
  q24_2: 'Crop 1 After MI ₹',
  q24_3: 'Crop 2 Before MI ₹',
  q24_4: 'Crop 2 After MI ₹',

  q25: '25. Has the crop yield per acre increased after adopting the MI system?',
  q25_1: 'Crop 1 Before MI (Q)',
  q25_2: 'Crop 1 After MI (Q)',
  q25_3: 'Crop 2 Before MI (Q)',
  q25_4: 'Crop 2 After MI (Q)',

  q26: '26. Has your income per acre increased after adopting the MI system?',
  q26_1: 'Crop 1 Before MI ₹',
  q26_2: 'Crop 1 After MI ₹',
  q26_3: 'Crop 2 Before MI ₹',
  q26_4: 'Crop 2 After MI ₹',

  q27: '27. What was the reason for MI adpation? (tick applicable)',
  q27_1: '27.1.',

  q28: '28.  How did you come to know about the PMKSY-PDMC Scheme?',
  q29: '29. Who Installed the MI System?',
  q30: '30. Name of the agency / vendor',

  q31: '31. What are the MI components received? (tick applicable)',
  q31_1: '31.1.',

  q32: '32. Is the MI System Still in Use? If No, share the reason',
  q32_1: 'If No, mention the reason',

  q33: '33. Did the MI agency or Government Department assist with the subsidy documentation? How was their response',
  q34: '34. Have you received any MI subsidy approval or payment communications? If yes, how did you received',
  q35: '35. Did the MI or Dept take your signature after successful installation?',

  q36: '36. What was the mode of MI subsidy disbursement?',
  q36_1: '36.1.',

  q37: '37. Did you get any training or booklet on MI operation and maintenance? If yes, please give details',
  q38: '38. Have you received any communication on MI System Warranty?',
  q39: '39. Has the MI company provided any service after installation?',
  q40: '40. Are you aware of the MI company’s service person, center, or helpline number? Please share details.',
  q41: '41. When do you do the maintenance?',
  q42: '42. Did you face any problems while using the MI system? If yes, please explain.',
  q43: '43. Overall Satisfaction Level with MI System:',
  q44: '44. Have you observed any reduction in water usage after the MI system? If yes, approx percentage reduction (%)',
  q45: '45. MI Financial Details – Total cost of MI system installed (₹ per acre)',
  q46: '46. How much amount you paid to Department or Agency for MI instalation (₹ per acre)',
  q47: '47. Have you taken any loan from a financial institution for MI? If yes, from where and how much (₹)',
  q48: '48. Has the adoption of MI influenced your standard of living?',

  q49: '49. What type of assets have you gained as a result?',
  q49_1: '49.1.',

  q50: '50. Has MI adoption in your village impacted labour?',
  q51: '51. Did MI Adoption Create New Employment in Your Area?',
  q66: 'If Yes, Details about new employment',
  q52: '52. Has MI adoption helped women?',
  q53: '53. Has any member of your family been trained on MI Maintenance by company?',
  q54: '54. Have you observed any change in groundwater levels after MI adoption?',
  q55: '55. Would you recommend MI to other farmers under the current scheme?',
  q56: '56. Any issues from Dept or MI agency during approval? If yes, list them',
  q57: '57. Have you attended any MI promotion activity organized by Government Departments? If yes, please provide the details.',
  q58: '58. Have you got your Soil Tested & have the Soil Health card?',

  q59: '59.Are you adopting the Nutrient Management Recommentations given in Soil Health Card?',
  q59_1: 'If No - Mention Reason',

  q60: '60. Any Suggestions for Improving the MI Scheme?',
  q61: '61. Any Additional comments?',
  q62: '62. Latitude & Longitude',
  q63: '63. Farmer Photosy',

  // q67: '67.',
  // q68: '68.',
  // q69: '69.',
  // q70: '70.',
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

    // Get all keys in the exact order from apiToHeaderMap
    const allKeys = Object.keys(apiToHeaderMap);

    // Create headers row using the mapped headers
    const headers = allKeys.map(key => apiToHeaderMap[key]);

    // Process each row
    const csvRows = data.map(row => {
      return allKeys.map(key => {
        let value = row[key] ?? '';

        // Format dates
        if (key === 'created_at' && value) {
          value = new Date(value).toLocaleString();
        }

        // Handle photo URL - fix the path
        if (key === 'q63' && value) {
          value = value.replace('/media/uploads/uploads/', '/media/uploads/');
          value = `https://tomhudson.pythonanywhere.com${value}`;
        }

        // Convert to string if not already
        if (value !== null && value !== undefined) {
          value = String(value);
        } else {
          value = '';
        }

        // Escape quotes by doubling them
        value = value.replace(/"/g, '""');

        // Always wrap in quotes to handle commas, newlines, etc.
        return `"${value}"`;
      }).join(',');
    });

    return [headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','), ...csvRows].join('\n');
  };

  const handleDownloadCSV = async () => {
    if (csvData.length === 0) {
      Alert.alert('No Data', 'There is no data to export.');
      return;
    }

    const csvContent = convertToCSV(csvData);
    // console.log('Generated CSV:', csvContent); // For debugging

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
                      if (key === 'q63' && value) {
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