import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import config from '../config';

const CodeVerificationScreen = ({ route }) => {
    const { contact } = route.params; // Update to contact
    const [code, setCode] = useState(['', '', '', '', '']);
    const navigation = useNavigation();
    const inputRefs = useRef([]);

    const handleChangeText = (text, index) => {
        let newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        // Focus the next input field if the current one is filled
        if (text && index < 4) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleVerifyCode = async () => {
        const fullCode = code.join('');
        try {
            const response = await fetch(`${config.apiBaseUrl}/verify-reset-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contact, code: fullCode }) // Update to contact
            });

            const data = await response.json();
            if (data.success) {
                navigation.navigate('ResetPasswordScreen', { token: data.token });
            } else {
                Alert.alert('Erreur', data.error);
            }
        } catch (error) {
            console.error('Error during code verification:', error);
            Alert.alert('Error', 'An error occurred while verifying the code.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Code de vérification</Text>
            <Text style={styles.description}>Entrez le code de 5 chiffres envoyé à {contact}</Text>
            <View style={styles.codeContainer}>
                {code.map((digit, index) => (
                    <TextInput
                        key={index}
                        style={styles.inputBox}
                        value={digit}
                        onChangeText={(text) => handleChangeText(text, index)}
                        keyboardType="numeric"
                        maxLength={1}
                        ref={(el) => inputRefs.current[index] = el}
                    />
                ))}
            </View>
            <Pressable
                style={styles.buttonVerify}
                onPress={handleVerifyCode}
            >
                <Text style={styles.buttonText}>Vérifier le code</Text>
            </Pressable>
        </View>
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
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'Ebrima'
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    inputBox: {
        width: 50,
        height: 50,
        borderRadius: 10,
        borderColor: 'gray',
        borderWidth: 1,
        textAlign: 'center',
        fontSize: 24,
        fontFamily: 'Ebrima'
    },
    buttonVerify: {
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

export default CodeVerificationScreen;
