import React, {useState} from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Footer = (currentPage) => {
    const navigation = useNavigation();

    return (
        <View style={styles.footer}>
            <TouchableOpacity
                style={styles.footerItem}
                onPress={() => navigation.navigate('Home')}
            >
                <FontAwesome name="home" size={24} backgroundColor={currentPage === 'Home' ? 'white' : '#15FCFC'}/>
                <Text style={styles.footerText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.footerItem}
                onPress={() => navigation.navigate('Recipe')}
            >
                <FontAwesome name="book" size={24} color={currentPage === 'Recipe' ? 'white' : '#15FCFC'}/>
                <Text style={styles.footerText}>Recette</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.footerItem}
                onPress={() => navigation.navigate('Ingredients')}
            >
                <FontAwesome name="shopping-basket" size={24} color={currentPage === 'Ingredients' ? 'white' : '#15FCFC'}/>
                <Text style={styles.footerText}>Ingredients</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.footerItem}
                onPress={() => navigation.navigate('Delivery')}
            >
                <FontAwesome name="truck" size={24} color={currentPage === 'Delivery' ? 'white' : '#15FCFC'}/>
                <Text style={styles.footerText}>Commander</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingVertical: 10,
        
    },
    footerItem: {
        alignItems: 'center',
    },
    footerText: {
        marginTop: 5,
        fontSize: 12,
    },
})

export default Footer