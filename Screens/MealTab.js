import React, { useState, useContext, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import BasketContext from './BasketContext';

const MealTab = ({ route }) => {
    const { dish, existingItem } = route.params; // Extract dish and existingItem from route.params
    const { addToBasket } = useContext(BasketContext);
    const [quantity, setQuantity] = useState(existingItem ? existingItem.quantity.toString() : ''); // Set initial quantity from existingItem if available
    const [deliveryTime, setDeliveryTime] = useState(existingItem ? existingItem.deliveryTime : '');
    const [deliveryDate, setDeliveryDate] = useState(existingItem ? new Date(existingItem.deliveryDate) : new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [specifications, setSpecifications] = useState(existingItem ? existingItem.specifications : []); // Set initial specifications from existingItem if available
    const [deliveryTimes, setDeliveryTimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!dish) return; // If no dish details provided, return

        // Generate delivery times based on the provided dish's deliveryDate
        generateDeliveryTimes(new Date(dish.deliveryDate));
    }, []);

    useEffect(() => {
        if (!existingItem) return; // If no existingItem provided, return

        // Set initial state based on existingItem
        setQuantity(existingItem.quantity.toString());
        setDeliveryTime(existingItem.deliveryTime);
        setDeliveryDate(new Date(existingItem.deliveryDate));
        setSpecifications(existingItem.specifications);
    }, [existingItem]);

    useEffect(() => {
        // Fetch ingredients from backend
        const fetchIngredients = async () => {
            try {
                const response = await fetch(`http://192.168.69.205:3006/api/dishes/${dish.id}/ingredients`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSpecifications(data.map(ingredient => ({ ...ingredient, quantity: 0 })));
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch ingredients:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchIngredients();
    }, [dish.id]);

    const generateDeliveryTimes = (chosenTime) => {
        const proposedTimes = [];
        const currentMinutes = chosenTime.getMinutes();
        const roundedMinutes = Math.ceil(currentMinutes / 5) * 5; // Round up to the nearest multiple of 5
        const roundedTime = new Date(chosenTime);
        roundedTime.setMinutes(roundedMinutes);

        for (let i = 3; i < 13; i++) {
            const nextTime = new Date(roundedTime);
            nextTime.setMinutes(nextTime.getMinutes() + i * 15);
            proposedTimes.push(nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }

        setDeliveryTimes(proposedTimes);
    };

    const handleAddToBasket = () => {
        if (!quantity || quantity <= 0) {
            alert('Please enter a valid quantity');
            return;
        }

        let totalPrice = parseFloat(dish.price) * parseInt(quantity);

        specifications.forEach(ingredient => {
            totalPrice += parseFloat(ingredient.price)/10 * ingredient.quantity;
        });

        addToBasket({ ...dish, quantity: parseInt(quantity), deliveryTime, deliveryDate, specifications, type: 'Plat', totalPrice });
        alert('Dish added to basket!');
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || deliveryDate;
        setShowDatePicker(false);
        setDeliveryDate(currentDate);
    };

    const handleTimeSelect = (time) => {
        setDeliveryTime(time);
    };

    useEffect(() => {
        generateDeliveryTimes(new Date());
    }, [deliveryDate]);

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

    return (
        <ScrollView style={styles.container}>
            <View>
                <Text style={styles.subHeader}>Nombre de portion</Text>
                <TextInput 
                    style={styles.input}
                    value={quantity} 
                    onChangeText={setQuantity}
                    keyboardType='numeric' 
                    placeholder='Entrez le nombre de portion' />

                <Text style={styles.subHeader}>Heure de livraison</Text>
                <View style={styles.timeContainer}>
                    {deliveryTimes.map((time, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={[styles.timeButton, deliveryTime === time && styles.selectedTime]}
                            onPress={() => handleTimeSelect(time)}
                        >
                            <Text style={styles.timeText}>{time}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.subHeader}>La date</Text>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.dateText}>
                        {showDatePicker ? 'Choose Date' : `Date selectionnée: ${deliveryDate.toLocaleDateString()}`}
                    </Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={deliveryDate}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}

                <Text style={styles.subHeader}>Spécifications(+ ou - d'ingrédients)</Text>
                <View style={styles.specificationsContainer}>
                    {specifications.map((ingredient, index) => (
                        <View key={index} style={styles.ingredientItem}>
                            <Text style={styles.ingredientName}>{ingredient.title}</Text>
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity onPress={() => decreaseQuantity(index)} style={styles.circleButton}>
                                    <Text style={styles.circleButtonText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.quantity}>{ingredient.quantity}</Text>
                                <TouchableOpacity onPress={() => increaseQuantity(index)} style={styles.circleButton}>
                                    <Text style={styles.circleButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginLeft: 60}}>
                                <Text style={styles.price}>${(parseFloat(ingredient.price) / 10).toFixed(2)}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.addToBasketButton} onPress={handleAddToBasket}>
                    <Text style={styles.buttonText}>Ajouter au panier</Text>
                </TouchableOpacity>
            </View>
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
    },
    timeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    timeButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#15FCFC',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginBottom: 10,
    },
    selectedTime: {
        backgroundColor: '#15B8B8',
    },
    timeText: {
        fontSize: 16,
        color: 'white',
    },
    dateButton: {
        padding: 10,
        backgroundColor: '#e7e7e7',
        borderRadius: 5,
        marginBottom: 15,
    },
    dateText: {
        fontSize: 16,
        textAlign: 'center',
    },
    addToBasketButton: {
        backgroundColor: '#15FCFC',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    subHeader: {
        fontSize: 20,
    },
    specificationsContainer: {
        maxHeight: 200,
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
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantity: {
        marginHorizontal: 5,
        fontSize: 16,
        fontWeight: 'bold',
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
    },
    price: {
        fontSize: 14,
        color: 'gray',
        marginTop: 5,
        fontWeight: 'bold',
    },
});

export default MealTab;
