// Import necessary modules from React Navigation
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens
import Basket from '../Screens/Basket';
import DeliveryScreen from '../Screens/DeliveryScreen';
import CheckoutScreen from '../Screens/CheckoutScreen';

// Create a stack navigator for your screens
const Stack = createStackNavigator();

// Define your navigation stack
const RecipeNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Command" component={DeliveryScreen} options={{ headerShown: false}}/>
      <Stack.Screen name="Basket" component={Basket} options={{ headerShown: false}}/>
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} options={{ headerShown: false}}/>
    </Stack.Navigator>
  );
};

export default RecipeNav;
