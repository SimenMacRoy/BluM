import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';
import SearchBar from './SearchBar';  // Import the SearchBar component
import SearchResults from './SearchResults';  // Import the SearchResults component
import config from '../config';

const StoreScreen = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/suppliers`);
                const data = await response.json();
                if (data.success) {
                    setSuppliers(data.suppliers);
                } else {
                    Alert.alert('Error', 'Failed to fetch suppliers.');
                }
            } catch (error) {
                console.error('Error fetching suppliers:', error);
                Alert.alert('Error', 'An error occurred while fetching suppliers.');
            }
        };

        fetchSuppliers();
    }, []);

    const isOpen = (openingTime, closingTime) => {
        const now = new Date();
        const openTime = new Date(now);
        const closeTime = new Date(now);

        const [openHour, openMinute] = openingTime.split(':').map(Number);
        const [closeHour, closeMinute] = closingTime.split(':').map(Number);

        openTime.setHours(openHour, openMinute);
        closeTime.setHours(closeHour, closeMinute);

        return now >= openTime && now <= closeTime;
    };

    const handleSearch = (results) => {
        setSearchResults(results);
        setIsSearching(results.length > 0);
    };

    const handleResultPress = (ingredient) => {
        navigation.navigate('IngredientsDetailScreen', { ingredientId: ingredient.id });
    };

    return (
        <View style={{ flex: 1 }}>
            <Header />
            <SearchBar
                onSearch={handleSearch}
                onResultPress={handleResultPress}
                placeholder='Recherchez des ingrédients...'
                searchType={'ingredients'}  // Ensure this search type targets ingredients
            />

            <Text style={styles.title}>Vos Magasins</Text>

            {isSearching ? (
                <SearchResults
                    results={searchResults}
                    onResultPress={handleResultPress}
                />
            ) : (
                <ScrollView>
                    {suppliers.map((supplier) => {
                        const open = isOpen(supplier.openingTime, supplier.closingTime);
                        return (
                            <TouchableOpacity
                                key={supplier.supplierID}
                                style={[styles.supplierContainer, !open && styles.closedContainer]}
                                onPress={() => navigation.navigate('StoreDetailScreen', { supplierID: supplier.supplierID })}
                            >
                                {supplier.logo && (
                                    <Image
                                        source={{ uri: supplier.logo }}
                                        style={styles.logoImage}
                                    />
                                )}
                                <Text style={styles.supplierName}>{supplier.name}</Text>
                                {open ? (
                                    <Text style={styles.openText}>Actuellement Ouvert</Text>
                                ) : (
                                    <Text style={styles.closedText}>Fermé ! Ouvre à 10:00 am</Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontFamily: 'Ebrimabd',
        textAlign: 'center',
        marginVertical: 10,
    },
    supplierContainer: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#15FCFC',
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',  // Center align the content
        marginHorizontal: 15,
        marginVertical: 10,
    },
    closedContainer: {
        backgroundColor: '#d3d3d3',  // Gray background if the store is closed
    },
    logoImage: {
        width: 100,
        height: 100,
        borderRadius: 50,  // Make the image round
        marginBottom: 10,
    },
    supplierName: {
        fontSize: 20,
        fontFamily: 'Ebrimabd',
        color: 'black',
    },
    closedText: {
        color: 'red',
        fontFamily: 'Ebrima',
        fontSize: 16,
    },
    openText: {
        color: 'green',
        fontFamily: 'Ebrima',
        fontSize: 16,
    },
});

export default StoreScreen;
