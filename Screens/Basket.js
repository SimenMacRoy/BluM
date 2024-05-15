import React, { useContext } from 'react';
import { Alert, View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import BasketContext from './BasketContext';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';

const Basket = () => {
    const { basketItems, setBasketItems } = useContext(BasketContext);
    const navigation = useNavigation();

    const navigateToCheckout = () => {
        navigation.navigate('CheckoutScreen');
    };

    const handleModify = (item) => {
        const screen = item.type === 'Plat' ? 'RecipeScreenDetail' : 'IngredientsDetailScreen';
        const paramKey = item.type === 'Plat' ? 'dishId' : 'ingredientId';
        navigation.navigate(screen, { [paramKey]: item.id, itemToUpdate: item  });
    };

    const updateBasketItem = (updatedItem) => {
        setBasketItems((prevItems) => {
            const updatedItems = prevItems.map((item) =>
                item.id === updatedItem.id ? updatedItem : item
            );
            return updatedItems;
        });
    };

    const handleDelete = (id) => {
        Alert.alert(
            "Confirmer Suppression",
            "Voulez-vous vraiment supprimer cet item du panier?",
            [
                { text: "Annuler", onPress: () => console.log("Deletion cancelled"), style: "cancel" },
                { text: "OK", onPress: () => {
                    setBasketItems(currentItems => {
                        const updatedItems = currentItems.filter(item => item.id !== id);
                        return updatedItems.map(item => {
                            if (item.type === 'Plat') return item;
                            else {
                                // Remove ingredients of the deleted item
                                return { ...item, specifications: [] };
                            }
                        });
                    });
                }}
            ],
            { cancelable: false }
        );
    };

    const renderItem = ({ item }) => {
        const deliveryDateTime = new Date(item.deliveryDate);
        const deliveryDay = deliveryDateTime.getDate();
        const deliveryMonth = deliveryDateTime.getMonth() + 1;
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
    
        let deliveryDateString = '';
        if (
            deliveryDateTime.getDate() === today.getDate() &&
            deliveryDateTime.getMonth() === today.getMonth() &&
            deliveryDateTime.getFullYear() === today.getFullYear()
        ) {
            deliveryDateString = "Aujourd'hui";
        } else if (
            deliveryDateTime.getDate() === tomorrow.getDate() &&
            deliveryDateTime.getMonth() === tomorrow.getMonth() &&
            deliveryDateTime.getFullYear() === tomorrow.getFullYear()
        ) {
            deliveryDateString = "Demain";
        } else {
            deliveryDateString = `${deliveryDay}/${deliveryMonth}`;
        }
    
        const deliveryTime = item.deliveryTime ? item.deliveryTime : '';
    
        return (
            <View style={styles.itemContainer}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.boldGreyText}>Quantité: <Text style={styles.normalText}>{item.quantity}</Text></Text>
                    <Text style={styles.boldGreyText}>Prix Total: <Text style={styles.normalText}>${item.totalPrice.toFixed(2)}</Text></Text>
                    {item.type === 'Plat' && <Text style={styles.boldGreyText}>Spécifications: <Text style={styles.normalText}>{item.specifications.map(spec => spec.title).join(', ')}</Text></Text>}
                    {item.type === 'Plat' && <Text style={styles.boldGreyText}>Date/Heure: <Text style={styles.normalText}>{deliveryDateString} à {deliveryTime}</Text></Text>}
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => handleModify(item)} style={styles.modifyButton}>
                        <Text style={{color: 'white', padding: 5}}>Mod</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                        <Text style={{color: 'white', padding: 5}}>Supp.</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };    
    

    return (
        <View style={styles.container}>
            <Header />
            <Text style={styles.headerTitle}>Votre panier</Text>
            {basketItems.length > 0 ? (
                <FlatList
                    data={basketItems}
                    keyExtractor={(item, index) => `${item.id}_${index}`}
                    renderItem={renderItem}
                />
            ) : (
                <View style={styles.emptyBasketContainer}>
                    <Text style={styles.emptyBasketText}>Votre Panier est vide.</Text>
                    <Text style={styles.emptyBasketText}>Procédez au magasinage.</Text>
                    <Image source={require('C:\\Users\\Mac Roy\\Documents\\bluMApp\\assets\\addToCart.png')} style={styles.basketIcon} />
                </View>
            )}
            <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')} style={styles.button}>
                <Text style={styles.buttonText}>Magasiner</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToCheckout} disabled={basketItems.length === 0} style={[styles.button, { backgroundColor: basketItems.length === 0 ? 'grey' : 'blue' }]}>
                <Text style={styles.buttonText}>Payer</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemContainer: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#333',
        padding: 20,
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
    },
    modifyButton: {
        backgroundColor: 'blue',
        padding: 5,
        marginRight: 5,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 5,
    },
    button: {
        margin: 15,
        backgroundColor: 'blue',
        padding: 20,
        borderRadius: 5,
        alignItems: 'center',
        
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    emptyBasketContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    emptyBasketText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'grey',
        textAlign: 'center',
    },
    basketIcon: {
        width: 100,
        height: 100,
        marginTop: 20,
        tintColor: 'grey',
    },
    boldGreyText: {
        fontWeight: 'bold',
        color: 'grey',
    },
    normalText: {
        fontWeight: 'normal',
    },
});

export default Basket;
