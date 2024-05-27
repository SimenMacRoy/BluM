import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './TabNav/TabNavigator';
import RootNavigator from './TabNav/RootStack';
import { BasketProvider } from './Screens/BasketContext';
import { UserProvider } from './Screens/UserContext';

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'Ebrima': require('./assets/fonts/Ebrima.ttf'),
      'Ebrimabd': require('./assets/fonts/Ebrimabd.ttf'),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const linking = {
    prefixes: ['blumapp://'],
    config: {
      screens: {
        ResetPasswordScreen: 'reset-password/:token',
        // Define other screens if necessary
      },
    },
  };

  return (
    <UserProvider>
      <BasketProvider>
        <NavigationContainer linking={linking}>
          <RootNavigator />
        </NavigationContainer>
      </BasketProvider>
    </UserProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  text: {
    fontFamily: 'Ebrima',
  },
});
