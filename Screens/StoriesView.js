import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Card from './Card'; // Import the Card component

const StoriesView = () => {
  // Dummy data representing status
  const statuses = [
    { id: 1, image: require('C:\\Users\\Mac Roy\\Documents\\bluMApp\\assets\\keila.png'), username: 'User1' },
    { id: 2, image: require('C:\\Users\\Mac Roy\\Documents\\bluMApp\\assets\\keila.png'), username: 'User2' },
    { id: 3, image: require('C:\\Users\\Mac Roy\\Documents\\bluMApp\\assets\\keila.png'), username: 'User3' },
    // Add more status objects as needed
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
      {statuses.map(status => (
        <Card key={status.id} image={status.image} username={status.username} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    MarginTop: 10,
  },
});

export default StoriesView;