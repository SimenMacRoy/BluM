import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import BasketContext from './BasketContext';
import Header from './Header';
import SearchBar from './SearchBar';

const CheckoutScreen = () => {
    // User and payment information states

    const { basketItems } = useContext(BasketContext);

    const { clearBasket } = useContext(BasketContext);

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [postalAddress, setPostalAddress] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvv, setCvv] = useState('');

    // Example order details (replace with real data)
    const subtotal = basketItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryFee = subtotal * 0.3; // Example delivery fee (30%)
    const tip = 5; // Example tip
    const taxTPS = subtotal * 0.05; // Example TPS (5%)
    const taxTVQ = subtotal * 0.09975; // Example TVQ (9.975%)
    const total = subtotal + deliveryFee + taxTPS + taxTVQ;

    const handlePayment = () => {
        // Validate credit card information
        // Process payment using payment gateway API
        console.log('Processing payment...');
        // Handle response and navigate or alert accordingly
        clearBasket(); // Clear the basket after payment
    };

    return (
        <ScrollView style={styles.container}>
            <Header />
            <SearchBar />
            <View style={styles.userInfoSection}>
                <TextInput style={styles.input} onChangeText={setName} value={name} placeholder="Name" />
                <TextInput style={styles.input} onChangeText={setSurname} value={surname} placeholder="Surname" />
                <TextInput style={styles.input} onChangeText={setPostalAddress} value={postalAddress} placeholder="Postal Address" />
                <TextInput 
                    style={styles.input}
                    onChangeText={setCardNumber}
                    value={cardNumber}
                    placeholder="Credit Card Number"
                    keyboardType="numeric"
                    maxLength={16} // Assuming a standard 16 digit card number
                />
                <TextInput 
                    style={styles.input}
                    onChangeText={setExpirationDate}
                    value={expirationDate}
                    placeholder="Expiration Date (MM/YY)"
                    maxLength={5} // Format: MM/YY
                />
                <TextInput 
                    style={styles.input}
                    onChangeText={setCvv}
                    value={cvv}
                    placeholder="CVV"
                    keyboardType="numeric"
                    maxLength={4} // 3 or 4 digits depending on the card
                    secureTextEntry
                />
            </View>

            <View style={styles.orderSummarySection}>
                <Text style={styles.summaryText}>Sub-total: ${subtotal.toFixed(2)}</Text>
                <Text style={styles.summaryText}>Delivery Fee: ${deliveryFee.toFixed(2)}</Text>
                <Text style={styles.summaryText}>Tax (TPS): ${taxTPS.toFixed(2)}</Text>
                <Text style={styles.summaryText}>Tax (TVQ): ${taxTVQ.toFixed(2)}</Text>
                <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
                <Text style={styles.payButtonText}>Payer</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    userInfoSection: {
        marginBottom: 20,
        padding: 20,
    },
    orderSummarySection: {
        marginBottom: 20,
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    summaryText: {
        fontSize: 16,
        marginBottom: 5,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    payButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    payButtonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default CheckoutScreen;
