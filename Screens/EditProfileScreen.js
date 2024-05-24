import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity, Alert, ScrollView, Switch, Platform, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import UserContext from './UserContext'; // Adjust the path if necessary
import { FontAwesome } from '@expo/vector-icons';
import ModalDropdown from 'react-native-modal-dropdown'; // Import ModalDropdown component
import countries from '../countries.json'; // Import the countries data

const EditProfileScreen = ({ navigation }) => {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const [name, setName] = useState(currentUser.name);
    const [surname, setSurname] = useState(currentUser.surname);
    const [email, setEmail] = useState(currentUser.email);
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [addressName, setAddressName] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(currentUser.phone_number);
    const [countryOfOrigin, setCountryOfOrigin] = useState(currentUser.country_of_origin);
    const [profilePicture, setProfilePicture] = useState(currentUser.profile_picture);
    const [password, setPassword] = useState(currentUser.password);

    const [modifyPassword, setModifyPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        const addressParts = currentUser.postal_address.split(', ');
        setAddressLine1(addressParts[0]);
        setAddressLine2(addressParts[1]);
        setAddressName(addressParts[2]);
        setCity(addressParts[3]);
        setProvince(addressParts[4]);
        setPostalCode(addressParts[5]);

        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

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
        if (newPassword === password){
            Alert.alert('Erreur de validation', 'Le nouveau mot de passe doit differé de lancien');
            return ;
        }
    };

    const handleSubmit = async () => {
        const postalAddress = `${addressLine1}, ${addressLine2}, ${addressName}, ${city}, ${province}, ${postalCode}`;

        if (modifyPassword && (!currentPassword || !newPassword)) {
            Alert.alert('Erreur de validation', 'Tous les champs de mot de passe sont obligatoires.');
            return;
        }

        try {
            const response = await fetch(`http://192.168.69.205:3006/api/users/${currentUser.userID}/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    surname,
                    email,
                    phone_number: phoneNumber,
                    postal_address: postalAddress,
                    country_of_origin: countryOfOrigin,
                    profile_picture: profilePicture,
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });

            const data = await response.json();
            console.log("Response data:", data);

            if (data.success) {
                Alert.alert("Profile Modifié", "Votre profile a été mis à jour avec succès.");
                navigation.goBack();
            } else {
                Alert.alert("Modification echouée", data.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert("Update Failed", `An error occurred while updating the profile: ${error.message}`);
        }
    };

    const renderCountryOption = (option) => {
        return (
            <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText}>{option.flag} {option.name}</Text>
            </View>
        );
    };

    const handleCountrySelect = (index, value) => {
        setCountryOfOrigin(`${value.flag} ${value.name}`);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={30} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Modifiez Votre Profile</Text>
            </View>
            <TouchableOpacity onPress={handlePickImage}>
                <Image source={{ uri: profilePicture || 'https://via.placeholder.com/150' }} style={styles.profileImage} />
            </TouchableOpacity>
            <Text style={styles.label}>Nom</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />

            <Text style={styles.label}>Prénom</Text>
            <TextInput style={styles.input} value={surname} onChangeText={setSurname} placeholder="Surname" />

            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />

            <Text style={styles.label}>Adresse postale</Text>
            <TextInput placeholder="Ligne 1" value={addressLine1} onChangeText={setAddressLine1} style={styles.input} />
            <TextInput placeholder="Ligne 2(facultatif)" value={addressLine2} onChangeText={setAddressLine2} style={styles.input} />
            <TextInput placeholder="Nom de l'adresse" value={addressName} onChangeText={setAddressName} style={styles.input} />
            <TextInput placeholder="Ville" value={city} onChangeText={setCity} style={styles.input} />
            <TextInput placeholder="Province" value={province} onChangeText={setProvince} style={styles.input} />
            <TextInput placeholder="Code postal" value={postalCode} onChangeText={setPostalCode} style={styles.input} />

            <Text style={styles.label}>Numéro de téléphone</Text>
            <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} placeholder="Phone Number" keyboardType="phone-pad" />

            <Text style={styles.label}>Pays d'origine</Text>
            <ModalDropdown
                options={countries}
                renderRow={renderCountryOption}
                onSelect={(index, value) => handleCountrySelect(index, value)}
                defaultValue={countryOfOrigin ? `${countryOfOrigin}` : 'Sélectionnez un pays'}
                textStyle={styles.input}
                dropdownStyle={styles.dropdown}
                renderButtonText={(rowData) => `${rowData.flag} ${rowData.name}`} // Add this line
            />

            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Modifier le mot de passe</Text>
                <Switch value={modifyPassword} onValueChange={setModifyPassword} />
            </View>

            {modifyPassword && (
                <>
                    <Text style={styles.label}>Ancien mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        placeholder="Ancien mot de passe"
                        secureTextEntry
                    />

                    <Text style={styles.label}>Nouveau mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Nouveau mot de passe"
                        secureTextEntry
                    />
                    <Pressable onPress={() => navigation.navigate('ForgotPasswordScreen')}>
                        <Text style={styles.forgotPasswordText}>Mot de passe oublié?</Text>
                    </Pressable>
                </>
            )}

            <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
                <Text style={styles.updateButtonText}>Mettre à jour</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    header: {
        marginBottom: 20,
        marginTop: 30
    },
    backButton: {
        marginRight: 10,
    },
    headerText: {
        fontSize: 24,
        fontFamily: 'Ebrimabd',
        alignSelf: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
        alignSelf: 'center',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        padding: 10,
        fontFamily: 'Ebrima',
    },
    label: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: 'Ebrimabd',
    },
    updateButton: {
        backgroundColor: '#15FCFC',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    updateButtonText: {
        fontSize: 18,
        color: 'black',
        fontFamily: 'Ebrima',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    switchLabel: {
        fontSize: 16,
        fontFamily: 'Ebrima',
    },
    dropdown: {
        width: '80%',
        maxHeight: 200,
        marginTop: 10,
        marginLeft: 0,
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    dropdownItemText: {
        fontSize: 16,
        fontFamily: 'Ebrima'
    },
    forgotPasswordText: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: 'Ebrima',
        color: 'blue',
        textDecorationLine: 'underline',
    }
});

export default EditProfileScreen;
