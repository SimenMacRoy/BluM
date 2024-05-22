import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const RegistrationScreen = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [addressName, setAddressName] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryOfOrigin, setCountryOfOrigin] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
        if (!name || !surname || !email || !addressLine1 || !city || !province || !postalCode || !phoneNumber || !countryOfOrigin || !profilePicture || !password || !confirmPassword) {
            Alert.alert('Erreur de validation', 'Tous les champs sont obligatoires.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erreur de validation', 'Les mots de passe ne correspondent pas.');
            return;
        }

        const postalAddress = `${addressLine1}, ${addressLine2}, ${addressName}, ${city}, ${province}, ${postalCode}`;
        
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
                Alert.alert('Succès', 'Inscription réussie. Veuillez vous connecter.');
                navigation.navigate('LoginScreen');
            } else {
                Alert.alert('Erreur d\'enregistrement', 'Échec de l\'enregistrement. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement:', error);
            Alert.alert('Erreur', 'Une erreur est survenue lors de l\'enregistrement.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require('C:\\Users\\Mac Roy\\Documents\\bluMApp\\assets\\bluMlogo.png')} style={styles.logo} />
                <Text style={styles.welcomeText}>Bienvenue, inscrivez-vous !</Text>
            </View>
            
            <TouchableOpacity onPress={handlePickImage} style={styles.imagePickerButton}>
                <Text style={styles.imagePickerButtonText}>Choisir une photo de profil</Text>
            </TouchableOpacity>
            {profilePicture && <Image source={{ uri: profilePicture }} style={styles.profileImage} />}
            
            <Text style={styles.label}>Nom</Text>
            <TextInput placeholder="Nom" value={name} onChangeText={setName} style={styles.input} />

            <Text style={styles.label}>Prénom</Text>
            <TextInput placeholder="Prénom" value={surname} onChangeText={setSurname} style={styles.input} />

            <Text style={styles.label}>Email</Text>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />

            <Text style={styles.label}>Adresse postale</Text>
            <TextInput placeholder="Ligne 1" value={addressLine1} onChangeText={setAddressLine1} style={styles.input} />
            <TextInput placeholder="Ligne 2(facultatif)" value={addressLine2} onChangeText={setAddressLine2} style={styles.input} />
            <TextInput placeholder="Nom de l'adresse" value={addressName} onChangeText={setAddressName} style={styles.input} />
            <TextInput placeholder="Ville" value={city} onChangeText={setCity} style={styles.input} />
            <TextInput placeholder="Province" value={province} onChangeText={setProvince} style={styles.input} />
            <TextInput placeholder="Code postal" value={postalCode} onChangeText={setPostalCode} style={styles.input} />

            <Text style={styles.label}>Numéro de téléphone</Text>
            <TextInput placeholder="Numéro de téléphone" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" style={styles.input} />

            <Text style={styles.label}>Pays d'origine</Text>
            <TextInput placeholder="Pays d'origine" value={countryOfOrigin} onChangeText={setCountryOfOrigin} style={styles.input} />

            <Text style={styles.label}>Mot de passe</Text>
            <TextInput placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <TextInput placeholder="Confirmer le mot de passe" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />

            <TouchableOpacity style={styles.registerButton} onPress={handleRegistration}>
                    <Text style={styles.registerButtonText}>S'inscrire</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
        borderRadius: 50,
    },
    welcomeText: {
        fontSize: 24,
        fontFamily: 'Ebrimabd',
    },
    label: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: 'Ebrima',
    },
    input: {
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        fontFamily: 'Ebrima',
    },
    imagePickerButton: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#15FCFC',
        borderRadius: 5,
    },
    imagePickerButtonText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Ebrima',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginVertical: 10,
        alignSelf: 'center',
    },
    registerButtonText: {
        fontSize: 18,
        color: 'black',
        fontFamily: 'Ebrima',
    },
    registerButton: {
        backgroundColor: '#15FCFC',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30
    }
});

export default RegistrationScreen;
