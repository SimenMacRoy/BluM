import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Card = ({ image, username }) => {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} />
      <Text style={styles.username}>{username}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  username: {
    marginTop: 8,
  },
});

export default Card;