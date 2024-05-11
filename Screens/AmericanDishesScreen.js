import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Header from './Header';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import { useNavigation } from '@react-navigation/native';

const AmericanDishesScreen = () => {
    const navigation = useNavigation();
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [americanDishes, setAmericanDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch American dishes from backend
        const fetchAmericanDishes = async () => {
            try {
                const response = await fetch('http://192.168.69.205:3006/api/american-dishes');
                if (!response.ok) {
                    throw new Error('Failed to fetch American dishes');
                }
                const data = await response.json();
                setAmericanDishes(data);
                setLoading(false);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchAmericanDishes();
    }, []);

    const navigateToDetail = (dishId) => {
        navigation.navigate('RecipeScreenDetail', { dishId });
    };

    const handleResultPress = (dish) => {
        navigateToDetail(dish.id);
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
                searchType={'Americans'}
                placeholder='Quel repas américain ...'
            />
            {isSearching ? (
                <SearchResults results={searchResults} onResultPress={handleResultPress} />
            ) : (
                <View>
                    <Text style={styles.bigTitle}>American Dishes</Text>
                    <FlatList
                        data={americanDishes}
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

export default AmericanDishesScreen;
