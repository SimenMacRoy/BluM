import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList , StyleSheet} from 'react-native';
import Header from './Header';
import SearchBar from './SearchBar'; // Ensure this path is correct
import SearchResults from './SearchResults'; // Ensure this path is correct
import ingredients from '../ingredients.json';

const FruitScreen = ({ navigation }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleResultPress = (ingredient) => {
        // Assuming you have a detail screen for ingredients
        navigation.navigate('IngredientDetailScreen', { ingredientId: ingredient.id });
    };

    const handleSearch = (results) => {
        setSearchResults(results);
        setIsSearching(results.length > 0);
    };

    const fruits = ingredients.filter(ingredient => ingredient.category === 'Fruit');

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.row} onPress={() => handleResultPress(item)}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <Header />
            <SearchBar 
                onSearch={handleSearch} 
                onResultPress={handleResultPress}
                searchType={'ingredients'} // Assuming 'ingredients' is a valid type for your SearchBar
            />
            {isSearching ? (
                <SearchResults results={searchResults} onResultPress={handleResultPress} />
            ) : (
                <View>
                    <Text style={styles.bigTitle}>Fruits</Text>
                    <FlatList
                        data={fruits}
                        keyExtractor={item => item.id.toString()}
                        renderItem={renderItem}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginHorizontal: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    bigTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
});

export default FruitScreen;
