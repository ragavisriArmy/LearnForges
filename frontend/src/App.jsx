import React, { useState, useContext, useEffect } from 'react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login'; 
import { AuthContext } from './context/AuthContext';

export default function App() {
    const auth = useContext(AuthContext) || {};
    const user = auth.user || null;

    // Track the linear app view state: 'landing' -> 'login' -> 'dashboard'
    const [currentView, setCurrentView] = useState('landing');

    // AUTOMATIC SESSION SYNC: If a logged-in user is found in the local cache storage, 
    // bypass the landing/login flows completely on mount or refresh!
    useEffect(() => {
        if (user) {
            setCurrentView('dashboard');
        }
    }, [user]);

    // 1. PHASE 1: Elegant Showcase Landing Page
    if (currentView === 'landing') {
        return <Landing onEnterApp={() => setCurrentView('login')} />;
    }

    // 2. PHASE 2: Secured Console Authentication
    if (currentView === 'login') {
        if (user) {
            return <Dashboard />;
        }
        return (
            <Login 
                onSuccess={() => setCurrentView('dashboard')} 
                onBypass={() => setCurrentView('dashboard')} 
            />
        );
    }

    // 3. PHASE 3: Functional Engineering Workspace
    // Extra safety: If the user manually logged out or cleared data, send them back to login
    if (currentView === 'dashboard' && !user) {
        return <Login onSuccess={() => setCurrentView('dashboard')} onBypass={() => setCurrentView('dashboard')} />;
    }

    return <Dashboard />;
}