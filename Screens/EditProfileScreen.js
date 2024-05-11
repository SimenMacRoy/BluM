import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import UserContext from './UserContext'; // Adjust the path if necessary

const EditProfileScreen = ({ navigation }) => {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const [name, setName] = useState(currentUser.name);
    const [surname, setSurname] = useState(currentUser.surname);
    const [email, setEmail] = useState(currentUser.email);
    const [phoneNumber, setPhoneNumber] = useState(currentUser.phone_number);
    const [postalAddress, setPostalAddress] = useState(currentUser.postal_address);
    const [countryOfOrigin, setCountryOfOrigin] = useState(currentUser.country_of_origin);
    const [profilePicture, setProfilePicture] = useState(currentUser.profile_picture);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const handleProfilePictureChange = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setProfilePicture(result.uri);
        }
    };

    const handleSubmit = async () => {
        // Assuming the backend expects a POST request to update the profile
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
                }),
            });

            const data = await response.json();
            if (data.success) {
                Alert.alert("Profile Updated", "Your profile has been updated successfully.");
                setCurrentUser({ ...currentUser, name, surname, email, phone_number: phoneNumber, postal_address: postalAddress, country_of_origin: countryOfOrigin, profilePicture });
                navigation.goBack();
            } else {
                Alert.alert("Update Failed", data.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert("Update Failed", "An error occurred while updating the profile.");
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleProfilePictureChange}>
                <Image source={{ uri: profilePicture || 'https://via.placeholder.com/150' }} style={styles.profileImage} />
            </TouchableOpacity>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
            <TextInput style={styles.input} value={surname} onChangeText={setSurname} placeholder="Surname" />
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
            <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} placeholder="Phone Number" keyboardType="phone-pad" />
            <TextInput style={styles.input} value={postalAddress} onChangeText={setPostalAddress} placeholder="Postal Address" />
            <TextInput style={styles.input} value={countryOfOrigin} onChangeText={setCountryOfOrigin} placeholder="Country of Origin" />
            
            <Button title="Update Profile" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    input: {
        width: '90%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        padding: 10,
    },
});

export default EditProfileScreen;
