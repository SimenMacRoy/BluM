// ForgotPasswordScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const navigation = useNavigation();

    const handlePasswordReset = async () => {
        try {
            const response = await fetch('http://192.168.69.205:3006/api/request-reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (data.success) {
                navigation.navigate('CodeVerificationScreen', { email });
            } else {
                Alert.alert('Erreur', data.error);
            }
        } catch (error) {
            console.error('Error during password reset:', error);
            Alert.alert('Erreur', 'An error occurred while trying to reset the password.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Mot de passe oublié</Text>
            <TextInput 
                style={styles.inputText}
                value={email}
                onChangeText={setEmail}
                placeholder="Entrez votre courriel"
                keyboardType="email-address"
            />
            <Pressable 
                style={styles.buttonReset}
                onPress={handlePasswordReset}
            >
                <Text style={styles.buttonText}>Réinitialiser le mot de passe</Text>
            </Pressable>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Ebrimabd',
        textAlign: 'center',
        marginVertical: 20,
    },
    inputText: {
        width: '100%',
        height: 50,
        borderRadius: 20,
        borderColor: 'gray',
        borderWidth: 1,
        backgroundColor: 'white',
        fontSize: 16,
        padding: 10,
        marginBottom: 20,
        fontFamily: 'Ebrima'
    },
    buttonReset: {
        width: '100%',
        height: 50,
        borderRadius: 20,
        backgroundColor: '#15FCFC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'black',
        fontSize: 18,
        fontFamily: 'Ebrima'
    },
});

export default ForgotPasswordScreen;
