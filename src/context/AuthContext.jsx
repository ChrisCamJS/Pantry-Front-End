
import React, {createContext, useState, useContext} from 'react';
import { api } from '../services/api'; 

// create the context
const  AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    // initiallize state from local storage
    const [user, setUser] = useState(()=> {
        const savedUser = localStorage.getItem('vault_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });


    // call when login succeeds
    const loginContext = (userData) => {
        setUser(userData);
        localStorage.setItem('vault_user', JSON.stringify(userData));
    }
    // call this to bin the session and kick them out
    const logoutContext = async () => {
        try {
            // tell the backend to destroy the session cookie
            await api.logout();
        }
        catch (err) {
            console.error('Backend Logout Threw a Wobbly', err);
        }

        // wipe the react state and local storage
        setUser(null);
        localStorage.removeItem('vault_user');
    }

    return (
        <AuthContext.Provider value={{ user, login: loginContext, logout: logoutContext }}>
            {children}
        </AuthContext.Provider>
    );
}

// A custom hook to make grabbing the context simple in other components
export const useAuth = () => useContext(AuthContext);