// Import necessary modules from React Navigation
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens
import ProfileScreen from '../Screens/ProfileScreen';
import MoreScreen from '../Screens/MoreScreen';

// Create a stack navigator for your screens
const Stack = createStackNavigator();

// Define your navigation stack
const MoreNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MoreScreen" component={MoreScreen} options={{ headerShown: false}}/>
    </Stack.Navigator>
  );
};

export default MoreNav;
