import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import Header from './Header';
import SearchBar from './SearchBar'; // Ensure this path is correct
import SearchResults from './SearchResults'; // Ensure this path is correct
import config from '../config';

const MeatScreen = ({ navigation }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [meats, setMeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch meats from backend
        const fetchMeats = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/ingredient/Viande`);
                if (!response.ok) {
                    throw new Error('Failed to fetch meats');
                }
                const data = await response.json();
                setMeats(data);
                setLoading(false);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchMeats();
    }, []);

    const handleResultPress = (ingredient) => {
        // Assuming you have a detail screen for ingredients
        navigation.navigate('IngredientsDetailScreen', { ingredientId: ingredient.id });
    };

    const handleSearch = (results) => {
        setSearchResults(results);
        setIsSearching(results.length > 0);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.row} onPress={() => handleResultPress(item)}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#15FCFC" />;
    }

    if (error) {
        return (
            <View>
                <Text style={{ color: 'red' }}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <Header />
            <SearchBar 
                onSearch={handleSearch} 
                onResultPress={handleResultPress}
                searchType={'viande'}
                placeholder='Rechercher un type de viande...'// Assuming 'ingredients' is a valid type for your SearchBar
            />
            {isSearching ? (
                <SearchResults results={searchResults} onResultPress={handleResultPress} />
            ) : (
                <View style={styles.container}>
                    <Text style={styles.bigTitle}>Viande</Text>
                    <FlatList
                        data={meats}
                        keyExtractor={item => item.id.toString()}
                        renderItem={renderItem}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 240,
    },
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
        fontFamily: 'Ebrima',
    },
    bigTitle: {
        fontSize: 24,
        fontFamily: 'Ebrimabd',
        textAlign: 'center',
        marginVertical: 10,
    },
});

export default MeatScreen;
