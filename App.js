import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';
import RootNavigator from './TabNav/RootStack';
import { BasketProvider } from './Screens/BasketContext';
import { UserProvider } from './Screens/UserContext';

SplashScreen.preventAutoHideAsync(); // Prevent the splash screen from auto-hiding

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'Ebrima': require('./assets/fonts/Ebrima.ttf'),
      'Ebrimabd': require('./assets/fonts/Ebrimabd.ttf'),
    });
    setFontsLoaded(true);
    SplashScreen.hideAsync(); // Hide the splash screen once fonts are loaded
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Keep the splash screen visible while fonts are loading
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
    <StripeProvider publishableKey="pk_test_51PIRk7DIrmiE2Hgb4lLVD99VQnFg7uWaAhtEBBBzLIixaLhcQ9FOuhkSonPw8SozcgiS19efR92rNwYX6kQ7TRvT00YayxN2sq">
      <UserProvider>
        <BasketProvider>
          <NavigationContainer linking={linking}>
            <RootNavigator />
          </NavigationContainer>
        </BasketProvider>
      </UserProvider>
    </StripeProvider>
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
