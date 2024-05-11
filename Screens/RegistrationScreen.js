// RegistrationScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const RegistrationScreen = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [postalAddress, setPostalAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryOfOrigin, setCountryOfOrigin] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setProfilePicture(result.assets[0].uri);
        }
    };

    const handleRegistration = async () => {
        if (!name || !surname || !email || !postalAddress || !phoneNumber || !countryOfOrigin || !profilePicture || !password) {
            Alert.alert('Validation Error', 'All fields are required.');
            return;
        }

        const userData = {
            name,
            surname,
            email,
            postalAddress,
            phoneNumber,
            countryOfOrigin,
            profilePicture,
            password,
        };

        try {
            const response = await fetch('http://192.168.69.205:3006/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            if (data.success) {
                navigation.navigate('MainTabs');
            } else {
                Alert.alert('Registration Error', 'Failed to register. Please try again.');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            Alert.alert('Error', 'An error occurred while trying to register.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
            <TextInput placeholder="Surname" value={surname} onChangeText={setSurname} style={styles.input} />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
            <TextInput placeholder="Postal Address" value={postalAddress} onChangeText={setPostalAddress} style={styles.input} />
            <TextInput placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" style={styles.input} />
            <TextInput placeholder="Country of Origin" value={countryOfOrigin} onChangeText={setCountryOfOrigin} style={styles.input} />
            
            <TouchableOpacity onPress={handlePickImage} style={styles.imagePickerButton}>
                <Text style={styles.imagePickerButtonText}>Pick Profile Picture</Text>
            </TouchableOpacity>
            {profilePicture && <Image source={{ uri: profilePicture }} style={styles.profileImage} />}

            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
            <Button title="Register" onPress={handleRegistration} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    input: {
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
    },
    imagePickerButton: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    imagePickerButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginVertical: 10,
    },
});

export default RegistrationScreen;
