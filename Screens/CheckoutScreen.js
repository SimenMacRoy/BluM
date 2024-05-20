import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import BasketContext from './BasketContext';
import Header from './Header';

const CheckoutScreen = () => {
    const { basketItems, clearBasket } = useContext(BasketContext);
    const { confirmPayment } = useStripe();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [postalAddress, setPostalAddress] = useState('');
    const [email, setEmail] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const subtotal = basketItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryFee = subtotal * 0.3;
    const taxTPS = subtotal * 0.05;
    const taxTVQ = subtotal * 0.09975;
    const total = subtotal + deliveryFee + taxTPS + taxTVQ;

    const fetchAddressSuggestions = (query) => {
        const addressList = ['123 Main St, Springfield', '456 Elm St, Shelbyville', '789 Maple Ave, Capital City'];
        if (query) {
            const filteredSuggestions = addressList.filter((address) => address.toLowerCase().includes(query.toLowerCase()));
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const formatCardNumber = (number) => {
        return number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
    };

    const handleCardNumberChange = (text) => {
        setCardNumber(formatCardNumber(text));
    };

    const handleExpirationDateChange = (text) => {
        if (text.length === 2 && !text.includes('/')) {
            setExpirationDate(text + '/');
        } else {
            setExpirationDate(text);
        }
    };

    const handlePayment = async () => {
        try {
            const response = await fetch('http://192.168.69.205:3006/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: total * 100 }), // amount in cents
            });

            const { clientSecret } = await response.json();

            if (!clientSecret) {
                throw new Error('Failed to fetch client secret');
            }

            const { error, paymentIntent } = await confirmPayment(clientSecret, {
                type: 'Card',
                billingDetails: {
                    name: `${name} ${surname}`,
                    email: email,
                    address: {
                        line1: postalAddress,
                    },
                },
            });

            if (error) {
                Alert.alert('Payment failed', error.message);
            } else if (paymentIntent) {
                await fetch('http://192.168.69.205:3006/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name,
                        surname,
                        postalAddress,
                        email,
                        orderDetails: JSON.stringify(basketItems),
                    }),
                });
                Alert.alert('Payment successful', 'Your order has been placed.');
                clearBasket();
            }
        } catch (error) {
            Alert.alert('Payment error', error.message);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => {
            setPostalAddress(item);
            setSuggestions([]);
        }}>
            <Text style={styles.suggestionText}>{item}</Text>
        </TouchableOpacity>
    );

    const data = [
        { key: 'header', render: () => <Header /> },
        { key: 'infoHeader', render: () => <Text style={styles.infoHeader}>Enter your information</Text> },
        {
            key: 'userInfoSection', render: () => (
                <View style={styles.userInfoSection}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput style={styles.input} onChangeText={setName} value={name} placeholder="Name" />
                    <Text style={styles.label}>Surname</Text>
                    <TextInput style={styles.input} onChangeText={setSurname} value={surname} placeholder="Surname" />
                    <Text style={styles.label}>Postal Address</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => {
                            setPostalAddress(text);
                            fetchAddressSuggestions(text);
                        }}
                        value={postalAddress}
                        placeholder="Postal Address"
                    />
                    {suggestions.length > 0 && (
                        <FlatList
                            data={suggestions}
                            keyExtractor={(item) => item}
                            renderItem={renderItem}
                            style={styles.autocompleteContainer}
                        />
                    )}
                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.input} onChangeText={setEmail} value={email} placeholder="Email" keyboardType="email-address" />
                    <Text style={styles.label}>Credit Card Number</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={handleCardNumberChange}
                        value={cardNumber}
                        placeholder="Credit Card Number"
                        keyboardType="numeric"
                        maxLength={19}
                    />
                    <Text style={styles.label}>Expiration Date (MM/YY)</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={handleExpirationDateChange}
                        value={expirationDate}
                        placeholder="Expiration Date (MM/YY)"
                        keyboardType="numeric"
                        maxLength={5}
                    />
                    <Text style={styles.label}>CVV</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setCvv}
                        value={cvv}
                        placeholder="CVV"
                        keyboardType="numeric"
                        maxLength={3}
                        secureTextEntry
                    />
                </View>
            )
        },
        {
            key: 'orderSummarySection', render: () => (
                <View style={styles.orderSummarySection}>
                    <Text style={styles.summaryText}>Sub-total: ${subtotal.toFixed(2)}</Text>
                    <Text style={styles.summaryText}>Delivery Fee: ${deliveryFee.toFixed(2)}</Text>
                    <Text style={styles.summaryText}>Tax (TPS): ${taxTPS.toFixed(2)}</Text>
                    <Text style={styles.summaryText}>Tax (TVQ): ${taxTVQ.toFixed(2)}</Text>
                    <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
                </View>
            )
        },
        {
            key: 'payButton', render: () => (
                <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
                    <Text style={styles.payButtonText}>Pay</Text>
                </TouchableOpacity>
            )
        }
    ];

    return (
        <FlatList
            data={data}
            renderItem={({ item }) => item.render()}
            keyExtractor={(item) => item.key}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    infoHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        justifyContent: 'center',
        padding: 5,
        margin: 10,
    },
    userInfoSection: {
        marginBottom: 20,
        padding: 20,
    },
    orderSummarySection: {
        marginBottom: 20,
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    autocompleteContainer: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'gray',
    },
    suggestionText: {
        padding: 10,
        fontSize: 16,
        borderBottomWidth: 1,
        borderColor: 'gray',
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
        margin: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    payButtonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default CheckoutScreen;
