// UserContext.js
import React, { createContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    const loginUser = (user) => {
        console.log('Logging in user:', user);
        setCurrentUser(user);
    };

    return (
        <UserContext.Provider value={{ currentUser, loginUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
