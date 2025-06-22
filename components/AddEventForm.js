import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext'; // Import ThemeContext

export default function AddEventForm({ onClose, onEventAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    time: '',
    venue: '',
    category: '',
    description: '',
    date: '',
  });

  const { isDarkMode } = useContext(ThemeContext); // Access dark mode state

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        'https://6824c1e10f0188d7e72aacc4.mockapi.io/api/eventsdata',
        formData
      );
      Alert.alert('Success', 'Event added successfully!');
      onEventAdded(response.data); // Notify parent component about the new event
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error adding event:', error);
      Alert.alert('Error', 'Failed to add event. Please try again.');
    }
  };

  const themeStyles = isDarkMode
    ? {
        containerBackground: '#333',
        textColor: '#fff',
        inputBackground: '#444',
        inputBorderColor: '#555',
        buttonBackground: '#007bff',
        cancelButtonBackground: '#555',
        cancelButtonTextColor: '#fff',
      }
    : {
        containerBackground: '#fff',
        textColor: '#333',
        inputBackground: '#fff',
        inputBorderColor: '#ccc',
        buttonBackground: '#007bff',
        cancelButtonBackground: '#ccc',
        cancelButtonTextColor: '#333',
      };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.containerBackground }]}>
      <Text style={[styles.title, { color: themeStyles.textColor }]}>Add New Event</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: themeStyles.inputBackground,
            borderColor: themeStyles.inputBorderColor,
            color: themeStyles.textColor,
          },
        ]}
        placeholder="Event Name"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        value={formData.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: themeStyles.inputBackground,
            borderColor: themeStyles.inputBorderColor,
            color: themeStyles.textColor,
          },
        ]}
        placeholder="Time"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        value={formData.time}
        onChangeText={(text) => handleInputChange('time', text)}
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: themeStyles.inputBackground,
            borderColor: themeStyles.inputBorderColor,
            color: themeStyles.textColor,
          },
        ]}
        placeholder="Venue"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        value={formData.venue}
        onChangeText={(text) => handleInputChange('venue', text)}
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: themeStyles.inputBackground,
            borderColor: themeStyles.inputBorderColor,
            color: themeStyles.textColor,
          },
        ]}
        placeholder="Category"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        value={formData.category}
        onChangeText={(text) => handleInputChange('category', text)}
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: themeStyles.inputBackground,
            borderColor: themeStyles.inputBorderColor,
            color: themeStyles.textColor,
          },
        ]}
        placeholder="Description"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        value={formData.description}
        onChangeText={(text) => handleInputChange('description', text)}
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: themeStyles.inputBackground,
            borderColor: themeStyles.inputBorderColor,
            color: themeStyles.textColor,
          },
        ]}
        placeholder="Date (YYYY-MM-DD)"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        value={formData.date}
        onChangeText={(text) => handleInputChange('date', text)}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: themeStyles.buttonBackground }]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Add Event</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.cancelButton, { backgroundColor: themeStyles.cancelButtonBackground }]}
        onPress={onClose}
      >
        <Text style={[styles.cancelButtonText, { color: themeStyles.cancelButtonTextColor }]}>
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontWeight: 'bold',
  },
});