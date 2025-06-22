import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { ThemeContext } from '../context/ThemeContext';

export default function EventCard({ event }) {
  const { isDarkMode } = useContext(ThemeContext);

  const themeStyles = isDarkMode
    ? {
        cardBackground: '#333',
        textColor: '#fff',
        descriptionColor: '#aaa',
        dateColor: '#ccc',
      }
    : {
        cardBackground: '#fff',
        textColor: '#000',
        descriptionColor: '#555',
        dateColor: '#888',
      };

  return (
    <Card style={[styles.card, { backgroundColor: themeStyles.cardBackground }]}>
      <Card.Content>
        <Text style={[styles.title, { color: themeStyles.textColor }]}>{event.name}</Text>
        <Text style={[styles.details, { color: themeStyles.textColor }]}>Time: {event.time}</Text>
        <Text style={[styles.details, { color: themeStyles.textColor }]}>Venue: {event.venue}</Text>
        <Text style={[styles.details, { color: themeStyles.textColor }]}>Category: {event.category}</Text>
        <Text style={[styles.description, { color: themeStyles.descriptionColor }]}>
          {event.description}
        </Text>
        <Text style={[styles.date, { color: themeStyles.dateColor }]}>Date: {event.date}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
    borderRadius: 8,
    elevation: 3, // Adds shadow for light mode
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 14,
    marginVertical: 2,
  },
  description: {
    fontSize: 12,
    marginTop: 5,
  },
  date: {
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
});