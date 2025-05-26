import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';

export default function Feedback({ userName, eventId }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [feedback, setFeedback] = useState('');

  const saveFeedback = async () => {
    if (!feedback.trim()) {
      Alert.alert('Error', 'Feedback cannot be empty.');
      return;
    }

    try {
      // Save feedback
      const storedFeedback = await AsyncStorage.getItem(`feedback_${eventId}`);
      const feedbackList = storedFeedback ? JSON.parse(storedFeedback) : [];
      const updatedFeedback = [...feedbackList, { user: userName || 'Anonymous', feedback }];
      await AsyncStorage.setItem(`feedback_${eventId}`, JSON.stringify(updatedFeedback));

      // Save notification
      const storedNotifications = await AsyncStorage.getItem('notifications');
      const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
      const newNotification = `Feedback submitted by ${userName || 'Anonymous'}`;
      const updatedNotifications = [...notifications, newNotification];
      await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));

      Alert.alert('Success', 'Thank you for your feedback!');
      setFeedback('');
    } catch (error) {
      console.error('Error saving feedback:', error);
      Alert.alert('Error', 'Failed to save feedback.');
    }
  };

  return (
    <View style={styles.feedbackForm}>
      <Text style={[styles.feedbackHeader, { color: isDarkMode ? '#fff' : '#333' }]}>
        Your Feedback
      </Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#333' },
        ]}
        placeholder="Enter your feedback"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        value={feedback}
        onChangeText={setFeedback}
      />
      <TouchableOpacity style={styles.button} onPress={saveFeedback}>
        <Text style={styles.buttonText}>Submit Feedback</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  feedbackForm: {
    marginBottom: 20,
  },
  feedbackHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});