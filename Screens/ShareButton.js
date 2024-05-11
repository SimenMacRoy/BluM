import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ShareButton = () => {
  return (
    <TouchableOpacity style={styles.container}>
      <FontAwesome name="share" size={16} color="white" />
      <Text style={styles.text}>Share</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: {
    color: 'white',
    marginLeft: 5,
  },
});

export default ShareButton;