import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';

import Feedback from '../components/Feedback';
import RegisterForm from '../components/RegisterForm';
import ActivityFeed from '../components/ActivityFeed';
import Reactions from '../components/Reactions';
import SetReminder from '../components/SetReminder';

export default function EventDetailsScreen({ route }) {
  const { event } = route.params;
  const navigation = useNavigation();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userName, setUserName] = useState('');
  const [refreshing, setRefreshing] = useState(false); // State for swipe-to-refresh

  const themeStyles = isDarkMode
    ? { backgroundColor: '#121212', color: '#ffffff' }
    : { backgroundColor: '#f5f5f5', color: '#333' };

  const loadData = async () => {
    try {
      const storedName = await AsyncStorage.getItem('profile_name');
      if (storedName) setUserName(storedName);

      const storedLikes = await AsyncStorage.getItem(`likes_${event.id}`);
      if (storedLikes) setLikes(parseInt(storedLikes));

      const storedDislikes = await AsyncStorage.getItem(`dislikes_${event.id}`);
      if (storedDislikes) setDislikes(parseInt(storedDislikes));

      const storedComments = await AsyncStorage.getItem(`comments_${event.id}`);
      if (storedComments) setComments(JSON.parse(storedComments));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setRefreshing(false); // Stop refreshing after data is loaded
    }
  };

  useEffect(() => {
    loadData();
  }, [event.id]);

  const onRefresh = () => {
    setRefreshing(true); // Start refreshing
    loadData(); // Reload event details
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {/* Navbar */}
      <View style={[styles.navbar, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={isDarkMode ? '#ffffff' : '#007bff'}
          onPress={() => navigation.goBack()}
        />
        <Text style={[styles.navbarTitle, { color: themeStyles.color }]}>Event Details</Text>
        <Ionicons
          name={isDarkMode ? 'sunny' : 'moon'}
          size={24}
          color={isDarkMode ? '#ffffff' : '#007bff'}
          onPress={toggleTheme}
        />
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Swipe-to-refresh control
        }
      >
        {/* Event Details */}
        <View style={[styles.section, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
          <Text style={[styles.title, { color: themeStyles.color }]}>{event.name}</Text>
          <Text style={[styles.details, { color: themeStyles.color }]}>Time: {event.time}</Text>
          <Text style={[styles.details, { color: themeStyles.color }]}>Venue: {event.venue}</Text>
          <Text style={[styles.details, { color: themeStyles.color }]}>Category: {event.category}</Text>
          <Text style={[styles.description, { color: themeStyles.color }]}>{event.description}</Text>
          <Text style={[styles.details, { color: themeStyles.color }]}>Date: {event.date}</Text>
        </View>

        {/* QR Code */}
        <View style={[styles.qrContainer, { backgroundColor: isDarkMode ? '#1e1e1e' : '#f5f5f5' }]}>
          <Text style={[styles.qrText, { color: themeStyles.color }]}>Scan this QR Code:</Text>
          <QRCode value={JSON.stringify(event)} size={200} />
        </View>

        {/* Reactions */}
        <View style={[styles.section, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
          <Reactions
            likes={likes}
            dislikes={dislikes}
            setLikes={setLikes}
            setDislikes={setDislikes}
            eventId={event.id}
          />
        </View>

        {/* Register Form */}
        <View style={[styles.section, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
          <RegisterForm event={event} userName={userName} />
        </View>

        {/* Feedback */}
        <View style={[styles.section, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
          <Feedback userName={userName} eventId={event.id} />
        </View>

        {/* Activity Feed */}
        <View style={[styles.section, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
          <ActivityFeed comments={comments} userName={userName} eventId={event.id} />
        </View>
      </ScrollView>

      {/* Set Reminder Button */}
      <View
        style={[
          styles.reminderContainer,
          { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' },
        ]}
      >
        <SetReminder event={event} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight || 25,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  navbarTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 15,
  },
  details: {
    fontSize: 18,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  qrText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
  },
  reminderContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: 20,
    right: 20,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
});