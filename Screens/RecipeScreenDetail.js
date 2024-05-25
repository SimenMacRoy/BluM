import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { FontAwesome } from '@expo/vector-icons';
import Header from './Header';
import SearchBar from './SearchBar';
import MealTab from './MealTab';
import IngredientsTab from './IngredientsTab';
import RecipeTab from './RecipeTab';
import { useNavigation } from '@react-navigation/native';

const RecipeScreenDetail = ({ route }) => {
    const { dishId, item, updateBasketItem, itemToUpdate } = route.params || {};

    const navigation = useNavigation();

    const [dish, setDish] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data from backend
        const fetchDish = async () => {
            try {
                const response = await fetch(`http://192.168.69.205:3006/api/dishes/${dishId}`); // Update with actual URL
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setDish(data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch dish:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchDish();

        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => {
                    // Call the function here
                    updateBasketItem(item); // Pass the item to updateBasketItem
                }}>
                    <Text>Modify Basket</Text> {/* Change the button text */}
                </TouchableOpacity>
            ),
        });
    }, [dishId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#15FCFC" />;
    }

    if (error) {
        return (
            <View>
                <Text style={{ color: 'red' }}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header />
            {dish && (
                <View style={styles.detailContainer}>
                     <TouchableOpacity onPress={() => navigation.navigate('ImageScreen', { imageUrl: dish.image, posterName: dish.title })}>
                        <Image source={{ uri: dish.image }} style={styles.foodImage} />
                    </TouchableOpacity>
                    
                    <View style={styles.titleContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                            <Text style={styles.foodTitle}>{dish.title}</Text>
                            <Text style={styles.countryFlag}>{dish.countryFlag}</Text>
                        </View>
                        <View style={styles.iconTextContainer}>
                            
                            <Text style={styles.iconText}>{dish.description}</Text>
                        </View>
                        <View style={styles.iconTextContainer}>
                            <FontAwesome name="star" size={24} color="black" />
                            <Text style={styles.iconText}>{dish.difficulty}</Text>
                        </View>
                        <View style={styles.iconTextContainer}>
                            <FontAwesome name="info-circle" size={24} color="black" />
                            <Text style={styles.iconText}>{dish.nutritiveFacts} calories</Text>
                        </View>
                    </View>
                </View>
            )}
            
            {dish && <TabNavigator dish={dish} itemToUpdate={itemToUpdate}/>}
            
        </View>
    );
};

const Tab = createMaterialTopTabNavigator();

const TabNavigator = ({ dish, itemToUpdate }) => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: 'black',
                tabBarLabelStyle: {
                    fontFamily: 'Ebrimabd',
                },
                tabBarIndicatorStyle: {
                    backgroundColor: '#15FCFC'
                },
                tabBarStyle: {
                    backgroundColor: 'white'
                },
            }}
        >
            <Tab.Screen name="Recette" component={RecipeTab} initialParams={{ dish }} />
            <Tab.Screen name="Ingredients" component={IngredientsTab} initialParams={{ dish }} />
            <Tab.Screen name="Commander Repas" component={MealTab} initialParams={{ dish, existingItem: itemToUpdate }} />
        </Tab.Navigator>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    detailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
        backgroundColor: '#15FCFC',
    },
    titleContainer: {
        flex: 1,
        marginLeft: 10,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    foodImage: {
        width: 120,
        aspectRatio: 1,
        borderRadius: 60,
    },
    countryFlag: {
        fontSize: 20,
        padding: 5
    },
    foodTitle: {
        fontSize: 30,
        fontFamily: 'Ebrimabd',
        color: 'black',
    },
    iconTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    iconText: {
        fontSize: 16,
        color: 'black',
        marginLeft: 5,
        fontFamily: 'Ebrima'
    },
});

export default RecipeScreenDetail;
