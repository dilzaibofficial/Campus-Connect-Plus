import React from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import eventEmitter from '../utils/EventEmitter'; // Import EventEmitter

export default function SetReminder({ event }) {
  const scheduleReminder = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Notification permissions are required.');
      return;
    }

    const eventDate = new Date(event.date);
    const today = new Date();
    const daysRemaining = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 0) {
      Alert.alert('Event Passed', 'This event has already passed.');
      return;
    }

    for (let i = 0; i < daysRemaining; i++) {
      const triggerDate = new Date(today);
      triggerDate.setDate(today.getDate() + i);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Reminder: ${event.name}`,
          body: `Don't forget to attend ${event.name} on ${event.date}.`,
        },
        trigger: { date: triggerDate },
      });
    }

    // Save notification to AsyncStorage
    const storedNotifications = await AsyncStorage.getItem('notifications');
    const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
    const newNotification = `Reminder set for ${event.name} on ${event.date}`;
    const updatedNotifications = [...notifications, newNotification];
    await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));

    // Emit event for real-time updates
    eventEmitter.emit('reminderSet', updatedNotifications);

    Alert.alert('Reminder Scheduled', `You will be reminded daily until the event.`);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={scheduleReminder}>
      <Text style={styles.buttonText}>Set Reminder</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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