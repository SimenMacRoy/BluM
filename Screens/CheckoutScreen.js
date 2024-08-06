import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import BasketContext from './BasketContext';
import UserContext from './UserContext';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

const CheckoutScreen = () => {
  const { basketItems, clearBasket } = useContext(BasketContext);
  const { currentUser } = useContext(UserContext);
  const { confirmPayment } = useStripe();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [addressName, setAddressName] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [cardDetails, setCardDetails] = useState({});
  const [countdown, setCountdown] = useState(5);
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const storedUserInfo = await AsyncStorage.getItem(`userInfo_${currentUser.userID}`);
        if (storedUserInfo) {
          const { name, surname, email, line1, line2, addressName, city, province, postalCode } = JSON.parse(storedUserInfo);
          setName(name || '');
          setSurname(surname || '');
          setEmail(email || '');
          setLine1(line1 || '');
          setLine2(line2 || '');
          setAddressName(addressName || '');
          setCity(city || '');
          setProvince(province || '');
          setPostalCode(postalCode || '');
        }
      } catch (error) {
        console.error('Failed to load user info from storage:', error);
      }
    };

    loadUserInfo();
  }, [currentUser]);

  const saveUserInfo = async () => {
    try {
      const userInfo = { name, surname, email, line1, line2, addressName, city, province, postalCode };
      await AsyncStorage.setItem(`userInfo_${currentUser.userID}`, JSON.stringify(userInfo));
    } catch (error) {
      console.error('Failed to save user info to storage:', error);
    }
  };

  useEffect(() => {
    saveUserInfo();
  }, [name, surname, email, line1, line2, addressName, city, province, postalCode]);

  const subtotal = basketItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = subtotal * 0.3;
  const taxTPS = subtotal * 0.05;
  const taxTVQ = subtotal * 0.09975;
  const total = subtotal + deliveryFee + taxTPS + taxTVQ;

  const startCountdown = () => {
    setShowCountdown(true);
    setCountdown(7);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handlePayment();
          setShowCountdown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelPayment = () => {
    setShowCountdown(false);
  };

  const handlePayment = async () => {
    console.log('Card details:', cardDetails);

    if (!cardDetails.complete) {
      Alert.alert('Payment error', 'Please fill in your card details completely.');
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(total * 100), // amount in cents
          name,
          surname,
          postalAddress: `${line1}, ${line2}, ${addressName}, ${city}, ${province}, ${postalCode}`,
          email,
          orderDetails: basketItems,
          userID: currentUser.userID, // Replace with actual user ID
          memberID: 20000 // Replace with actual member ID
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      if (!clientSecret) {
        throw new Error('Failed to fetch client secret');
      }

      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            name: `${name} ${surname}`,
            email: email,
            address: {
              line1: line1,
              line2: line2,
              city: city,
              state: province,
              postalCode: postalCode,
            },
          },
        },
      });

      if (error) {
        Alert.alert('Payment failed', error.message);
      } else if (paymentIntent) {
        // Payment succeeded, handle receipt and email
        Alert.alert('Payment successful', 'Your order has been placed.');
        clearBasket(); // Clear the basket after successful payment
      }
    } catch (error) {
      Alert.alert('Payment error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header />
      <Text style={styles.infoHeader}>Entrez vos informations</Text>
      <View style={styles.userInfoSection}>
        <Text style={styles.label}>Nom</Text>
        <TextInput style={styles.input} onChangeText={setName} value={name} placeholder="Nom" />
        <Text style={styles.label}>Prénom</Text>
        <TextInput style={styles.input} onChangeText={setSurname} value={surname} placeholder="Prénom" />
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} onChangeText={setEmail} value={email} placeholder="Email" keyboardType="email-address" />
        <Text style={styles.label}>Adresse Ligne 1</Text>
        <TextInput style={styles.input} onChangeText={setLine1} value={line1} placeholder="Adresse Ligne 1" />
        <Text style={styles.label}>Adresse Ligne 2 (optionnelle)</Text>
        <TextInput style={styles.input} onChangeText={setLine2} value={line2} placeholder="Adresse Ligne 2" />
        <Text style={styles.label}>Nom de l'adresse</Text>
        <TextInput style={styles.input} onChangeText={setAddressName} value={addressName} placeholder="Nom de l'adresse" />
        <Text style={styles.label}>Ville</Text>
        <TextInput style={styles.input} onChangeText={setCity} value={city} placeholder="Ville" />
        <Text style={styles.label}>Province</Text>
        <TextInput style={styles.input} onChangeText={setProvince} value={province} placeholder="Province" />
        <Text style={styles.label}>Code Postal</Text>
        <TextInput style={styles.input} onChangeText={setPostalCode} value={postalCode} placeholder="Code Postal" />
      </View>
      <CardField
        postalCodeEnabled={true}
        placeholder={{
          number: '1234 1234 1234 1234',
        }}
        cardStyle={styles.cardField}
        style={styles.cardContainer}
        onCardChange={(cardDetails) => {
          setCardDetails(cardDetails);
        }}
      />
      <View style={styles.orderSummarySection}>
        <Text style={styles.sommaireText}>Sommaire</Text>
        <Text style={styles.summaryText}>Sub-total: ${subtotal.toFixed(2)}</Text>
        <Text style={styles.summaryText}>Frais de livraison: ${deliveryFee.toFixed(2)}</Text>
        <Text style={styles.summaryText}>Taxe (TPS): ${taxTPS.toFixed(2)}</Text>
        <Text style={styles.summaryText}>Taxe (TVQ): ${taxTVQ.toFixed(2)}</Text>
        <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
      </View>
      {showCountdown ? (
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>Payment will proceed in {countdown} seconds...</Text>
          <TouchableOpacity style={styles.cancelButton} onPress={cancelPayment}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.payButton} onPress={startCountdown}>
          <Text style={styles.payButtonText}>Payer</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
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
  orderSummarySection: {
    marginBottom: 10,
    padding: 20,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'Ebrima',
  },
  totalText: {
    fontSize: 20,
    marginTop: 10,
    fontFamily: 'Ebrimabd',
  },
  sommaireText: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: 'Ebrimabd',
  },
  payButton: {
    backgroundColor: '#15FCFC',
    padding: 15,
    margin: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  payButtonText: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Ebrimabd',
  },
  cardContainer: {
    height: 50,
    marginVertical: 30,
    marginHorizontal: 20,
  },
  cardField: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    fontFamily: 'Ebrima',
  },
  countdownContainer: {
    backgroundColor: '#FFF0F0',
    padding: 20,
    margin: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'Ebrimabd',
  },
  cancelButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Ebrimabd',
  },
});

export default CheckoutScreen;
