import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import BasketContext from './BasketContext';
import DateTimeSelector from '../utils/DateTimeSelector';

const IngredientsTab = ({ route }) => {
    const { dish } = route.params;

    const [ingredientsList, setIngredientsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deliveryDate, setDeliveryDate] = useState(new Date());
    const [deliveryTime, setDeliveryTime] = useState('');
    const [deliveryTimes, setDeliveryTimes] = useState([]);

    const { addToBasket } = useContext(BasketContext);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await fetch(`http://192.168.69.205:3006/api/dishes/${dish.id}/ingredients`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const initializedIngredients = data.map(ingredient => ({
                    ...ingredient,
                    quantity: 1
                }));
                
                setIngredientsList(initializedIngredients);
                setLoading(false);
                generateDeliveryTimes(); // This could also be moved to DateTimeSelector if it's not used elsewhere
            } catch (err) {
                console.error('Failed to fetch ingredients:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchIngredients();
    }, [dish.id]);

    const generateDeliveryTimes = () => {
        let times = [];
        let currentTime = new Date();
        currentTime.setMinutes(currentTime.getMinutes() + 30 - (currentTime.getMinutes() % 5));
        for (let i = 0; i < 8; i++) {
            let newTime = new Date(currentTime.getTime() + i * 30 * 60000);
            times.push(newTime.toTimeString().substring(0, 5));
        }
        setDeliveryTimes(times);
        setDeliveryTime(times[0]);
    };

    const handleAddToBasket = () => {
        ingredientsList.forEach(ingredient => {
            addToBasket({
                ...ingredient,
                quantity: ingredient.quantity,
                deliveryDate: deliveryDate.toISOString(),
                deliveryTime
            });
        });
        alert('Ingredients added to basket with delivery details!');
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#15FCFC" />;
    }

    if (error) {
        return <View><Text style={{ color: 'red' }}>Error: {error}</Text></View>;
    }

    return (
        <ScrollView style={styles.scroll}>
            <View style={styles.ingredientsContainer}>
                {ingredientsList.map((ingredient, index) => {
                    return (
                        <View key={index} style={styles.ingredientItem}>
                            <View style={styles.row}>
                                <Image source={{ uri: ingredient.image }} style={styles.image} />
                                <Text style={styles.ingredientName}>{ingredient.title}</Text>
                                <View style={styles.quantityContainer}>
                                    <TouchableOpacity onPress={() => setIngredientsList(prev => {
                                        const newList = [...prev];
                                        newList[index].quantity = Math.max(1, newList[index].quantity - 1);
                                        return newList;
                                    })}>
                                        <FontAwesome name="minus" size={24} color="black" />
                                    </TouchableOpacity>
                                    <Text style={styles.quantity}>{ingredient.quantity}</Text>
                                    <TouchableOpacity onPress={() => setIngredientsList(prev => {
                                        const newList = [...prev];
                                        newList[index].quantity += 1;
                                        return newList;
                                    })}>
                                        <FontAwesome name="plus" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.descriptionContainer}>
                                <Text style={styles.description}>
                                    {ingredient.quantity} {ingredient.package} = ${(ingredient.price * ingredient.quantity).toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
            <DateTimeSelector
                initialDate={deliveryDate}
                onDateChange={setDeliveryDate}
                initialTime={deliveryTime}
                onTimeChange={setDeliveryTime}
                deliveryTimes={deliveryTimes}
            />
            <TouchableOpacity style={styles.checkoutButton} onPress={handleAddToBasket}>
                <Text style={styles.checkoutText}>Ajouter au panier</Text>
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
