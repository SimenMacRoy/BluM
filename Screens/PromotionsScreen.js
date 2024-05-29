import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from './Header'; // Adjust the path if necessary

const PromotionsScreen = () => {
    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.content}>
                <Text style={styles.noPromotionsText}>Aucune promotion</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noPromotionsText: {
        fontSize: 20,
        fontFamily: 'Ebrimabd',
        color: '#333',
    },
});

export default PromotionsScreen;
