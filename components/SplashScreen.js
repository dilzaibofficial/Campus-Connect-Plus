import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen'; // Importing expo-splash-screen

export default function CustomSplashScreen({ onFinish }) {
  useEffect(() => {
    const prepare = async () => {
      try {
        // Keep the splash screen visible while we load resources
        await SplashScreen.preventAutoHideAsync();
        // Simulate a loading delay (e.g., fetching resources)
        setTimeout(() => {
          SplashScreen.hideAsync();
          onFinish(); // Notify the parent component that the splash screen is done
        }, 3000); // 3-second delay
      } catch (e) {
        console.warn(e);
      }
    };

    prepare();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FontAwesome name="connectdevelop" size={80} color="#007bff" />
      <Text style={styles.title}>CampusConnect+</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212', // Dark background for a modern look
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'sans-serif', // Use a clean font
  },
});