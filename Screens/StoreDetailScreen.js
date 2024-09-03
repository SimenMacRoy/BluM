import React, { useEffect, useState,} from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SearchBar from './SearchBar';
import IngredientsScreen from './IngredientsScreen';
import SearchResults from './SearchResults';
import config from '../config';
import Header from './Header';
import { useNavigate } from 'react-router';

const StoreDetailScreen = ({ route }) => {
    const { supplierID } = route.params;
    const [supplier, setSupplier] = useState(null);
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchSupplierDetails = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/suppliers/${supplierID}`);
                const data = await response.json();
                if (data.success) {
                    setSupplier(data.supplier);
                    setFilteredIngredients(data.ingredients);  // Initialize with all ingredients
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
        if (results.length > 0) {
            setIsSearching(true);
            setFilteredIngredients(results);
        } else {
            setIsSearching(false);
            setFilteredIngredients(supplier.ingredients);  // Reset to all ingredients if no results
        }
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
                <View style={styles.supplierDetails}>
                    <Text style={styles.supplierName}>{supplier.name}</Text>
                    <Text style={styles.supplierInfoText}>Ouvert, ferme à {supplier.closingTime}</Text>
                    <Text style={styles.supplierInfoText}>Address: {supplier.postalAddress}</Text>
                </View>
            </View>
            <SearchBar
                onSearch={handleSearch}
                placeholder={`Rechercher dans ${supplier.name}`}
                searchType={`supplier_ingredients_${supplierID}`}
                supplierID={supplierID}
            />
            {isSearching ? (
                <SearchResults
                    results={filteredIngredients}
                    onResultPress={(ingredient) => navigation.navigate('IngredientsDetailScreen', { ingredientId: ingredient.id })}
                />
            ) : (
                <IngredientsScreen 
                    supplierID={supplierID} 
                    hideHeader={true} 
                    hideSearchBar={true} 
                    customIngredients={filteredIngredients} 
                />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    supplierInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    logoImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 15,
    },
    supplierDetails: {
        flex: 1,
    },
    supplierName: {
        fontSize: 24,
        fontFamily: 'Ebrimabd',
    },
    supplierInfoText: {
        fontSize: 16,
        fontFamily: 'Ebrima',
        color: '#666',
        marginTop: 5,
    },
});

export default StoreDetailScreen;
