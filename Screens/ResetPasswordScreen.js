import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import config from '../config';

const ResetPasswordScreen = ({ route }) => {
    const { token } = route.params;
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation();

    const [isUpperCase, setIsUpperCase] = useState(false);
    const [isLowerCase, setIsLowerCase] = useState(false);
    const [isNumber, setIsNumber] = useState(false);
    const [isSpecialChar, setIsSpecialChar] = useState(false);
    const [isMinLength, setIsMinLength] = useState(false);

    useEffect(() => {
        console.log('Token received:', token);
    }, [token]);

    useEffect(() => {
        setIsUpperCase(/[A-Z]/.test(password));
        setIsLowerCase(/[a-z]/.test(password));
        setIsNumber(/\d/.test(password));
        setIsSpecialChar(/[@$!%*?&#]/.test(password));
        setIsMinLength(password.length >= 8);
    }, [password]);

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Erreur de validation', 'Les mots de passe ne correspondent pas.');
            return;
        }

        if (!isUpperCase || !isLowerCase || !isNumber || !isSpecialChar || !isMinLength) {
            Alert.alert('Erreur de validation', 'Le mot de passe ne respecte pas tous les critères.');
            return;
        }

        try {
            const response = await fetch(`${config.apiBaseUrl}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password, confirmPassword }),
            });

            const responseText = await response.text();  // Read the response as text
            console.log('Response text:', responseText);  // Log the response text

            // Try to parse the response as JSON
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                throw new Error('Invalid JSON response');
            }

            if (data.success) {
                Alert.alert('Succès', 'Mot de passe réinitialisé avec succès.');
                navigation.navigate('LoginScreen');
            } else {
                Alert.alert('Erreur', data.error);
            }
        } catch (error) {
            console.error('Erreur lors de la réinitialisation du mot de passe:', error);
            Alert.alert('Erreur', 'Une erreur est survenue lors de la réinitialisation du mot de passe.');
        }
    };

    const renderHint = (condition, text) => {
        return (
            <View style={styles.hintContainer}>
                <FontAwesome name="circle" size={12} color={condition ? 'green' : 'red'} />
                <Text style={styles.hintText}>{text}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nouveau mot de passe</Text>
            <TextInput
                placeholder="Entrez votre nouveau mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            {renderHint(isUpperCase, 'Au moins une lettre majuscule')}
            {renderHint(isLowerCase, 'Au moins une lettre minuscule')}
            {renderHint(isNumber, 'Au moins un chiffre')}
            {renderHint(isSpecialChar, 'Au moins un caractère spécial')}
            {renderHint(isMinLength, 'Au moins 8 caractères')}
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <TextInput
                placeholder="Confirmez votre nouveau mot de passe"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
            />
            <Pressable 
                style={styles.buttonReset}
                onPress={handleResetPassword}
            >
                <Text style={styles.buttonText}>Réinitialiser le mot de passe</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontFamily: 'Ebrima',
    },
    input: {
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
    },
    hintContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
    },
    hintText: {
        marginLeft: 5,
        fontSize: 14,
        fontFamily: 'Ebrima',
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

export default ResetPasswordScreen;
