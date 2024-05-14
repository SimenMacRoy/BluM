import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Header from './Header';
import SearchBar from './SearchBar';
import BasketContext from './BasketContext';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const IngredientsDetailScreen = ({ route }) => {
    const { ingredientId } = route.params;
    const { basketItems, addToBasket } = useContext(BasketContext);
    const [quantity, setQuantity] = useState(1);
    const [ingredient, setIngredient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation(); // Initialize navigation

    useEffect(() => {
        // Fetch ingredient from backend
        const fetchIngredient = async () => {
            try {
                const response = await fetch(`http://192.168.69.205:3006/api/ingredients/${ingredientId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch ingredient');
                }
                const data = await response.json();
                setIngredient(data);
                setLoading(false);

                // Set initial quantity from basket
                const existingItem = basketItems.find(item => item.id === ingredientId);
                if (existingItem) {
                    setQuantity(existingItem.quantity);
                }
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchIngredient();
    }, [ingredientId, basketItems]);

    // Increase the quantity
    const increaseQuantity = () => setQuantity(quantity + 1);
    
    // Decrease the quantity but not below 1
    const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);

    // Handle adding ingredient to the basket
    const handleAddToBasket = () => {
        if (ingredient && quantity > 0) {
            addToBasket({ ...ingredient, quantity });
            alert(`Updated ${ingredient.title} with quantity ${quantity} in basket.`);
        } else {
            alert('Please select a quantity before adding to basket.');
        }
    };

    const handleResultPress = (ingredient) => {
        navigation.navigate('IngredientsDetailScreen', { ingredientId: ingredient.id });
    };

    const handleSearch = (results) => {
        setSearchResults(results);
        setIsSearching(results.length > 0);
    };

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

    if (!ingredient) {
        return (
            <View>
                <Text style={{ color: 'red' }}>Ingredient not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.foodContainer}>
                <Image source={{ uri: ingredient.image }} style={styles.foodImage} />
                <Text style={styles.foodTitle}>{ingredient.title}</Text>
            </View>

            <ScrollView style={styles.scroll}>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>{ingredient.description}</Text>

                    <View style={styles.quantityControl}>
                        <TouchableOpacity onPress={decreaseQuantity}>
                            <FontAwesome name="minus" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{quantity}</Text>
                        <TouchableOpacity onPress={increaseQuantity}>
                            <FontAwesome name="plus" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.packageContainer}>
                        <Text style={styles.packageInfo}>{quantity} {ingredient.package} = {(ingredient.price * quantity).toFixed(2)}$</Text>
                    </View>

                    <TouchableOpacity style={styles.addToBasketButton} onPress={handleAddToBasket}>
                        <Text style={styles.addToBasketText}>Add to Basket</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    descriptionContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    description: {
        fontSize: 18,
        textAlign: 'center',
        marginHorizontal: 20,
        marginTop: 10,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    quantity: {
        fontSize: 20,
        marginHorizontal: 10,
    },
    addToBasketButton: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
    },
    addToBasketText: {
        color: 'white',
        fontSize: 18,
    },
    foodContainer: {
        backgroundColor: '#15FCFC',
        alignItems: 'center',
        padding: 10,
        borderRadius: 30,
        margin: 10,
    },
    foodImage: {
        width: 125,
        height: 125,
        resizeMode: 'cover',
        borderRadius: 50,
    },
    foodTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    scroll: {
        flex: 1,
        backgroundColor: 'white',
    },
    packageContainer: {
        backgroundColor: '#e6e6e6',
        borderRadius: 10,
        padding: 10,
    },
    packageInfo: {
        fontSize: 14,
        color: '#666',
    },
});

export default IngredientsDetailScreen;
