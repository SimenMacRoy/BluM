import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SectionList } from 'react-native';
import UserContext from './UserContext'; // Adjust the path if necessary
import { FontAwesome } from '@expo/vector-icons';
import config from '../config';

const ProfileScreen = ({ navigation }) => {
    const { currentUser: user } = useContext(UserContext);
    const [likedDishes, setLikedDishes] = useState([]);

    useEffect(() => {
        if (user) {
            fetchLikedDishes(user.userID);
        }
    }, [user]);

    const fetchLikedDishes = async (userID) => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/user/${userID}/liked-dishes`);
            const data = await response.json();
            setLikedDishes(data);
        } catch (error) {
            console.error('Failed to fetch liked dishes:', error);
        }
    };

    if (!user) {
        return <Text style={styles.loadingText}>Loading...</Text>;
    }

    const handleEditProfile = () => {
        navigation.navigate('EditProfileScreen');
    };

    const handleProfileImagePress = () => {
        navigation.navigate('ImageScreen', { imageUrl: user.profile_picture, posterName: `${user.surname} ${user.name}` });
    };

    const handleDishPress = (dishId) => {
        navigation.navigate('RecipeScreenDetail', { dishId });
    };

    const renderProfileSection = () => (
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
    );

    const renderDishItem = ({ item }) => (
        <TouchableOpacity style={styles.dishCard} onPress={() => handleDishPress(item.id)}>
            <Image source={{ uri: item.image }} style={styles.dishImage} />
            <Text style={styles.dishName}>{item.title}</Text>
            <View style={styles.dishInfo}>
                <Text style={styles.countryFlag}>{item.countryFlag}</Text>
                <Text style={styles.likesText}>{item.dish_blums} blums</Text>
            </View>
        </TouchableOpacity>
    );

    const sections = [
        { title: '', data: [user], renderItem: renderProfileSection },
        { title: 'Vos repas', data: likedDishes, renderItem: renderDishItem }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={30} color="#333" paddingTop={20} />
                </TouchableOpacity>
            </View>
            <SectionList
                sections={sections}
                keyExtractor={(item, index) => `${item.title}-${index}`}
                renderItem={({ item, section }) => section.renderItem({ item })}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionTitle}>{title}</Text>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingTop: 30
    },
    backButton: {
        marginRight: 10,
    },
    headerText: {
        fontFamily: 'Ebrimabd',
        fontSize: 20,
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
        width: '100%',
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
        marginLeft: 20,
        marginRight: 20
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
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Ebrimabd',
        color: '#333',
        marginBottom: 10,
        marginTop: 0,
        alignSelf: 'center'
    },
    row: {
        flex: 1,
        justifyContent: 'space-around',
    },
    dishCard: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 10,
        paddingTop: 0,
        margin: 5,
        alignItems: 'center',
        width: '45%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    dishImage: {
        width: '112%',
        height: 110,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginBottom: 5,
    },
    dishName: {
        fontSize: 16,
        fontFamily: 'Ebrimabd',
        color: '#333',
        textAlign: 'center',
    },
    dishInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    countryFlag: {
        fontSize: 20,
        padding: 5
    },
    likesText: {
        fontSize: 14,
        fontFamily: 'Ebrima',
        color: '#666',
        marginLeft: 10,
    },
});

export default ProfileScreen;
