import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, TextInput, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome } from '@expo/vector-icons';
import Header from './Header';
import BasketContext from './BasketContext';
import DateTimeSelector from '../utils/DateTimeSelector';
import { useNavigation } from '@react-navigation/native';

const IngredientsDetailScreen = ({ route }) => {
    const { ingredientId } = route.params;
    const { basketItems, addToBasket } = useContext(BasketContext);
    const [quantity, setQuantity] = useState(1);
    const [ingredient, setIngredient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [existingItem, setExistingItem] = useState(null);
    const navigation = useNavigation();
    const [deliveryDate, setDeliveryDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [deliveryTime, setDeliveryTime] = useState('');
    const [deliveryTimes, setDeliveryTimes] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    function formatPackage(quantity, packageDescription) {
        const parts = packageDescription.split(' ');
        if (quantity > 1) {
            if (parts[0] === 'Sac') {
                if (parts[3]){
                    return `${quantity} sacs de ${parts[2]} ${parts[3]}`;
                }
                else {
                    return `${quantity} sacs de ${parts[2]}`;
                }
            } else if (parts[0] === 'Unité') {
                return `${quantity} unités`;
            } else {
                return `${quantity} ${packageDescription}s`;
            }
        } else {
            return `${quantity} ${packageDescription}`;
        }
    }

    useEffect(() => {
        const fetchIngredient = async () => {
            try {
                const response = await fetch(`http://192.168.69.205:3006/api/ingredients/${ingredientId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch ingredient');
                }
                const data = await response.json();
                setIngredient(data);
                setLoading(false);

                const foundItem = basketItems.find(item => item.id === ingredientId);
                if (foundItem) {
                    setExistingItem(foundItem);
                    setQuantity(foundItem.quantity);
                    setDeliveryDate(new Date(foundItem.deliveryDate));
                    setDeliveryTime(foundItem.deliveryTime || '');
                    setTotalPrice(foundItem.totalPrice || 0);
                } else {
                    setExistingItem(null);
                    calculateTotalPrice(data.price, quantity);
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
        const currentHour = currentTime.getHours();
        const startTime = (currentHour >= 22 || currentHour < 7) ? new Date(currentTime.setHours(7, 0, 0, 0)) : new Date(currentTime);

        startTime.setMinutes(Math.ceil(startTime.getMinutes() / 15) * 15);

        for (let i = 0; i < 10; i++) {
            const nextTime = new Date(startTime);
            nextTime.setMinutes(startTime.getMinutes() + i * 15);
            times.push(nextTime.toTimeString().substring(0, 5));
        }

        setDeliveryTimes(times);
        setDeliveryTime(times[0]);
    };

    const calculateTotalPrice = (price, qty) => {
        setTotalPrice((price * qty).toFixed(2));
    };

    const handleAddToBasket = () => {
        if (ingredient && quantity > 0) {
            const totalPrice = parseFloat(ingredient.price) * parseInt(quantity);
            addToBasket({
                ...ingredient,
                quantity,
                totalPrice: totalPrice.toFixed(2),
                deliveryDate: deliveryDate.toISOString(),
                deliveryTime
            });
            Alert.alert(existingItem ? `L'item ${ingredient.title} a été modifié par ${quantity} quantités.` : `Ajout de ${quantity} quantités de ${ingredient.title} à votre panier.`);
        } else {
            Alert.alert('Please select a quantity before adding to basket.');
        }
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || deliveryDate;
        if (currentDate < new Date()) {
            Alert.alert('Date Invalide', 'Veuillez choisir une date future.');
            setShowDatePicker(false);
            return;
        }
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
                        <TouchableOpacity onPress={() => {
                            const newQuantity = Math.max(1, quantity - 1);
                            setQuantity(newQuantity);
                            calculateTotalPrice(ingredient.price, newQuantity);
                        }}>
                            <FontAwesome name="minus" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{quantity}</Text>
                        <TouchableOpacity onPress={() => {
                            const newQuantity = quantity + 1;
                            setQuantity(newQuantity);
                            calculateTotalPrice(ingredient.price, newQuantity);
                        }}>
                            <FontAwesome name="plus" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.packageContainer}>
                        <Text style={styles.packageInfo}>
                            {formatPackage(quantity, ingredient.package)} = ${(ingredient.price * quantity).toFixed(2)}
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
                        <Text style={styles.addToBasketText}>{existingItem ? `Modifier le panier ($${totalPrice})` : `Ajouter au panier ($${totalPrice})`}</Text>
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
        fontFamily: 'Ebrima',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    quantity: {
        fontSize: 20,
        marginHorizontal: 10,
        fontFamily: 'Ebrima',
    },
    addToBasketButton: {
        backgroundColor: '#15FCFC',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
    },
    addToBasketText: {
        color: 'black',
        fontSize: 18,
        fontFamily: 'Ebrimabd',
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
        fontFamily: 'Ebrima',
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
        fontFamily: 'Ebrima',
    },
    subHeader: {
        fontSize: 18,
        fontFamily: 'Ebrimabd',
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
    },
    foodTitle: {
        fontFamily: 'Ebrimabd',
        fontSize: 22,
    }
});

export default IngredientsDetailScreen;
