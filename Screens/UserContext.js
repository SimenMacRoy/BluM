import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('currentUser');
                if (storedUser) {
                    setCurrentUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Failed to load user from storage:', error);
            }
        };

        loadUser();
    }, []);

    const loginUser = async (user) => {
        try {
            console.log('Logging in user:', user);
            setCurrentUser(user);
            await AsyncStorage.setItem('currentUser', JSON.stringify(user));
        } catch (error) {
            console.error('Failed to save user to storage:', error);
        }
    };

    const logoutUser = async () => {
        try {
            setCurrentUser(null);
            await AsyncStorage.removeItem('currentUser');
        } catch (error) {
            console.error('Failed to remove user from storage:', error);
        }
    };

    return (
        <UserContext.Provider value={{ currentUser, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
