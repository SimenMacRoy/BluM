import React, {useEffect, useRef} from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoginScreen from './LoginScreen';

 const WelcomeScreen = () => {
  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: 10, // move up 10 units
          duration: 300, // duration for the move up
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim, {
          toValue: 0, // move back to start position
          duration: 300, // duration for the move down
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [moveAnim]);

  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('LoginScreen'); // Replace 'LoginScreen' with the name of your login screen in the navigator
    }, 5000);

    return () => clearTimeout(timer); // Clear the timer if the component unmounts
  }, [navigation]);
  return (
    <View style={{ flex: 1, backgroundColor: '#15FCFC', justifyContent: 'center', alignItems: 'center' }}>
      {/* Logo */}
      <Image
        source={require('C:\\Users\\Mac Roy\\Documents\\bluMApp\\assets\\bluMlogo.png')}  // Replace with the actual path to your logo image
        style={styles.imageLogo}
        resizeMode="contain"
      />

      {/* Frying Pan Icon */}
      <Animated.Image
        source={require('C:\\Users\\Mac Roy\\Documents\\bluMApp\\assets\\iconPan.png')}
        style={[styles.iconWaitingPan, { transform: [{ translateY: moveAnim }] }]}
        resizeMode="contain"
      />

      {/* Additional Welcome Text or Components */}
      <Text style={styles.welcomeText}>
        Welcome to BluM!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  imageLogo: {
    width: 205, 
    height: 205, 
    position: 'absolute', 
    top: 169, 
    left: 90,
    borderRadius: 100,
  },
  iconWaitingPan: {
    width: 158, 
    height: 140, 
    position: 'absolute', 
    top: 570, 
    left: 130, 
  },
  welcomeText: {
    fontSize: 32, 
    color: '#629A97', 
    marginTop: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    fontWeight: 'bold',
    
  }
});

export default WelcomeScreen;