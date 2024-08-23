import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';
import config from '../config';

const StoreScreen = () => {
    const [suppliers, setSuppliers] = useState([]);
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

    return (
        <ScrollView>
            <Header />
            <Text style={{ fontSize: 24, fontWeight: 'bold', padding: 10 }}>Vos Magasins</Text>
            {suppliers.map((supplier) => (
                <TouchableOpacity
                    key={supplier.supplierID}
                    style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ddd' }}
                    onPress={() => navigation.navigate('StoreDetailScreen', { supplierID: supplier.supplierID })}
                >
                    {supplier.logo && (
                        <Image
                            source={{ uri: supplier.logo }}
                            style={{ width: 100, height: 100, marginBottom: 10 }}
                        />
                    )}
                    <Text style={{ fontSize: 20 }}>{supplier.name}</Text>
                    {!isOpen(supplier.openingTime, supplier.closingTime) && (
                        <Text style={{ color: 'red' }}>Ferme ouvre à 10hr</Text>
                    )}
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

export default StoreScreen;
