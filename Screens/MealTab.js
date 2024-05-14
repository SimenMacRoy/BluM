import React, { useState, useContext } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome } from '@expo/vector-icons';
import BasketContext from './BasketContext';

const MealTab = ({ route }) => {
    const { dish } = route.params;
    const { addToBasket } = useContext(BasketContext);
    const [quantity, setQuantity] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [deliveryDate, setDeliveryDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [specifications, setSpecifications] = useState('');
    const deliveryTimes = ['30 mins', '1 hour', '1 hour 30 mins'];

    const handleAddToBasket = () => {
        if (!quantity || quantity <= 0) {
            alert('Please enter a valid quantity');
            return;
        }
        addToBasket({ ...dish, quantity: parseInt(quantity), deliveryTime, deliveryDate, specifications, type: 'Plat' });
        alert('Dish added to basket!');
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || deliveryDate;
        setShowDatePicker(false);
        setDeliveryDate(currentDate);
    };

    return (
        <ScrollView style={styles.container}>
            <View>
                <Text>Nombre de portion</Text>
                <TextInput 
                    style={styles.input}
                    value={quantity} 
                    onChangeText={setQuantity}
                    keyboardType='numeric' 
                    placeholder='Enter number of portions' />

                <Text>Heure de livraison</Text>
                <View style={styles.timeContainer}>
                    {deliveryTimes.map((time, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={[styles.timeButton, deliveryTime === time && styles.selectedTime]}
                            onPress={() => setDeliveryTime(time)}
                        >
                            <Text style={styles.timeText}>{time}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text>La date</Text>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.dateText}>
                        {showDatePicker ? 'Choose Date' : `Selected Date: ${deliveryDate.toLocaleDateString()}`}
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

                <Text>Specifications</Text>
                <TextInput 
                    style={styles.input}
                    value={specifications} 
                    onChangeText={setSpecifications}
                    placeholder='Any specific requirements' />

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
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    timeButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#e7e7e7',
    },
    selectedTime: {
        backgroundColor: '#15FCFC', // Highlight the selected time with the specified color
    },
    timeText: {
        fontSize: 16,
        color: '#333',
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
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    }
});

export default MealTab;
