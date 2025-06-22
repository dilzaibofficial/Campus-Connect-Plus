import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  Platform,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import eventEmitter from '../utils/EventEmitter'; // Import EventEmitter

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State for swipe-to-refresh
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const themeStyles = isDarkMode
    ? {
        backgroundColor: '#121212',
        color: '#ffffff',
      }
    : {
        backgroundColor: '#f5f5f5',
        color: '#333',
      };

  const loadNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem('notifications');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications).reverse()); // Reverse to show the latest notification first
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setRefreshing(false); // Stop refreshing after data is loaded
    }
  };

  useEffect(() => {
    loadNotifications();

    // Listen for real-time updates
    const reminderListener = eventEmitter.addListener('reminderSet', (updatedNotifications) => {
      setNotifications(updatedNotifications.reverse()); // Reverse to show the latest notification first
    });

    return () => {
      reminderListener.remove(); // Clean up listener
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true); // Start refreshing
    loadNotifications(); // Reload notifications
  };

  const renderNotification = ({ item }) => (
    <View style={[styles.notification, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
      <Text style={[styles.notificationText, { color: themeStyles.color }]}>{item}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {/* Navbar */}
      <View style={[styles.navbar, { backgroundColor: themeStyles.backgroundColor }]}>
        <Text style={[styles.header, { color: themeStyles.color }]}>Notifications</Text>
        <Ionicons
          name={isDarkMode ? 'sunny' : 'moon'}
          size={24}
          color={isDarkMode ? '#ffffff' : '#007bff'}
          onPress={toggleTheme}
        />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderNotification}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.noNotifications, { color: themeStyles.color }]}>
              No notifications yet.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Swipe-to-refresh control
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight || 25, // Adjust for iOS and Android
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  header: {
    fontSize: 30, // Larger font for a bold statement
    fontWeight: '800', // Extra bold for emphasis
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20, // Add padding for better spacing
  },
  notification: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // Shadow for Android
    borderLeftWidth: 5, // Highlight the notification
    borderLeftColor: '#007bff', // Blue highlight for notifications
  },
  notificationText: {
    fontSize: 16,
    color: '#555',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  noNotifications: {
    fontSize: 18,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#aaa',
  },
});