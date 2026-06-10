import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '1rem 2rem', backgroundColor: 'var(--bg-secondary)', 
            borderBottom: '1px solid var(--border-ui)'
        }}>
            <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
                Learn<span style={{ color: 'var(--accent-blue)' }}>Forge</span>
            </Link>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                {user ? (
                    <>
                        <span style={{ color: 'var(--accent-emerald)' }}>{user.name}</span>
                        <button onClick={handleLogout} className="btn-forge" style={{ backgroundColor: 'var(--accent-rose)' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Login</Link>
                        <Link to="/register" className="btn-forge">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}