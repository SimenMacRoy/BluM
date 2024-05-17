import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome } from '@expo/vector-icons';
import Header from './Header';
import BasketContext from './BasketContext';
import DateTimeSelector from '../utils/DateTimeSelector';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const IngredientsDetailScreen = ({ route }) => {
    const { ingredientId } = route.params;
    const { basketItems, addToBasket } = useContext(BasketContext);
    const [quantity, setQuantity] = useState(1);
    const [ingredient, setIngredient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [existingItem, setExistingItem] = useState(null);
    const navigation = useNavigation(); // Initialize navigation
    const [deliveryDate, setDeliveryDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [deliveryTime, setDeliveryTime] = useState('');
    const [deliveryTimes, setDeliveryTimes] = useState([]);

    function formatPackage(quantity, packageDescription) {
        // Sépare le package en "prefix" et "unit" (ex. '1 sac de', '3kg')
        const parts = packageDescription.split(' ');
        if (quantity > 1) {
            if (parts[0] === 'Sac') {
                // Pluralize and adjust the prefix based on French grammar rules
                return `${quantity} sacs de ${parts[2]} ${parts[3]}`;
            } else if (parts[0] === 'Unité') {
                // Simple pluralization for "unité"
                return `${quantity} unités`;
            } else {
                // Default pluralization logic
                return `${quantity} ${packageDescription}s`;
            }
        } else {
            // No change needed for singular
            return `${quantity} ${packageDescription}`;
        }
    
    }
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
                const foundItem = basketItems.find(item => item.id === ingredientId);
                if (foundItem) {
                    setExistingItem(foundItem);
                    setQuantity(foundItem.quantity);
                    setDeliveryDate(new Date(foundItem.deliveryDate));
                    setDeliveryTime(foundItem.deliveryTime || '');
                } else {
                    setExistingItem(null);
                }
                generateDeliveryTimes();
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchIngredient();
    }, [ingredientId, basketItems]);

    const generateDeliveryTimes = () => {
        let times = [];
        let currentTime = new Date();
        currentTime.setMinutes(currentTime.getMinutes() + 30 - (currentTime.getMinutes() % 5));
        for (let i = 0; i < 8; i++) { // 6 times within 3 hours
            let newTime = new Date(currentTime.getTime() + i * 30 * 60000);
            times.push(newTime.toTimeString().substring(0, 5));
        }
        setDeliveryTimes(times);
        setDeliveryTime(times[0]);
    };

    const handleAddToBasket = () => {
        if (ingredient && quantity > 0) {
            let totalPrice = parseFloat(ingredient.price) * parseInt(quantity);
            addToBasket({
                ...ingredient,
                quantity,
                totalPrice: totalPrice.toFixed(2),
                deliveryDate: deliveryDate.toISOString(),
                deliveryTime
            });
            alert(existingItem ? `L'item ${ingredient.title} a été modifié par ${quantity} quantités.` : `Ajout de ${quantity} quantités de ${ingredient.title} à votre panier.`);
        } else {
            alert('Please select a quantity before adding to basket.');
        }
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || deliveryDate;
        setShowDatePicker(false);
        setDeliveryDate(currentDate);
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
                        <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                            <FontAwesome name="minus" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{quantity}</Text>
                        <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                            <FontAwesome name="plus" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.packageContainer}>
                        <Text style={styles.packageInfo}>
                            {formatPackage(quantity, ingredient.package)} = ${(ingredient.price * quantity).toFixed(2)}$
                        </Text>
                    </View>


                    <DateTimeSelector
                        initialDate={deliveryDate}
                        onDateChange={setDeliveryDate}
                        initialTime={deliveryTime}
                        onTimeChange={setDeliveryTime}
                        deliveryTimes={deliveryTimes}
                    />

                    <TouchableOpacity style={styles.addToBasketButton} onPress={handleAddToBasket}>
                        <Text style={styles.addToBasketText}>{existingItem ? 'Modifier le panier' : 'Ajouter au panier'}</Text>
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
    subHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    timeButton: {
        backgroundColor: '#15FCFC',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        margin: 5,
    },
    selectedTime: {
        backgroundColor: '#15B8B8',
    },
    timeText: {
        color: 'white',
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        fontSize: 16,
        borderRadius: 5,
        backgroundColor: 'white',
        marginBottom: 15,
    }
});

export default IngredientsDetailScreen;
