import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Header from './Header'; // Adjust the path as necessary
import SearchBar from './SearchBar'; // Adjust the path as necessary
import SearchResults from './SearchResults';
import { useNavigation } from '@react-navigation/native'; 
import config from '../config';// Import useNavigation

const AsianDishesScreen = () => {
    const navigation = useNavigation(); // Initialize navigation
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [asianDishes, setAsianDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch Asian dishes from backend
        const fetchAsianDishes = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/dish/Asians`);
                if (!response.ok) {
                    throw new Error('Failed to fetch Asian dishes');
                }
                const data = await response.json();
                setAsianDishes(data);
                setLoading(false);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchAsianDishes();
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
                searchType={'Asians'}
                placeholder='Rechercher un plat asiatique...'
            />
            {isSearching ? (
                <SearchResults results={searchResults} onResultPress={handleResultPress} />
            ) : (
                <View>
                    <Text style={styles.bigTitle}>Plats Asiatiques</Text>
                    <FlatList
                        data={asianDishes}
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
        fontFamily: 'Ebrima',
    },
    bigTitle: {
        fontSize: 24,
        fontFamily: 'Ebrimabd',
        textAlign: 'center',
        marginVertical: 10,
    },
});

export default AsianDishesScreen;
