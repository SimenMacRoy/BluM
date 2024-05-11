import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import RecipeScreenDetail from '../Screens/RecipeScreenDetail';
import ProfileScreen from '../Screens/ProfileScreen';
import IngredientsDetailScreen from '../Screens/IngredientsDetailScreen';
import WelcomeScreen from '../Screens/WelcomeScreen';
import LoginScreen from './../Screens/LoginScreen';
import RegistrationScreen from '../Screens/RegistrationScreen';
import AfricanDishesScreen from '../Screens/AfricanDishesScreen';
import AmericanDishesScreen from '../Screens/AmericanDishesScreen';
import AsianDishesScreen from '../Screens/AsianDishesScreen';
import SpiceScreen from '../Screens/SpiceScreen';
import CondimentScreen from '../Screens/CondimentScreen';
import AssaisonementScreen from '../Screens/AssaisonementScreen';
import ProdEnConservesScreen from '../Screens/ProdEnConservesScreen';
import DrinksScreen from '../Screens/DrinksScreen';
import OthersScreen from '../Screens/OthersScreen';
import FruitScreen from '../Screens/FruitScreen';
import LegumeScreen from '../Screens/LegumeScreen';
import MeatScreen from '../Screens/MeatScreen';
import ImageScreen from '../Screens/ImageScreen';
import CommentScreen from '../Screens/CommentScreen';
import UserScreen from '../Screens/UserScreen';
import EditProfileScreen from '../Screens/EditProfileScreen';
import PublishScreen from '../Screens/PublishScreen';
import EuropeanDishesScreen from '../Screens/EuropeanDishesScreen';


// Define a root stack navigator
const RootStack = createStackNavigator();

// Define your root navigation stack
const RootNavigator = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="RegistrationScreen" component={RegistrationScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
      <RootStack.Screen name="RecipeScreenDetail" component={RecipeScreenDetail} options={{ headerShown: false }} />
      <RootStack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false}}/>
      <RootStack.Screen name="IngredientsDetailScreen" component={IngredientsDetailScreen} options={{ headerShown: false}}/>
      <RootStack.Screen name="AfricanDishesScreen" component={AfricanDishesScreen} options={{ headerShown: false}}/>
      <RootStack.Screen name="AmericanDishesScreen" component={AmericanDishesScreen} options={{ headerShown: false}}/>
      <RootStack.Screen name="AsianDishesScreen" component={AsianDishesScreen} options={{ headerShown: false}}/>
      <RootStack.Screen name="EuropeanDishesScreen" component={EuropeanDishesScreen} options={{ headerShown: false}}/>
      <RootStack.Screen name="SpiceScreen" component={SpiceScreen} options={{ headerShown: false}}/>
      <RootStack.Screen name="CondimentScreen" component={CondimentScreen} options={{ headerShown: false}}/>
      <RootStack.Screen name="AssaisonementScreen" component={AssaisonementScreen} options={{ headerShown: false}}/>
      <RootStack.Screen name="FruitScreen" component={FruitScreen} options={{ headerShown: false}}/>
      <RootStack.Screen name="LegumeScreen" component={LegumeScreen} options={{ headerShown: false}}/>
      <RootStack.Screen name="MeatScreen" component={MeatScreen} options={{ headerShown: false}}/>
      <RootStack.Screen name="ImageScreen" component={ImageScreen} options={{ headerShown: false}}/>
      <RootStack.Screen name="CommentScreen" component={CommentScreen} options={{ headerShown: true}}/>
      <RootStack.Screen name="UserScreen" component={UserScreen} options={{ headerShown: false}}/>
      <RootStack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ headerShown:false}}/>
      <RootStack.Screen name="PublishScreen" component={PublishScreen} options={{ headerShown: false}}/>
      <RootStack.Screen name="ProdEnConservesScreen" component={ProdEnConservesScreen} options={{ headerShown:false}}/>
      <RootStack.Screen name="DrinksScreen" component={DrinksScreen} options={{ headerShown:false}}/>
      <RootStack.Screen name="OthersScreen" component={OthersScreen} options={{ headerShown:false }}/>
    </RootStack.Navigator>
  );
};

export default RootNavigator
