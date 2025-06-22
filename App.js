import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Navbar from './components/Navbar'; // Import Navbar
import EventDetailsScreen from './screens/EventDetailsScreen';
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider
import CustomSplashScreen from './components/SplashScreen'; // Import renamed SplashScreen

const Stack = createStackNavigator();

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  if (isSplashVisible) {
    return <CustomSplashScreen onFinish={() => setIsSplashVisible(false)} />;
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Navbar with Bottom Tabs */}
          <Stack.Screen name="Main" component={Navbar} />
          {/* Event Details Screen */}
          <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}