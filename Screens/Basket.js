// React and useContext are imported for creating the component and using context.
import React, { useContext } from 'react'; 
// Importing necessary components from 'react-native' for UI.
import { Alert, View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
// Importing BasketContext to access basket data.
import BasketContext from './BasketContext';
// useNavigation is used for navigating between screens.
import { useNavigation } from '@react-navigation/native';

// Basket component to display items in the user's basket.
const Basket = () => {
    
    // Using BasketContext to access and update the items in the basket.
    const { basketItems, setBasketItems } = useContext(BasketContext);
    // Initializing navigation for screen transitions.
    const navigation = useNavigation();

    // Function to navigate to the RecipeScreen.
    const shop = () => {
        navigation.navigate('HomeScreen');
    };

    // Function to navigate to the CheckoutScreen.
    const navigateToCheckout = () => {
        navigation.navigate('CheckoutScreen');
    };

    // Function to navigate to the RecipeScreenDetail or IngredientsDetailScreen with specific item details.
    const handleModify = (item) => {
        if (item.type === 'Plat') {
            // Navigate to RecipeScreenDetail for dishes
            navigation.navigate('RecipeScreenDetail', { dishId: item.id });
        } else {
            // Navigate to IngredientsDetailScreen for ingredients
            navigation.navigate('IngredientsDetailScreen', { ingredientId: item.id });
        }
    };

    // Function to handle deletion of an item from the basket.
    const handleDelete = (id) => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to remove this item from the basket?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Deletion cancelled"),
                    style: "cancel"
                },
                { 
                    text: "OK", 
                    onPress: () => {
                        setBasketItems(currentItems => currentItems.filter(item => item.id !== id));
                    } 
                }
            ],
            { cancelable: false }
        );
    };


    // renderItem function to render each item in the FlatList.
    const renderItem = ({ item }) => {
        const totalPrice = item.price * item.quantity;  // Calculate total price inside renderItem

    return (
        <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text>Quantity: {item.quantity}</Text>
                <Text>Total Price: ${totalPrice.toFixed(2)}</Text>
                {item.type === 'Plat' && (
                    <>
                        {item.deliveryTime && <Text>Delivery Time: {item.deliveryTime}</Text>}
                        {item.deliveryDate && <Text>Delivery Date: {item.deliveryDate.toLocaleDateString()}</Text>}
                    </>
                )}
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleModify(item)} style={styles.modifyButton}>
                    <Text>Modify</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                    <Text>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={basketItems}
                keyExtractor={(item, index) => `${item.id}_${index}`}
                renderItem={renderItem}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={shop} style={styles.button}>
                    <Text style={styles.buttonText}>Magasiner</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={navigateToCheckout} style={styles.button}>
                    <Text style={styles.buttonText}>Check-out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // styles definitions...
    container: {
        flex: 1,
        paddingTop: 22
    },
    itemContainer: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
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
    },
    modifyButton: {
        backgroundColor: 'blue',
        padding: 5,
        marginRight: 5,
        marginBottom: 10,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 5,
    },
    buttonContainer: {
        margin: 10,
    },
    button: {
        marginTop: 15,
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Basket;
