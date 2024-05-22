import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import Header from './Header';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';

const SpiceScreen = ({ navigation }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [spices, setSpices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch spices from backend
        const fetchSpices = async () => {
            try {
                const response = await fetch('http://192.168.69.205:3006/api/ingredient/Epices');
                if (!response.ok) {
                    throw new Error('Failed to fetch spices');
                }
                const data = await response.json();
                setSpices(data);
                setLoading(false);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchSpices();
    }, []);

    const handleResultPress = (ingredient) => {
        // Navigate to the detail screen for the selected ingredient
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
                searchType={'epices'}
                placeholder='Quel épice ... ?'
            />
            {isSearching ? (
                <SearchResults results={searchResults} onResultPress={handleResultPress} />
            ) : (
                <View>
                    <Text style={styles.bigTitle}>Epices</Text>
                    <FlatList
                        data={spices}
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
        fontFamily: 'Ebrimabd',
    },
    bigTitle: {
        fontSize: 24,
        fontFamily: 'Ebrimabd',
        textAlign: 'center',
        marginVertical: 10,
    },
});

export default SpiceScreen;
