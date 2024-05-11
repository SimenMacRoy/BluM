// Importing React from the react library for creating components.
import React from 'react';
// Importing View, Text, and ScrollView from react-native for layout and scrolling functionality.
import { View, Text, ScrollView } from 'react-native';
// Importing the Basket, Header, and SearchBar components for use in this screen.
import Basket from './Basket';
import Header from './Header';
import SearchBar from './SearchBar';

// Creating the DeliveryScreen component.
const DeliveryScreen = () => {
    return (
        // ScrollView allows the content to be scrollable.
        <ScrollView>
            {/* Header component displays the header of the screen */}
            <Header />
            {/* SearchBar component provides a search bar functionality */}
            <SearchBar />
            {/* Basket component shows the user's basket */}
            <Basket />
        </ScrollView>
    );
};

// Exporting DeliveryScreen for use in other parts of the app.
export default DeliveryScreen;
