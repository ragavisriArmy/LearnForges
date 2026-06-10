import React, { useState, useContext } from 'react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login'; 
import { AuthContext } from './context/AuthContext';

export default function App() {
    const auth = useContext(AuthContext) || {};
    const user = auth.user || null;

    // We track the linear app view state: 'landing' -> 'login' -> 'dashboard'
    const [currentView, setCurrentView] = useState('landing');

    // 1. PHASE 1: Elegant Showcase Landing Page
    if (currentView === 'landing') {
        return <Landing onEnterApp={() => setCurrentView('login')} />;
    }

    // 2. PHASE 2: Secured Console Authentication
    // If a real backend context user exists, or if we skip login, jump to dashboard
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
    return <Dashboard />;
}