import React, {useContext} from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Badge from './Badge';
import BasketContext from './BasketContext';// Context for accessing the basket items.

const Header = () => {

    // Using the navigation hook for navigating between screens.
    const navigation = useNavigation();
    // Accessing basket items from BasketContext.
    const { basketItems } = useContext(BasketContext);

    // Function to navigate to the basket screen.
    const basketScreen = () => {
        navigation.navigate('Commander');
    };

    // Calculating the total count of items in the basket.
    const basketItemCount = basketItems.reduce((acc, item) => acc + item.quantity, 0);

    return(
        <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <Image
                    source={require('C:\\Users\\Mac Roy\\Documents\\bluMApp\\assets\\bluMlogo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <View style={styles.rightIcons}>
                    <TouchableOpacity style={styles.iconContainer}>
                        <FontAwesome name="shopping-basket" size={24} color="black" onPress={basketScreen}/>
                        {basketItemCount > 0 && <Badge value={basketItemCount} />}
                    </TouchableOpacity>
                    <TouchableOpacity 
                    style={styles.iconContainer}
                    onPress={() => navigation.navigate('ProfileScreen')}>
                        <FontAwesome name="user-circle" size={24} color="black" />
                    </TouchableOpacity>
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 30,
        
    },
    rightIcons: {
        flexDirection: 'row',
    },
    iconContainer: {
        padding: 10,
    },
    logo: {
        width: 100, 
        height: 50, 
        borderRadius: 10,
        marginLeft: 60
    },
    backButton: {
        marginTop: 10
    }
})

export default Header