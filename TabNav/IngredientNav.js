// Import necessary modules from React Navigation
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens
import IngredientsScreen from '../Screens/IngredientsScreen';
import IngredientsScreenDetail from '../Screens/IngredientsDetailScreen';
import Basket from '../Screens/Basket';
import CheckoutScreen from '../Screens/CheckoutScreen';

// Create a stack navigator for your screens
const Stack = createStackNavigator();

// Define your navigation stack
const IngredientNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="IngredientScreen" component={IngredientsScreen} options={{ headerShown: false}}/>
      <Stack.Screen name="Basket" component={Basket} options={{ headerShown: false}}/>
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} options={{ headerShown: false}}/>
    </Stack.Navigator>
  );
};

export default IngredientNav;
