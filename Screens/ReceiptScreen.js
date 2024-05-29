import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import Header from './Header';
import BasketContext from './BasketContext';
import UserContext from './UserContext'; // Import UserContext

const ReceiptScreen = () => {
    const { basketItems } = useContext(BasketContext);
    const { currentUser } = useContext(UserContext); // Obtain currentUser from UserContext
    const [receipts, setReceipts] = useState([]);

    useEffect(() => {
        fetchReceipts();
    }, []);

    const fetchReceipts = async () => {
        if (!currentUser || !currentUser.userID) {
            console.error('User ID is not available');
            Alert.alert("Error", "User ID is not available.");
            return;
        }

        try {
            const response = await fetch(`http://192.168.69.205:3006/api/receipts?userID=${currentUser.userID}`); // Pass userID as query parameter
            const data = await response.json();
            setReceipts(data);
        } catch (error) {
            console.error('Failed to fetch receipts:', error);
            Alert.alert("Error", "Failed to load receipts.");
        }
    };

    const printReceiptToFile = async (receiptData) => {
        const amountDetails = JSON.parse(receiptData.amountDetails);
        const commandDetails = JSON.parse(receiptData.commandDetails);

        const commandItemsHtml = commandDetails.map(item => `
            <tr>
                <td style="text-align: left;">${item.id}</td>
                <td style="text-align: left;">${item.title} (x${item.quantity})</td>
                <td style="text-align: right;">${item.price}</td>
                <td style="text-align: right;">${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `).join('');

        const html = `
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            </head>
            <body style="text-align: center;">
                <h1 style="color: #15FCFC;">bluM</h1>
                <p>blum@canada.ca</p>
                <p>(819) 701-8694</p>
                <hr style="border: 1px solid gray;" />
                <p><strong>Nom:</strong> ${receiptData.userName} ${receiptData.userSurname}</p>
                <p><strong>Numéro Téléphone:</strong> ${receiptData.userPhone}</p>
                <hr style="border: 1px solid gray;" />
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="text-align: left;">ID</th>
                            <th style="text-align: left;">Item</th>
                            <th style="text-align: right;">Prix Unit</th>
                            <th style="text-align: right;">Prix Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${commandItemsHtml}
                    </tbody>
                </table>
                <hr style="border: 1px solid gray;" />
                <p><strong>Sous-total:</strong> ${amountDetails.subtotal}</p>
                <p><strong>TVQ (9.975%):</strong> ${amountDetails.taxTVQ}</p>
                <p><strong>TPS (5%):</strong> ${amountDetails.taxTPS}</p>
                <p><strong>Frais de livraison:</strong> ${amountDetails.deliveryFee}</p>
                <p><strong>Total:</strong> ${amountDetails.total}</p>
                <p><strong>Paiement par :</strong> ${receiptData.paymentType}</p>
                <hr style="border: 1px solid gray;" />
                <p><strong>Commande géré par:</strong> ${receiptData.memberName} ${receiptData.memberSurname}</p>
                <p><strong>ID membre:</strong> ${receiptData.memberID}</p>
                <p style="text-align: right;">${receiptData.commandDateTime}</p>
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
            {receipts.length === 0 ? (
                <Text style={styles.noReceiptsText}>Vous n'avez aucune facture</Text>
            ) : (
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
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 22,
        fontFamily: 'Ebrimabd',
        marginBottom: 20,
        textAlign: 'center'
    },
    noReceiptsText: {
        fontSize: 18,
        color: '#333',
        fontFamily: 'Ebrimabd',
        textAlign: 'center',
        marginTop: 20,
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
        margin: 10,
    },
    commandNumber: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Ebrimabd',
    },
    dateTime: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Ebrima'
    }
});

export default ReceiptScreen;
