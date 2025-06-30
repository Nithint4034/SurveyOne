// AdminDownload.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import surveyQuestions from '../assets/surveyQuestions';

// Simulated response data (partial data in some rows)
const csvData = [
  {
    '1': 'SURV-001',
    '6': 'Nithin',
    '2': '2025-06-28 18:45',
    '56': 'https://example.com/photo.jpg',
  },
  {
    '1': 'SURV-002',
    '6': 'Bhavana',
    '2': '2025-06-28 19:30',
    '56': 'https://example.com/photo2.jpg',
  },
];

// Build header map: "1" → "Survey ID", "2" → "Date & Time", etc.
const headerMap = {};
surveyQuestions.forEach((text, index) => {
  headerMap[(index + 1).toString()] = text;
});

// All keys from 1 to 56
const allKeys = Array.from({ length: surveyQuestions.length }, (_, i) => (i + 1).toString());

// Convert data to CSV string
const convertToCSV = () => {
  const headers = allKeys.map(key => headerMap[key] || key).join(',');

  const rows = csvData.map(item =>
    allKeys.map(key => {
      const value = item[key] ?? ''; // Fill missing keys with empty string
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    }).join(',')
  );

  return [headers, ...rows].join('\n');
};

const AdminDownload = () => {
  const handleDownloadCSV = async () => {
    const csvContent = convertToCSV();
    const fileName = 'survey_data.csv';
    const fileUri = FileSystem.documentDirectory + fileName;

    try {
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
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
      <View style={styles.csvHeader}>
        <Text style={styles.sectionTitle}>Survey Data Export</Text>
        <TouchableOpacity onPress={handleDownloadCSV} style={styles.downloadButton}>
          <FontAwesome5 name="file-download" size={18} color="#2196F3" />
          <Text style={styles.downloadButtonText}>Download CSV</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal contentContainerStyle={styles.scrollContent}>
        <View style={styles.tableContainer}>
          <View style={styles.csvContainer}>
            {/* Header row */}
            <View style={styles.csvRow}>
              {allKeys.map((key, index) => (
                <Text key={index} style={[styles.csvCell, styles.csvHeaderCell]}>
                  {headerMap[key] || key}
                </Text>
              ))}
            </View>

            {/* Data rows */}
            {csvData.map((item, rowIndex) => (
              <View
                key={rowIndex}
                style={[styles.csvRow, rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow]}
              >
                {allKeys.map((key, cellIndex) => {
                  const value = item[key] ?? '';
                  if (key === '56' && value) {
                    return (
                      <TouchableOpacity
                        key={cellIndex}
                        style={styles.csvCell}
                        onPress={() => Linking.openURL(value)}
                      >
                        <Text style={styles.linkText}>View Image</Text>
                      </TouchableOpacity>
                    );
                  }
                  return (
                    <Text key={cellIndex} style={styles.csvCell}>
                      {value}
                    </Text>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  tableContainer: {
    minWidth: 1000,
  },
  csvHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 5,
  },
  downloadButtonText: {
    marginLeft: 5,
    color: '#2196F3',
    fontWeight: '500',
  },
  csvContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    overflow: 'hidden',
  },
  csvRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    minWidth: '100%',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  oddRow: {
    backgroundColor: 'white',
  },
  csvCell: {
    width: 180,
    fontSize: 12,
    color: '#333',
    paddingHorizontal: 5,
  },
  csvHeaderCell: {
    fontWeight: 'bold',
    color: '#555',
  },
  linkText: {
    color: '#1e88e5',
    textDecorationLine: 'underline',
    fontSize: 12,
  },
});

export default AdminDownload;
