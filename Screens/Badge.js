import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// This component is used to represent the amount of items we have in the basket.
// It is used in the Basket component, to indicate what quantity of items is present in it.

const Badge = ({ value }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{value}</Text>
    </View>
  );
};

// The color of the badge is red and it is slightly joined to the basket icon.

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 25,
    right: -3,
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Ebrimabd',
  },
});

export default Badge;