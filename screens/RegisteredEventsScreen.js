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
import { eventEmitter } from '../components/RegisterForm'; // Import EventEmitter

export default function RegisteredEventsScreen() {
  const [registeredEvents, setRegisteredEvents] = useState([]);
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

  const loadRegisteredEvents = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem('registered_events');
      if (storedEvents) {
        setRegisteredEvents(JSON.parse(storedEvents));
      }
    } catch (error) {
      console.error('Error loading registered events:', error);
    } finally {
      setRefreshing(false); // Stop refreshing after data is loaded
    }
  };

  useEffect(() => {
    loadRegisteredEvents();

    // Listen for real-time updates
    const eventListener = eventEmitter.addListener('eventRegistered', (updatedEvents) => {
      setRegisteredEvents(updatedEvents);
    });

    return () => {
      eventListener.remove(); // Clean up listener
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true); // Start refreshing
    loadRegisteredEvents(); // Reload registered events
  };

  const renderEvent = ({ item }) => (
    <View style={[styles.event, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
      <Text style={[styles.eventName, { color: themeStyles.color }]}>{item.eventName}</Text>
      <Text style={[styles.eventDetails, { color: themeStyles.color }]}>User: {item.userName}</Text>
      <Text style={[styles.eventDetails, { color: themeStyles.color }]}>Email: {item.email}</Text>
      <Text style={[styles.eventDetails, { color: themeStyles.color }]}>Quantity: {item.quantity}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {/* Navbar */}
      <View style={[styles.navbar, { backgroundColor: themeStyles.backgroundColor }]}>
        <Text style={[styles.header, { color: themeStyles.color }]}>Registered Events</Text>
        <Ionicons
          name={isDarkMode ? 'sunny' : 'moon'}
          size={24}
          color={isDarkMode ? '#ffffff' : '#007bff'}
          onPress={toggleTheme}
        />
      </View>

      <FlatList
        data={registeredEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.noEvents, { color: themeStyles.color }]}>
              No registered events yet.
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
  event: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // Shadow for Android
  },
  eventName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  eventDetails: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  noEvents: {
    fontSize: 18,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#aaa',
  },
});