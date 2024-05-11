import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import BasketContext from './BasketContext';

const IngredientsTab = ({ route }) => {
    const { dish } = route.params;

    const [ingredientsList, setIngredientsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { addToBasket } = useContext(BasketContext);

    useEffect(() => {
        // Fetch ingredients from backend
        const fetchIngredients = async () => {
            try {
                const response = await fetch(`http://192.168.69.205:3006/api/dishes/${dish.id}/ingredients`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                
                // Initialize quantity to 1 for all ingredients
                const initializedIngredients = data.map(ingredient => ({
                    ...ingredient,
                    quantity: 1
                }));
                
                setIngredientsList(initializedIngredients);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch ingredients:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchIngredients();
    }, [dish.id]);

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

    const increaseQuantity = (index) => {
        const newIngredientsList = [...ingredientsList];
        newIngredientsList[index].quantity++;
        setIngredientsList(newIngredientsList);
    };

    const decreaseQuantity = (index) => {
        const newIngredientsList = [...ingredientsList];
        if (newIngredientsList[index].quantity > 1) {
            newIngredientsList[index].quantity--;
            setIngredientsList(newIngredientsList);
        }
    };

    const deleteIngredient = (index) => {
        const newIngredientsList = [...ingredientsList];
        newIngredientsList.splice(index, 1);
        setIngredientsList(newIngredientsList);
    };

    const handleAddToBasket = () => {
        ingredientsList.forEach(ingredient => {
            addToBasket({ ...ingredient, quantity: ingredient.quantity });
        });
        alert('Ingredients added to basket!');
    };

    return (
        <ScrollView style={styles.scroll}>
            <View style={styles.ingredientsContainer}>
                {ingredientsList.map((ingredient, index) => {
                    const quantity = ingredient.quantity || 0;
                    const packaging = ingredient.package || 'unit';
                    const price = parseFloat(ingredient.price) || 0;
                    const totalPrice = (price * quantity).toFixed(2);

                    return (
                        <View key={index} style={styles.ingredientItem}>
                            <View style={styles.row}>
                                <Image source={{ uri: ingredient.image }} style={styles.image} />
                                <Text style={styles.ingredientName}>{ingredient.title}</Text>
                                <View style={styles.quantityContainer}>
                                    <TouchableOpacity onPress={() => decreaseQuantity(index)}>
                                        <FontAwesome name="minus" size={24} color="black" />
                                    </TouchableOpacity>
                                    <Text style={styles.quantity}>{quantity}</Text>
                                    <TouchableOpacity onPress={() => increaseQuantity(index)}>
                                        <FontAwesome name="plus" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={() => deleteIngredient(index)}>
                                    <FontAwesome name="trash" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.descriptionContainer}>
                                <Text style={styles.description}>
                                    {quantity} {packaging} = {totalPrice}$
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleAddToBasket}>
                <Text style={styles.checkoutText}>Add to basket</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: 'white',
    },
    ingredientsContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    ingredientItem: {
        marginBottom: 10,
    },
    row : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    image: {
        width: 50, // Adjust the size as needed
        height: 50,
        marginRight: 10,
    },
    ingredientName: {
        fontSize: 16,
        flex: 0.5,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantity: {
        marginHorizontal: 10,
        fontSize: 16,
    },
    checkoutButton: {
        backgroundColor: 'black',
        padding: 15,
        margin: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    checkoutText: {
        color: 'white',
        fontSize: 18,
    },
    descriptionContainer: {
        backgroundColor: '#e6e6e6',
        borderRadius: 10,
        padding: 10,
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
});

export default IngredientsTab;
