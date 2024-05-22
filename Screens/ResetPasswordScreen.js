// ResetPasswordScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ResetPasswordScreen = ({ route }) => {
    const { token } = route.params;
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        console.log('Token received:', token);
    }, [token]);

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Erreur de validation', 'Les mots de passe ne correspondent pas.');
            return;
        }

        try {
            const response = await fetch(`http://192.168.69.205:3006/api/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password, confirmPassword }),
            });

            const data = await response.json();
            if (data.success) {
                Alert.alert('Succès', 'Mot de passe réinitialisé avec succès.');
                navigation.navigate('LoginScreen');
            } else {
                Alert.alert('Erreur', 'Échec de la réinitialisation du mot de passe. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Erreur lors de la réinitialisation du mot de passe:', error);
            Alert.alert('Erreur', 'Une erreur est survenue lors de la réinitialisation du mot de passe.');
        }
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
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <TextInput
                placeholder="Confirmez votre nouveau mot de passe"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button title="Réinitialiser le mot de passe" onPress={handleResetPassword} />
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
});

export default ResetPasswordScreen;
