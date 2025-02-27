import React, { useState, useContext, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import BasketContext from './BasketContext';
import DateTimeSelector from '../utils/DateTimeSelector'; 
import config from '../config';

const MealTab = ({ route }) => {
    const { dish, existingItem } = route.params;
    const { addToBasket } = useContext(BasketContext);
    const [quantity, setQuantity] = useState(existingItem ? existingItem.quantity.toString() : '');
    const [specifications, setSpecifications] = useState(existingItem ? existingItem.specifications : []);
    const [deliveryDate, setDeliveryDate] = useState(existingItem ? new Date(existingItem.deliveryDate) : new Date());
    const [deliveryTime, setDeliveryTime] = useState(existingItem ? existingItem.deliveryTime : '');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const disabledIngredientIds = [90023, 90135, 90147, 90162, 90133]; // Array of IDs to be disabled

    useEffect(() => {
        if (!existingItem) {
            fetchIngredients();
        } else {
            setLoading(false);
        }
    }, [dish.id, existingItem]);

    const fetchIngredients = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/dishes/${dish.id}/ingredients`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const initialSpecifications = data.map(ingredient => ({
                ...ingredient,
                quantity: existingItem && existingItem.specifications.find(spec => spec.id === ingredient.id) ? 
                          existingItem.specifications.find(spec => spec.id === ingredient.id).quantity : 
                          0
            }));
            setSpecifications(initialSpecifications);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch ingredients:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handleAddToBasket = () => {
        if (!quantity || quantity <= 0) {
            Alert.alert('Quantité Invalide', 'Veuillez entrer une quantité valide !');
            return;
        }

        if (!deliveryTime) {
            Alert.alert('Heure Invalide', 'Veuillez entrer une heure valide !');
            return;
        }
    
        let totalPrice = parseFloat(dish.price) * parseInt(quantity);
        let activeSpecifications = specifications.filter(spec => spec.quantity > 0);
    
        activeSpecifications.forEach(spec => {
            const ingredientPrice = parseFloat(spec.price);
            totalPrice += (ingredientPrice / 10) * spec.quantity;
        });
    
        addToBasket({
            ...dish,
            quantity: parseInt(quantity),
            deliveryTime,
            deliveryDate,
            specifications: activeSpecifications,
            type: 'Plat',
            totalPrice: totalPrice.toFixed(2)
        });
        Alert.alert(existingItem ? 'Panier modifié' : 'Plat ajouté au panier !');
    };

    const increaseQuantity = (index) => {
        const newSpecifications = [...specifications];
        newSpecifications[index].quantity++;
        setSpecifications(newSpecifications);
    };

    const decreaseQuantity = (index) => {
        const newSpecifications = [...specifications];
        if (newSpecifications[index].quantity > 0) {
            newSpecifications[index].quantity--;
            setSpecifications(newSpecifications);
        }
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    let totalPrice = parseFloat(dish.price) * parseInt(quantity || 0);
    let activeSpecifications = specifications.filter(spec => spec.quantity > 0);

    activeSpecifications.forEach(spec => {
        const ingredientPrice = parseFloat(spec.price);
        totalPrice += (ingredientPrice / 10) * spec.quantity;
    });

    return (
        <ScrollView style={styles.container}>
            
                <Text style={styles.subHeader}>Nombre de portion</Text>
                <TextInput 
                    style={styles.input}
                    value={quantity} 
                    onChangeText={setQuantity}
                    keyboardType='numeric' 
                    placeholder='Entrez le nombre de portion' />

                <DateTimeSelector
                    initialDate={deliveryDate}
                    onDateChange={setDeliveryDate}
                    initialTime={deliveryTime}
                    onTimeChange={setDeliveryTime}
                />

                <Text style={styles.subHeader}>Spécifications(+ ou - d'ingrédients)</Text>
                <ScrollView style={styles.specificationsContainer}>
                    {specifications.map((ingredient, index) => {
                        const isDisabled = disabledIngredientIds.includes(ingredient.id); // Check if the ingredient ID is in the disabled list
                        
                        return (
                            <View key={index} style={styles.ingredientItem}>
                                <Text style={styles.ingredientName}>{ingredient.title}</Text>
                                <View style={styles.quantityContainer}>
                                    <TouchableOpacity 
                                        onPress={() => !isDisabled && decreaseQuantity(index)} 
                                        style={[styles.circleButton, isDisabled && styles.disabledButton]}
                                        disabled={isDisabled}
                                    >
                                        <Text style={[styles.circleButtonText, isDisabled && styles.disabledText]}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={[styles.quantity, isDisabled && styles.disabledText]}>{ingredient.quantity}</Text>
                                    <TouchableOpacity 
                                        onPress={() => !isDisabled && increaseQuantity(index)} 
                                        style={[styles.circleButton, isDisabled && styles.disabledButton]}
                                        disabled={isDisabled}
                                    >
                                        <Text style={[styles.circleButtonText, isDisabled && styles.disabledText]}>+</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginLeft: 60 }}>
                                    <Text style={styles.price}>${(parseFloat(ingredient.price) / 10).toFixed(2)}</Text>
                                </View>
                            </View>
                        );
                    })}

                    <TouchableOpacity style={styles.addToBasketButton} onPress={handleAddToBasket}>
                        <Text style={styles.buttonText}>{existingItem ? `Mettre à jour ($${totalPrice.toFixed(2)})` : `Ajouter au panier ($${totalPrice.toFixed(2)})`}</Text>
                    </TouchableOpacity>
                </ScrollView>
            
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f9f9f9'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        fontSize: 16,
        borderRadius: 5,
        backgroundColor: 'white',
        marginBottom: 15,
        fontFamily: 'Ebrima',
        alignSelf: 'center',
    },
    subHeader: {
        fontSize: 20,
        fontFamily: 'Ebrimabd',
        alignSelf: 'center',
    },
    ingredientItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
    },
    ingredientName: {
        fontSize: 16,
        flex: 1,
        fontFamily: 'Ebrima',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantity: {
        marginHorizontal: 5,
        fontSize: 16,
        fontFamily: 'Ebrimabd',
    },
    circleButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#15FCFC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleButtonText: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Ebrima',
    },
    disabledButton: {
        backgroundColor: '#ddd', // Greyed out color
    },
    disabledText: {
        color: '#999', // Greyed out text
    },
    price: {
        fontSize: 14,
        color: 'gray',
        marginTop: 5,
        fontFamily: 'Ebrimabd',
    },
    addToBasketButton: {
        backgroundColor: '#15FCFC',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 30,
    },
    buttonText: {
        fontSize: 18,
        color: 'black',
        fontFamily: 'Ebrimabd',
    },
});

export default MealTab;
