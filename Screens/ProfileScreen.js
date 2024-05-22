import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button } from 'react-native';
import UserContext from './UserContext'; // Adjust the path if necessary

const ProfileScreen = ({ navigation }) => {
    const { currentUser: user } = useContext(UserContext);
    const [blumers, setBlumers] = useState([]);
    const [blumees, setBlumees] = useState([]);

    const handlePublish = () => {
        navigation.navigate('PublishScreen');
    };

    useEffect(() => {
        const fetchBlumersBlumees = async () => {
            try {
                const [blumersResponse, blumeesResponse] = await Promise.all([
                    fetch(`http://192.168.69.205:3006/api/users/${user.userID}/blumers`),
                    fetch(`http://192.168.69.205:3006/api/users/${user.userID}/blumees`)
                ]);

                const [blumersData, blumeesData] = await Promise.all([
                    blumersResponse.json(),
                    blumeesResponse.json()
                ]);

                setBlumers(blumersData);
                setBlumees(blumeesData);
            } catch (error) {
                console.error('Error fetching Blumers and Blumees:', error);
            }
        };

        if (user) fetchBlumersBlumees();
    }, [user]);

    if (!user) {
        return <Text style={styles.loadingText}>Loading...</Text>;
    }

    const handleEditProfile = () => {
        // Navigate to the EditProfileScreen
        navigation.navigate('EditProfileScreen');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileSection}>
                <Image source={{ uri: user.profile_picture }} style={styles.profileImage} />
                <Text style={styles.name}>{user.surname} {user.name}</Text>
                <Button title="Modifier Profile" onPress={handleEditProfile} color="#FF1493" fontFamily="Ebrima" />
                <Button title="Publier" onPress={handlePublish} color="#15FCFC"/>
                <View style={styles.infoRow}>
                    <Text style={styles.infoText}>Blumers: {blumers.length}</Text>
                    <Text style={styles.infoText}>Blumees: {blumees.length}</Text>
                </View>
                <View style={styles.details}>
                    <Text style={styles.detailText}>Email: {user.email}</Text>
                    <Text style={styles.detailText}>Phone: {user.phone_number}</Text>
                    <Text style={styles.detailText}>Postal Address: {user.postal_address}</Text>
                    <Text style={styles.detailText}>Country of Origin: {user.country_of_origin}</Text>
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
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 10,
        paddingVertical: 10,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        borderRadius: 10,
    },
    infoText: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Ebrima',
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
        marginVertical: 5,
        fontFamily: 'Ebrima',
    },
});

export default ProfileScreen;
