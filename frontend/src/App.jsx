import React, { useState, useContext, useEffect } from 'react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login'; 
import { AuthContext } from './context/AuthContext';

export default function App() {
    const auth = useContext(AuthContext) || {};
    const user = auth.user || null;

    // Track state: 'landing' -> 'login' -> 'dashboard'
    const [currentView, setCurrentView] = useState('landing');

    // If local storage already has an active user session, stay on the dashboard!
    useEffect(() => {
        if (user) {
            setCurrentView('dashboard');
        }
    }, [user]);

    // 1. PHASE 1: Landing Page
    if (currentView === 'landing') {
        if (user) return <Dashboard />;
        return <Landing onEnterApp={() => setCurrentView('login')} />;
    }

    // 2. PHASE 2: Login Console
    if (currentView === 'login') {
        if (user) return <Dashboard />;
        return (
            <Login 
                onSuccess={() => setCurrentView('dashboard')} 
                onBypass={() => setCurrentView('dashboard')} 
            />
        );
    }

    // 3. PHASE 3: Dashboard Workspace
    if (currentView === 'dashboard' && !user) {
        return <Login onSuccess={() => setCurrentView('dashboard')} onBypass={() => setCurrentView('dashboard')} />;
    }

    return <Dashboard />;
}