// Import necessary modules from React Navigation
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens
import HomeScreen from '../Screens/HomeScreen';
import SearchBar from '../Screens/SearchBar';
import RecipeScreenDetail from './../Screens/RecipeScreenDetail';

// Create a stack navigator for your screens
const Stack = createStackNavigator();

// Define your navigation stack
const HomeNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false}}/>
      <Stack.Screen name="SearchBar" component={SearchBar} options={{ headerShown: false}}/>
    </Stack.Navigator>
  );
};

export default HomeNav;
