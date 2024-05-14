import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Header from './Header';
import SearchBar from './SearchBar';
import MealTab from './MealTab';
import IngredientsTab from './IngredientsTab';
import RecipeTab from './RecipeTab';

const RecipeScreenDetail = ({ route }) => {
    const { dishId } = route.params;

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
                <View style={styles.foodContainer}>
                    <Image source={{ uri: dish.image }} style={styles.foodImage} />
                    <Text style={styles.foodTitle}>{dish.title}</Text>
                </View>
            )}
            {dish && <TabNavigator dish={dish} />}
        </View>
    );
};

const Tab = createMaterialTopTabNavigator();

const TabNavigator = ({ dish }) => {
    return (
        <Tab.Navigator
            tabBarOptions={{
                style: { backgroundColor: 'white' },
                activeTintColor: 'black',
                indicatorStyle: { backgroundColor: '#15FCFC' },
                labelStyle: { fontWeight: 'bold' }
            }}
        >
            <Tab.Screen name="Recette" component={RecipeTab} initialParams={{ dish }} />
            <Tab.Screen name="Ingredients" component={IngredientsTab} initialParams={{ dish }} />
            <Tab.Screen name="Commander Repas" component={MealTab} initialParams={{ dish }} />
            
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    foodContainer: {
        backgroundColor: '#15FCFC',
        alignItems: 'center',
        padding: 10,
        borderRadius: 30,
        margin: 10
    },
    foodImage: {
        width: 125,
        height: 125,
        resizeMode: 'cover',
        borderRadius: 50
    },
    foodTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10
    }
});

export default RecipeScreenDetail;
