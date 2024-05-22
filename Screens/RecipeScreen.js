import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import SearchResults from './SearchResults';
import Header from './Header';
import SearchBar from './SearchBar';
import { useNavigation } from '@react-navigation/core';

const RecipeScreen = () => {
    // State for handling selected dish ID
    const [dishes, setDishes] = useState([]);
    const [selectedDishId, setSelectedDishId] = useState(null);
    const navigation = useNavigation();

    // Function to navigate to details screen when a dish is selected
    const handleResultPress = (food) => {
        navigation.navigate('RecipeScreenDetail', { dishId: food.id });
    };

    // State for handling search results and search status
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Function to update search results and searching status
    const handleSearch = (results) => {
        setSearchResults(results);
        setIsSearching(results.length > 0);
    };

    // Function to handle the selection of a dish card
    const handleCardPress = (id) => {
        setSelectedDishId(id);
        navigation.navigate('RecipeScreenDetail', { dishId: id });
    };

    const navigateToCategoryScreen = (category) => {
        const filteredDishes = dishes.filter(dish => dish.category === `${category}s`);
        navigation.navigate(`${category}DishesScreen`, { dishes: filteredDishes });
    };
    useEffect(() => {
        fetch('http://192.168.69.205:3006/api/dishes') // Adjust URL to your backend
            .then(response => response.json())
            .then(data => setDishes(data))
            .catch(error => {
                console.error('Failed to fetch dishes:', error);
                Alert.alert('Error', 'Could not retrieve dishes.');
            });
    }, []);

    // Function to reset the selected dish
    const resetSelectedDish = () => setSelectedDishId(null);

    // Find the selected dish based on ID
    const selectedDish = selectedDishId ? dishes.find(dish => dish.id === selectedDishId) : null;

    return (
        <View style={{ flex: 1 }}>
            <Header />
            <SearchBar 
                onSearch={handleSearch} 
                onResultPress={handleResultPress}
                searchType={'foods'} />

            {/* Display search results if searching, else show dish categories */}
            {isSearching ? (
                <SearchResults results={searchResults} onResultPress={handleResultPress} />
            ) : (
                <ScrollView>
                    {/* African dishes section */}
                <TouchableOpacity onPress={() => navigateToCategoryScreen('African')}>
                    <SectionHeader text="Plats Africains" imageSource={require('C:\\Users\\Mac Roy\\Documents\\bluMApp\\assets\\iconAfrique.png')}/>
                </TouchableOpacity>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <DishList dishes={dishes.filter(dish => dish.category === "Africans")} onPress={handleCardPress} />
                </ScrollView>

                {/* American dishes section */}
                <TouchableOpacity onPress={() => navigateToCategoryScreen('American')}>
                    <SectionHeader text="Plats Americains" imageSource={require('C:\\Users\\Mac Roy\\Documents\\bluMApp\\assets\\iconAmerica.png')}/>
                </TouchableOpacity>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <DishList dishes={dishes.filter(dish => dish.category === "Americans")} onPress={handleCardPress} />
                </ScrollView>

                {/* Asian dishes section */}
                <TouchableOpacity onPress={() => navigateToCategoryScreen('Asian')}>
                    <SectionHeader text="Plats Asiatiques" imageSource={require('C:\\Users\\Mac Roy\\Documents\\bluMApp\\assets\\iconAsia.png')}/>
                </TouchableOpacity>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <DishList dishes={dishes.filter(dish => dish.category === "Asians")} onPress={handleCardPress} />
                </ScrollView>

                {/* European dishes section */}
                <TouchableOpacity onPress={() => navigateToCategoryScreen('European')}>
                    <SectionHeader text="Plats Européens" imageSource={require('C:\\Users\\Mac Roy\\Documents\\bluMApp\\assets\\iconEurope.jpg')}/>
                </TouchableOpacity>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <DishList dishes={dishes.filter(dish => dish.category === "Europeans")} onPress={handleCardPress} />
                </ScrollView>
                </ScrollView>
            )}
        </View>
    );
};

// SectionHeader component for each category
const SectionHeader = ({ text, imageSource }) => (
    
    <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{text}</Text> 
        {imageSource && (
        <Image
            source={imageSource}
            style={{ width: 24, height: 24, marginRight: 10 }}
            resizeMode="contain"
        />
    )}  
    </View>
);

// DishList component to display list of dishes
const DishList = ({ dishes, onPress }) => (
    <View style={styles.cardsContainer}>
        {dishes.map((dish) => (
            <TouchableOpacity key={dish.id} style={styles.card} onPress={() => onPress(dish.id)}>
                <Image source={{ uri: dish.image }} style={styles.cardImage} />
                <Text style={styles.cardTitle}>{dish.title}</Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.priceText}>${dish.price}</Text>
                    <Text style={styles.countryFlag}>{dish.countryFlag}</Text>
                </View>
            </TouchableOpacity>
        ))}
    </View>
);

// Styles for the RecipeScreen components
const styles = {
    
    sectionHeader: {
        alignItems: 'center', 
        backgroundColor: '#e6e6e6',
        padding: 10,
        margin: 10,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: "#15FCFC"
    },
    sectionHeaderText: {
        fontSize: 20,
        fontFamily: 'Ebrimabd',
        color: 'black',
        alignSelf: 'center',
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    card: {
        width: 150,
        borderWidth: 1,
        borderColor: 'white',
        marginBottom: 10,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        padding: 0,
        marginLeft: 10,
    },
    cardImage: {
        width: 149,
        height: 130,
        borderTopLeftRadius: 20,
        
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: 'Ebrimabd',
        paddingVertical: 3,
        alignSelf: 'center',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingBottom: 5,
    },
    countryFlag: {
        fontSize: 20,
        alignSelf: 'flex-end',
        padding: 5
    },
    priceText: {
        fontSize: 16,
        fontFamily: 'Ebrimabd',
        color: 'gray'
    },
};

export default RecipeScreen;
