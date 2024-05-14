import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import Header from './Header'; // Make sure the path to your Header component is correct

const ReceiptScreen = () => {
    const [receipts, setReceipts] = useState([]);

    useEffect(() => {
        fetchReceipts();
    }, []);

    const fetchReceipts = async () => {
        try {
            const response = await fetch('http://192.168.69.205:3006/api/receipts'); // Replace with your actual API URL
            const data = await response.json();
            setReceipts(data);
        } catch (error) {
            console.error('Failed to fetch receipts:', error);
            Alert.alert("Error", "Failed to load receipts.");
        }
    };

    const printReceiptToFile = async (receiptData) => {
        const html = `
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            </head>
            <body style="text-align: center;">
                <h1>Receipt Details</h1>
                <p><strong>Command Number:</strong> ${receiptData.commandId}</p>
                <p><strong>Date & Time:</strong> ${receiptData.commandDateTime}</p>
                <p><strong>Name:</strong> ${receiptData.userName} ${receiptData.userSurname}</p>
                <p><strong>Phone Number:</strong> ${receiptData.userPhone}</p>
                <p><strong>Email:</strong> ${receiptData.userEmail}</p>
                <p><strong>Details:</strong> ${receiptData.commandDetails}</p>
                <p><strong>Member Name:</strong> ${receiptData.memberName} ${receiptData.memberSurname}</p>
                <p><strong>Member Number:</strong> ${receiptData.memberID}</p>
                <p><strong>Payment Type:</strong> ${receiptData.paymentType}</p>
                <p><strong>Amount:</strong> ${receiptData.amount}</p>
            </body>
            </html>
        `;
        try {
            const { uri } = await Print.printToFileAsync({ html });
            console.log('Receipt PDF has been saved to:', uri);
            await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
            Alert.alert("PDF Generated", "PDF has been generated and saved.");
        } catch (error) {
            console.error("Failed to create PDF:", error);
            Alert.alert("PDF Error", "Failed to generate PDF.");
        }
    };

    return (
        <View style={styles.container}>
            <Header />
            <Text style={styles.title}>Vos Factures</Text>
            <FlatList
                data={receipts}
                keyExtractor={item => item.commandId.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item} onPress={() => printReceiptToFile(item)}>
                        <Text style={styles.commandNumber}>Command Number: {item.commandId}</Text>
                        <Text style={styles.dateTime}>Date: {item.commandDateTime}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    item: {
        backgroundColor: '#ffffff',
        padding: 20,
        marginVertical: 8,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
        elevation: 4,
    },
    commandNumber: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold'
    },
    dateTime: {
        fontSize: 14,
        color: '#666'
    }
});

export default ReceiptScreen;
