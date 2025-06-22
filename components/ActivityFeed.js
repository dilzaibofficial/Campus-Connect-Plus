import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ActivityFeed({ userName, eventId }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const themeStyles = isDarkMode
    ? { backgroundColor: '#121212', color: '#ffffff' }
    : { backgroundColor: '#f5f5f5', color: '#333' };

  // Fetch comments from AsyncStorage when the component mounts
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const storedComments = await AsyncStorage.getItem(`comments_${eventId}`);
        if (storedComments) {
          setComments(JSON.parse(storedComments));
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [eventId]);

  const addComment = async () => {
    if (newComment.trim() === '') {
      alert('Comment cannot be empty.');
      return;
    }

    const comment = {
      id: Date.now().toString(),
      text: newComment,
      user: userName || 'Anonymous',
    };

    const updatedComments = [...comments, comment];
    try {
      await AsyncStorage.setItem(`comments_${eventId}`, JSON.stringify(updatedComments));
      setComments(updatedComments); // Update the state to reflect the new comment
    } catch (error) {
      console.error('Error saving comments:', error);
    }
    setNewComment('');
  };

  const renderComment = ({ item }) => (
    <View style={styles.comment}>
      <Text style={[styles.commentUser, { color: themeStyles.color }]}>{item.user}:</Text>
      <Text style={[styles.commentText, { color: themeStyles.color }]}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.activityFeed}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={[styles.activityHeader, { color: themeStyles.color }]}>Activity Feed</Text>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={renderComment}
        ListEmptyComponent={
          <Text style={[styles.noComments, { color: themeStyles.color }]}>No comments yet.</Text>
        }
        contentContainerStyle={styles.commentList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: isDarkMode ? '#333' : '#fff', color: themeStyles.color },
          ]}
          placeholder="Add a comment..."
          placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity style={styles.button} onPress={addComment}>
          <Text style={styles.buttonText}>Post Comment</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  activityFeed: {
    flex: 1,
    marginTop: 20,
  },
  activityHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentList: {
    paddingBottom: 20, // Add padding to avoid overlap with the input field
  },
  comment: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  commentUser: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 14,
  },
  noComments: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  inputContainer: {
    marginTop: 10,
    paddingBottom: 20, // Ensure the input field is above the navigation bar
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});