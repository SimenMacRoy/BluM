import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../Screens/HomeScreen';
import RecipeScreen from '../Screens/RecipeScreen';
import IngredientsScreen from '../Screens/IngredientsScreen';
import DeliveryScreen from '../Screens/DeliveryScreen';
import MoreScreen from '../Screens/MoreScreen';
import RecipeScreenDetail from '../Screens/RecipeScreenDetail';
import RecipeNav from './RecipeNav';
import CommandNav from './CommandNav';
import IngredientNav from './IngredientNav';
import MoreNav from './MoreNav';
import HomeNav from './HomeNav';
import Basket from '../Screens/Basket';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Accueil') {
            iconName = 'home';
          } else if (route.name === 'Recettes') {
            iconName = 'book';
          } else if (route.name === 'Ingredients') {
            iconName = 'nutrition';
          } else if (route.name === 'Commander') {
            iconName = 'cart';
          } else if (route.name === 'Mon Compte') {
            iconName = 'menu-outline';
          }

          // Use focused state to determine icon size
          const adjustedSize = focused ? size * 1.25 : size;

          return <Ionicons name={iconName} size={adjustedSize} color={color} />;
        },
        // Common screenOptions can be added here
        activeTintColor: 'blue',
        inactiveTintColor: 'gray',
        keyboardHidesTabBar: true,
  
      })}
    >
      <Tab.Screen name="Recettes" component={RecipeNav} options={{headerShown: false}}/>
      <Tab.Screen name="Ingredients" component={IngredientNav} options={{headerShown: false}}/>
      <Tab.Screen name="Commander" component={Basket} options={{headerShown: false}}/>
      <Tab.Screen name="Mon Compte" component={MoreNav} options={{headerShown: false}}/>
      
    </Tab.Navigator>
  );
};

export default TabNavigator;