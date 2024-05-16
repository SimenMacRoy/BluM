import React, { createContext, useState } from 'react';

const BasketContext = createContext();

export const BasketProvider = ({ children }) => {
    const [basketItems, setBasketItems] = useState([]);

    const addToBasket = (itemToAdd) => {
        setBasketItems(currentItems => {
            const existingItemIndex = currentItems.findIndex(item => item.id === itemToAdd.id);
            if (existingItemIndex >= 0) {
                const updatedItems = [...currentItems];
                const existingItem = updatedItems[existingItemIndex];
                // Updating only the changed properties
                const updatedItem = {
                    ...existingItem,
                    quantity: itemToAdd.quantity,
                    specifications: itemToAdd.specifications,
                    deliveryDate: itemToAdd.deliveryDate,
                    deliveryTime: itemToAdd.deliveryTime,
                    totalPrice: calculateTotalPrice(itemToAdd)
                };
                updatedItems[existingItemIndex] = updatedItem;
                return updatedItems;
            } else {
                itemToAdd.totalPrice = calculateTotalPrice(itemToAdd);
                return [...currentItems, itemToAdd];
            }
        });
    };

    const calculateTotalPrice = (item) => {
        // Check if the item and its price are valid
        if (!item || isNaN(item.price)) {
            console.error('Invalid item price:', item);
            return 0; // Return 0 or some other default value indicating error
        }
    
        let totalPrice = item.price * item.quantity;
    
        // Check if specifications exist and are in an array
        if (item.specifications && Array.isArray(item.specifications)) {
            item.specifications.forEach(spec => {
                // Check each specification for a valid price
                if (spec && !isNaN(spec.price)) {
                    totalPrice += (spec.price / 10) * spec.quantity;
                } else {
                    console.error('Invalid or missing price in specifications:', spec);
                }
            });
        }
    
        return totalPrice.toFixed(2); // Format the total price to 2 decimal places
    };
    
    
    const clearBasket = () => {
        setBasketItems([]);
    };

    return (
        <BasketContext.Provider value={{ basketItems, setBasketItems, addToBasket, clearBasket }}>
            {children}
        </BasketContext.Provider>
    );
};

export default BasketContext;
