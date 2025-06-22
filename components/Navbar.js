import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import RegisteredEventsScreen from '../screens/RegisteredEventsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { ThemeContext } from '../context/ThemeContext'; // Import ThemeContext

const Tab = createBottomTabNavigator();

export default function Navbar() {
  const { isDarkMode } = useContext(ThemeContext); // Access Dark/Light Mode

  const themeStyles = isDarkMode
    ? {
        tabBarBackgroundColor: '#121212',
        tabBarIconColor: 'white',
      }
    : {
        tabBarBackgroundColor: '#f5f5f5',
        tabBarIconColor: 'gray',
      };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: themeStyles.tabBarBackgroundColor,
          borderTopWidth: 0,
          elevation: 5,
          height: 60,
        },
      }}
    >
      {/* Home Tab */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              size={24}
              color={focused ? 'red' : themeStyles.tabBarIconColor}
            />
          ),
        }}
      />

      {/* Registered Events Tab */}
      <Tab.Screen
        name="RegisteredEvents"
        component={RegisteredEventsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="list"
              size={24}
              color={focused ? 'red' : themeStyles.tabBarIconColor}
            />
          ),
        }}
      />

      {/* Notifications Tab */}
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="notifications"
              size={24}
              color={focused ? 'red' : themeStyles.tabBarIconColor}
            />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person"
              size={24}
              color={focused ? 'red' : themeStyles.tabBarIconColor}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}