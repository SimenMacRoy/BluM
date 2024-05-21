import React, { useEffect } from 'react';
import { StyleSheet, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './TabNav/TabNavigator';
import RootNavigator from './TabNav/RootStack';
import { BasketProvider } from './Screens/BasketContext';
import { UserProvider } from './Screens/UserContext';

const App = () => {
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
});
