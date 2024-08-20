import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import RecipeNav from './RecipeNav';
import IngredientNav from './IngredientNav';
import Basket from '../Screens/Basket';
import MoreNav from './MoreNav';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          let IconComponent = Ionicons; // Default to Ionicons

          if (route.name === 'Accueil') {
            iconName = 'home';
          } else if (route.name === 'Recettes') {
            iconName = 'book';
          } else if (route.name === 'Ingredients') {
            iconName = 'carrot'; // Example of a more representative icon
            IconComponent = FontAwesome5; // Use FontAwesome5 for this icon
          } else if (route.name === 'Commander') {
            iconName = 'cart';
          } else if (route.name === 'Mon Compte') {
            iconName = 'menu-outline';
          }

          const adjustedSize = focused ? size * 1.25 : size;

          return <IconComponent name={iconName} size={adjustedSize} color={color} />;
        },
        activeTintColor: 'blue',
        inactiveTintColor: 'gray',
        keyboardHidesTabBar: false, // Prevent the tab bar from hiding with the keyboard
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
