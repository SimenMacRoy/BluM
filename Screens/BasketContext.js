// Importing React and its hooks for creating context and state.
import React, { createContext, useState } from 'react';

// Creating a context for the basket, which can be accessed throughout the component tree.
const BasketContext = createContext();

// BasketProvider is a component that wraps its children with BasketContext.Provider.
export const BasketProvider = ({ children }) => {
    // State hook for maintaining the list of items in the basket.
    const [basketItems, setBasketItems] = useState([]);

    // Function to add items to the basket.
    const addToBasket = (itemToAdd) => {
        setBasketItems(currentItems => {
            // Checking if the item already exists in the basket.
            const existingItemIndex = currentItems.findIndex(item => item.id === itemToAdd.id);
            if (existingItemIndex >= 0) {
                // If the item exists, replace its quantity.
                const updatedItems = [...currentItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: itemToAdd.quantity // Set the quantity directly to the new value.
                };
                return updatedItems; // Returning the updated list.
            } else {
                // If the item is new, add it to the basket.
                return [...currentItems, itemToAdd]; // Adding the new item.
            }
        });
    };
    const clearBasket = () => {
        setBasketItems([]); // This sets the basket items to an empty array
    };

    // The Provider component makes the basket state and the addToBasket function available to any child components.
    return (
        <BasketContext.Provider value={{ basketItems, setBasketItems, addToBasket, clearBasket }}>
            {children}
        </BasketContext.Provider>
    );
};

// Exporting the BasketContext to be used by other components.
export default BasketContext;
