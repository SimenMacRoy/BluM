import { StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './TabNav/TabNavigator';
import RootNavigator from './TabNav/RootStack';
import { BasketProvider } from './Screens/BasketContext';
import { UserProvider } from './Screens/UserContext';



export default function App() {
  return (
    <UserProvider> 
      <BasketProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </BasketProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});