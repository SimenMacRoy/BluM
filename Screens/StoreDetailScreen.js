import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';
import config from '../config';

const StoreDetailScreen = ({ route }) => {
    const { supplierID } = route.params;
    const [supplier, setSupplier] = useState(null);
    const [ingredients, setIngredients] = useState([]);
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

    if (!supplier) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView>
            <Header />
            <View style={{ alignItems: 'center', padding: 20 }}>
                {supplier.logo && (
                    <Image
                        source={{ uri: supplier.logo }}
                        style={{ width: 150, height: 150, marginBottom: 10 }}
                    />
                )}
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{supplier.name}</Text>
            </View>
            {ingredients.map((ingredient) => (
                <TouchableOpacity
                    key={ingredient.id}
                    style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ddd' }}
                    onPress={() => navigation.navigate('IngredientsDetailScreen', { ingredientId: ingredient.id })}
                >
                    {ingredient.image && (
                        <Image
                            source={{ uri: ingredient.image }}
                            style={{ width: 100, height: 100, marginBottom: 10 }}
                        />
                    )}
                    <Text style={{ fontSize: 20 }}>{ingredient.title}</Text>
                    <Text style={{ fontSize: 16, color: '#888' }}>Prix: ${ingredient.unitPrice}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

export default StoreDetailScreen;
