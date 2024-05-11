import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import FAQs from '../Screens/FAQs';
import AboutUsScreen from '../Screens/AboutUsScreen';

const Drawer = createDrawerNavigator();

const HamburgerMenu = () => {

    return(
        <NavigationContainer>
            <Drawer.Navigator>
                <Drawer.Screen name="FAQs" component={FAQs} />
                <Drawer.Screen name="About us" component={AboutUsScreen} />
            </Drawer.Navigator>
        </NavigationContainer>
    )
}

export default HamburgerMenu;