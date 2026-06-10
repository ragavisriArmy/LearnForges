import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Making a direct network call to our Express backend port
            const response = await axios.post('http://localhost:5000/api/auth/register', formData);
            if (response.data.status === 'success') {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 2000); // Redirect to login page after 2 seconds
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during registration.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-ui)' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Create Account</h2>
            
            {error && <div style={{ color: 'var(--accent-rose)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
            {success && <div style={{ color: 'var(--accent-emerald)', marginBottom: '1rem', textAlign: 'center' }}>Registration successful! Redirecting...</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label>Full Name</label>
                    <input type="text" required style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border-ui)', backgroundColor: 'var(--bg-primary)', color: 'white' }}
                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label>Email Address</label>
                    <input type="email" required style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border-ui)', backgroundColor: 'var(--bg-primary)', color: 'white' }}
                        value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label>Password</label>
                    <input type="password" required style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border-ui)', backgroundColor: 'var(--bg-primary)', color: 'white' }}
                        value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
                <button type="submit" className="btn-forge" style={{ marginTop: '0.5rem' }}>Sign Up</button>
            </form>
            <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>Login here</Link>
            </p>
        </div>
    );
}