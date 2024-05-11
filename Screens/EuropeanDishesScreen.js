import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Header from './Header'; // Adjust the path as necessary
import SearchBar from './SearchBar'; // Adjust the path as necessary
import SearchResults from './SearchResults';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const EuropeanDishesScreen = () => {
    const navigation = useNavigation(); // Initialize navigation
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [europeanDishes, setEuropeanDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch Asian dishes from backend
        const fetchEuropeanDishes = async () => {
            try {
                const response = await fetch('http://192.168.69.205:3006/api/dish/Europeans');
                if (!response.ok) {
                    throw new Error('Failed to fetch European dishes');
                }
                const data = await response.json();
                setEuropeanDishes(data);
                setLoading(false);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchEuropeanDishes();
    }, []);

    const navigateToDetail = (dishId) => {
        navigation.navigate('RecipeScreenDetail', { dishId });
    };

    const handleResultPress = (food) => {
        navigateToDetail(food.id);
    };

    const handleSearch = (results) => {
        setSearchResults(results);
        setIsSearching(results.length > 0);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.row} onPress={() => navigateToDetail(item.id)}>
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
                searchType={'Europeans'}
                placeholder='Rechercher un plat européen...'
            />
            {isSearching ? (
                <SearchResults results={searchResults} onResultPress={handleResultPress} />
            ) : (
                <View>
                    <Text style={styles.bigTitle}>Plats Européens</Text>
                    <FlatList
                        data={europeanDishes}
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

export default EuropeanDishesScreen;
