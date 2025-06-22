import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Reactions({ likes, dislikes, setLikes, setDislikes, eventId }) {
  const { isDarkMode } = useContext(ThemeContext);

  const saveReactions = async (updatedLikes, updatedDislikes) => {
    try {
      await AsyncStorage.setItem(`likes_${eventId}`, updatedLikes.toString());
      await AsyncStorage.setItem(`dislikes_${eventId}`, updatedDislikes.toString());
    } catch (error) {
      console.error('Error saving reactions:', error);
    }
  };

  const handleLike = () => {
    const updatedLikes = likes + 1;
    setLikes(updatedLikes);
    saveReactions(updatedLikes, dislikes); // Save updated likes and current dislikes
  };

  const handleDislike = () => {
    const updatedDislikes = dislikes + 1;
    setDislikes(updatedDislikes);
    saveReactions(likes, updatedDislikes); // Save current likes and updated dislikes
  };

  return (
    <View style={styles.reactionsContainer}>
      <TouchableOpacity onPress={handleLike} style={styles.reactionButton}>
        <Ionicons name="thumbs-up" size={24} color="green" />
        <Text style={[styles.reactionText, { color: isDarkMode ? '#fff' : '#333' }]}>{likes}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDislike} style={styles.reactionButton}>
        <Ionicons name="thumbs-down" size={24} color="red" />
        <Text style={[styles.reactionText, { color: isDarkMode ? '#fff' : '#333' }]}>{dislikes}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  reactionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  reactionButton: {
    alignItems: 'center',
  },
  reactionText: {
    fontSize: 16,
    marginTop: 5,
  },
});