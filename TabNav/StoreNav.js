// Import necessary modules from React Navigation
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens
import StoreScreen from '../Screens/StoreScreen';
import IngredientsDetailScreen from '../Screens/IngredientsDetailScreen';
import StoreDetailScreen from '../Screens/StoreDetailScreen';

// Create a stack navigator for your screens
const Stack = createStackNavigator();

// Define your navigation stack
const StoreNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="StoreScreen" component={StoreScreen} options={{ headerShown: false}}/>
      <Stack.Screen name="StoreDetailScreen" component={StoreDetailScreen} options={{ headerShown: false}}/>
      
    </Stack.Navigator>
  );
};

export default StoreNav;
