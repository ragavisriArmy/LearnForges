import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('lf_token'));
    const [loading, setLoading] = useState(true); // Added a true loading state tracker

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('lf_user');
            if (token && savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (err) {
            console.error("Error reading session context memory:", err);
            localStorage.removeItem('lf_user');
        } finally {
            setLoading(false); // Done checking browser memory!
        }
    }, [token]);

    const login = (userData, userToken) => {
        localStorage.setItem('lf_token', userToken);
        localStorage.setItem('lf_user', JSON.stringify(userData));
        setToken(userToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('lf_token');
        localStorage.removeItem('lf_user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};