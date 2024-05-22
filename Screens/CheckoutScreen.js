import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import BasketContext from './BasketContext';
import Header from './Header';
import { FontAwesome } from '@expo/vector-icons';

const CheckoutScreen = () => {
    const { basketItems, clearBasket } = useContext(BasketContext);
    const { confirmPayment } = useStripe();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [line1, setLine1] = useState('');
    const [line2, setLine2] = useState('');
    const [addressName, setAddressName] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [postalCode, setPostalCode] = useState('');
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
                        line1: `${line1}, ${line2}, ${addressName}, ${city}, ${province}, ${postalCode}`,
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
                        postalAddress: `${line1}, ${line2}, ${addressName}, ${city}, ${province}, ${postalCode}`,
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
        { key: 'infoHeader', render: () => <Text style={styles.infoHeader}>Entrez vos informations</Text> },
        {
            key: 'userInfoSection', render: () => (
                <View style={styles.userInfoSection}>
                    <Text style={styles.label}>Nom</Text>
                    <TextInput style={styles.input} onChangeText={setName} value={name} placeholder="Nom" />
                    <Text style={styles.label}>Prénom</Text>
                    <TextInput style={styles.input} onChangeText={setSurname} value={surname} placeholder="Prénom" />
                    <Text style={styles.label}>Adresse Postale</Text>
                    <Text style={styles.label}>Ligne 1</Text>
                    <TextInput style={styles.input} onChangeText={setLine1} value={line1} placeholder="Ligne 1" />
                    <Text style={styles.label}>Ligne 2(facultatif)</Text>
                    <TextInput style={styles.input} onChangeText={setLine2} value={line2} placeholder="Ligne 2" />
                    <Text style={styles.label}>Nom de l'adresse</Text>
                    <TextInput style={styles.input} onChangeText={setAddressName} value={addressName} placeholder="Nom de l'adresse" />
                    <Text style={styles.label}>Ville</Text>
                    <TextInput style={styles.input} onChangeText={setCity} value={city} placeholder="Ville" />
                    <Text style={styles.label}>Province</Text>
                    <TextInput style={styles.input} onChangeText={setProvince} value={province} placeholder="Province" />
                    <Text style={styles.label}>Code postal</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => {
                            setPostalCode(text);
                            fetchAddressSuggestions(text);
                        }}
                        value={postalCode}
                        placeholder="Code postal"
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
                    <Text style={styles.label}>Numéro de carte</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={handleCardNumberChange}
                        value={cardNumber}
                        placeholder="Numéro de carte"
                        keyboardType="numeric"
                        maxLength={19}
                    />
                    <Text style={styles.label}>Date d'expiration (MM/AA)</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={handleExpirationDateChange}
                        value={expirationDate}
                        placeholder="Date d'expiration (MM/AA)"
                        keyboardType="numeric"
                        maxLength={5}
                    />
                    <Text style={styles.label}>CVV</Text>
                    <View style={styles.cvvContainer}>
                        <TextInput
                            style={styles.inputCvv}
                            onChangeText={setCvv}
                            value={cvv}
                            placeholder="CVV"
                            keyboardType="numeric"
                            maxLength={3}
                            secureTextEntry
                        />
                        <FontAwesome name="lock" size={24} color="black" style={styles.cvvIcon} />
                    </View>
                </View>
            )
        },
        {
            key: 'orderSummarySection', render: () => (
                <View style={styles.orderSummarySection}>
                    <Text style={styles.sommaireText}>Sommaire</Text>
                    <Text style={styles.summaryText}>Sub-total: ${subtotal.toFixed(2)}</Text>
                    <Text style={styles.summaryText}>Frais de livraison: ${deliveryFee.toFixed(2)}</Text>
                    <Text style={styles.summaryText}>Taxe (TPS): ${taxTPS.toFixed(2)}</Text>
                    <Text style={styles.summaryText}>Taxe (TVQ): ${taxTVQ.toFixed(2)}</Text>
                    <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
                </View>
            )
        },
        {
            key: 'payButton', render: () => (
                <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
                    <Text style={styles.payButtonText}>Payer</Text>
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
        fontFamily: 'Ebrima',
        justifyContent: 'center',
        padding: 5,
        margin: 10,
    },
    userInfoSection: {
        padding: 20,
        paddingBottom: 5,
    },
    orderSummarySection: {
        marginBottom: 10,
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontFamily: 'Ebrima',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        fontFamily: 'Ebrima',
    },
    inputCvv: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
        fontFamily: 'Ebrima',
        flex: 1,
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
        fontFamily: 'Ebrima',
    },
    summaryText: {
        fontSize: 16,
        marginBottom: 5,
        fontFamily: 'Ebrima',
    },
    totalText: {
        fontSize: 18,
        marginTop: 10,
        fontFamily: 'Ebrima',
    },
    sommaireText: {
        fontSize: 20,
        marginBottom: 10,
        fontFamily: 'Ebrimabd',
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
        fontFamily: 'Ebrima',
    },
    cvvContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cvvIcon: {
        marginLeft: 10,
    },
});

export default CheckoutScreen;
