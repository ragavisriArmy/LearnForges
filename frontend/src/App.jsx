import React, { useState, useContext, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login'; 
import { AuthContext } from './context/AuthContext';

export default function App() {
    const auth = useContext(AuthContext) || {};
    const user = auth.user || null;

    // FORCE INITIALIZATION: Start directly on the login console view
    const [currentView, setCurrentView] = useState('login');

    // If local storage has an active user session, stay locked on the dashboard!
    useEffect(() => {
        if (user) {
            setCurrentView('dashboard');
        }
    }, [user]);

    // 1. SECURED CONSOLE LOGIN LAYER
    if (currentView === 'login') {
        if (user) return <Dashboard />;
        return (
            <Login 
                onSuccess={() => setCurrentView('dashboard')} 
                onBypass={() => setCurrentView('dashboard')} 
            />
        );
    }

    // 2. DASHBOARD WORKSPACE LAYER
    if (currentView === 'dashboard' && !user) {
        return <Login onSuccess={() => setCurrentView('dashboard')} onBypass={() => setCurrentView('dashboard')} />;
    }

    return <Dashboard />;
}