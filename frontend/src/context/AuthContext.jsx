import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('lf_token'));

    useEffect(() => {
        const savedUser = localStorage.getItem('lf_user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
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
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};