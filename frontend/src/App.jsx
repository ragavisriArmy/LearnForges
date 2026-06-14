import React, { useState, useContext } from 'react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login'; 
import { AuthContext } from './context/AuthContext';

export default function App() {
    const auth = useContext(AuthContext) || {};
    const user = auth.user || null;

    // Track standard view flow state
    const [currentView, setCurrentView] = useState('landing');

    // 1. Landing view state transition
    if (currentView === 'landing') {
        return <Landing onEnterApp={() => setCurrentView('login')} />;
    }

    // 2. Authentication view state transition
    if (currentView === 'login') {
        return (
            <Login 
                onSuccess={() => setCurrentView('dashboard')} 
                onBypass={() => setCurrentView('dashboard')} 
            />
        );
    }

    // 3. Main Workspace Dashboard
    return <Dashboard />;
}