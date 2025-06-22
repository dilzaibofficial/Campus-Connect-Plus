import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventCard from '../components/EventCard';
import AddEventForm from '../components/AddEventForm'; // Import AddEventForm
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/HomeScreenStyles';

export default function HomeScreen() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State for swipe-to-refresh
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddEventModalVisible, setIsAddEventModalVisible] = useState(false); // State for Add Event Modal
  const navigation = useNavigation();
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

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://6824c1e10f0188d7e72aacc4.mockapi.io/api/eventsdata');
      const sortedEvents = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));

      const updatedEvents = await Promise.all(
        sortedEvents.map(async (event) => {
          const likes = await AsyncStorage.getItem(`likes_${event.id}`);
          const registered = await AsyncStorage.getItem('registered_events');
          const registeredCount = registered
            ? JSON.parse(registered).filter((reg) => reg.eventName === event.name).length
            : 0;

          return {
            ...event,
            likes: parseInt(likes) || 0,
            registered: registeredCount,
          };
        })
      );

      setEvents(updatedEvents);
      setFilteredEvents(updatedEvents);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch events. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop refreshing after data is fetched
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((event) => event.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [searchQuery, selectedCategory, events]);

  const handleRecommendEvents = () => {
    const recommended = events
      .filter((event) => event.likes > 10 || event.registered > 5)
      .slice(0, 5);
    setRecommendedEvents(recommended);
    setIsModalVisible(true);
  };

  const handleEventAdded = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setFilteredEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const onRefresh = () => {
    setRefreshing(true); // Start refreshing
    fetchEvents(); // Fetch updated data
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.navbar}>
        <Text style={[styles.header, { color: themeStyles.color }]}>Home</Text>
        <View style={styles.navIcons}>
          <Ionicons
            name="add"
            size={24}
            color={isDarkMode ? '#ffffff' : '#007bff'}
            onPress={() => setIsAddEventModalVisible(true)}
            style={{ marginRight: 15 }} // Add spacing between icons
          />
          <Ionicons
            name={isDarkMode ? 'sunny' : 'moon'}
            size={24}
            color={isDarkMode ? '#ffffff' : '#007bff'}
            onPress={toggleTheme}
          />
        </View>
      </View>

      <TextInput
        style={[
          styles.searchBar,
          { backgroundColor: isDarkMode ? '#333' : '#fff', color: themeStyles.color },
        ]}
        placeholder="Search by name or venue"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.dropdownContainer}>
        <Text style={[styles.dropdownLabel, { color: themeStyles.color }]}>Category:</Text>
        <TouchableOpacity
          style={[
            styles.dropdown,
            { backgroundColor: isDarkMode ? '#333' : '#fff', borderColor: isDarkMode ? '#555' : '#ccc' },
          ]}
          onPress={() => {
            const categories = ['All', 'Workshop', 'Sports', 'Exhibition', 'Hackathon', 'Concert'];
            Alert.alert(
              'Select Category',
              '',
              categories.map((category) => ({
                text: category,
                onPress: () => setSelectedCategory(category),
              }))
            );
          }}
        >
          <Text style={[styles.dropdownText, { color: themeStyles.color }]}>{selectedCategory}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.recommendButton} onPress={handleRecommendEvents}>
        <Text style={styles.recommendButtonText}>Recommend Events</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('EventDetails', { event: item })}>
            <EventCard event={item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: themeStyles.color }]}>No events found.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Swipe-to-refresh control
        }
      />

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: themeStyles.backgroundColor }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: themeStyles.color }]}>Recommended Events</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color={themeStyles.color} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={recommendedEvents}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('EventDetails', { event: item })}>
                  <EventCard event={item} />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={[styles.emptyText, { color: themeStyles.color }]}>
                  No recommended events found.
                </Text>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Add Event Modal */}
      <Modal visible={isAddEventModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: themeStyles.backgroundColor }]}>
            <AddEventForm
              onClose={() => setIsAddEventModalVisible(false)}
              onEventAdded={handleEventAdded}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}