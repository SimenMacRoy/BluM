import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Image, Linking, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const RecipeTab = ({ route }) => {
    const { dish } = route.params;
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await fetch(`http://192.168.69.205:3006/api/dishes/${dish.id}/ingredients`); // Update with actual URL
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setIngredients(data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch ingredients:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchIngredients();
    }, [dish.id]);

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
        <ScrollView>
            <View style={styles.tabContent}>
                {dish.portions && (
                    <View style={styles.rowContainer}>
                        <Text style={styles.label}>Nombre de portions</Text>
                        <FontAwesome name="users" size={24} color="gold" />
                    </View>
                )}
                {dish.portions && <Text style={styles.portion}>{dish.portions} personnes</Text>}
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>Ingrédients</Text>
                    <FontAwesome name="shopping-basket" size={24} color="gold" />
                </View>
                {ingredients.map((ingredient, index) => (
                    <View key={index} style={styles.ingredientRow}>
                        <Image source={{ uri: ingredient.image }} style={styles.ingredientImage} />
                        <View>
                            <Text style={styles.portion}>
                                {ingredient.title}
                            </Text>
                            <Text style={styles.portion}>
                                ({ingredient.quantity})
                            </Text>
                        </View>
                    </View>
                ))}
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>Recommandations</Text>
                    <FontAwesome name="pencil" size={24} color="gold" />
                </View>
                {dish.recommendations && <Text style={styles.portion}>{dish.recommendations}</Text>}
                <View style={styles.rowContainer}>
                    <Text style={styles.label}>Vidéo</Text>
                    <FontAwesome name="video-camera" size={24} color="gold" />
                </View>
                {dish.video_url && (
                    <TouchableOpacity onPress={() => Linking.openURL(dish.video_url)}>
                        <Text style={[styles.portion, styles.videoUrl]}>{dish.video_url}</Text>
                    </TouchableOpacity>
                )}
                <View style={styles.rowContainer}>
                    <Text style={styles.preparation}>Préparation</Text>
                    <FontAwesome name="clock-o" size={24} color="gold" />
                </View>
                {dish.preparation && <Text style={styles.portion}>{dish.preparation}</Text>}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: "#15FCFC",
        borderRadius: 20,
        padding: 10,
        alignSelf: 'center',
    },
    label: {
        marginRight: 10,
        fontSize: 20,
        fontFamily: 'Ebrimabd'
    },
    portion: {
        marginLeft: 10,
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'Ebrima'
    },
    videoUrl: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    preparation: {
        marginRight: 10,
        fontSize: 20,
        fontFamily: 'Ebrimabd',
    },
    tabContent: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    ingredientRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    ingredientImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    }
});

export default RecipeTab;