import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import Header from './Header';
import SearchBar from './SearchBar'; // Ensure this path is correct
import SearchResults from './SearchResults'; // Ensure this path is correct
import config from '../config';

const LegumeScreen = ({ navigation }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [legumes, setLegumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch legumes from backend
        const fetchLegumes = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/ingredient/Legumes`);
                if (!response.ok) {
                    throw new Error('Failed to fetch legumes');
                }
                const data = await response.json();
                setLegumes(data);
                setLoading(false);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchLegumes();
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
                searchType={'legumes'} 
            />
            {isSearching ? (
                <SearchResults results={searchResults} onResultPress={handleResultPress} />
            ) : (
                <View>
                    <Text style={styles.bigTitle}>Legumes</Text>
                    <FlatList
                        data={legumes}
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
        fontFamily: 'Ebrima',
    },
    bigTitle: {
        fontSize: 24,
        fontFamily: 'Ebrimabd',
        textAlign: 'center',
        marginVertical: 10,
    },
});

export default LegumeScreen;
