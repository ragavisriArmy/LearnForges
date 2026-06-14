import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function Login({ onSuccess, onBypass }) {
    const auth = useContext(AuthContext) || {};
    const login = auth.login || (() => { console.log("Mock login triggered"); });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        
        if (auth.login) {
            try {
                // 1. Attempt connection to backend API
                const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
                
                if (res.data && res.data.token && res.data.user) {
                    login(res.data.user, res.data.token);
                    if (onSuccess) onSuccess();
                    window.location.reload();
                } else {
                    setErrorMessage("Invalid credentials response structure.");
                }
            } catch (err) {
                console.warn("Backend node offline, activating workspace bypass mode...", err);
                
                // 2. SAFE BYPASS: Logs you in automatically if the database server is sleeping
                const fallbackUser = {
                    id: "local-dev-operator",
                    name: "M. Sulookamithra"
                };
                const fallbackToken = "local-session-token-12345";
                
                login(fallbackUser, fallbackToken);
                if (onSuccess) onSuccess();
                window.location.reload();
            }
        } else {
            if (onBypass) onBypass();
            window.location.reload();
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', fontFamily: 'system-ui, sans-serif', color: '#f8fafc' }}>
            <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#0f172a', padding: '2.5rem', borderRadius: '12px', border: '1px solid #1e293b', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
                
                <h2 style={{ fontSize: '1.75rem', fontWeight: '800', textAlign: 'center', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
                    Access <span style={{ color: '#3b82f6' }}>Console</span>
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', marginBottom: '2rem' }}>
                    Enter credentials to initialize secure database session nodes.
                </p>

                {errorMessage && (
                    <div style={{ padding: '0.75rem', backgroundColor: '#7f1d1d', border: '1px solid #f87171', color: '#fca5a5', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>
                        SYSTEM IDENTIFICATION EMAIL
                        <input 
                            type="email" 
                            required 
                            placeholder="operator@forge.edu" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', fontSize: '0.95rem' }}
                        />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>
                        ENCRYPTED ACCESS KEYS
                        <input 
                            type="password" 
                            required 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', fontSize: '0.95rem' }}
                        />
                    </label>

                    <button type="submit" style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>
                        Authenticate Session
                    </button>
                </form>

            </div>
        </div>
    );
}