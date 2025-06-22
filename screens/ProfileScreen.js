import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Alert,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState(null); // Placeholder for profile picture
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

  // Load data from AsyncStorage on component mount
  const loadProfileData = async () => {
    try {
      const storedName = await AsyncStorage.getItem('profile_name');
      const storedNumber = await AsyncStorage.getItem('profile_number');
      const storedEmail = await AsyncStorage.getItem('profile_email');
      const storedPic = await AsyncStorage.getItem('profile_pic');

      if (storedName) setName(storedName);
      if (storedNumber) setNumber(storedNumber);
      if (storedEmail) setEmail(storedEmail);
      if (storedPic) setProfilePic(storedPic);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setRefreshing(false); // Stop refreshing after data is loaded
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  // Save data to AsyncStorage
  const saveProfileData = async () => {
    try {
      await AsyncStorage.setItem('profile_name', name);
      await AsyncStorage.setItem('profile_number', number);
      await AsyncStorage.setItem('profile_email', email);
      if (profilePic) {
        await AsyncStorage.setItem('profile_pic', profilePic);
      }
      Keyboard.dismiss(); // Dismiss the keyboard
      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile data:', error);
      Alert.alert('Error', 'Failed to save profile data.');
    }
  };

  // Change Profile Picture
  const changeProfilePicture = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'You need to allow access to your media library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfilePic(result.assets[0].uri); // Set the selected image URI
        await AsyncStorage.setItem('profile_pic', result.assets[0].uri); // Save to AsyncStorage
        Alert.alert('Success', 'Profile picture updated!');
      }
    } catch (error) {
      console.error('Error changing profile picture:', error);
      Alert.alert('Error', 'Failed to change profile picture.');
    }
  };

  const onRefresh = () => {
    setRefreshing(true); // Start refreshing
    loadProfileData(); // Reload profile data
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Swipe-to-refresh control
        }
      >
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        {/* Navbar */}
        <View style={[styles.navbar, { backgroundColor: themeStyles.backgroundColor }]}>
          <Text style={[styles.header, { color: themeStyles.color }]}>Profile</Text>
          <Ionicons
            name={isDarkMode ? 'sunny' : 'moon'}
            size={24}
            color={isDarkMode ? '#ffffff' : '#007bff'}
            onPress={toggleTheme}
          />
        </View>

        {/* Profile Picture */}
        <View style={styles.profilePicContainer}>
          <Image
            source={
              profilePic
                ? { uri: profilePic }
                : require('../assets/default-profile.png') // Default profile picture
            }
            style={styles.profilePic}
          />
          <Button title="Change Picture" onPress={changeProfilePicture} />
        </View>

        {/* Name Input */}
        <TextInput
          style={[
            styles.input,
            { backgroundColor: isDarkMode ? '#333' : '#fff', color: themeStyles.color },
          ]}
          placeholder="Enter your name"
          placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
          value={name}
          onChangeText={setName}
        />

        {/* Number Input */}
        <TextInput
          style={[
            styles.input,
            { backgroundColor: isDarkMode ? '#333' : '#fff', color: themeStyles.color },
          ]}
          placeholder="Enter your number"
          placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
          value={number}
          onChangeText={setNumber}
          keyboardType="phone-pad"
        />

        {/* Email Input */}
        <TextInput
          style={[
            styles.input,
            { backgroundColor: isDarkMode ? '#333' : '#fff', color: themeStyles.color },
          ]}
          placeholder="Enter your email"
          placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Save Button */}
        <Button title="Save" onPress={saveProfileData} />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight || 25, // Adjust for iOS and Android
    paddingHorizontal: 20,
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
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15, // Smooth rounded corners
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
});