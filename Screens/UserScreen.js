import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

const UserScreen = ({ route }) => {
    const { userData } = route.params;

    // Check if userData is correctly passed
    if (!userData) {
        return <Text style={styles.errorText}>User data is not available.</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: userData.profile_picture || 'https://via.placeholder.com/150' }} style={styles.profileImage} />
            <Text style={styles.name}>{userData.name} {userData.surname}</Text>
            <Text style={styles.info}>Email: {userData.email || 'Not provided'}</Text>
            <Text style={styles.info}>Phone: {userData.phone_number || 'Not provided'}</Text>
            <Text style={styles.info}>Postal Address: {userData.postal_address || 'Not provided'}</Text>
            <Text style={styles.info}>Country of Origin: {userData.country_of_origin || 'Not provided'}</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
        alignSelf: 'center',  // Center the profile image
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',  // Center the name
        marginBottom: 10,
    },
    info: {
        fontSize: 18,
        marginBottom: 5,
        textAlign: 'left',  // Align text to the left
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    // Add other styles as needed
});

export default UserScreen;
