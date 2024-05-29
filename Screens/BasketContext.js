import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from './UserContext';

const BasketContext = createContext();

export const BasketProvider = ({ children }) => {
    const { currentUser } = useContext(UserContext);
    const [basketItems, setBasketItems] = useState([]);

    useEffect(() => {
        const loadBasket = async () => {
            if (currentUser && currentUser.userID) {
                try {
                    const storedBasket = await AsyncStorage.getItem(`basketItems_${currentUser.userID}`);
                    if (storedBasket) {
                        setBasketItems(JSON.parse(storedBasket));
                    } else {
                        setBasketItems([]); // Reset the basket if no items found
                    }
                } catch (error) {
                    console.error('Failed to load basket from storage:', error);
                }
            }
        };

        loadBasket();
    }, [currentUser]);

    const saveBasket = async (items) => {
        if (currentUser && currentUser.userID) {
            try {
                await AsyncStorage.setItem(`basketItems_${currentUser.userID}`, JSON.stringify(items));
            } catch (error) {
                console.error('Failed to save basket to storage:', error);
            }
        }
    };

    const addToBasket = (itemToAdd) => {
        setBasketItems(currentItems => {
            const existingItemIndex = currentItems.findIndex(item => item.id === itemToAdd.id);
            let updatedItems;
            if (existingItemIndex >= 0) {
                updatedItems = [...currentItems];
                const existingItem = updatedItems[existingItemIndex];
                const updatedItem = {
                    ...existingItem,
                    quantity: itemToAdd.quantity,
                    specifications: itemToAdd.specifications,
                    deliveryDate: itemToAdd.deliveryDate,
                    deliveryTime: itemToAdd.deliveryTime,
                    totalPrice: calculateTotalPrice(itemToAdd)
                };
                updatedItems[existingItemIndex] = updatedItem;
            } else {
                itemToAdd.totalPrice = calculateTotalPrice(itemToAdd);
                updatedItems = [...currentItems, itemToAdd];
            }
            saveBasket(updatedItems); // Save updated basket to storage
            return updatedItems;
        });
    };

    const calculateTotalPrice = (item) => {
        if (!item || isNaN(item.price)) {
            console.error('Invalid item price:', item);
            return 0;
        }

        let totalPrice = item.price * item.quantity;

        if (item.specifications && Array.isArray(item.specifications)) {
            item.specifications.forEach(spec => {
                if (spec && !isNaN(spec.price)) {
                    totalPrice += (spec.price / 10) * spec.quantity;
                } else {
                    console.error('Invalid or missing price in specifications:', spec);
                }
            });
        }

        return parseFloat(totalPrice).toFixed(2); 
    };

    const removeFromBasket = (id) => {
        setBasketItems(currentItems => {
            const updatedItems = currentItems.filter(item => item.id !== id);
            saveBasket(updatedItems); // Save updated basket to storage
            return updatedItems;
        });
    };

    const clearBasket = async () => {
        setBasketItems([]);
        if (currentUser && currentUser.userID) {
            try {
                await AsyncStorage.removeItem(`basketItems_${currentUser.userID}`);
            } catch (error) {
                console.error('Failed to clear basket from storage:', error);
            }
        }
    };

    return (
        <BasketContext.Provider value={{ basketItems, setBasketItems, addToBasket, removeFromBasket, clearBasket }}>
            {children}
        </BasketContext.Provider>
    );
};

export default BasketContext;
