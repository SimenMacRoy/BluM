// ProfileScreen.js
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import UserContext from './UserContext'; // Adjust the path if necessary
import { FontAwesome } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
    const { currentUser: user } = useContext(UserContext);

    if (!user) {
        return <Text style={styles.loadingText}>Loading...</Text>;
    }

    const handleEditProfile = () => {
        navigation.navigate('EditProfileScreen');
    };

    const handleProfileImagePress = () => {
        navigation.navigate('ImageScreen', { imageUrl: user.profile_picture, posterName: `${user.surname} ${user.name}` });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={30} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerText}></Text>
            </View>
            <View style={styles.profileSection}>
                <TouchableOpacity onPress={handleProfileImagePress}>
                    <Image source={{ uri: user.profile_picture }} style={styles.profileImage} />
                </TouchableOpacity>
                <Text style={styles.name}>{user.surname} {user.name}</Text>
                <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                    <FontAwesome name="edit" size={20} color="#FFFFFF" />
                    <Text style={styles.editButtonText}>Modifier Profile</Text>
                </TouchableOpacity>
                <View style={styles.details}>
                    <Text style={styles.detailText}><Text style={styles.boldText}>Email:</Text> {user.email}</Text>
                    <Text style={styles.detailText}><Text style={styles.boldText}>Téléphone:</Text> {user.phone_number}</Text>
                    <Text style={styles.detailText}><Text style={styles.boldText}>Adresse Postale:</Text> {user.postal_address}</Text>
                    <Text style={styles.detailText}><Text style={styles.boldText}>Pays d'origine:</Text> {user.country_of_origin}</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        marginRight: 10,
        marginTop: 10,
    },
    headerText: {
        fontFamily: 'Ebrimabd',
        color: '#333',
    },
    loadingText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginTop: 20,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 20,
        paddingTop: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
        borderColor: '#ccc',
        borderWidth: 3,
    },
    name: {
        fontSize: 24,
        fontFamily: 'Ebrimabd',
        color: '#333',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#15FCFC',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 10,
    },
    editButtonText: {
        fontSize: 16,
        color: 'white',
        marginLeft: 10,
        fontFamily: 'Ebrimabd',
    },
    details: {
        alignItems: 'flex-start',
        backgroundColor: '#ffffff',
        padding: 10,
        width: '100%',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    detailText: {
        fontSize: 16,
        color: '#333',
        marginVertical: 20,
        fontFamily: 'Ebrima',
    },
    boldText: {
        fontFamily: 'Ebrimabd',
    },
});

export default ProfileScreen;
