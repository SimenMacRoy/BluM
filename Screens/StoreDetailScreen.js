import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import config from '../config';

const StoreDetailScreen = ({ route }) => {
    const { supplierID } = route.params;
    const [supplier, setSupplier] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchSupplierDetails = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/suppliers/${supplierID}`);
                const data = await response.json();
                if (data.success) {
                    setSupplier(data.supplier);
                    setIngredients(data.ingredients);
                } else {
                    Alert.alert('Error', 'Failed to fetch supplier details.');
                }
            } catch (error) {
                console.error('Error fetching supplier details:', error);
                Alert.alert('Error', 'An error occurred while fetching supplier details.');
            }
        };

        fetchSupplierDetails();
    }, [supplierID]);

    const handleSearch = (results) => {
        setSearchResults(results);
        setIsSearching(results.length > 0);
    };

    if (!supplier) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView>
            <Header />
            <View style={styles.supplierInfoContainer}>
                {supplier.logo && (
                    <Image
                        source={{ uri: supplier.logo }}
                        style={styles.logoImage}
                    />
                )}
                <Text style={styles.supplierName}>{supplier.name}</Text>
            </View>
            <SearchBar
                onSearch={handleSearch}
                placeholder={`Rechercher dans ${supplier.name}`}
                searchType={`supplier_ingredients_${supplierID}`}  // Assuming search type is specific to supplier's ingredients
            />
            {isSearching ? (
                <SearchResults
                    results={searchResults}
                    onResultPress={(ingredient) => navigation.navigate('IngredientsDetailScreen', { ingredientId: ingredient.id })}
                />
            ) : (
                ingredients.map((ingredient) => (
                    <TouchableOpacity
                        key={ingredient.id}
                        style={styles.ingredientContainer}
                        onPress={() => navigation.navigate('IngredientsDetailScreen', { ingredientId: ingredient.id })}
                    >
                        {ingredient.image && (
                            <Image
                                source={{ uri: ingredient.image }}
                                style={styles.ingredientImage}
                            />
                        )}
                        <Text style={styles.ingredientTitle}>{ingredient.title}</Text>
                        <Text style={styles.ingredientPrice}>Prix: ${ingredient.unitPrice}</Text>
                    </TouchableOpacity>
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    supplierInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    logoImage: {
        width: 100,
        height: 100,
        borderRadius: 50,  // Make the logo round
        marginRight: 15,
    },
    supplierName: {
        fontSize: 24,
        fontFamily: 'Ebrimabd',
    },
    ingredientContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
    },
    ingredientImage: {
        width: 100,
        height: 100,
        marginRight: 15,
    },
    ingredientTitle: {
        fontSize: 20,
        fontFamily: 'Ebrima',
    },
    ingredientPrice: {
        fontSize: 16,
        color: '#888',
        fontFamily: 'Ebrima',
    },
});

export default StoreDetailScreen;
