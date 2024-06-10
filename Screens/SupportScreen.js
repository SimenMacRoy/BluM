import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Linking from 'expo-linking';
import Header from './Header'; // Adjust the path if necessary
import UserContext from './UserContext';
import config from '../config';

const SupportScreen = () => {
    const { currentUser: user } = useContext(UserContext);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState(user ? user.email : '');

    const handleSendEmail = async () => {
        if (!subject || !message || !email) {
            Alert.alert("Error", "All fields are required.");
            return;
        }

        try {
            const response = await fetch(`${config.apiBaseUrl}/send-support-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, message, email }),
            });
            const data = await response.json();
            if (data.success) {
                Alert.alert("Success", "Email sent successfully.");
                setSubject('');
                setMessage('');
            } else {
                Alert.alert("Error", "Failed to send email.");
            }
        } catch (error) {
            console.error('Error sending email:', error);
            Alert.alert("Error", "Failed to send email.");
        }
    };

    const handleCall = () => {
        Linking.openURL('tel:8197018694');
    };

    return (
        <View style={styles.container}>
            <Header />
            <View style={{ padding: 20}}>
            <Text style={styles.title}>Aide et Support</Text>
            <Text style={styles.label}>Contactez-nous par courriel</Text>
            <TextInput
                style={styles.input}
                placeholder="Votre courriel"
                value={email}
                onChangeText={setEmail}
                editable={false}
            />
            <TextInput
                style={styles.input}
                placeholder="Objet"
                value={subject}
                onChangeText={setSubject}
            />
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Décrivez votre problème"
                value={message}
                onChangeText={setMessage}
                multiline
            />
            <TouchableOpacity style={styles.button} onPress={handleSendEmail}>
                <Text style={styles.buttonText}>Envoyer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.callButton]} onPress={handleCall}>
                <Icon name="phone" size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>Nous appeler</Text>
            </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontFamily: 'Ebrimabd',
        color: '#333',
        textAlign: 'center',
        marginVertical: 20,
    },
    label: {
        fontSize: 18,
        fontFamily: 'Ebrimabd',
        color: '#333',
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
        fontFamily: 'Ebrima',
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
    },
    textArea: {
        height: 100,
    },
    button: {
        backgroundColor: '#15FCFC',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    callButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#15FCFC',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'Ebrimabd',
    },
});

export default SupportScreen;
