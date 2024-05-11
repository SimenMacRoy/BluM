// Import necessary modules from React Navigation
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens
import RecipeScreen from '../Screens/RecipeScreen';

// Create a stack navigator for your screens
const Stack = createStackNavigator();

// Define your navigation stack
const RecipeNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RecipeScreen" component={RecipeScreen} options={{ headerShown: false}}/>
    </Stack.Navigator>
  );
};

export default RecipeNav;
