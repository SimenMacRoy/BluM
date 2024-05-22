import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import SearchResults from './SearchResults';
import Header from './Header';
import SearchBar from './SearchBar';

const IngredientsScreen = () => {
    const [ingredients, setIngredients] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        // Fetch ingredients from backend
        const fetchIngredients = async () => {
            try {
                const response = await fetch('http://192.168.69.205:3006/api/ingredients');
                if (!response.ok) {
                    throw new Error('Failed to fetch ingredients');
                }
                const data = await response.json();
                setIngredients(data);
                setLoading(false);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchIngredients();
    }, []);

    const handleCategoryPress = (category) => {
        switch (category) {
            case "Epice":
                navigation.navigate('SpiceScreen');
                break;
            case "Condiments":
                navigation.navigate('CondimentScreen');
                break;
            case "Legumes":
                navigation.navigate('LegumeScreen');
                break;
            case "Viande":
                navigation.navigate('MeatScreen');
                break;
            case "ProdEnConserves":
                navigation.navigate('ProdEnConservesScreen');
                break;
            case "Boissons":
                navigation.navigate('DrinksScreen');
                break;
            case "Autres":
                navigation.navigate('OthersScreen');
                break;
            default:
                break;
        }
    };

    const handleResultPress = (ingredient) => {
        navigation.navigate('IngredientsDetailScreen', { ingredientId: ingredient.id });
    };

    const handleSearch = (results) => {
        setSearchResults(results);
        setIsSearching(results.length > 0);
    };

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
        <View style={{ flex: 1 }}>
            <Header />
            <SearchBar onSearch={handleSearch} onResultPress={handleResultPress} placeholder='Quels ingredients voulez-vous ?' searchType={'ingredients'} />

            {isSearching ? (
                <SearchResults results={searchResults} onResultPress={handleResultPress} />
            ) : (
                <ScrollView>
                    <SectionHeader text="Epices" onPress={() => handleCategoryPress("Epice")} />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <IngredientsList ingredients={ingredients.filter(i => i.category === 'Epices')} onPress={handleResultPress} />
                    </ScrollView>

                    <SectionHeader text="Viande" onPress={() => handleCategoryPress("Viande")} />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <IngredientsList ingredients={ingredients.filter(i => i.category === 'Viande')} onPress={handleResultPress} />
                    </ScrollView>
                    
                    <SectionHeader text="Légumes" onPress={() => handleCategoryPress("Legumes")} />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <IngredientsList ingredients={ingredients.filter(i => i.category === 'Legumes')} onPress={handleResultPress} />
                    </ScrollView>

                    <SectionHeader text="Condiments Et Assaisonements" onPress={() => handleCategoryPress("Condiments")} />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <IngredientsList ingredients={ingredients.filter(i => i.category === 'Condiments')} onPress={handleResultPress} />
                    </ScrollView>

                    <SectionHeader text="Produits en Conserves" onPress={() => handleCategoryPress("ProdEnConserves")} />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <IngredientsList ingredients={ingredients.filter(i => i.category === 'ProdEnConserves')} onPress={handleResultPress} />
                    </ScrollView>

                    <SectionHeader text="Boissons" onPress={() => handleCategoryPress("Boissons")} />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <IngredientsList ingredients={ingredients.filter(i => i.category === 'Boissons')} onPress={handleResultPress} />
                    </ScrollView>

                    <SectionHeader text="Autres" onPress={() => handleCategoryPress("Autres")} />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <IngredientsList ingredients={ingredients.filter(i => i.category === 'Autres')} onPress={handleResultPress} />
                    </ScrollView>

                    {/* Add more categories as needed */}
                </ScrollView>
            )}
        </View>
    );
};

const SectionHeader = ({ text, onPress }) => (
    <TouchableOpacity style={styles.sectionHeader} onPress={onPress}>
        <Text style={styles.sectionHeaderText}>{text}</Text>
    </TouchableOpacity>
);

const IngredientsList = ({ ingredients, onPress }) => (
    <View style={styles.cardsContainer}>
        {ingredients.map((ingredient) => (
            <TouchableOpacity key={ingredient.id} style={styles.card} onPress={() => onPress(ingredient)}>
                <Image source={{ uri: ingredient.image }} style={styles.cardImage} />
                <Text style={styles.cardTitle}>{ingredient.title}</Text>
                <Text style={styles.cardPrice}>${ingredient.price}</Text>
            </TouchableOpacity>
        ))}
    </View>
);

const styles = {
    sectionHeader: {
        alignItems: 'center', 
        backgroundColor: '#e6e6e6',
        padding: 10,
        margin: 10,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: "#15FCFC"
    },
    sectionHeaderText: {
        fontSize: 20,
        fontFamily: 'Ebrimabd',
        color: 'black',
        alignSelf: 'center',
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    card: {
        width: 150,
        borderWidth: 1,
        borderColor: 'white',
        marginBottom: 10,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        padding: 0,
        marginLeft: 10,
    },
    cardImage: {
        width: 149,
        height: 130,
        borderTopLeftRadius: 20,
        
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: 'Ebrimabd',
        paddingVertical: 3,
        alignSelf: 'center',
    },
    cardPrice: {
        marginTop: 5,
        fontSize: 14,
        color: 'gray',
        paddingLeft: 10,
        fontFamily: 'Ebrimabd',
    },
};

export default IngredientsScreen;
