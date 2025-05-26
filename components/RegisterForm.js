import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';
import { EventEmitter } from 'events'; // Import EventEmitter

const eventEmitter = new EventEmitter(); // Create an EventEmitter instance

export default function RegisterForm({ event, userName }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleRegister = async () => {
    if (!email.trim() || !quantity.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const registeredEvent = {
      id: Date.now().toString(),
      eventName: event.name,
      userName: userName || 'Anonymous',
      email,
      quantity,
    };

    try {
      // Save registered event
      const storedEvents = await AsyncStorage.getItem('registered_events');
      const events = storedEvents ? JSON.parse(storedEvents) : [];
      const updatedEvents = [...events, registeredEvent];
      await AsyncStorage.setItem('registered_events', JSON.stringify(updatedEvents));

      // Save notification
      const storedNotifications = await AsyncStorage.getItem('notifications');
      const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
      const newNotification = `User ${userName || 'Anonymous'} registered for ${event.name}`;
      const updatedNotifications = [...notifications, newNotification];
      await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));

      // Emit event for real-time updates
      eventEmitter.emit('eventRegistered', updatedEvents);
      eventEmitter.emit('notificationAdded', updatedNotifications);

      Alert.alert('Success', 'You have successfully registered for the event!');
      setEmail('');
      setQuantity('');
    } catch (error) {
      console.error('Error registering for event:', error);
      Alert.alert('Error', 'Failed to register for the event.');
    }
  };

  return (
    <View style={styles.registerForm}>
      <Text style={[styles.registerHeader, { color: isDarkMode ? '#fff' : '#333' }]}>
        Register for Event
      </Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#333' },
        ]}
        placeholder="Enter your email"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[
          styles.input,
          { backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#333' },
        ]}
        placeholder="Enter quantity"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  registerForm: {
    marginBottom: 20,
  },
  registerHeader: {
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

export { eventEmitter }; // Export the EventEmitter instance