import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Header from './Header';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import { useNavigation } from '@react-navigation/native';
import config from '../config';

const AfricanDishesScreen = () => {
    const navigation = useNavigation();
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [africanDishes, setAfricanDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch African dishes from backend
        const fetchAfricanDishes = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/dish/Africans`);
                if (!response.ok) {
                    throw new Error('Failed to fetch African dishes');
                }
                const data = await response.json();
                setAfricanDishes(data);
                setLoading(false);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchAfricanDishes();
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
                searchType={'Africans'}
                placeholder='Rechercher des plats africains...'
            />
            {isSearching ? (
                <SearchResults results={searchResults} onResultPress={handleResultPress} />
            ) : (
                <View>
                    <Text style={styles.bigTitle}>Plats Africains</Text>
                    <FlatList
                        data={africanDishes}
                        keyExtractor={item => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContainer}
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
        textAlign: 'center',
        marginVertical: 10,
        fontFamily: 'Ebrimabd',
    },
    listContainer: {
        paddingBottom: 200,
    },
});

export default AfricanDishesScreen;
